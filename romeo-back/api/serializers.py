from rest_framework import fields, serializers, status
from rest_framework.response import Response
from django.contrib.auth.validators import UnicodeUsernameValidator
from djoser.serializers import UserCreateSerializer as BaseUserRegistrationSerializer
from rest_framework.validators import UniqueValidator
from drf_writable_nested.serializers import WritableNestedModelSerializer
from drf_writable_nested.mixins import UniqueFieldsMixin, NestedUpdateMixin
from django.db.models import Q
# Import App Models
from photographers.models import Photographer, Photo, AvailTime, Equipment, Style
from customers.models import Customer
from jobs.models import JobInfo, JobReservation
from users.models import CustomUser, CustomUserProfile
from notification.models import Notification
from reviews.models import ReviewInfo
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

class ChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(max_length=128, write_only=True, required=True)
    new_password = serializers.CharField(max_length=128, write_only=True, required=True)
    class Meta:
        model = CustomUser
        fields = ['old_password','new_password']

    def update(self, instance, validated_data):
        old_password = validated_data.pop('old_password')
        new_password = validated_data.pop('new_password')
        if not instance.check_password(old_password):
            raise serializers.ValidationError('Your old password was entered incorrectly. Please enter it again.')
        else:
                instance.set_password(new_password)
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
        if 'user' in validated_data:
            user_data = dict(validated_data.pop('user'))
            user = UserSerializer.update(UserSerializer(required=False),instance=instance.user,validated_data=user_data)

        # update profile instance
        instance.user = user
        instance.ssn = validated_data.pop('ssn')
        instance.bank_account_number = validated_data.pop('bank_account_number')
        instance.bank_name = validated_data.pop('bank_name')
        instance.bank_account_name = validated_data.pop('bank_account_name')
        instance.phone = validated_data.pop('phone')

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
        if 'profile' in validated_data:
            profile_data = dict(validated_data['profile'])
            if 'user' in profile_data:
                profile_data_dict = dict(profile_data['user'])
                profile_instance = ProfileSerializer.update(ProfileSerializer(required=False), instance=instance.profile, validated_data=profile_data)

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
        customer.fav_photographers.set(validated_data.pop('fav_photographers'))

        customer.save()
        profile.save()
        return customer

    def update (self, instance, validated_data):
        # update profile
        if 'profile' in validated_data:
            profile_data = dict(validated_data['profile'])
            if 'user' in profile_data:
                username = dict(profile_data['user'])['username']
                profile_instance = CustomUserProfile.objects.get(user__username=username)
                profile_instance = ProfileSerializer.update(ProfileSerializer, instance=profile_instance, validated_data=profile_data)

        if 'fav_photographers' in validated_data:
            instance.fav_photographers.clear()
            for favphotographers_data in validated_data.pop('fav_photographers'):
                if favphotographers_data != []:
                    instance.fav_photographers.add(favphotographers_data)

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
    noti_actor = serializers.CharField(source='noti_actor.user.username')
    noti_receiver = serializers.CharField(source='noti_receiver.user.username')
        
    class Meta:
        model = Notification
        fields = '__all__'
        ordering = ('-timestamp')
    
    def create(self, validated_data):
        notification = Notification.objects.create(**validated_data)
        notification.save()
        return notification

    def update(self, instance, validated_data):
        if 'noti_read' in validated_data:
            instance.noti_read = validated_data.pop('noti_read')

        instance.save()
        return instance

class JobReservationSerializer(serializers.ModelSerializer):
    job_reservation = AvailTimeSerializer(partial=True)
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
    job_customer = serializers.CharField(source='job_customer.profile.user.username')
    job_photographer = serializers.CharField(source='job_photographer.profile.user.username')
    job_reservation = JobReservationSerializer(many=True, required=False, partial=True)

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

        job_customer=validated_data.pop('job_customer')
        job_customer=Customer.objects.get(profile__user__username=job_customer['profile']['user']['username'])
        
        job_photographer_username=validated_data.pop('job_photographer')['profile']['user']['username']
        job_photographer=Photographer.objects.get(profile__user__username=job_photographer_username)

        job_status = "PENDING"
        
        job_total_price = 0
        reservation_list = []
        # create job reservation instances and store them in reservation_list
        for reservation_data in validated_data.pop('job_reservation'):
            reservation_data = dict(reservation_data)
            job_reservation_data = dict(reservation_data['job_reservation'])
            photoshoot_date = reservation_data['photoshoot_date']
            # check if reservation date and time is valid
            is_vaild = False
            for avail_time_instance in job_photographer.photographer_avail_time.all():
                if avail_time_instance.avail_date == job_reservation_data['avail_date'] and avail_time_instance.avail_time == job_reservation_data['avail_time']:
                    # prevent creating job when photographer already has a job in the selected time 
                    if JobInfo.objects.filter(Q(job_reservation__photoshoot_date=photoshoot_date) & 
                                                Q(job_photographer__profile__user__username=job_photographer_username)).exists():
                        raise serializers.ValidationError('''Photographer is not available in this time''')
                    try :
                        reservation_instance = JobReservation.objects.get(photoshoot_date=photoshoot_date,
                                                                        job_reservation=avail_time_instance)
                    except :
                        reservation_instance = JobReservation.objects.create(photoshoot_date=photoshoot_date,
                                                                        job_reservation=avail_time_instance)
                    job_total_price += avail_time_instance.photographer_price
                    reservation_list.append(reservation_instance)
                    is_vaild = True
            if not is_vaild:
                raise serializers.ValidationError('''Your selected date or time for reservation is invalid for the photographer, please check photographer's available time''')
        
        job_info = JobInfo.objects.create(job_title=validated_data.pop('job_title'), 
                                        job_description=validated_data.pop('job_description'), 
                                        job_customer=job_customer, 
                                        job_photographer=job_photographer, 
                                        job_status='PENDING', 
                                        job_start_date=validated_data.pop('job_start_date'), 
                                        job_end_date=validated_data.pop('job_end_date'), 
                                        job_total_price=job_total_price)
        job_info.job_reservation.add(*reservation_list)
        job_info.save()

        # Create a notification
        notification=NotificationSerializer.create(self,validated_data={'noti_receiver':job_photographer.profile, \
        'noti_actor':job_customer.profile, 'noti_action':'CREATE', 'noti_status':job_status, 'noti_read': 'UNREAD'})

        return job_info

    def update(self, instance, validated_data):
        # job_status
        if 'job_status' in validated_data:
            instance.job_status = validated_data.pop('job_status')
            # Create a notification
            notification=NotificationSerializer.create(self,validated_data={'noti_receiver':instance.job_customer.profile, \
            'noti_actor':instance.job_photographer.profile, 'noti_action':'UPDATE', 'noti_status':instance.job_status, 'noti_read':'UNREAD'})
        if 'job_url' in validated_data:
            instance.job_url = validated_data.pop('job_url')

        instance.save()
        return instance

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewInfo
        fields = '__all__'