import django_filters

# import models
from photographers.models import Photographer, Style

class styleFilter(django_filters.FilterSet):
    style = django_filters.Filter(name="photographer_style")

    class Meta:
        model = Photographer
        fields = ["photographer_style"]