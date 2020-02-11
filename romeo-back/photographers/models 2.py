from django.db import models

# Create your models here.

class Photo(models.Model):
    PhotoID = models.AutoField(primary_key = True);
    # TODO Photo เก็บยังไง


class AvailTime(models.Model):
    AvailTime = models.DateTimeField();


class Equipment(models.Model):
    EquipmentID = models.AutoField(primary_key = True);
    EquipmentDetail = models.TextField();


class PhotographerInfo(models.Model):
    #General fields
    PhotographerID = models.AutoField(primary_key=True);
    PhotographerFName = models.CharField(max_length=50);
    PhotographerLName = models.CharField(max_length=50);
    PhotographerSSN = models.CharField(max_length=13);
    PhotographerEmail = models.EmailField();
    PhotographerPassword = models.CharField(max_length=50);

    #Photographer fields
    PhotographerStyle = models.CharField(max_length=200);
    PhotographerContact = models.CharField(max_length = 100);
    PhotographerPrice = models.FloatField();
    PhotographerLastOnlineTime = models.DateTimeField();
    PhotographerPaymentInfo = models.TextField();

    PhotographerAvailTime = models.ForeignKey(AvailTime, on_delete = models.CASCADE, );
    PhotographerEquipment = models.ForeignKey(Equipment, on_delete = models.CASCADE, );
    PhotographerPhotos = models.ForeignKey(Photo, on_delete = models.CASCADE, );

    def __str__(self):
        return self.PhotographerFName + " " + self.PhotographerLName;



