from django.db import models

# Create your models here.
# TODO create model


class ReviewInfo(models.Model) :
    ReviewID = models.AutoField(primary_key=True)
    ReviewDetail = models.TextField()
    # TODO : Implement review only after job
    # ReviewPhotographer  =
