from django.db import models
from django.conf import settings
# from django.db.models.signals import post_save,post_delete
# from django.dispatch import receiver
# from jobs.models import JobInfo

# from payments.models import Payment

# to whom you want to send the notification
NOTIFICATION_TARGET = [(0, 'admin'),
                        (1, 'photographer'),
                        (2, 'customer')]

class Notification(models.Model):
    notification_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification')
    actor = models.CharField(max_length=50)
    verb = models.CharField(max_length=50)
    action = models.CharField(max_length=50, blank=True, null=True)
    # target = models.IntegerField(max_length=1, choices=NOTIFICATION_TARGET)
    description = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    #flag
    # owner = models.ForeignKey(User)
    # datetime = models.DateTimeField(auto_now_add=True)
    # resources = models.ManyToManyField(Resource, related_name='notifications', blank=True)
    # recipients = models.ManyToManyField(User, related_name='notifications', blank=True)

    def __str__(self):
        return f"{self.actor} {self.verb} {self.action} {self.target} at {self.timestamp}"

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
