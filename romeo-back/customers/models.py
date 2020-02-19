from django.db import models
from users.models import CustomUser
from django.contrib.auth import get_user_model

# Create your models here.


# TODO Rename common fields
class Customer(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    PaymentInfo = models.TextField()

    def __str__(self):
        return self.user.first_name

