from django.db import models
from customers.models import CustomerInfo
from photographers.models import PhotographerInfo
# Create your models here.

# JOB_STATUS_CHOICES=[('TEST','Test')]

# class JobInfo(models.Model):
#     JobCustomer = models.ForeignKey(CustomerInfo, on_delete=models.CASCADE)
#     JobPhotographer = models.ForeignKey(PhotographerInfo, on_delete=models.CASCADE)
#     JobStatus = models.CharField(choices=JOB_STATUS_CHOICES,max_length=4)