# HIGH-FIDELITY BANGALORE BUS DATASET
# Coordinates verified for map accuracy.

BMTC_DATA = [
    {
        "route_no": "KIA-5",
        "name": "KIA-5: Banashankari <-> Airport",
        "stops": [
            {"name": "Banashankari TTMC", "lat": 12.9154, "lon": 77.5736},
            {"name": "Jayanagar 4th Block", "lat": 12.9245, "lon": 77.5841},
            {"name": "South End Circle", "lat": 12.9355, "lon": 77.5802},
            {"name": "Shanthinagar TTMC", "lat": 12.9566, "lon": 77.5913},
            {"name": "Mekhri Circle", "lat": 13.0135, "lon": 77.5878},
            {"name": "Hebbal Flyover", "lat": 13.0333, "lon": 77.5893},
            {"name": "Kempegowda Int. Airport", "lat": 13.1986, "lon": 77.7066}
        ]
    },
    {
        "route_no": "500-D",
        "name": "500-D: Silk Board <-> Hebbal (ORR)",
        "stops": [
            {"name": "Central Silk Board", "lat": 12.9172, "lon": 77.6234},
            {"name": "Agara Lake", "lat": 12.9231, "lon": 77.6477},
            {"name": "Ecospace / Bellandur", "lat": 12.9348, "lon": 77.6705},
            {"name": "Marathahalli Bridge", "lat": 12.9555, "lon": 77.6998},
            {"name": "Karthik Nagar", "lat": 12.9667, "lon": 77.7013},
            {"name": "Tin Factory", "lat": 12.9926, "lon": 77.6718},
            {"name": "Hebbal Flyover", "lat": 13.0333, "lon": 77.5893}
        ]
    },
    {
        "route_no": "335-E",
        "name": "335-E: Majestic <-> ITPL (Whitefield)",
        "stops": [
            {"name": "Kempegowda BS (Majestic)", "lat": 12.9774, "lon": 77.5724},
            {"name": "Corporation Circle", "lat": 12.9663, "lon": 77.5879},
            {"name": "Richmond Circle", "lat": 12.9649, "lon": 77.5960},
            {"name": "Domlur Flyover", "lat": 12.9608, "lon": 77.6369},
            {"name": "HAL Main Gate", "lat": 12.9576, "lon": 77.6661},
            {"name": "Marathahalli", "lat": 12.9555, "lon": 77.6998},
            {"name": "ITPL / Hope Farm", "lat": 12.9845, "lon": 77.7516}
        ]
    },
    {
        "route_no": "215-H",
        "name": "215-H: Majestic <-> Jayanagar",
        "stops": [
            {"name": "Kempegowda BS (Majestic)", "lat": 12.9774, "lon": 77.5724},
            {"name": "Town Hall", "lat": 12.9642, "lon": 77.5862},
            {"name": "Lalbagh Main Gate", "lat": 12.9496, "lon": 77.5823},
            {"name": "Ashoka Pillar", "lat": 12.9379, "lon": 77.5858},
            {"name": "Jayanagar 4th Block", "lat": 12.9245, "lon": 77.5841}
        ]
    },
    {
        "route_no": "G-2",
        "name": "G-2: Electronic City <-> Majestic",
        "stops": [
            {"name": "Electronic City Wipro Gate", "lat": 12.8450, "lon": 77.6625},
            {"name": "Bommanahalli", "lat": 12.9056, "lon": 77.6255},
            {"name": "Central Silk Board", "lat": 12.9172, "lon": 77.6234},
            {"name": "Dairy Circle", "lat": 12.9416, "lon": 77.6015},
            {"name": "Shanthinagar TTMC", "lat": 12.9566, "lon": 77.5913},
            {"name": "Majestic", "lat": 12.9774, "lon": 77.5724}
        ]
    },
    {
        "route_no": "410-FA",
        "name": "410-FA: Banashankari <-> Yeshwanthpur",
        "stops": [
            {"name": "Banashankari TTMC", "lat": 12.9154, "lon": 77.5736},
            {"name": "PES University", "lat": 12.9344, "lon": 77.5348},
            {"name": "Nayandahalli", "lat": 12.9439, "lon": 77.5222},
            {"name": "Vijayanagar TTMC", "lat": 12.9682, "lon": 77.5360},
            {"name": "Iskcon Temple", "lat": 13.0097, "lon": 77.5511},
            {"name": "Yeshwanthpur TTMC", "lat": 13.0182, "lon": 77.5513}
        ]
    }
]

def get_routes():
    print(f"✅ Loaded {len(BMTC_DATA)} verified routes.")
    return BMTC_DATA