import json
import os
import google.generativeai as genai


# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath('/home/thomas/Documents/ETH_Zurich/internship/tata/chat_bot/backend/botapi/core'))))
from ..models import Business, Review


business_schema = {
    "type": "array",
    "items": {
            "type": "object",
            "properties": {
                "business_name": {"type": "string"},
                "business_address": {"type": "string"},
                "business_category": {"type": "string"},
                "business_city": {"type": "string"}
            },
        "required": ["business_name", "business_address"]
    }
}

review_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "business_id": {"type": "string"},
            "rating": {"type": "number"},
            "review_text": {"type": "string"},
        },
        "required": ["business_id", "rating", "review_text"]
    }
}


def get_random_business() -> dict:
    random_business = Business.objects.order_by('?').first()
    business_data = {
        'business_id': str(random_business.business_id),
        'business_name': random_business.business_name,
        'business_address': random_business.business_address,
        'business_city': random_business.business_city,
        'business_category': random_business.business_category,
    }
    return business_data


def generate_response(prompt: str, schema: dict = None) -> str:
    prompt_text = f'''
        Human: {prompt}
        Assistant:
    '''

    # do not hardcode your API key! remove this for production
    genai.configure(api_key=os.getenv("API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt_text, generation_config=genai.GenerationConfig(
        response_mime_type="application/json", response_schema=schema))
    return response.text


def generate_data(category, count):
    try:
        if category == 'businesses':
            prompt = f'Generate a list of {count} fictional businesses in Swizerland, use the english spelling for the cities.'
            response = generate_response(prompt, business_schema)
        elif category == 'reviews':
            business_to_review = get_random_business()
            prompt = f'Generate {count} reviews for the following business: {str(business_to_review)}'
            response = generate_response(prompt, review_schema)
        retVal = json.loads(response)
        return retVal
    except Exception as e:
        return [{
            'category': 'error',
            'error': str(e)
        }]
