from rest_framework import fields, serializers
from djoser.serializers import UserCreateSerializer as BaseUserRegistrationSerializer
# Import App Models
from photographers.models import Photographer, Photo, AvailTime, Equipment, Style
from customers.models import Customer
from jobs.models import JobInfo
from users.models import CustomUser, CustomUserProfile
import datetime


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

    def create(self, validated_data):
        user = CustomUser.objects.create_user(username=validated_data['username'],
                                              password=validated_data['password'],
                                              )
        return user


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True, partial=True)

    class Meta:
        model = CustomUserProfile
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer.create(UserSerializer(), validated_data=user_data)
        profile = CustomUserProfile.objects.create(
            user=user,
            ssn=validated_data.pop('ssn', ''),
            bank_account_number=validated_data.pop('bank_account_number', ''),
            bank_name=validated_data.pop('bank_name', ''),
            bank_account_name=validated_data.pop('bank_account_name', ''),
            phone=validated_data.pop('phone', '')
        )
        profile.save()
        return profile


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobInfo
        fields = '__all__'


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
    class Meta:
        model = Equipment
        fields = '__all__'


class PhotographerSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=True, partial=True)
    photographer_photos = PhotoSerializer(many=True, required=False)
    photographer_equipments = EquipmentSerializer(many=True, required=False)
    photographer_styles = StyleSerializer(many=True, required=False)

    class Meta:
        model = Photographer
        fields = '__all__'

    # Override default create method to auto create user from photographer
    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        profile = ProfileSerializer.create(ProfileSerializer(), validated_data=profile_data)
        photographer = Photographer.objects.create(profile=profile,
                                                   PhotographerPrice=validated_data.pop('PhotographerPrice', ""),
                                                   # TODO Correctly implement fetching last online time
                                                   PhotographerLastOnlineTime=validated_data.pop('PhotographerLastOnlineTime', "2020-02-24T09:54:43.770582Z"),
                                                   # PhotographerStyle=validated_data.pop('PhotographerStyle', "None"),
                                                   PhotographerAvailTime=validated_data.pop('PhotographerAvailTime', None),
                                                   PhotographerEquipment=validated_data.pop('PhotographerEquipment', None),
                                                   PhotographerPhotos=validated_data.pop('PhotographerPhotos', None))
        profile.save()
        return photographer

    def update(self, instance, validated_data):
        # update user information except username and password
        user_data = validated_data.pop('profile')
        user = instance.user
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.email = user_data.get('email', user.email)
        user.ssn = user_data.get('ssn', user.ssn)
        user.back_account_number = user_data.get('bank_account_number', user.back_account_number)
        user.bank_name = user_data.get('bank_name', user.bank_name)
        user.phone = user_data.get('phone', user.phone)
        user.save()

        # update photographer's photos
        photos_data = validated_data.pop('photographer_photo')
        photos = (instance.photos).all()
        photos = list(photos)
        for photo_data in photos_data:
            photo = photos.pop(0)
            photo.PhotoLink = photo_data.get('PhotoLink', photo.PhotoLink)
            photo.save()

        # update photographer's equipments
        equipments_data = validated_data.pop('photographer_equipments')
        equipments = (instance.equipments).all()
        equipments = list(equipments)
        for equipment_data in equipments_data:
            equipment = equipments.pop(0)
            equipment.EquipmentName = equipment_data.get('EquipmentName', equipment.EquipmentName)
            equipment.save()

        # update photographer's style
        styles_data = validated_data.pop('photographer_styles')
        styles = (instance.styles).all()
        styles = list(styles)
        for style_data in styles_data:
            style = styles.pop(0)
            style.StyleName = style_data.get('StyleName', style.StyleName)
            style.save()

        return instance


class CustomerSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=True, partial=True)
    # jobs_by_customer = JobSerializer(many=True)

    class Meta:
        model = Customer
        fields = '__all__'

        # Override default create method to auto create user from customer
    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        profile = ProfileSerializer.create(ProfileSerializer(), validated_data=profile_data)
        customer = Customer.objects.create(profile=profile,
                                           PaymentInfo=validated_data.pop('PaymentInfo'))

        profile.save()
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


# class UserRegistrationSerializer(BaseUserRegistrationSerializer):
#     class Meta(BaseUserRegistrationSerializer.Meta):
#         fields = '__all__'

    # first_name = serializers.CharField(required=True, write_only=True)
    # last_name = serializers.CharField(required=True, write_only=True)
    # password = serializers.CharField(write_only=True)
    #
    # def get_cleaned_data(self):
    #     return {
    #         'first_name': self.validated_data.get('first_name', ''),
    #         'last_name': self.validated_data.get('last_name', ''),
    #         'password1': self.validated_data.get('password1', ''),
    #         'email': self.validated_data.get('email', ''),
    #     }
