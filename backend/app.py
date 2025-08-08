# app.py
from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)

# --- CORS Settings -----------------------------------------------------------
# Explicitly allow the Vercel frontend URL.
CORS(app, origins=["https://credit-risk-analyzer-omega.vercel.app"])


# --- Model Loading (Path Corrected - FINAL) ----------------------------------
try:
    # Render's 'Root Directory' is set to 'backend', so the working directory
    # for this script is already inside the 'backend' folder.
    # Therefore, the path to the models is simply "models/filename.joblib".
    approval_model = joblib.load("models/low_cohort_approval_model.v171.joblib")
    interest_model = joblib.load("models/interest_rate_model.v171.joblib")
    print("Models loaded successfully.")
except Exception as e:
    approval_model = None
    interest_model = None
    # This log is crucial for debugging path issues.
    print(f"CRITICAL: Model load error: {e}")


# --- Utilities -------------------------------------------------------------------
def fico_to_grade(score):
    """FICO -> grade (higher number is a better grade)"""
    s = int(score or 0)
    if s >= 740: return 7
    if s >= 670: return 6
    if s >= 580: return 5
    return 4

APPROVAL_THRESHOLD = 0.42

# --- Endpoints -------------------------------------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    if approval_model is None or interest_model is None:
        # This is the error message the user is seeing.
        return jsonify({"error": "Models are not loaded on the server. Check server logs."}), 500

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid or missing JSON payload"}), 400

        # ---------- 1) Approval Model ----------
        approval_features = pd.DataFrame([{
            "cibil_score": data.get("fico_score"),
            "loan_term":   data.get("term"),
            "income_annum": data.get("annual_inc"),
            "loan_amount":  data.get("loan_amnt"),
        }])

        approval_prob = float(approval_model.predict_proba(approval_features)[0][1])
        if approval_prob < APPROVAL_THRESHOLD:
            return jsonify({
                "status": "Rejected",
                "approval_probability": round(approval_prob, 4),
            }), 200

        # ---------- 2) Interest Rate Model ----------
        all_purposes = [
            "purpose_credit_card", "purpose_debt_consolidation", "purpose_educational",
            "purpose_home_improvement", "purpose_house", "purpose_major_purchase",
            "purpose_medical", "purpose_moving", "purpose_other",
            "purpose_renewable_energy", "purpose_small_business",
            "purpose_vacation", "purpose_wedding",
        ]
        purpose_data = {p: 0 for p in all_purposes}
        purpose_key = f"purpose_{data.get('purpose', 'other')}"
        if purpose_key in purpose_data:
            purpose_data[purpose_key] = 1

        grade_val = fico_to_grade(data.get("fico_score"))

        interest_features_data = {
            "loan_amnt":  data.get("loan_amnt"),
            "term":       data.get("term"),
            "grade":      grade_val,
            "annual_inc": data.get("annual_inc"),
            **purpose_data,
            "fico_score": data.get("fico_score"),
        }
        interest_features = pd.DataFrame([interest_features_data])

        rate = float(interest_model.predict(interest_features)[0])

        return jsonify({
            "status": "Approved",
            "approval_probability": round(approval_prob, 4),
            "predicted_interest_rate": round(rate, 2),
            "loan_amount": int(data.get("loan_amnt") or 0),
            "term": int(data.get("term") or 0),
        }), 200

    except Exception as e:
        print(f"ERROR in /predict endpoint: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500


@app.route("/")
def home():
    return "Loan Prediction API is running!"

if __name__ == "__main__":
    app.run(debug=True)
