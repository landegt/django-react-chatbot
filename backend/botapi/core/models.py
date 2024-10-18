from django.db import models
from django.db.models import JSONField
    
import uuid
from django.core.validators import MinValueValidator, MaxValueValidator


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Item(models.Model):
    category = models.ForeignKey(Category, related_name='items', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    data = JSONField()  # This will store category-specific fields
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Business(models.Model):
    business_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business_name = models.CharField(max_length=255)
    business_address = models.TextField()
    business_city = models.CharField(max_length=255)
    business_category = models.CharField(max_length=255)

    def __str__(self):
        return self.business_name

class Review(models.Model):
    review_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    review_text = models.TextField()
    review_date = models.DateTimeField(auto_now_add=True)
