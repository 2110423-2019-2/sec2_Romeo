from django.db import models
# from django.db.models.signals import post_save,post_delete
# from django.dispatch import receiver
# from jobs.models import JobInfo
# from photographers.models import Photographer

# from payments.models import Payment

NOTI_CHOICES = [('CREATE', 'Create'),
               ('DELETE', 'Delete'),
               ('UPDATE', 'Update')]

class Notification(models.Model):
    notification_id = models.AutoField(primary_key=True)
    notification_type = models.CharField(max_length=20, choices=NOTI_CHOICES)
    # photographer = models.ForeignKey(Photographer, on_delete=models.CASCADE)
    #timestamp, flag, details(allow null)

    def __str__(self):
        return self.notification_id

#create/update job - move to job serializer
# @receiver(post_save, sender=Photographer)
# def save_job(sender, instance, created, **kwargs):
#     if created:
#         print('A new job was created.')
#     elif not created:
#         # User object updated
#         print('The job was updated.')
#         jobs_obj = instance
#         pass


# @receiver([post_save, post_delete], sender=User)
# def create_payment(sender, instance, created, **kwargs):
#     if created:
#         JobInfo.objects.create(job=instance)
