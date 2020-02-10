from django.db import models
# Create your models here.


class CustomerInfo(models.Model):
    CustomerID = models.AutoField(primary_key=True)
    CustomerFName = models.CharField(max_length=50)
    CustomerLName = models.CharField(max_length=50)
    SSN = models.CharField(max_length=13)
    Email = models.EmailField()
    Password = models.CharField(max_length=100)
