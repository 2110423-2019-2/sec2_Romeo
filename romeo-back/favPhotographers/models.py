from django.db import models
from photographers.models import Photographer

# Create your models here.
# TODO create model

class FavPhotographer(models.Model): 
    fav_photographers_name = models.CharField(primary_key=True, unique=True, max_length=100)
    def __str__(self):
        return self.fav_photographers_name


