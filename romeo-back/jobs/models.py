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
                      ('DONE', 'Done'),
                      ('COMPLETED', 'Completed'),
                      ('CLOSED', 'Closed')]


class JobInfo(models.Model):
    # TODO write function to calculate Job Total price
    # TODO check parameters of start date so it cannot be after end date
    # TODO not allow job bookings from customers to photographers
    #  whose status is already past 'matched' for that time period
    job_id = models.AutoField(primary_key=True)
    job_description = models.TextField(blank=True, null=True)
    job_customer = models.ForeignKey(Customer, related_name='jobs_by_customer', on_delete=models.CASCADE)
    job_photographer = models.ForeignKey(Photographer, related_name='jobs_of_photographer', on_delete=models.CASCADE)
    job_status = models.CharField(choices=JOB_STATUS_CHOICES, max_length=10)
    job_start_date = models.DateField()
    job_end_date = models.DateField()
    # job_total_price =
    # is_reviewed
    # job_payment

    def __str__(self):
        return self.job_customer.profile.user.first_name + " " + self.job_photographer.profile.user.first_name

    # Calculate price
    # def calculate_job_price():