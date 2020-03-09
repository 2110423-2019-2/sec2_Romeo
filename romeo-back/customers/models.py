from django.db import models
from users.models import CustomUser
# Create your models here.


# TODO Rename common fields
class Customer(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    PaymentInfo = models.CharField(max_length=50)

    def __str__(self):
        return self.user.first_name

