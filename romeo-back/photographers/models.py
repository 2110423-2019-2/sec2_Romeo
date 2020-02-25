from django.db import models
from users.models import CustomUser
# Create your models here.


DAY_CHOICES = [('SUNDAY', 'Sunday'),
               ('MONDAY', 'Monday'),
               ('TUESDAY', 'Tuesday'),
               ('WEDNESDAY', 'Wednesday'),
               ('THURSDAY', 'Thursday'),
               ('FRIDAY', 'Friday'),
               ('SATURDAY', 'Saturday')]

STYLE_CHOICES = [('GRADUATION', 'Graduation'),
                 ('LANDSCAPE', 'Landscape'),
                 ('PORTRAIT', 'Portrait'),
                 ('PRODUCT', 'Product'),
                 ('FASHION', 'Fashion'),
                 ('EVENT', 'Event'),
                 ('WEDDING', 'Wedding')]

TIME_CHOICES = [('HALF_DAY_MORNING', "Half-day(Morning-Noon)"),
                     ('HALF_DAY_NOON', "Half-day(Noon-Evening)"),
                     ('FULL_DAY', "Full-Day"),
                     ('NIGHT', "Night"),
                     ('FULL_DAY_NIGHT', "Full-Day and Night")]


class Photo(models.Model):
    PhotoLink = models.URLField(primary_key=True, unique=True)

    def __str__(self):
        return self.PhotoLink


class AvailTime(models.Model):
    AvailDate = models.CharField(max_length=20, choices=DAY_CHOICES)
    AvailTime = models.CharField(max_length=16, choices=TIME_CHOICES)

    def __str__(self):
        return self.AvailDate + " " + self.AvailTime

class Equipment(models.Model):
    EquipmentName = models.CharField(primary_key=True, unique=True, max_length=100)

    def __str__(self):
        return self.EquipmentName


class Style(models.Model):
    StyleName = models.CharField(primary_key=True, unique=True, max_length=20, choices=STYLE_CHOICES)

    def __str__(self):
        return self.StyleName


# TODO Rename common fields
class Photographer(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    # # Common fields
    # PhotographerID = models.AutoField(primary_key=True)
    # PhotographerFName = models.CharField(max_length=50)
    # PhotographerLName = models.CharField(max_length=50)
    # PhotographerSSN = models.CharField(max_length=13)
    # PhotographerEmail = models.EmailField()
    # PhotographerPassword = models.CharField(max_length=50)
    # Photographer fields
    PhotographerContact = models.CharField(max_length=100)
    PhotographerPrice = models.FloatField()
    # TODO Correctly implement fetching last online time
    PhotographerLastOnlineTime = models.DateTimeField()
    PhotographerPaymentInfo = models.TextField()
    PhotographerStyle = models.ManyToManyField(Style)
    PhotographerAvailTime = models.ForeignKey(AvailTime, related_name='photographer_avail_time', on_delete=models.CASCADE)
    PhotographerEquipment = models.ForeignKey(Equipment, related_name='photographer_equipment', on_delete=models.CASCADE)
    PhotographerPhotos = models.ForeignKey(Photo, related_name='photographer_photos', on_delete=models.CASCADE, blank=True)

    def __str__(self):
        return self.user.first_name




