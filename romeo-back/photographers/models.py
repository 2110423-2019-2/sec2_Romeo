from django.db import models
from users.models import CustomUserProfile
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
                 ('WEDDING', 'Wedding'),
                 ('NONE', 'None')]

TIME_CHOICES = [('HALF_DAY_MORNING', "Half-day(Morning-Noon)"),
                     ('HALF_DAY_NOON', "Half-day(Noon-Evening)"),
                     ('FULL_DAY', "Full-Day"),
                     ('NIGHT', "Night"),
                     ('FULL_DAY_NIGHT', "Full-Day and Night")]


class Photo(models.Model):
    photo_link = models.URLField(primary_key=True, unique=True)

    def __str__(self):
        return self.PhotoLink


class AvailTime(models.Model):
    avail_date = models.CharField(max_length=20, choices=DAY_CHOICES)
    avail_time = models.CharField(max_length=16, choices=TIME_CHOICES)
    photographer_price = models.FloatField()

    def __str__(self):
        return self.AvailDate + " " + self.AvailTime


class Equipment(models.Model):
    equipment_name = models.CharField(primary_key=True, unique=True, max_length=100)

    def __str__(self):
        return self.equipment_name


class Style(models.Model):
    style_name = models.CharField(primary_key=True, unique=True, max_length=20, choices=STYLE_CHOICES)

    def __str__(self):
        return self.style_name


# TODO Rename common fields
class Photographer(models.Model):
    profile = models.OneToOneField(CustomUserProfile, on_delete=models.CASCADE, primary_key=True)
    # # Common fields
    # PhotographerID = models.AutoField(primary_key=True)
    # PhotographerFName = models.CharField(max_length=50)
    # PhotographerLName = models.CharField(max_length=50)
    # PhotographerSSN = models.CharField(max_length=13)
    # PhotographerEmail = models.EmailField()
    # PhotographerPassword = models.CharField(max_length=50)
    # Photographer fields
    # TODO Correctly implement fetching last online time
    photographer_last_online_time = models.DateTimeField(null=True, blank=True)
    photographer_style = models.ManyToManyField(Style, through="StylePhotographerGroup")
    photographer_avail_time = models.ForeignKey(AvailTime, related_name='photographer_avail_time', on_delete=models.CASCADE, blank=True, null=True)
    photographer_equipment = models.ForeignKey(Equipment, related_name='photographer_equipment', on_delete=models.CASCADE, null=True, blank=True)
    photographer_photos = models.ForeignKey(Photo, related_name='photographer_photos', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.profile.user.first_name


class StylePhotographerGroup(models.Model):
    photographer = models.ForeignKey(Photographer, on_delete=models.CASCADE)
    style = models.ForeignKey(Style, on_delete=models.CASCADE)


