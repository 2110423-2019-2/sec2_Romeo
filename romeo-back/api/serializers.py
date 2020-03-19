from rest_framework import fields, serializers, status
from rest_framework.response import Response
from django.contrib.auth.validators import UnicodeUsernameValidator
from djoser.serializers import UserCreateSerializer as BaseUserRegistrationSerializer
from rest_framework.validators import UniqueValidator
from drf_writable_nested.serializers import WritableNestedModelSerializer
from drf_writable_nested.mixins import UniqueFieldsMixin, NestedUpdateMixin
# Import App Models
from favPhotographers.models import FavPhotographer
from photographers.models import Photographer, Photo, AvailTime, Equipment, Style
from customers.models import Customer
from jobs.models import JobInfo, JobReservation
from users.models import CustomUser, CustomUserProfile
from notification.models import Notification
import datetime


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
        extra_kwargs = {
            'username': {
                'validators': [UnicodeUsernameValidator()],
            }
        }


    def create(self, validated_data):
        user = CustomUser.objects.create_user(username=validated_data['username'],
                                              password=validated_data['password'],
                                              user_type=validated_data['user_type'],
                                              email=validated_data['email'],
                                              first_name=validated_data['first_name'],
                                              last_name=validated_data['last_name']
                                              )
        return user

    def update(self, instance, validated_data):
        # special case to hash password
        if 'password' in validated_data :
            raw_password = validated_data.pop('password')
            if not instance.check_password(raw_password):
                instance.set_password(raw_password)
            
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True, partial=True)

    class Meta:
        model = CustomUserProfile
        fields = '__all__'

    # Override default create method to auto create nested user from profile
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer.create(UserSerializer(), validated_data=user_data)
        validated_data['user'] = user
        profile = CustomUserProfile.objects.create(**validated_data)
        return profile

    def update (self, instance, validated_data):
        # update user instance before updating profile 
        user_data = dict(validated_data.pop('user'))
        user_username = user_data['username']
        user = CustomUser.objects.get(username = user_username)
        user = UserSerializer.update(UserSerializer(),instance=user,validated_data=user_data)

        # update profile instance
        instance.user = user
        instance.ssn = validated_data.pop('ssn')
        instance.bank_account_number = validated_data.pop('bank_account_number')
        instance.bank_name = validated_data.pop('bank_name')
        instance.bank_account_name = validated_data.pop('bank_account_name')
        instance.phone = validated_data.pop('phone')

        instance.save()
        return instance


class JobReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobReservation
        fields = '__all__'

    # Override default create method to auto create nested profile from photographer
    def create(self, validated_data):
        if validated_data['photoshoot_date'].get_weekday() not in validated_data['job_reservation.avail_date']:
            raise serializers.ValidationError('The photographer is not available at the selected date.')
        reservation = JobReservation.objects.create(**validated_data)
        return reservation


class JobSerializer(serializers.ModelSerializer):
    # Reservation=True
    reservation = JobReservationSerializer(many=True, required=False)

    class Meta:
        model = JobInfo
        fields = '__all__'

    # Override default create method to auto create nested profile from photographer
    def create(self, validated_data):
        # Check if start date is valid
        if validated_data["job_start_date"] < datetime.date.today():
            raise serializers.ValidationError('The selected date should not be before today.')
        # Check valid start&end date
        if validated_data["job_end_date"] < validated_data["job_start_date"]:
            raise serializers.ValidationError('End date should not be before start date.')

        job_info = JobInfo.objects.create(job_title=validated_data.pop('job_title'), job_description=validated_data.pop('job_description'), \
         job_customer=validated_data.pop('job_customer'), job_photographer=validated_data.pop('job_photographer'), \
         job_status=validated_data.pop('job_status'), job_start_date=validated_data.pop('job_start_date'), \
         job_end_date=validated_data.pop('job_end_date'), job_total_price=validated_data.pop('job_total_price'))

        # create job reservation instance then add to job_reservation field
        for reservation_data in validated_data.pop('job_reservation'):
            reservation_data = dict(reservation_data)
            try :
                reservation_instance = JobReservation.objects.get(photoshoot_date=reservation_data['photoshoot_date'], \
                job_reservation=reservation_data['job_reservation'])
            except :
                reservation_instance = JobReservation.objects.create(photoshoot_date=reservation_data['photoshoot_date'], \
                job_reservation=reservation_data['job_reservation'])
            job_info.reservation.add(reservation_instance)
        job_info.save()
        return job_info

    def update(self, instance, validated_data):
        # job_reservation
        if 'job_reservation' in validated_data:
            instance.job_reservation.clear()
            for reservation_data in validated_data.pop('job_reservation'):
                reservation_data = dict(reservation_data)
                try :
                    reservation_instance = JobReservation.objects.get(photoshoot_date=reservation_data['photoshoot_date'],
                                                                job_reservation=reservation_data['job_reservation'])
                except :
                    reservation_instance = JobReservation.objects.create(**reservation_data)
                instance.job_reservation.add(reservation_instance)

        # job_status
        if 'job_status' in validated_data:
            instance.job_status = validated_data.pop('job_status')

        instance.save()
        return instance


class PhotoSerializer(UniqueFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = '__all__'
        extra_kwargs = {
            'photo_link':{
                'validators' : [UniqueValidator(queryset=Photo.objects.all())]
            }
        }


class AvailTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailTime
        fields = '__all__'


class StyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Style
        fields = '__all__'


class EquipmentSerializer(UniqueFieldsMixin,NestedUpdateMixin,serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = '__all__'
        extra_kwargs = {
            'equipment_name': {
                'validators': [UniqueValidator(queryset=Equipment.objects.all())]
            },
        }


class PhotographerSerializer(WritableNestedModelSerializer):
    profile = ProfileSerializer(required=True, partial=True)
    photographer_photos = PhotoSerializer(many=True, required=False, allow_null=True)
    photographer_equipment = EquipmentSerializer(many=True, required=False, allow_null=True)
    photographer_styles = StyleSerializer(many=True, required=False)
    photographer_avail_time = AvailTimeSerializer(many=True, required=False)

    class Meta:
        model = Photographer
        fields = '__all__'

    # Override default create method to auto create nested profile from photographer
    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        profile = ProfileSerializer.create(ProfileSerializer(), validated_data=profile_data)
        photographer = Photographer.objects.create(profile=profile,
                                                   photographer_last_online_time=validated_data.pop('photographer_last_online_time'),
                                                   )

        # create photo instance then add to photographer_photos field
        # (photo_links are always unique)
        for photo_data in validated_data.pop('photographer_photos'):
            photo_data = dict(photo_data)
            photo_instance = Photo.objects.create(photo_link=photo_data['photo_link'])
            photographer.photographer_photos.add(photo_instance)

        # create equipment instance then add to photographer_equipments field
        for equipment_data in validated_data.pop('photographer_equipment'):
            equipment_data = dict(equipment_data)
            try :
                equipment_instance = Equipment.objects.get(equipment_name=equipment_data['equipment_name'])
            except :
                equipment_instance = Equipment.objects.create(equipment_name=equipment_data['equipment_name'])
            photographer.photographer_equipment.add(equipment_instance)

        # add selected style to photographer_style
        for style_data in validated_data.pop('photographer_style'):
            style_instance = Style.objects.get(style_name=style_data)
            photographer.photographer_style.add(style_instance)

        # add avail time
        for avail_time_data in validated_data.pop('photographer_avail_time'):
            avail_time_data = dict(avail_time_data)
            try :
                avail_time_instance = AvailTime.objects.get(avail_date=avail_time_data['avail_date'],
                                                            avail_time=avail_time_data['avail_time'],
                                                            photographer_price=avail_time_data['photographer_price'])
            except :
                avail_time_instance = AvailTime.objects.create(**avail_time_data)
            photographer.photographer_avail_time.add(avail_time_instance)

        profile.save()
        photographer.save()
        return photographer

    def update (self, instance, validated_data):
        # update profile 
        profile_data = dict(validated_data['profile'])
        username = dict(profile_data['user'])['username']
        profile_instance = CustomUserProfile.objects.get(user__username=username)
        profile_instance = ProfileSerializer.update(ProfileSerializer, instance=profile_instance, validated_data=profile_data)

        # update photographer_photos
        if 'photographer_photos' in validated_data:
            instance.photographer_photos.clear()
            for photo_data in validated_data.pop('photographer_photos'):
                photo_data = dict(photo_data)
                try:
                    photo_instance = Photo.objects.get(photo_link=photo_data['photo_link'])
                except:
                    photo_instance = Photo.objects.create(photo_link=photo_data['photo_link'])
                instance.photographer_photos.add(photo_instance)

        # photographer_equipment
        if 'photographer_equipment' in validated_data:
            instance.photographer_equipment.clear()
            for equipment_data in validated_data.pop('photographer_equipment'):
                equipment_data = dict(equipment_data)
                try :
                    equipment_instance = Equipment.objects.get(equipment_name=equipment_data['equipment_name'])
                except :
                    equipment_instance = Equipment.objects.create(equipment_name=equipment_data['equipment_name'])
                instance.photographer_equipment.add(equipment_instance)

        # photographer_avail_time
        if 'photographer_avail_time' in validated_data:
            instance.photographer_avail_time.clear()
            for avail_time_data in validated_data.pop('photographer_avail_time'):
                avail_time_data = dict(avail_time_data)
                try :
                    avail_time_instance = AvailTime.objects.get(avail_date=avail_time_data['avail_date'],
                                                                avail_time=avail_time_data['avail_time'],
                                                                photographer_price=avail_time_data['photographer_price'])
                except :
                    avail_time_instance = AvailTime.objects.create(**avail_time_data)
                instance.photographer_avail_time.add(avail_time_instance)

        # photographer_last_online_time
        if 'photographer_last_online_time' in validated_data:
            instance.photographer_last_online_time = validated_data.pop('photographer_last_online_time')

        # photographer_style
        if 'photographer_style' in validated_data:
            instance.photographer_style.clear()
            for style_data in validated_data.pop('photographer_style'):
                style_instance = Style.objects.get(style_name=style_data)
                instance.photographer_style.add(style_instance)

        instance.save()
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
        customer = Customer.objects.create(profile=profile)
        # customer.fav_photographers.set(validated_data.pop('fav_photographers'))

         # create equipment instance then add to photographer_equipments field
        # for equipment_data in validated_data.pop('photographer_equipment'):
        #     equipment_data = dict(equipment_data)
        #     try :
        #         equipment_instance = Equipment.objects.get(equipment_name=equipment_data['equipment_name'])
        #     except :
        #         equipment_instance = Equipment.objects.create(equipment_name=equipment_data['equipment_name'])
        #     photographer.photographer_equipment.add(equipment_instance)

        for favphotographers_data in validated_data.pop('fav_photographers'):
            favphotographers_data = dict(favphotographers_data)
            try :
                favphotographers_instance = FavPhotographer.objects.get(fav_photographers_name=favphotographers_data['fav_photographers_name'])
            except :
                favphotographers_instance = FavPhotographer.objects.create(fav_photographers_name=favphotographers_data['fav_photographers_name'])
            customer.fav_photographers.add(favphotographers_instance)

        customer.save()
        profile.save()
        return customer

    def update (self, instance, validated_data):
        # update profile
        profile_data = dict(validated_data['profile'])
        username = dict(profile_data['user'])['username']
        profile_instance = CustomUserProfile.objects.get(user__username=username)
        profile_instance = ProfileSerializer.update(ProfileSerializer, instance=profile_instance, validated_data=profile_data)

         # photographer_equipment
        # if 'photographer_equipment' in validated_data:
        #     instance.photographer_equipment.clear()
        #     for equipment_data in validated_data.pop('photographer_equipment'):
        #         equipment_data = dict(equipment_data)
        #         try :
        #             equipment_instance = Equipment.objects.get(equipment_name=equipment_data['equipment_name'])
        #         except :
        #             equipment_instance = Equipment.objects.create(equipment_name=equipment_data['equipment_name'])
        #         instance.photographer_equipment.add(equipment_instance)

         # photographer_equipment
        if 'fav_photographers' in validated_data:
            instance.fav_photographers.clear()
            for favphotographers_data in validated_data.pop('fav_photographers'):
                favphotographers_data = dict(favphotographers_data)
                try :
                    favphotographers_instance = FavPhotographer.objects.get(fav_photographers_name=favphotographers_data['fav_photographers_name'])
                except :
                    favphotographers_instance = FavPhotographer.objects.create(fav_photographers_name=favphotographers_data['fav_photographers_name'])
                instance.fav_photographers.add(favphotographers_instance)
        instance.save()
        return instance
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

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

    # noti = Notificaiton.objects.create(user = settings.AUTH_USER_MODEL, actor = validated_data['customer'],\
    # verb = validated_data['job_status'])

class FavPhotographerSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavPhotographer
        fields = '__all__'
