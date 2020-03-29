from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from .views import PhotographerViewSet, PhotoViewSet, EquipmentViewSet, PhotoViewSet, AvailTimeViewSet, \
    StyleViewSet, CustomerViewSet, JobsViewSet, JobReservationViewSet, UserViewSet, ProfileViewSet, \
    NotificationViewSet, PhotographerSearchViewSet, ChangePasswordViewSet, ReviewViewSet, PaymentViewSet, \
    RegisterViewSet

router = DefaultRouter()
router.register(r'photographers', PhotographerViewSet, basename='photographers')
router.register(r'photographersearch', PhotographerSearchViewSet, basename='photographersearch')
router.register(r'payment', PaymentViewSet, basename='payment')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'jobs', JobsViewSet, basename='jobs')
router.register(r'reservation', JobReservationViewSet, basename='reservation')
router.register(r'review', ReviewViewSet, basename='review')
router.register(r'users', UserViewSet, basename='users')
router.register(r'profiles', ProfileViewSet, basename='profiles')
router.register(r'equipments', EquipmentViewSet, basename='equipments')
router.register(r'photos', PhotoViewSet, basename='photos')
router.register(r'availtimes', AvailTimeViewSet, basename='availtimes')
router.register(r'styles', StyleViewSet, basename='styles')
router.register(r'notification', NotificationViewSet, basename='notification')
router.register(r'password', ChangePasswordViewSet, basename='password')
router.register(r'registeration', RegisterViewSet, basename='registeration')

urlpatterns = router.urls
