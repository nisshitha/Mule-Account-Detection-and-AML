from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import shap
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mule Account Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = joblib.load("mule_model.pkl")
scaler = joblib.load("scaler.pkl")

explainer = shap.TreeExplainer(model)

feature_names = [
    "total_in",
    "total_out",
    "velocity",
    "turnover_ratio",
    "net_flow",
    "fraud_ratio"
]

class AccountRequest(BaseModel):
    total_in: float
    total_out: float
    velocity: float
    turnover_ratio: float
    net_flow: float
    fraud_ratio: float


@app.get("/")
def home():
    return {"message": "🚀 Mule Detection API Running"}


@app.post("/predict")
def predict(data: AccountRequest):

    input_df = pd.DataFrame([{
        "total_in": data.total_in,
        "total_out": data.total_out,
        "velocity": data.velocity,
        "turnover_ratio": data.turnover_ratio,
        "net_flow": data.net_flow,
        "fraud_ratio": data.fraud_ratio
    }])

    scaled = scaler.transform(input_df)

    prob = float(model.predict_proba(scaled)[0][1])

# 🔥 Soft probability compression
    prob = float(model.predict_proba(scaled)[0][1])
    risk_score = round(prob * 100, 2)
    confidence = round(max(prob, 1 - prob) * 100, 2)

    # SHAP
    shap_values = explainer(scaled)

    contributions = {
        feature_names[i]: float(shap_values.values[0][i])
        for i in range(len(feature_names))
    }

    sorted_features = sorted(
        contributions.items(),
        key=lambda x: abs(x[1]),
        reverse=True
    )

    reasons = []

    for feature, value in sorted_features:
        readable = feature.replace("_", " ").title()

        if abs(value) > 0.05:
            if value > 0:
                reasons.append(f"🔴 Elevated {readable}")
            else:
                reasons.append(f"🟢 Stable {readable}")

        if len(reasons) == 4:
            break

    if not reasons:
        reasons = ["Behavior within normal thresholds"]

    # Category
    if risk_score < 30:
        category = "Normal"
    elif risk_score < 60:
      category = "Moderate"
    elif risk_score < 80:
      category = "High"
    else:
      category = "Critical"

    intelligence_report = (
        f"{category} Risk detected based on transaction behavior. "
        f"Key drivers include: {', '.join(reasons[:2])}."
    )

    return {
        "risk_score": risk_score,
        "risk_category": category,
        "model_confidence": confidence,
        "explanation": intelligence_report,
        "top_risk_drivers": reasons
    }