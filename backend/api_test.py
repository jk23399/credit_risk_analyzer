# api_test.py

import requests
import json

# The URL of our running Flask API server
API_URL = "http://127.0.0.1:5000/predict"

# --- Test Scenarios ---

# Scenario 1: High credit score user (should be approved)
user_1 = {
    "fico_score": 750,
    "grade": 7,
    "loan_amnt": 15000,
    "term": 36,
    "annual_inc": 80000,
    "purpose": "debt_consolidation"
}

# Scenario 2: Low credit score user, short term (should be approved)
user_2 = {
    "fico_score": 570,
    "grade": 4,
    "loan_amnt": 5000,
    "term": 36,
    "annual_inc": 40000,
    "purpose": "credit_card"
}

# --- THIS IS THE CORRECTED PART ---
# Scenario 3: Low credit score user, long term, AND realistic low income (should be rejected)
user_3 = {
    "fico_score": 560,
    "grade": 4,
    "loan_amnt": 20000,
    "term": 60,
    "annual_inc": 35000, # Lowered income to be more realistic for this credit score
    "purpose": "debt_consolidation"
}

# --- Send requests to the API and print responses ---
print("--- Testing User 1 (High Credit) ---")
response1 = requests.post(API_URL, json=user_1)
print(response1.json())

print("\n--- Testing User 2 (Low Credit, Short Term) ---")
response2 = requests.post(API_URL, json=user_2)
print(response2.json())

print("\n--- Testing User 3 (Low Credit, Long Term, Low Income) ---")
response3 = requests.post(API_URL, json=user_3)
print(response3.json())
