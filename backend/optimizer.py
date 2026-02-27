import networkx as nx
import osmnx as ox
import random
from demand_model import load_or_train_model, predict_demand

model = load_or_train_model()

# --- CONSTANTS ---
GRID_INTENSITY_INDIA = 0.72  
EV_BUS_EFFICIENCY = 1.2      
DIESEL_BUS_EMISSION = 1.2    

def get_traffic_factor(hour):
    # 8-10 AM & 5-8 PM = PEAK
    if 8 <= hour <= 10 or 17 <= hour <= 20: 
        return random.uniform(8.0, 12.0)
    elif 11 <= hour <= 16: 
        return random.uniform(2.0, 3.5)
    else: 
        return 1.0

def get_traffic_percentage(traffic_factor):
    return int(min(100, max(0, ((traffic_factor - 1.0) / 11.0) * 100)))

def get_color_by_traffic(traffic):
    if traffic < 2.0: return "#3b82f6" # Blue
    elif traffic < 5.0: return "#f97316" # Orange
    else: return "#ef4444" # Red

def get_path_stats(G, path_nodes, traffic_multiplier, hour):
    path_coords = []
    total_time = 0
    total_dist_meters = 0
    hotspots = []
    
    is_peak = (8 <= hour <= 10 or 17 <= hour <= 20)
    hotspot_chance = 0.15 if is_peak else 0.05
    
    for i, node in enumerate(path_nodes):
        if node in G.nodes:
            lat = G.nodes[node]['y']
            lon = G.nodes[node]['x']
            path_coords.append((lat, lon))
            
            if random.random() < hotspot_chance:
                count = random.randint(20, 90) if is_peak else random.randint(5, 20)
                hotspots.append({"lat": lat, "lon": lon, "count": count})

            if i < len(path_nodes) - 1: 
                u, v = path_nodes[i], path_nodes[i+1]
                data = G.get_edge_data(u, v)
                if data:
                    edge = data[0]
                    length = edge.get('length', 100)
                    total_dist_meters += float(length)
                    total_time += 10 

    dist_km = round(total_dist_meters / 1000, 2)
    duration_min = round(total_time / 60 * traffic_multiplier, 1)
    
    diesel = round(dist_km * DIESEL_BUS_EMISSION, 2)
    ev = round(dist_km * EV_BUS_EFFICIENCY * GRID_INTENSITY_INDIA, 2)
    
    return {
        "path": path_coords,
        "duration": duration_min,
        "distance_km": dist_km,
        "stops_count": len(path_nodes),
        "emissions": { "diesel": diesel, "ev": ev, "saved": max(0, round(diesel - ev, 2)) },
        "color": get_color_by_traffic(traffic_multiplier),
        "hotspots": hotspots,
        "traffic_pct": get_traffic_percentage(traffic_multiplier)
    }

def find_optimal_routes_multi(G, start_lat, start_lon, end_lat, end_lon, hour, simulate_crash=False, target_route_idx=0):
    try:
        start_node = ox.distance.nearest_nodes(G, start_lon, start_lat)
        end_node = ox.distance.nearest_nodes(G, end_lon, end_lat)

        pred_demand = predict_demand(model, hour)
        traffic_base = get_traffic_factor(hour)
        is_peak_hour = (traffic_base > 5.0) # Check if it's 9 AM / 6 PM

        # --- 1. QUICKEST ROUTE (The "Guaranteed Shift" Logic) ---
        
        # A. Helper to calculate standard weight
        def get_standard_weight(u, v, d):
            length = d.get('length', 100)
            try:
                raw_speed = d.get('maxspeed', 30)
                if isinstance(raw_speed, list): speed = float(raw_speed[0])
                else: speed = float(raw_speed)
            except: speed = 30.0
            return length / (max(speed, 10) / 3.6)

        # B. Calculate the "Standard Best Path" (The Main Road)
        try:
            standard_path = nx.dijkstra_path(G, start_node, end_node, weight=get_standard_weight)
        except:
            standard_path = nx.shortest_path(G, start_node, end_node, weight='length')

        # C. Decide: Do we stick to it, or force a change?
        path_q_base = standard_path
        
        if is_peak_hour:
            # IT IS PEAK HOUR. The "Standard Path" is now assumed JAMMED.
            # We must force the algorithm to find a different path.
            
            # Identify edges in the standard path
            jammed_edges = set()
            for i in range(len(standard_path) - 1):
                u, v = standard_path[i], standard_path[i+1]
                jammed_edges.add((u, v))
                jammed_edges.add((v, u))

            # Define a new weight function that HATES the standard path
            def weight_rat_run(u, v, d):
                base_cost = get_standard_weight(u, v, d)
                # If this road was part of the "Standard Path", apply 50x Penalty
                if (u, v) in jammed_edges:
                    return base_cost * 50.0 
                return base_cost * traffic_base # Normal traffic elsewhere

            # Recalculate to find the "Rat Run" (Alternative Route)
            try:
                path_q_base = nx.dijkstra_path(G, start_node, end_node, weight=weight_rat_run)
            except:
                path_q_base = standard_path # Fallback

        # --- 2. BALANCED ROUTE ---
        # Must be different from whatever path_q_base is
        q_edges = set()
        for i in range(len(path_q_base) - 1):
            u, v = path_q_base[i], path_q_base[i+1]
            q_edges.add((u, v))
            q_edges.add((v, u))

        def weight_balanced(u, v, d):
            base_cost = get_standard_weight(u, v, d) * 1.1
            if (u, v) in q_edges: return base_cost * 10000.0 # Force separation
            return base_cost

        try:
            path_b_base = nx.dijkstra_path(G, start_node, end_node, weight=weight_balanced)
        except:
            path_b_base = path_q_base

        # --- 3. COVERAGE ROUTE ---
        mid_lat, mid_lon = (start_lat + end_lat)/2, (start_lon + end_lon)/2
        detour_node = ox.distance.nearest_nodes(G, mid_lon + 0.015, mid_lat + 0.015)
        try:
            p1 = nx.shortest_path(G, start_node, detour_node, weight='length')
            p2 = nx.shortest_path(G, detour_node, end_node, weight='length')
            path_c_base = p1 + p2[1:]
        except:
            path_c_base = path_q_base

        paths = [path_q_base, path_b_base, path_c_base]
        
        # --- CRASH LOGIC ---
        crash_node = None
        if simulate_crash:
            target_path = paths[target_route_idx]
            if len(target_path) > 5:
                crash_node = target_path[len(target_path) // 2]
                def weight_crash(u, v, d):
                    if u == crash_node or v == crash_node: return 1e9
                    return get_standard_weight(u, v, d)
                try:
                    paths[target_route_idx] = nx.dijkstra_path(G, start_node, end_node, weight=weight_crash)
                except: pass

        # --- OUTPUT ---
        routes_data = []
        labels = ["⚡ Quickest", "⚖️ Balanced", "👥 Coverage"]
        types = ["quickest", "balanced", "coverage"]
        
        for i, p in enumerate(paths):
            stats = get_path_stats(G, p, traffic_base, hour)
            
            routes_data.append({
                "type": types[i],
                "name": labels[i],
                "path": stats["path"],
                "color": stats["color"], 
                "duration": stats["duration"],
                "distance": stats["distance_km"],
                "stops": stats["stops_count"],
                "emissions": stats["emissions"],
                "traffic_rating": f"{stats['traffic_pct']}%",
                "passenger_demand": pred_demand + sum(h['count'] for h in stats['hotspots']),
                "hotspots": stats["hotspots"]
            })

        crash_coords = None
        if crash_node:
             crash_coords = {"lat": G.nodes[crash_node]['y'], "lon": G.nodes[crash_node]['x']}

        return {"routes": routes_data, "crash_location": crash_coords}

    except Exception as e:
        print(f"Error: {e}")
        return None