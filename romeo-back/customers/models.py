from django.db import models
from users.models import CustomUserProfile
# Create your models here.


# TODO Rename common fields
class Customer(models.Model):
    profile = models.OneToOneField(CustomUserProfile, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return self.profile.user.first_name

