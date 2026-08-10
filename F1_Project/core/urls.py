from django.urls import path
from .views import F1DriversAPIView , F1CircuitAPIView
urlpatterns = [
    path('api/drivers/', F1DriversAPIView.as_view(), name='f1_drivers_api'),
    path("api/circuit/", F1CircuitAPIView.as_view() , name="f1_circuit"),
]
