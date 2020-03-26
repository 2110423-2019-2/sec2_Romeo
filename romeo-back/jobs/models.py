from django.db import models
from customers.models import Customer
from photographers.models import Photographer, AvailTime
import datetime


# Create your models here.
# TODO implement payment model that has a one to one relationship with all JobInfo with status matched
JOB_STATUS_CHOICES = [('PENDING', 'Pending'),
                      ('DECLINED', 'Declined'),
                      ('MATCHED', 'Matched'),
                      ('PAID', 'Paid'),
                      ('CANCELLED', 'Cancelled'),
                      ('PROCESSING', 'Processing Photos'),
                      ('COMPLETED', 'Completed'),
                      ('CLOSED', 'Closed')]

class JobReservation(models.Model):
    photoshoot_date = models.DateField()
    job_reservation = models.ForeignKey(AvailTime, related_name='photographer_avail_time', on_delete=models.CASCADE)

    def __str__(self):
        return self.job_reservation.avail_date + ' ' + self.job_reservation.avail_time

class JobInfo(models.Model):
    # TODO write function to calculate Job Total price
    # TODO not allow job bookings from customers to photographers
    #  whose status is already past 'matched' for that time period
    job_id = models.AutoField(primary_key=True)
    job_title = models.CharField(max_length = 250)
    job_description = models.TextField(blank=True, null=True)
    job_customer = models.ForeignKey(Customer, related_name='jobs_by_customer', on_delete=models.CASCADE)
    job_photographer = models.ForeignKey(Photographer, related_name='jobs_of_photographer', on_delete=models.CASCADE)
    job_status = models.CharField(choices=JOB_STATUS_CHOICES, max_length=10, default='PENDING')
    job_start_date = models.DateField()
    job_end_date = models.DateField()
    job_reservation = models.ManyToManyField(JobReservation, null=True)
    job_total_price = models.IntegerField(default=0)
    # is_reviewed
    # job_payment

    def __str__(self):
        return self.job_title + '\n' + self.job_customer.profile.user.first_name + " " + self.job_photographer.profile.user.first_name
    