from django.db import models

CLIENT_TYPE_CHOICES = [('PHOTOGRAPHER', 'Photographer'),
                       ('CUSTOMER', 'Customer')]


class ClientInfo(models.Model):
    ClientID = models.AutoField(primary_key=True)
    ClientEmail = models.EmailField()
    ClientFName = models.CharField(max_length=50)
    ClientLName = models.CharField(max_length=50)
    ClientSSN = models.CharField(max_length=13)
    ClientType = models.CharField(max_length=15, choices=CLIENT_TYPE_CHOICES)

    # Login Information
    ClientUserName = models.CharField(max_length=20, unique=True)
    ClientPassword = models.CharField(max_length=50)

    def __str__(self):
        return self.ClientType + " " + self.ClientFName + " " + self.ClientLName

    def is_photographer(self):
        if self.ClientType is 'Photographer':
            return True
        return False

    def is_customer(self):
        if self.ClientType is 'Customer':
            return True
        return False

    class Meta:
        abstract = True


