# --- 1. Import Libraries ---
import pandas as pd
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- 2. Create Flask App ---
app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# --- 3. Load BOTH pre-trained models ---
try:
    approval_model = joblib.load('models/low_cohort_approval_model.joblib')
    interest_rate_model = joblib.load('models/interest_rate_model.joblib')
    print("All models loaded successfully.")
except FileNotFoundError as e:
    approval_model = None
    interest_rate_model = None
    print(f"WARNING: Model file not found ({e}). The /predict endpoint will not work.")

# --- 4. Define the column lists for BOTH models ---
# Columns for the Low-Cohort Approval Model
APPROVAL_MODEL_COLUMNS = [
    'cibil_score', 'loan_term', 'income_annum', 'loan_amount'
]

# Columns for the Interest Rate Prediction Model
INTEREST_RATE_MODEL_COLUMNS = [
    'loan_amnt', 'term', 'grade', 'annual_inc', 'fico_score',
    'purpose_credit_card', 'purpose_debt_consolidation', 'purpose_educational',
    'purpose_home_improvement', 'purpose_house', 'purpose_major_purchase',
    'purpose_medical', 'purpose_moving', 'purpose_other', 'purpose_renewable_energy',
    'purpose_small_business', 'purpose_vacation', 'purpose_wedding'
]

# Define the optimal threshold found in the notebook for the approval model
APPROVAL_THRESHOLD = 0.42 


# --- 5. Define the API endpoint for prediction ---
@app.route('/predict', methods=['POST'])
def predict():
    # Check if models are loaded
    if not approval_model or not interest_rate_model:
        return jsonify({'error': 'Models are not loaded. Check server logs.'}), 500

    # Get the JSON data sent from the client
    user_data = request.get_json()
    
    # --- 6. The CORE 2-Tier Approval Logic ---
    is_approved = False
    approval_status = ""
    
    # Tier 1: High Credit Score check
    if user_data['fico_score'] >= 580:
        is_approved = True
        approval_status = "Approved (High Credit Score)"
    
    # Tier 2: Low Credit Score special assessment USING THE TRAINED MODEL
    else:
        print("User has low credit score. Running specialized approval model...")
        
        approval_input_data = {
            'cibil_score': user_data.get('fico_score', 0),
            'loan_term': user_data.get('term', 36),
            'income_annum': user_data.get('annual_inc', 0),
            'loan_amount': user_data.get('loan_amnt', 0)
        }
        
        approval_input_df = pd.DataFrame([approval_input_data])[APPROVAL_MODEL_COLUMNS]
        
        # Predict the PROBABILITY of approval using the model
        approval_probability = approval_model.predict_proba(approval_input_df)[:, 1][0]
        
        print(f"Approval probability: {approval_probability:.4f}, Threshold: {APPROVAL_THRESHOLD}")

        # Compare the probability against our optimal threshold
        if approval_probability >= APPROVAL_THRESHOLD:
            is_approved = True
            approval_status = "Approved by Specialized Model"
        else:
            is_approved = False
            approval_status = "Rejected by Specialized Model"

    # --- 7. Handle the final outcome ---
    if not is_approved:
        return jsonify({
            'status': 'Rejected',
            'reason': approval_status
        })

    # --- 8. If approved, proceed to Interest Rate Prediction ---
    print("Status: Approved. Predicting interest rate...")
    
    # Prepare data for the interest rate model
    input_df = pd.DataFrame(columns=INTEREST_RATE_MODEL_COLUMNS)
    input_df.loc[0] = 0
    
    input_df['loan_amnt'] = user_data.get('loan_amnt', 0)
    input_df['term'] = user_data.get('term', 36)
    input_df['grade'] = user_data.get('grade', 0)
    input_df['annual_inc'] = user_data.get('annual_inc', 0)
    input_df['fico_score'] = user_data.get('fico_score', 0)
    
    purpose_col = f"purpose_{user_data.get('purpose', 'other')}"
    if purpose_col in input_df.columns:
        input_df[purpose_col] = 1
        
    predicted_rate = interest_rate_model.predict(input_df)[0]

    return jsonify({
        'status': 'Approved',
        'approval_reason': approval_status,
        'predicted_interest_rate': round(predicted_rate, 2)
    })

# --- Home route ---
@app.route('/')
def home():
    return "Loan Prediction API is running!"

# --- Run app ---
if __name__ == '__main__':
    app.run(debug=True)