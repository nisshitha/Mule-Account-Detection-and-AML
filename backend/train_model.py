import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score
from sklearn.calibration import CalibratedClassifierCV
from xgboost import XGBClassifier

print("🚀 Loading Dataset...")

df = pd.read_csv("synthetic_mule_dataset.csv")

X = df.drop("isMule", axis=1)
y = df["isMule"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Base model (less aggressive)
base_model = XGBClassifier(
    n_estimators=250,
    max_depth=4,
    learning_rate=0.08,
    eval_metric="logloss",
    random_state=42
)

base_model.fit(X_train_scaled, y_train)

y_pred = base_model.predict(X_test_scaled)

print("\n📊 Classification Report:\n")
print(classification_report(y_test, y_pred))

acc = accuracy_score(y_test, y_pred) * 100
print(f"\n🎯 Accuracy: {acc:.2f}%")

# Save ONLY this model
joblib.dump(base_model, "mule_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("✅ Model Saved")