from fastapi import FastAPI
from pydantic import BaseModel
from graph_builder import load_or_build_graph
from demand_model import load_or_train_model
from optimizer import find_optimal_routes_multi
from bmtc_data import get_routes  # <--- NEW IMPORT
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Initializing System...")
G = load_or_build_graph()
model = load_or_train_model()

# --- LOAD DATA DIRECTLY ---
BMTC_ROUTES = get_routes() # No internet needed

class RouteRequest(BaseModel):
    start_lat: float
    start_lon: float
    end_lat: float
    end_lon: float
    hour: int
    simulate_crash: bool = False
    target_route_idx: int = 0 

@app.get("/")
def read_root():
    return {"status": "System Online"}

@app.get("/get-bmtc-routes")
def get_bmtc_routes():
    # Returns the hardcoded data
    return BMTC_ROUTES

@app.get("/get-city-demand")
def get_city_demand():
    import random
    return [{"lat": random.uniform(12.91, 12.96), "lon": random.uniform(77.57, 77.63), "intensity": random.randint(10, 100)} for _ in range(100)]

@app.post("/optimize-route")
def get_optimized_route(request: RouteRequest):
    data = find_optimal_routes_multi(
        G, request.start_lat, request.start_lon,
        request.end_lat, request.end_lon,
        request.hour,
        request.simulate_crash,
        request.target_route_idx # Pass it
    )
    if not data: return {"error": "No path found."}
    return data