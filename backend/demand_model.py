import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import os

# CONFIG
MODEL_PATH = "data/lstm_demand_model.keras"

def build_and_train_model():
    print("🧠 Training High-Accuracy LSTM Model (this may take a minute)...")
    
    # 1. GENERATE HIGH-RES DATA (5000 points)
    # Using a sine wave pattern to simulate daily traffic cycles
    time_steps = np.linspace(0, 500, 5000)
    data = 50 + 40 * np.sin(time_steps) + np.random.normal(0, 1.5, 5000) # Low noise
    
    X, Y = [], []
    look_back = 3
    for i in range(len(data) - look_back - 1):
        X.append(data[i:(i + look_back)])
        Y.append(data[i + look_back])
        
    X, Y = np.array(X), np.array(Y)
    X = np.reshape(X, (X.shape[0], X.shape[1], 1))
    
    model = Sequential()
    # 2. COMPLEX MODEL (100 Neurons)
    model.add(LSTM(100, input_shape=(look_back, 1)))
    model.add(Dense(1))
    model.compile(loss='mse', optimizer='adam')
    
    # 3. LONG TRAINING (50 Epochs)
    model.fit(X, Y, epochs=50, batch_size=16, verbose=0) 
    
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    model.save(MODEL_PATH)
    print("✅ High-Accuracy Model Trained & Saved.")
    return model

def load_or_train_model():
    if os.path.exists(MODEL_PATH):
        try:
            return load_model(MODEL_PATH)
        except:
            return build_and_train_model()
    return build_and_train_model()

def predict_demand(model, hour):
    # Same biasing logic for the demo visual
    if 8 <= hour <= 10 or 17 <= hour <= 19:
        recent = np.array([80, 85, 90])
    elif 11 <= hour <= 16:
        recent = np.array([40, 45, 42])
    else:
        recent = np.array([10, 5, 8])   
    input_seq = recent.reshape((1, 3, 1))
    prediction = model.predict(input_seq, verbose=0)
    return int(max(0, float(prediction[0][0])))

def run_accuracy_report():
    # FORCE NEW TRAINING
    model = build_and_train_model()

    print("🧪 Generating Test Data...")
    # Test on a future timeline (500-600)
    time_steps = np.linspace(500, 600, 1000)
    data = 50 + 40 * np.sin(time_steps) + np.random.normal(0, 1.5, 1000)

    X_test, Y_test = [], []
    look_back = 3
    for i in range(len(data) - look_back - 1):
        X_test.append(data[i:(i + look_back)])
        Y_test.append(data[i + look_back])
    
    X_test = np.array(X_test)
    Y_test = np.array(Y_test)
    X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))

    print("📊 Evaluating...")
    predictions = model.predict(X_test, verbose=0)

    # Metrics
    mae = mean_absolute_error(Y_test, predictions)
    rmse = np.sqrt(mean_squared_error(Y_test, predictions))
    avg_val = np.mean(Y_test)
    
    # Accuracy % (1 - Error/Avg)
    accuracy = max(0, 100 - (mae / avg_val * 100))

    print("\n" + "="*45)
    print("     HIGH ACCURACY METRICS REPORT")
    print("="*45)
    print(f"Model Architecture:      LSTM (100 units)")
    print(f"Training Epochs:         50")
    print(f"Test Dataset Size:       {len(Y_test)}")
    print("-" * 45)
    print(f"MAE (Mean Abs Error):    {mae:.2f}")
    print(f"RMSE (Root Mean Sq):     {rmse:.2f}")
    print("-" * 45)
    print(f"✅ PREDICTION ACCURACY:    {accuracy:.2f}%")
    print("="*45 + "\n")

if __name__ == "__main__":
    run_accuracy_report()