import joblib
import numpy as np

model = joblib.load("mule_model.pkl")
scaler = joblib.load("scaler.pkl")

def predict_account():
    print("\nEnter Account Details:")

    total_in = float(input("Total Incoming Amount: "))
    total_out = float(input("Total Outgoing Amount: "))
    velocity = float(input("Transaction Velocity: "))
    turnover_ratio = float(input("Turnover Ratio: "))
    net_flow = float(input("Net Flow: "))
    fraud_ratio = float(input("Fraud Ratio: "))

    features = np.array([[ 
        total_in,
        total_out,
        velocity,
        turnover_ratio,
        net_flow,
        fraud_ratio
    ]])

    scaled = scaler.transform(features)

    prob = model.predict_proba(scaled)[0][1]
    risk_score = round(prob * 100, 2)

    if risk_score < 30:
        category = "Normal"
    elif risk_score < 55:
        category = "Moderate"
    elif risk_score < 80:
        category = "High"
    else:
        category = "Critical"

    print("\n---------------------------")
    print("Mule Probability:", risk_score, "%")
    print("Risk Category:", category)
    print("---------------------------\n")


if __name__ == "__main__":
    predict_account()