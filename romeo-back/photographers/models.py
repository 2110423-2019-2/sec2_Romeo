from django.db import models
from multiselectfield import MultiSelectField
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
# Create your models here.

STYLE_CHOICES = [('GRADUATION', 'Graduation'),
                 ('LANDSCAPE', 'Landscape'),
                 ('PORTRAIT', 'Portrait'),
                 ('PRODUCT', 'Product'),
                 ('FASHION', 'Fashion'),
                 ('EVENT', 'Event'),
                 ('WEDDING', 'Wedding')]

AVAILTIME_CHOICES = [('HALF_DAY_MORNING', "Half-day(Morning-Noon)"),
                     ('HALF_DAY_NOON', "Half-day(Noon-Evening)"),
                     ('FULL_DAY', "Full-Day"),
                     ('NIGHT', "Night"),
                     ('FULL_DAY_NIGHT', "Full-Day and Night")]


class Photo(models.Model):
    PhotoID = models.AutoField(primary_key=True)
    PhotoLink = models.URLField()


class AvailTime(models.Model):
    AvailDate = models.DateTimeField()
    AvailTime = models.CharField(max_length=16, choices=AVAILTIME_CHOICES)


class Equipment(models.Model):
    EquipmentID = models.AutoField(primary_key=True)
    EquipmentName = models.TextField()


class PhotographerInfo(models.Model):
    # General fields
    PhotographerID = models.AutoField(primary_key=True)
    PhotographerFName = models.CharField(max_length=50)
    PhotographerLName = models.CharField(max_length=50)
    PhotographerSSN = models.CharField(max_length=13)
    PhotographerEmail = models.EmailField()
    PhotographerPassword = models.CharField(max_length=50)

    # Photographer fields
    PhotographerContact = models.CharField(max_length=100)
    PhotographerPrice = models.FloatField()
    PhotographerLastOnlineTime = models.DateTimeField()
    PhotographerPaymentInfo = models.TextField()
    PhotographerStyle = MultiSelectField(choices=STYLE_CHOICES, max_choices=6)

    PhotographerAvailTime = models.ForeignKey(AvailTime, related_name='photographer_avail_time', on_delete=models.CASCADE,)
    PhotographerEquipment = models.ForeignKey(Equipment, related_name='photographer_equipment', on_delete=models.CASCADE,)
    PhotographerPhotos = models.ForeignKey(Photo, related_name='photographer_photos', on_delete=models.CASCADE, )

    def __str__(self):
        return self.PhotographerFName + " " + self.PhotographerLName



