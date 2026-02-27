import requests
import math
import json
import random

# CONFIGURATION
CENTER_LAT = 12.9250
CENTER_LON = 77.5938
RADIUS_KM = 6.0  
ROUTES_URL = "https://raw.githubusercontent.com/Vonter/bmtc-gtfs/main/geojson/routes.geojson"

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat/2) * math.sin(dLat/2) + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon/2) * math.sin(dLon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def generate_mock_bmtc_data():
    """Fallback generator to ensure presentation never crashes"""
    print("⚠️ Download failed. Generating synthetic data for demo...")
    routes = []
    landmarks = [
        ("South End Circle", 12.9350, 77.5800),
        ("Jayanagar 4th Block", 12.9240, 77.5840),
        ("Banashankari TTMC", 12.9150, 77.5750),
        ("BTM Layout", 12.9160, 77.6100),
        ("Silk Board", 12.9170, 77.6230),
        ("Lalbagh Gate", 12.9490, 77.5820),
    ]
    route_numbers = ["215-H", "500-D", "13-A", "25-A", "365-J"]
    
    for i, r_num in enumerate(route_numbers):
        start = landmarks[i % len(landmarks)]
        end = landmarks[(i + 2) % len(landmarks)]
        stops = [{"name": start[0], "lat": start[1], "lon": start[2]}]
        for j in range(1, 4):
            ratio = j / 4
            lat = start[1] + (end[1] - start[1]) * ratio
            lon = start[2] + (end[2] - start[2]) * ratio
            stops.append({"name": f"{r_num} Stop {j}", "lat": lat, "lon": lon})
        stops.append({"name": end[0], "lat": end[1], "lon": end[2]})
        routes.append({"route_no": r_num, "name": f"{start[0]} -> {end[0]}", "stops": stops})
    return routes

def find_route_name(props):
    """Checks multiple keys to find a valid route name"""
    # Priority list of keys to check
    keys = ['route_short_name', 'route_long_name', 'route_id', 'route_no', 'name', 'ref', 'bus_no']
    for k in keys:
        if k in props and props[k]:
            return str(props[k])
    return "Unknown Route"

def fetch_and_filter_real_data():
    print(f"⬇️ Downloading BMTC data from: {ROUTES_URL}")
    try:
        response = requests.get(ROUTES_URL, timeout=30)
        if response.status_code != 200:
            print(f"❌ Failed to download. HTTP Status: {response.status_code}")
            return generate_mock_bmtc_data()
        
        data = response.json()
        print(f"✅ Download complete. Parsing {len(data['features'])} routes...")

        filtered_routes = []
        
        for feature in data['features']:
            props = feature.get('properties', {})
            
            # --- FIX: Smarter Name Detection ---
            route_name = find_route_name(props)
            origin = props.get('origin', 'Start')
            dest = props.get('destination', 'End')
            
            # Skip if geometry is missing
            geometry = feature.get('geometry')
            if not geometry: continue
                
            coords_raw = geometry.get('coordinates', [])
            coordinates = []
            if geometry['type'] == 'MultiLineString':
                for line in coords_raw: coordinates.extend(line)
            else:
                coordinates = coords_raw

            if not coordinates: continue

            local_stops = []
            passes_through_zone = False
            
            # Sampling for speed
            step = max(1, len(coordinates) // 20)
            for i in range(0, len(coordinates), step):
                lon, lat = coordinates[i]
                if haversine(CENTER_LAT, CENTER_LON, lat, lon) < RADIUS_KM:
                    passes_through_zone = True
                    local_stops.append({
                        "name": f"{route_name} Stop",
                        "lat": lat,
                        "lon": lon
                    })
            
            # Format the name nicely for the dropdown
            if passes_through_zone and len(local_stops) >= 2:
                display_name = f"{route_name}: {origin} -> {dest}" if origin != 'Start' else f"Route {route_name}"
                
                filtered_routes.append({
                    "route_no": route_name,
                    "name": display_name,
                    "stops": local_stops
                })

        print(f"🎯 Filtered {len(filtered_routes)} routes for Jayanagar.")
        
        if not filtered_routes:
            return generate_mock_bmtc_data()

        return filtered_routes[:50]
        
    except Exception as e:
        print(f"❌ Error during import: {e}")
        return generate_mock_bmtc_data()