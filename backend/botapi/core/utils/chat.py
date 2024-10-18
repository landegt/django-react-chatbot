import json
import os

import google.generativeai as genai
import typing_extensions as typing
from google.ai.generativelanguage_v1beta.types.content import Content

from ..models import Business

genai.configure(api_key=os.getenv("API_KEY"))


class ChatHandler:
    def __init__(self, session):
        self.session = session
        self.model = genai.GenerativeModel("gemini-1.5-pro")

        if "chat" in session:
            history = [Content.from_json(content) for content in session["chat"]]
        else:
            history = [
                {
                    "role": "user",
                    "parts": "you are a recommendation system, you recommend businesses to users based on their requests, always try to recommend a buisiness even if unsure",
                },
                {"role": "model", "parts": "Hello! How can I assist you today?"},
            ]

        self.chat = self.model.start_chat(
            history=history,
        )
        # from IPython import embed; embed()

    def chat_to_json(self):
        return [Content.to_json(content) for content in self.chat.history]

    def find_businesses_in_city(self, city):
        businesses = Business.objects.filter(business_city__icontains=city)
        return [
            {
                "name": business.business_name,
                "address": business.business_address,
                "category": business.business_category,
                "reviews": business.reviews.all(),
            }
            for business in businesses
        ]

    function_declarations = [
        {
            "name": "find_businesses_in_city",
            "description": "returns a list of businesses and their reviews in a specified city",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "The city to search for businesses in",
                    }
                },
                "required": ["city"],
            },
        }
    ]

    def process_chat(self, user_input):
        response = self.chat.send_message(
            user_input,
            tools=[self.function_declarations],
        )

        if response.candidates[0].content.parts[0].function_call:
            function_call = response.candidates[0].content.parts[0].function_call
            if function_call.name == "find_businesses_in_city":
                city = function_call.args["city"]

                # TODO: Implement more refined search logic, e.g. by category
                # For small number of businesses, this is fine
                businesses = self.find_businesses_in_city(city)
                businesses_info = ""

                for b in businesses:
                    businesses_info += (
                        f"- {b['name']} ({b['category']}): {b['address']}\n"
                    )
                    if b["reviews"]:
                        businesses_info += "  Reviews:\n"
                        for review in b["reviews"][
                            :5
                        ]:  # Limit to 5 reviews per business
                            businesses_info += f"Rating: {review.rating}, Comment: {review.review_text[:50]}...\n"
                    else:
                        businesses_info += "No reviews available.\n"
                    businesses_info += "\n"

                follow_up = self.chat.send_message(
                    f"This is the output of a function call NOT the user giving you information. Here are the businesses in {city}:\n{businesses_info}\n Make a recommendation based on these businesses"
                )

                return follow_up.text
        print(response.text)
        return response.text
