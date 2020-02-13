from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import generics, viewsets
from rest_framework.permissions import BasePermission

# Import Serializers of apps
from .serializers import PhotographerSerializer, CustomerSerializer, JobSerializer

# Import models of apps for queryset
from photographers.models import PhotographerInfo
from customers.models import CustomerInfo
from jobs.models import JobInfo


# Define custom permissions to allow only admin or owner to view
class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


class IsUser(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user:
            if request.user.is_superuser:
                return True
            else:
                return obj == request.user
        else:
            return False

#######################


class PhotographerViewSet(viewsets.ModelViewSet):
    serializer_class = PhotographerSerializer
    queryset = PhotographerInfo.objects.all()

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [IsSuperUser, ]
        elif self.action in ['update', 'retrieve', 'destroy']:
            self.permission_classes = [IsUser]
        return super(self.__class__, self).get_permissions()


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = CustomerInfo.objects.all()
    serializer_class = CustomerSerializer

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [IsSuperUser, ]
        elif self.action in ['update', 'retrieve', 'destroy']:
            self.permission_classes = [IsUser]
        return super(self.__class__, self).get_permissions()


class JobsViewSet(viewsets.ModelViewSet):
    queryset = JobInfo.objects.all()
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [IsSuperUser, ]
        elif self.action in ['update', 'retrieve', 'destroy']:
            self.permission_classes = [IsUser]
        return super(self.__class__, self).get_permissions()

