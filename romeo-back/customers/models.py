from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from reviews.models import ReviewInfo
# Create your models here.


class CustomerInfo(models.Model):
    CustomerID = models.AutoField(primary_key=True)
    CustomerFName = models.CharField(max_length=50)
    CustomerLName = models.CharField(max_length=50)
    SSN = models.CharField(max_length=13)
    Email = models.EmailField()
    Username = models.CharField(max_length=20, default="")
    Password = models.CharField(max_length=100)
    PaymentInfo = models.TextField()

    def __str__(self):
        return self.CustomerFName + " " + self.CustomerLName

