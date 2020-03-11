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
                                              user_type=validated_data['user_type'],
                                              email=validated_data['email'],
                                              first_name=validated_data['first_name'],
                                              last_name=validated_data['last_name']
                                              )
        return user

    # def update(self, instance, validated_data):
    #     username = self.data['username']
    #     user = CustomUser.objects.get(username=username)
    #     print(user)
    #     user.username = validated_data.pop('username', user.username)
    #     user.password = validated_data.pop('password', user.password)
    #     user.email = validated_data.pop('email', user.email)
    #     user.first_name = validated_data.pop('first_name', user.first_name)
    #     user.last_name = validated_data.pop('last_name', user.last_name)
    #     instance.save()
    #     return instance


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True, partial=True)

    class Meta:
        model = CustomUserProfile
        fields = '__all__'

    # Override default create method to auto create nested user from profile
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

    # def update(self, instance, validated_data):
    #     user_data = validated_data.pop('user')
    #     user = UserSerializer.update(self,instance,user_data)
    #
    #     username = self.data['user']['username']
    #     user = CustomUser.objects.get(username=username)
    #     user.first_name = user_data.get('first_name', user_data.first_name)
    #     user.last_name = user_data.get('last_name', user_data.last_name)
    #     user.email = user_data.get('email', user_data.email)
    #     user.save()
    #     return instance


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
    photographer_photos = PhotoSerializer(many=True, required=False, allow_null=True)
    photographer_equipments = EquipmentSerializer(many=True, required=False, allow_null=True)
    photographer_styles = StyleSerializer(many=True, required=False)

    class Meta:
        model = Photographer
        fields = '__all__'

    # Override default create method to auto create nested profile from photographer
    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        # photographer_photos_data=validated_data.pop('photographer_photos')
        # photographer_equipments_data=validated_data.pop('photographer_equipment')
        profile = ProfileSerializer.create(ProfileSerializer(), validated_data=profile_data)
        photographer = Photographer.objects.create(profile=profile, **validated_data)
        # for photographer_photo_data in photographer_photos_data:
        #     Photo.objects.create(photographer=photographer, **photographer_photo_data)
        #
        # for photographer_equipment_data in photographer_equipments_data:
        #     Equipment.objects.create(photographer=photographer, **photographer_equipment_data)

        profile.save()
        return photographer

    # def update(self, instance, validated_data):
    #     # update user information except username and password
    #     profile_data = validated_data.pop('profile')
    #     profile = instance.profile
    #     profile.ssn = profile_data.get('ssn', profile.ssn)
    #     profile.back_account_number = profile_data.get('bank_account_number', profile.back_account_number)
    #     profile.bank_name = profile_data.get('bank_name', profile.bank_name)
    #     profile.phone = profile_data.get('phone', profile.phone)
    #     profile.save()
    #
    #     # update photographer's photos
    #     photos_data = validated_data.pop('photographer_photo')
    #     photos = (instance.photos).all()
    #     photos = list(photos)
    #     for photo_data in photos_data:
    #         photo = photos.pop(0)
    #         photo.photo_link = photo_data.get('photo_link', photo.photo_link)
    #         photo.save()
    #
    #     # update photographer's equipments
    #     equipments_data = validated_data.pop('photographer_equipments')
    #     equipments = (instance.equipments).all()
    #     equipments = list(equipments)
    #     for equipment_data in equipments_data:
    #         equipment = equipments.pop(0)
    #         equipment.equipment_name = equipment_data.get('equipment_name', equipment.equipment_name)
    #         equipment.save()
    #
    #     # update photographer's style
    #     styles_data = validated_data.pop('photographer_styles')
    #     styles = (instance.styles).all()
    #     styles = list(styles)
    #     for style_data in styles_data:
    #         style = styles.pop(0)
    #         style.style_name = style_data.get('style_name', style.style_name)
    #         style.save()
    #
    #     return instance


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
        customer = Customer.objects.create(profile=profile)

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


