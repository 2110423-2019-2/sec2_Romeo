from rest_framework.decorators import action
from rest_framework import status, viewsets, filters, mixins
from rest_framework.response import Response
from .permissions import IsUser
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Q, Avg
import datetime

# Import Serializers of apps
from .serializers import PhotographerSerializer, CustomerSerializer, JobSerializer, JobReservationSerializer, UserSerializer, \
    PhotoSerializer, AvailTimeSerializer, EquipmentSerializer, ProfileSerializer, StyleSerializer, NotificationSerializer, ChangePasswordSerializer, \
        ReviewSerializer
# Import models of apps for queryset
from photographers.models import Photographer, Photo, AvailTime, Equipment, Style
from customers.models import Customer
from jobs.models import JobInfo, JobReservation
from users.models import CustomUser, CustomUserProfile
from notification.models import Notification
from reviews.models import ReviewInfo


class PhotographerViewSet(viewsets.ModelViewSet):
    serializer_class = PhotographerSerializer
    queryset = Photographer.objects.all()
    permission_classes = [AllowAny]
    lookup_field = 'profile__user__username'
    filter_backends = [filters.SearchFilter]
    search_fields = ['profile__user__username',"profile__user__first_name","profile__user__last_name"]

    # # custom action routing for photographers to update photos
    # @action(detail=True, methods=['get', 'post', 'delete'], url_path='update_photos')
    # def update_photos(self, request, *args, **kwargs):
    #     user = self.get_object()
    #     serializer = PhotoSerializer(data=self.request.query_params.get('PhotographerPhotos'))
    #     if serializer.is_valid():
    #         user.update_photos(serializer.data)
    #         user.save()
    #         return Response({'status': 'password set'})
    #     else:
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #


class PhotoViewSet(viewsets.ModelViewSet):
    serializer_class = PhotoSerializer
    queryset = Photo.objects.all()


class AvailTimeViewSet(viewsets.ModelViewSet):
    serializer_class = AvailTimeSerializer
    queryset = AvailTime.objects.all()


class StyleViewSet(viewsets.ModelViewSet):
    serializer_class = StyleSerializer
    queryset = Style.objects.all()

class PhotographerSearchViewSet(viewsets.ModelViewSet) :
    serializer_class = PhotographerSerializer
    def get_queryset(self):
        #Filter name
        user = self.request.query_params.get('user')
        if user is not None :
            nameset = Photographer.objects.filter(Q(profile__user__username__icontains=user)|Q(profile__user__first_name__icontains=user)|Q(profile__user__last_name__icontains=user))
        else : nameset = Photographer.objects.all()

        #Filter other parameters
        style = self.request.query_params.get('style')
        time = self.request.query_params.get('time')
        metafil = {'photographer_style__style_name': style, 'photographer_avail_time__avail_time': time}
        filters = {k: v for k, v in metafil.items() if v is not None}
        paraset = nameset.filter(**filters)

        #Filter Date (allphotographer - photographerwithjobs)
        date = self.request.query_params.get('date')
        if date is not None :
            #Filter Photographer by date
            day, month, year = (int(x) for x in date.split('_')) 
            sel_date = (datetime.date(year, month, day)).strftime('%A')
            dateset = paraset.filter(photographer_avail_time__avail_date = sel_date)
            #Filter out reserved photographer
            compdate = "-".join(date.split("_")[::-1])
            jobset = JobInfo.objects.filter(job_reservation__photoshoot_date = compdate).values_list('job_photographer_id', flat=True)
            toremove = []
            for cid in jobset :
                if dateset.filter(profile__user__id=cid) is not None:
                    toremove.append(cid)
            queryset = dateset.filter(~Q(profile__user__id__in=toremove))
        else : queryset = paraset
        
        #Sort
        sort = self.request.query_params.get('sort')
        if sort == "time_des" :
            return queryset.order_by("-photographer_last_online_time")
        elif sort == "time_asc" :
            return queryset.order_by("photographer_last_online_time")
        elif sort == "price_des" :
            return queryset.annotate(price=Avg('photographer_avail_time__photographer_price')).order_by('-price')
        elif sort == "price_asc" :
            return queryset.annotate(price=Avg('photographer_avail_time__photographer_price')).order_by('price')
        return queryset

class EquipmentViewSet(viewsets.ModelViewSet):
    serializer_class = EquipmentSerializer
    queryset = Equipment.objects.all()


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.filter()
    serializer_class = CustomerSerializer
    permission_classes = [AllowAny]
    lookup_field = 'profile__user__username'
    filter_backends = [filters.SearchFilter]
    search_fields = ['profile__user__username']


class JobsViewSet(viewsets.ModelViewSet):
    queryset = JobInfo.objects.all()
    serializer_class = JobSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['job_photographer__profile__user__username','job_customer__profile__user__username']

    # def get_permissions(self):
    #     if self.action == 'list':
    #         self.permission_classes = [IsSuperUser, ]
    #     elif self.action in ['update', 'retrieve', 'destroy']:
    #         self.permission_classes = [IsUser]
    #     return super(self.__class__, self).get_permissions()

class JobReservationViewSet(viewsets.ModelViewSet):
    queryset = JobReservation.objects.all()
    serializer_class = JobReservationSerializer
    permission_classes = [AllowAny]

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    lookup_field = 'username'
    filter_backends = [filters.SearchFilter]
    search_fields = ['username']

class ChangePasswordViewSet(mixins.UpdateModelMixin,viewsets.GenericViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = ChangePasswordSerializer
    permission_classes = [AllowAny]
    lookup_field = 'username'   

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = CustomUserProfile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]
    lookup_field = 'user__username'
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__username']

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    queryset = Notification.objects.filter()
    permission_classes = [AllowAny]
    lookup_field = 'noti_receiver__user__username'
    filter_backends = [filters.SearchFilter]
    search_fields = ['noti_receiver__user__username']

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = ReviewInfo.objects.filter()
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]