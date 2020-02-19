from django.db import models
from customers.models import Customer
from photographers.models import Photographer
# Create your models here.
# TODO implement payment model that has a one to one relationship with all JobInfo with status matched
JOB_STATUS_CHOICES = [('PENDING', 'Pending'),
                      ('MATCHED', 'Matched'),
                      ('DECLINED', 'Declined'),
                      ('PAID', 'Paid'),
                      ('CANCELLED', 'Cancelled'),
                      ('PROCESSING', 'Processing Photos'),
                      ('DONE', 'DONE'),
                      ('COMPLETED', 'Completed'),
                      ('CLOSED', 'Closed')]


class JobInfo(models.Model):
    # TODO write function to calculate Job Total price
    # TODO check parameters of start date so it cannot be after end date
    # TODO not allow job bookings from customers to photographers
    #  whose status is already past 'matched' for that time period
    JobID = models.AutoField(primary_key=True,default=1)
    JobCustomer = models.ForeignKey(Customer, related_name='jobs_by_customer', on_delete=models.CASCADE)
    JobPhotographer = models.ForeignKey(Photographer, related_name='jobs_of_photographer', on_delete=models.CASCADE)
    JobStatus = models.CharField(choices=JOB_STATUS_CHOICES, max_length=10)
    JobStartDate = models.DateField()
    JobEndDate = models.DateField()
    # JobTotalPrice =

    def __str__(self):
        return self.JobCustomer + " " + self.JobPhotographer
