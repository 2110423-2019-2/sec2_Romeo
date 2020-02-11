from django.contrib import admin
from .models import CustomerInfo
# Register your models here.

# admin.site.register(CustomerInfo)
@admin.register(CustomerInfo)
class CustomerInfoAdmin(admin.ModelAdmin):
    list_display = ('CustomerID', 'CustomerFName', 'CustomerLName',
                    'SSN', 'Email', 'Username')
