from django.db import transaction
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Business, Category, Item, Review
from .serializers import (
    BusinessSerializer,
    CategoryInputSerializer,
    CategorySerializer,
    ReviewSerializer,
)
from .utils.chat import ChatHandler
from .utils.generateData import generate_data


def save_businesses(generated_businesses):
    saved_businesses = []
    for business_data in generated_businesses:
        business, created = Business.objects.get_or_create(
            business_name=business_data["business_name"],
            defaults={
                "business_address": business_data["business_address"],
                "business_city": business_data["business_city"],
                "business_category": business_data["business_category"],
            },
        )
        saved_businesses.append(business)
    return saved_businesses


def save_reviews(generated_reviews):
    saved_reviews = []
    with transaction.atomic():
        for review_data in generated_reviews:
            try:
                business = Business.objects.get(business_id=review_data["business_id"])
                review = Review.objects.create(
                    business=business,
                    rating=review_data["rating"],
                    review_text=review_data["review_text"],
                )
                saved_reviews.append(review)
            except Business.DoesNotExist:
                print(f"Business with id {review_data['business_id']} does not exist.")
    return saved_reviews


class CategoryItemsView(APIView):
    def post(self, request):
        serializer = CategoryInputSerializer(data=request.data)
        if serializer.is_valid():
            category_name = serializer.validated_data["category"]
            count = serializer.validated_data["count"]

            category, created = Category.objects.get_or_create(name=category_name)

            generated_items = generate_data(category, count)

            for item_data in generated_items:
                Item.objects.create(category=category, **item_data)

            category_serializer = CategorySerializer(category)
            return Response(category_serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GenerateDataView(APIView):
    def post(self, request):
        category = request.data.get("category")
        # Default to generating 10 items if count is not provided
        count = request.data.get("count", 10)

        if category not in ["businesses", "reviews"]:
            return Response(
                {"error": "Invalid category. Choose 'businesses' or 'reviews'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        generated_items = generate_data(category, count)
        if generated_items[0].get("category") == "error":
            return Response(
                {
                    "error": "An error occurred while generating data.",
                    "details": generated_items[0]["error"],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        if category == "businesses":
            saved_items = save_businesses(generated_items)
            serializer = BusinessSerializer(saved_items, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:  # reviews
            saved_items = save_reviews(generated_items)
            serializer = ReviewSerializer(saved_items, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BusinessList(generics.ListAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer


class ReviewList(generics.ListAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


class ChatbotView(APIView):
    def post(self, request):
        user_input = request.data.get("user_input", "")

        chat_handler = ChatHandler(request.session)
        bot_response = chat_handler.process_chat(user_input)
        request.session["chat"] = chat_handler.chat_to_json()

        return Response({"response": bot_response}, status=status.HTTP_200_OK)
    
class ResetSessionView(APIView):
    def post(self, request):
        request.session.flush()
        return Response(status=status.HTTP_200_OK)
