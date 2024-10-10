import sys
import numpy as np
import joblib
import warnings

# Suppress specific warnings
warnings.filterwarnings("ignore")

# Load the model
model = joblib.load('C:/Users/Administrator/Downloads/model.pkl')

# Get input values from command line arguments
try:
    passenger_count = int(sys.argv[1])
    trip_distance = int(sys.argv[2])
    duration_minutes = int(sys.argv[3])
except IndexError as e:
    print("Error: Missing input values.")
    sys.exit(1)

# Prepare the feature array
features = np.array([[passenger_count, trip_distance, duration_minutes]])

# Make prediction
prediction = model.predict(features)

# Output the prediction
print(prediction[0])
