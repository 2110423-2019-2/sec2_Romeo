from rest_framework.decorators import action
from rest_framework import status, viewsets
from rest_framework.response import Response
from .permissions import IsUser
from rest_framework.permissions import AllowAny, SAFE_METHODS

# Import Serializers of apps
from .serializers import PhotographerSerializer, CustomerSerializer, JobSerializer, UserSerializer, \
    PhotoSerializer, AvailTimeSerializer, EquipmentSerializer, ProfileSerializer, StyleSerializer

# Import models of apps for queryset
from photographers.models import Photographer, Photo, AvailTime, Equipment, Style
from customers.models import Customer
from jobs.models import JobInfo
from users.models import CustomUser, CustomUserProfile


class PhotographerViewSet(viewsets.ModelViewSet):
    serializer_class = PhotographerSerializer
    queryset = Photographer.objects.all()
    permission_classes = [AllowAny]

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


class EquipmentViewSet(viewsets.ModelViewSet):
    serializer_class = EquipmentSerializer
    queryset = Equipment.objects.all()


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.filter()
    serializer_class = CustomerSerializer


class JobsViewSet(viewsets.ModelViewSet):
    queryset = JobInfo.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsUser]

    # def get_permissions(self):
    #     if self.action == 'list':
    #         self.permission_classes = [IsSuperUser, ]
    #     elif self.action in ['update', 'retrieve', 'destroy']:
    #         self.permission_classes = [IsUser]
    #     return super(self.__class__, self).get_permissions()


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = CustomUserProfile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]



