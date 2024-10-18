from django.contrib import admin

from .models import Business, Category, Item, Review


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("name", "category")
    list_filter = ("category",)
    search_fields = ("name", "category__name")


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ("business_name", "business_city", "business_category")
    search_fields = ("business_name", "business_city", "business_category")
    list_filter = ("business_city", "business_category")


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("business", "rating", "review_date")
    list_filter = ("rating", "review_date")
    search_fields = ("business__business_name", "review_text")
    date_hierarchy = "review_date"
