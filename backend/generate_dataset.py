import pandas as pd
import numpy as np

np.random.seed(42)

NUM_NORMAL = 40000
NUM_BORDERLINE = 6000
NUM_MULE = 4000

data = []

# ---------------------------
# 1️⃣ NORMAL ACCOUNTS
# ---------------------------
for _ in range(NUM_NORMAL):
    total_in = np.random.uniform(5000, 300000)
    total_out = np.random.uniform(1000, total_in * 0.7)
    velocity = np.random.uniform(0.1, 2.0)
    turnover_ratio = total_out / (total_in + 1)
    fraud_ratio = np.random.uniform(0.0, 0.2)
    net_flow = total_in - total_out

    # Add small random noise
    total_in += np.random.normal(0, 5000)
    velocity += np.random.normal(0, 0.2)

    data.append([
        total_in,
        total_out,
        velocity,
        turnover_ratio,
        net_flow,
        fraud_ratio,
        0
    ])

# ---------------------------
# 2️⃣ BORDERLINE ACCOUNTS
# ---------------------------
for _ in range(NUM_BORDERLINE):
    total_in = np.random.uniform(150000, 600000)
    total_out = total_in * np.random.uniform(0.6, 0.9)
    velocity = np.random.uniform(1.0, 3.0)
    turnover_ratio = total_out / (total_in + 1)
    fraud_ratio = np.random.uniform(0.1, 0.5)
    net_flow = total_in - total_out

    # 50% labeled mule
    label = np.random.choice([0, 1])

    data.append([
        total_in,
        total_out,
        velocity,
        turnover_ratio,
        net_flow,
        fraud_ratio,
        label
    ])

# ---------------------------
# 3️⃣ STRONG MULE ACCOUNTS
# ---------------------------
for _ in range(NUM_MULE):
    total_in = np.random.uniform(400000, 2000000)
    total_out = total_in * np.random.uniform(0.85, 0.99)
    velocity = np.random.uniform(2.0, 5.0)
    turnover_ratio = total_out / (total_in + 1)
    fraud_ratio = np.random.uniform(0.3, 0.8)
    net_flow = total_in - total_out

    data.append([
        total_in,
        total_out,
        velocity,
        turnover_ratio,
        net_flow,
        fraud_ratio,
        1
    ])

columns = [
    "total_in",
    "total_out",
    "velocity",
    "turnover_ratio",
    "net_flow",
    "fraud_ratio",
    "isMule"
]

df = pd.DataFrame(data, columns=columns)

df.to_csv("synthetic_mule_dataset.csv", index=False)

print("✅ Dataset Created")
print(df["isMule"].value_counts())