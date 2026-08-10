from django.shortcuts import render
from django.http import HttpResponse
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# import random


# Create your views here.
def home(request):
    return HttpResponse("<h1>This is F1 home page!!!!</h1>")


class F1DriversAPIView(APIView):
    """
    Fetches driver info from OpenF1 with built-in emergency fallbacks 
    if the API flags a 401 Unauthorized or live-session restriction.
    """
    def get(self, request):
        session_key = request.query_params.get('session_key', '9161')
        openf1_url = f"https://api.openf1.org/v1/drivers?session_key={session_key}"
        
        # 🏎️ Paddock Emergency Vault: Accurate fallback driver data package
        local_driver_fallbacks = [
            {"name": "Max Verstappen", "abbreviation": "VER", "number": 1, "team": "Red Bull Racing", "team_color": "#3671C2"},
            {"name": "Lewis Hamilton", "abbreviation": "HAM", "number": 44, "team": "Ferrari", "team_color": "#E80020"},
            {"name": "Lando Norris", "abbreviation": "NOR", "number": 4, "team": "McLaren", "team_color": "#FF8000"},
            {"name": "Charles Leclerc", "abbreviation": "LEC", "number": 16, "team": "Ferrari", "team_color": "#E80020"},
            {"name": "George Russell", "abbreviation": "RUS", "number": 63, "team": "Mercedes", "team_color": "#27F4D2"},
            {"name": "Fernando Alonso", "abbreviation": "ALO", "number": 14, "team": "Aston Martin", "team_color": "#229971"}
        ]

        try:
            response = requests.get(openf1_url, timeout=5)
            
            # If the remote API explicitly flags an auth wall (401) or crashes (500)
            if response.status_code in [401, 403]:
                return Response(local_driver_fallbacks, status=status.HTTP_200_OK)
                
            if response.status_code == 200:
                raw_drivers = response.json()
                sanitized_drivers = []
                seen_numbers = set()
                
                for driver in raw_drivers:
                    driver_number = driver.get("driver_number")
                    if not driver_number or driver_number in seen_numbers:
                        continue
                    
                    seen_numbers.add(driver_number)
                    team_color = driver.get("team_colour")
                    formatted_color = f"#{team_color}" if team_color and not team_color.startswith('#') else "#FFFFFF"
                    
                    sanitized_drivers.append({
                        "name": driver.get("full_name"),
                        "abbreviation": driver.get("name_acronym"),
                        "number": driver_number,
                        "team": driver.get("team_name"),
                        "team_color": formatted_color,
                        "headshot_url": driver.get("headshot_url")
                    })
                
                # If the API returned empty arrays, activate backup code
                if not sanitized_drivers:
                    return Response(local_driver_fallbacks, status=status.HTTP_200_OK)
                    
                return Response(sanitized_drivers, status=status.HTTP_200_OK)
                
        except requests.exceptions.RequestException:
            pass # Network dropped completely, fall through to fallback data array

        # Global safety catch
        return Response(local_driver_fallbacks, status=status.HTTP_200_OK)



class F1CircuitAPIView(APIView):
    """
    Serves circuit metadata and spatial shape vectors for layout tracing.
    Includes a robust local fallback mechanism in case of external API timeouts.
    """
    def get(self, request):
        circuit_id = request.query_params.get('circuit_id', 'monaco').lower()
        ergast_url = f"https://ergast.com/api/f1/circuits/{circuit_id}.json"
        
        # 🌟 Hardcoded professional mock data asset cache for reliable development
        local_fallbacks = {
            "monaco": {
                "id": "monaco",
                "track_name": "Circuit de Monaco",
                "locality": "Monte Carlo",
                "country": "Monaco",
                "svg_path": "M 80,220 C 70,180 90,140 140,110 C 200,80 280,60 340,90 C 400,120 420,170 390,210 C 350,260 260,220 220,260 C 180,300 130,350 90,310 C 60,280 90,260 80,220 Z"
            },
            "silverstone": {
                "id": "silverstone",
                "track_name": "Silverstone Circuit",
                "locality": "Silverstone",
                "country": "UK",
                "svg_path": "M 50,100 L 200,50 L 350,120 L 300,250 L 150,280 Z"
            }
        }

        try:
            # Attempt to pull from live API with a slightly lower timeout for speed
            response = requests.get(ergast_url, timeout=4)
            
            if response.status_code == 200:
                data = response.json()
                # Safe checking for deeply nested keys using .get()
                mr_data = data.get("MRData", {})
                table = mr_data.get("CircuitTable", {})
                circuits = table.get("Circuits", [])
                
                if circuits:
                    circuit_data = circuits[0]
                    location = circuit_data.get("Location", {})
                    
                    # Target SVG path from fallbacks if available, otherwise give a default shape
                    fallback_track = local_fallbacks.get(circuit_id, local_fallbacks["monaco"])
                    
                    return Response({
                        "id": circuit_data.get("circuitId"),
                        "track_name": circuit_data.get("circuitName"),
                        "locality": location.get("locality"),
                        "country": location.get("country"),
                        "svg_path": fallback_track["svg_path"]
                    }, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException:
            # 🏁 PADDOCK SAFETY PROTOCOL INITIATED: 
            # External network failed, fall back to our reliable local database assets!
            pass

        # If API failed or we don't have internet access right now, serve the fallback data!
        if circuit_id in local_fallbacks:
            return Response(local_fallbacks[circuit_id], status=status.HTTP_200_OK)
            
        # Global fallback if they query an unregistered track while offline
        return Response(local_fallbacks["monaco"], status=status.HTTP_200_OK)
    

