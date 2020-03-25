from django.db import models
from django.utils import timezone
from users.models import CustomUserProfile

NOTI_FIELD_CHOICES = [('PAYMENT', 'Payment'),
                      ('JOB', 'Job')]

NOTI_ACTION_CHOICES = [('CREATE', 'Create'),
                      ('UPDATE', 'Update')]

NOTI_STATUS_CHOICES = [('PENDING', 'Pending'),
                      ('DECLINED', 'Declined'),
                      ('MATCHED', 'Matched'),
                      ('PAID', 'Paid'),
                      ('CANCELLED', 'Cancelled'),
                      ('PROCESSING', 'Processing Photos'),
                      ('DONE', 'Done'),
                      ('COMPLETED', 'Completed'),
                      ('CLOSED', 'Closed')]

class Notification(models.Model): 
    noti_id = models.AutoField(primary_key=True)
    noti_field = models.CharField(choices=NOTI_FIELD_CHOICES, max_length=10)
    noti_receiver = models.ForeignKey(CustomUserProfile,blank=False,related_name='noti_receiver',on_delete=models.CASCADE)
    noti_actor = models.ForeignKey(CustomUserProfile,blank=False,related_name='noti_actor',on_delete=models.CASCADE)
    noti_action = models.CharField(max_length=100)
    noti_status = models.CharField(choices=NOTI_STATUS_CHOICES, max_length=10)
    noti_description = models.TextField(blank=True, null=True,max_length=250)
    noti_timestamp = models.DateTimeField(default=timezone.now, db_index=True)

    # NOTI_TYPE_CHOICES = [('success', 'info', 'warning', 'error')]
    # noti_type = models.CharField(choices=NOTI_TYPE_CHOICES, default='Info', max_length=10)
    # unread = models.BooleanField(default=True, blank=False, db_index=True)
    # public = models.BooleanField(default=False, db_index=True)


    def __str__(self):
        return self.noti_actor.user.username + ' -> ' + self.noti_recipient.user.username \
        + ': ' + self.noti_action