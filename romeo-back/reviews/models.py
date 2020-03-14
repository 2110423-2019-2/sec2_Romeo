from django.db import models
from jobs.models import JobInfo
# Create your models here.
# TODO create model


class ReviewInfo(models.Model):
    ReviewJob = models.OneToOneField(JobInfo, limit_choices_to={'JobStatus': 'Done'}, primary_key=True, on_delete=models.CASCADE)
    ReviewDetail = models.TextField()
    # ReviewPhotographer  =
