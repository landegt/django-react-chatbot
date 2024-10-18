"""
URL configuration for botapi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from core.views import (
    BusinessList,
    CategoryItemsView,
    ChatbotView,
    GenerateDataView,
    ReviewList,
    ResetSessionView,
)
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/items/", CategoryItemsView.as_view(), name="category-items"),
    path("generate-data/", GenerateDataView.as_view(), name="generate-data"),
    path("businesses/", BusinessList.as_view(), name="business-list"),
    path("reviews/", ReviewList.as_view(), name="review-list"),
    path("chatbot/", ChatbotView.as_view(), name="chatbot"),
    path("reset-session/", ResetSessionView.as_view(), name="reset-session"),
]
