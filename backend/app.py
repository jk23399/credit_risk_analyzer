# app.py
from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)

# ── CORS (개발용: 모든 오리진 허용) ─────────────────────────────────────────────
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=False)

@app.after_request
def add_cors_headers(resp):
    # 프리플라이트와 실제 요청 모두에 헤더 강제 주입
    resp.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
    resp.headers["Vary"] = "Origin"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return resp

# ── 모델 로드 (repacked for sklearn 1.7.1) ─────────────────────────────────────
try:
    approval_model = joblib.load("models/low_cohort_approval_model.v171.joblib")
    interest_model = joblib.load("models/interest_rate_model.v171.joblib")
    print("Approval model features:", getattr(approval_model, "feature_names_in_", None))
    print("Interest model features:", getattr(interest_model, "feature_names_in_", None))
except Exception as e:
    approval_model = None
    interest_model = None
    print("Model load error:", e)

# ── 유틸 ────────────────────────────────────────────────────────────────────────
def fico_to_grade(score):
    """FICO → grade (숫자 클수록 더 좋은 등급)"""
    s = int(score or 0)
    if s >= 740: return 7
    if s >= 670: return 6
    if s >= 580: return 5
    return 4

APPROVAL_THRESHOLD = 0.42  # 필요시 조정

# ── 엔드포인트 ─────────────────────────────────────────────────────────────────
@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    # CORS preflight
    if request.method == "OPTIONS":
        return ("", 204)

    if approval_model is None or interest_model is None:
        return jsonify({"error": "Models not loaded"}), 500

    try:
        data = request.get_json() or {}

        # ---------- 1) 승인 모델 ----------
        approval_features = pd.DataFrame([{
            "cibil_score": data.get("fico_score"),
            "loan_term":   data.get("term"),
            "income_annum": data.get("annual_inc"),
            "loan_amount":  data.get("loan_amnt"),
        }])[["cibil_score", "loan_term", "income_annum", "loan_amount"]]

        if not hasattr(approval_model, "predict_proba"):
            return jsonify({"error": "approval_model has no predict_proba"}), 500

        approval_prob = float(approval_model.predict_proba(approval_features)[0][1])
        if approval_prob < APPROVAL_THRESHOLD:
            return jsonify({
                "status": "Rejected",
                "approval_probability": round(approval_prob, 4),
                "reason": "Rejected by approval model",
            }), 200

        # ---------- 2) 이자율 모델 ----------
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
            purpose_data[purpose_key] = 1  # 알 수 없는 값은 전부 0 유지

        grade_val = fico_to_grade(data.get("fico_score"))

        interest_features = pd.DataFrame([{
            "loan_amnt":  data.get("loan_amnt"),
            "term":       data.get("term"),
            "grade":      grade_val,
            "annual_inc": data.get("annual_inc"),
            **purpose_data,
            "fico_score": data.get("fico_score"),
        }])[[
            "loan_amnt", "term", "grade", "annual_inc",
            "purpose_credit_card", "purpose_debt_consolidation", "purpose_educational",
            "purpose_home_improvement", "purpose_house", "purpose_major_purchase",
            "purpose_medical", "purpose_moving", "purpose_other",
            "purpose_renewable_energy", "purpose_small_business",
            "purpose_vacation", "purpose_wedding",
            "fico_score",
        ]]

        rate = float(interest_model.predict(interest_features)[0])

        return jsonify({
            "status": "Approved",
            "approval_probability": round(approval_prob, 4),
            "predicted_interest_rate": round(rate, 2),
            "loan_amount": int(data.get("loan_amnt") or 0),
            "term": int(data.get("term") or 0),
        }), 200

    except Exception as e:
        print("predict() error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/")
def home():
    return "Loan Prediction API is running!"

if __name__ == "__main__":
    app.run(debug=True)
