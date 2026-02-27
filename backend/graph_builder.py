import osmnx as ox
import os

def load_or_build_graph():
    filename = "bangalore_full.graphml"
    
    if os.path.exists(filename):
        print(f"✅ Loading cached full-city map: {filename}...")
        return ox.load_graphml(filename)
    
    print("⬇️ Downloading map: 35km Radius around Bangalore Majestic...")
    print("   (This takes ~3 minutes. Do not close.)")
    
    # Foolproof Download: 35km radius covers Airport to Electronic City
    G = ox.graph_from_point((12.9716, 77.5946), dist=35000, network_type='drive', simplify=True)
    
    # Add physics data
    G = ox.add_edge_speeds(G)
    G = ox.add_edge_travel_times(G)
    
    print(f"💾 Saving map to {filename}...")
    ox.save_graphml(G, filename)
    print("✅ Map ready!")
    return G

if __name__ == "__main__":
    load_or_build_graph()