from django.shortcuts import render
from django.http import HttpResponse
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


# Create your views here.
def home(request):
    return HttpResponse("<h1>This is F1 home page!!!!</h1>")


class F1DriversAPIView(APIView):
    """
    Fetches real-time driver information from the OpenF1 API
    and sanitizes it into a clean, optimized payload for React.
    """
    def get(self, request):
        # We will use '9161' (2023 Abu Dhabi GP) as a reliable default fallback session
        session_key = request.query_params.get('session_key', '9161')
        openf1_url = f"https://api.openf1.org/v1/drivers?session_key={session_key}"
        
        try:
            # Hit the external OpenF1 REST API
            response = requests.get(openf1_url, timeout=10)
            
            if response.status_code == 200:
                raw_drivers = response.json()
                sanitized_drivers = []
                
                # Deduplicate drivers (OpenF1 can return multiple entries per driver if parameters change)
                seen_numbers = set()
                
                for driver in raw_drivers:
                    driver_number = driver.get("driver_number")
                    if driver_number in seen_numbers:
                        continue
                    
                    seen_numbers.add(driver_number)
                    
                    # Pull official hex colors, ensuring a fallback hash sign exists
                    team_color = driver.get("team_colour")
                    formatted_color = f"#{team_color}" if team_color and not team_color.startswith('#') else "#FFFFFF"
                    
                    # Strip out the unnecessary keys and shape a clean React payload
                    sanitized_drivers.append({
                        "name": driver.get("full_name"),
                        "abbreviation": driver.get("name_acronym"),
                        "number": driver_number,
                        "team": driver.get("team_name"),
                        "team_color": formatted_color,
                        "headshot_url": driver.get("headshot_url")
                    })
                
                return Response(sanitized_drivers, status=status.HTTP_200_OK)
            
            return Response({"error": "Failed to pull data from OpenF1 paddock"}, status=response.status_code)
            
        except requests.exceptions.RequestException as e:
            return Response({"error": f"Paddock connection timeout: {str(e)}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)