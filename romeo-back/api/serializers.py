from rest_framework import fields, serializers
from rest_auth.registration.serializers import RegisterSerializer
from allauth.account import app_settings as allauth_settings
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email

# Import App Models
from photographers.models import PhotographerInfo
from customers.models import CustomerInfo
from jobs.models import JobInfo


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobInfo
        fields = '__all__'


class PhotographerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhotographerInfo
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    jobs_by_customer = JobSerializer(many=True)

    class Meta:
        model = CustomerInfo
        fields = ['CustomerID', 'CustomerFName', 'CustomerLName', 'SSN',
                  'Email', 'Username', 'Password', 'PaymentInfo', 'jobs_by_customer']

    def create(self, validated_data):
        jobs_by_customer_data = validated_data.pop('jobs_by_customer')
        customer = CustomerInfo.objects.create(**validated_data)
        for job_by_customer_data in jobs_by_customer_data :
            JobInfo.objects.create(**job_by_customer_data)
        return customer

    # Allows only update of status, the rest is the same
    def update(self, instance, validated_data):
        jobs_by_customer_data = validated_data.pop('jobs_by_customer')
        jobs_by_customer = instance.jobs_by_customer

        instance.JobID = validated_data.get('JobId', instance.JobID)
        instance.JobCustomer = validated_data.get('JobCustomer', instance.JobCustomer)
        instance.JobPhotographer = validated_data.get('JobPhotographer', instance.JobPhotographer)
        instance.JobStartDate = validated_data.get('JobStartDate', instance.JobStartDate)
        instance.JobEndDate = validated_data.get('JobEndDate', instance.JobEndDate)
        instance.save()

        jobs_by_customer.JobStatus = jobs_by_customer_data.get('JobStatus', jobs_by_customer.JobStatus)
        jobs_by_customer_data.save()


class RegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(required=True, write_only=True)
    last_name = serializers.CharField(required=True, write_only=True)

    def get_cleaned_data(self):
        return {
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        setup_user_email(request, user, [])
        user.save()
        return user