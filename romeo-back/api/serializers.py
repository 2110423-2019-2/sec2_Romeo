from rest_framework import fields, serializers

# Import App Models
from photographers.models import Photographer, Photo, AvailTime, Equipment, Style
from customers.models import Customer
from jobs.models import JobInfo
from users.models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobInfo
        fields = '__all__'


class PhotographerSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)

    class Meta:
        model = Photographer
        fields = '__all__'

    # Override default create method to auto create user from photographer
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_data.is_Photographer = True
        user = UserSerializer.create(UserSerializer(), validated_data=user_data)
        photographer = Photographer.objects.create(user=user,
                                                   PhotographerContact=validated_data.pop('PhotographerContact'),
                                                   PhotographerPrice=validated_data.pop('PhotographerPrice'),
                                                   PhotographerLastOnlineTime=validated_data.pop('PhotographerLastOnlineTime'),
                                                   PhotographerPaymentInfo=validated_data.pop('PhotographerPaymentInfo'),
                                                   PhotographerStyle=validated_data.pop('PhotographerStyle'),
                                                   PhotographerAvailTime=validated_data.pop('PhotographerAvailTime'),
                                                   PhotographerEquipment=validated_data.pop('PhotographerEquipment'),
                                                   PhotographerPhotos=validated_data.pop('PhotographerPhotos'))
        return photographer


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = '__all__'


class AvailTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailTime
        fields = '__all__'


class StyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Style
        fields = '__all__'


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta :
        model = Equipment
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)
    #jobs_by_customer = JobSerializer(many=True)

    class Meta:
        model = Customer
        fields = ['user']

        # Override default create method to auto create user from photographer
        def create(self, validated_data):
            user_data = validated_data.pop('user')
            user_data.is_Customer = True
            user = UserSerializer.create(UserSerializer(), validated_data=user_data)
            customer = Customer.objects.create(user=user,
                                               PaymentInfo=validated_data.pop('PaymentInfo'))

            return customer

    # def create(self, validated_data):
    #     jobs_by_customer_data = validated_data.pop('jobs_by_customer')
    #     customer = Customer.objects.create(**validated_data)
    #     for job_by_customer_data in jobs_by_customer_data :
    #         JobInfo.objects.create(**job_by_customer_data)
    #     return customer
    #
    # # Allows only update of status, the rest is the same
    # def update_job_status(self, instance, validated_data):
    #     jobs_by_customer_data = validated_data.pop('jobs_by_customer')
    #     jobs_by_customer = instance.jobs_by_customer
    #
    #     instance.JobID = validated_data.get('JobId', instance.JobID)
    #     instance.JobCustomer = validated_data.get('JobCustomer', instance.JobCustomer)
    #     instance.JobPhotographer = validated_data.get('JobPhotographer', instance.JobPhotographer)
    #     instance.JobStartDate = validated_data.get('JobStartDate', instance.JobStartDate)
    #     instance.JobEndDate = validated_data.get('JobEndDate', instance.JobEndDate)
    #     instance.save()
    #
    #     jobs_by_customer.JobStatus = jobs_by_customer_data.get('JobStatus', jobs_by_customer.JobStatus)
    #     jobs_by_customer_data.save()


# class CustomRegisterSerializer(RegisterSerializer):
#     first_name = serializers.CharField(required=True, write_only=True)
#     last_name = serializers.CharField(required=True, write_only=True)
#     password = serializers.CharField(write_only=True)
#
#     def get_cleaned_data(self):
#         return {
#             'first_name': self.validated_data.get('first_name', ''),
#             'last_name': self.validated_data.get('last_name', ''),
#             'password1': self.validated_data.get('password1', ''),
#             'email': self.validated_data.get('email', ''),
#         }
