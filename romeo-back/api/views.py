from rest_framework.decorators import action
from rest_framework import generics, viewsets
from .permissions import IsUser

# Import Serializers of apps
from .serializers import PhotographerSerializer, CustomerSerializer, JobSerializer, UserSerializer

# Import models of apps for queryset
from photographers.models import Photographer
from customers.models import Customer
from jobs.models import JobInfo
from users.models import CustomUser


class PhotographerViewSet(viewsets.ModelViewSet):
    serializer_class = PhotographerSerializer
    queryset = Photographer.objects.all()


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



