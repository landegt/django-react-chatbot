# Django React AI Chatbot

A learning project showcasing a chatbot built with Django and React, using the Google Gemini API to generate and recommend fictional local businesses.

## Project Overview

This project demonstrates the integration of Django and React to create a web application that incorporates AI services. It features a simple interface for generating fictional businesses and reviews, and a chatbot that interacts with this data. The application uses the Google Gemini API, showcasing basic function calling for data generation and retrieval tasks.


### Key Features

- Vite-powered React frontend for a responsive chat interface
- Django backend with REST API
- Integration with Google Gemini API for:
  - Generating fictional business and review data
  - Natural language processing of user queries
  - Creating conversational responses
- Simple interface for generating businesses and reviews

## Tech Stack

- Frontend: React (Vite)
- Backend: Django
- AI: Google Gemini API
- Database: SQLite 

## Setup and Installation

1. Clone the repository
   ```
   git clone https://github.com/landegt/django-react-chatbot
   cd django-react-chatbot
   ```

2. Set up the backend
   ```
   cd backend
   python manage.py makemigrations  
   python manage.py migrate 
   python manage.py runserver
   ```

3. Set up the frontend
   ```
   cd frontend/chatbot-react
   npm install
   npm run dev
   ```

4. Configure Google Gemini API
   - Obtain an API key from the Google AI Studio
   - Add your API key to the `backend/.env` configuration file

5. Access the application at `http://localhost:5173`

## How It Works

1. Data Generation:
   - Users can access a simple interface to generate fictional businesses or reviews.
   - They specify whether to generate businesses or reviews and the number to generate.
   - The Gemini API creates the requested fictional data based on these inputs.

2. Data Storage:
   - Generated businesses and reviews are stored in the SQLite database managed by Django.

3. Chatbot Interaction:
   - Users interact with the chatbot, asking about the generated businesses.
   - The chatbot uses Gemini to interpret queries and search the generated database.
   - Responses are crafted by Gemini based on the stored fictional data and user queries.
