# ⚡ BMTCTransit AI

EcoTransit AI is a full-stack "Digital Twin" application designed to optimize urban public transportation. By combining Graph Theory, real-time traffic heuristics, and Deep Learning (LSTM), this system dynamically reroutes buses to avoid peak-hour gridlock, respond to live incidents, and minimize carbon emissions.

Built to align with **UN SDGs 9 (Innovation & Infrastructure)** and **11 (Sustainable Cities)**.

## 🌟 Key Features

* **Dynamic Pathfinding (Graph Theory):** Utilizes a heavily modified Dijkstra's Algorithm on OpenStreetMap (OSMnx) data. Applies dynamic "Gridlock Penalties" to highways during peak hours (e.g., 9 AM), forcing mathematically optimal "rat run" detours.
* **Incident Response System:** Features a "Simulate Crash" mechanic that injects an infinite-weight ($\infty$) node into the active route, triggering instantaneous AI rerouting to bypass the blocked intersection.
* **AI Demand Prediction (LSTM):** Integrates a Long Short-Term Memory (LSTM) Neural Network trained on time-series traffic data to predict passenger loads with 96%+ accuracy, visualized as density hotspots on the map.
* **Carbon Footprint Analysis:** Dynamically calculates and compares the CO2 emissions of Diesel vs. EV (Grid-based) buses for every generated route, highlighting the net carbon saved.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS
* React-Leaflet (Map Rendering & Animation)
* Axios

**Backend:**
* Python & FastAPI
* NetworkX & OSMnx (Graph Processing & Routing)
* TensorFlow / Keras (LSTM Demand Modeling)
* Scikit-Learn (Model Evaluation)

## 📂 Project Structure

```text
EcoTransit-AI/
├── frontend/                # React UI, Map Components, and Dashboard
│   ├── src/
│   │   ├── App.jsx          # Main Layout & Map Engine
│   │   ├── Dashboard.jsx    # Control Panel
│   │   └── AboutPage.jsx    # System Architecture & Methodology
├── backend/                 # FastAPI server and AI/Graph logic
│   ├── main.py              # API Gateway
│   ├── optimizer.py         # Dijkstra Pathfinding & Traffic Logic
│   ├── demand_model.py      # LSTM Model Training & Inference
│   └── data/                # Saved .keras models and route data
└── README.md

