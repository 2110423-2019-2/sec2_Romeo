from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    is_photographer = models.BooleanField(default=False)
    is_customer = models.BooleanField(default=False)

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    username = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=255)
    email = models.EmailField()
    ssn = models.CharField(max_length=13)
    bank_account_number = models.CharField(max_length=50)
    bank_name = models.CharField(max_length=50)
    bank_account_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=11)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
