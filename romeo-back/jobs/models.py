from django.db import models
from customers.models import CustomerInfo
from photographers.models import PhotographerInfo
# Create your models here.

JOB_STATUS_CHOICES=[('PENDING', 'Pending'),
                    ('MATCHED', 'Matched'),
                    ('DECLINED', 'Declined'),
                    ('CANCELLED', 'Cancelled'),
                    ('PROCESSING', 'Processing Photos'),
                    ('COMPLETED', 'Completed')]


class JobInfo(models.Model):
    JobID = models.AutoField(primary_key=True)
    JobCustomer = models.ForeignKey(CustomerInfo, related_name='jobs_by_customer', on_delete=models.CASCADE)
    JobPhotographer = models.ForeignKey(PhotographerInfo, on_delete=models.CASCADE)
    JobStatus = models.CharField(choices=JOB_STATUS_CHOICES, max_length=10)
    JobStartDate = models.DateField()
    JobEndDate = models.DateField()
    # JobTotalPrice =

    def __str__(self):
        return self.JobCustomer + " " + self.JobPhotographer
