from rest_framework import serializers
from .models import Category, Item, Business, Review


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'data', 'created_at']


class CategorySerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'items']


class CategoryInputSerializer(serializers.Serializer):
    category = serializers.CharField(max_length=100)
    count = serializers.IntegerField(min_value=1, max_value=100)


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['review_id', 'business',
                  'rating', 'review_text', 'review_date']


class BusinessSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Business
        fields = ['business_id', 'business_name', 'business_address',
                  'business_city', 'business_category', 'reviews']
