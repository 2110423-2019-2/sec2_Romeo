from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager


class CustomUser(AbstractUser):
    is_photographer = models.BooleanField(default=False)
    is_customer = models.BooleanField(default=False)

    first_name = models.CharField(max_length=50, blank=True, default="")
    last_name = models.CharField(max_length=50,blank=True, default="")
    username = models.CharField(max_length=20, unique=True, primary_key=True)
    password = models.CharField(max_length=255)
    email = models.EmailField(blank=True, default="")
    ssn = models.CharField(max_length=13, blank=True, default="")
    bank_account_number = models.CharField(max_length=50, blank=True, default="")
    bank_name = models.CharField(max_length=50, blank=True, default="")
    bank_account_name = models.CharField(max_length=50, blank=True, default="")
    phone = models.CharField(max_length=11, blank=True, default="")

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
