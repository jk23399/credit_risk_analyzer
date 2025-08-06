# backend/app.py

import os
import pandas as pd
import joblib
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Credit Approval API")

# Allow calls from your React dev server (http://localhost:3000)
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load only the approval model (no separate credit‐score model file)
BASE_DIR = os.path.dirname(__file__)
MODELS_DIR = os.path.join(BASE_DIR, "models")
approval_model = joblib.load(os.path.join(MODELS_DIR, "credit_model.pkl"))

class UserInput(BaseModel):
    on_time_rate: float
    utilization_rate: float
    oldest_account_months: int
    recent_inquiries: int
    num_account_types: int
    desired_loan_term: int

@app.post("/predict")
def predict(inp: UserInput):
    # 1) Synthetic FICO calculation inline
    sub1 = inp.on_time_rate
    sub2 = 1 - inp.utilization_rate
    sub3 = inp.oldest_account_months / 600
    sub4 = 1 - inp.recent_inquiries / 10
    sub5 = (inp.num_account_types - 1) / 4
    score_factor = 0.35*sub1 + 0.30*sub2 + 0.15*sub3 + 0.10*sub4 + 0.10*sub5
    synthetic_FICO = 300 + 550 * score_factor

    # 2) Approval probability per product
    products = [
        {"name":"Starter Loan","max_term":12},
        {"name":"Growth Loan","max_term":36},
        {"name":"Scale Loan","max_term":60},
    ]
    results = []
    for p in products:
        term = min(inp.desired_loan_term, p["max_term"])
        df_feat = pd.DataFrame([{"cibil_score": synthetic_FICO, "loan_term": term}])
        prob = approval_model.predict_proba(df_feat)[:,1][0]
        results.append({"product":p["name"], "approval_probability":round(prob,4)})

    results.sort(key=lambda x: x["approval_probability"], reverse=True)
    return {"credit_score": round(synthetic_FICO,1), "recommendations": results}
