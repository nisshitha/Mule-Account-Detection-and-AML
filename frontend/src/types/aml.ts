export interface PredictionRequest {
  total_in: number;
  total_out: number;
  velocity: number;
  turnover_ratio: number;
  net_flow: number;
  fraud_ratio: number;
}

export interface PredictionResponse {
  risk_score: number;
  risk_category: "Normal" | "Moderate" | "High" | "Critical";
  explanation: string;
  top_risk_drivers: string[];
  model_confidence: number;
}

export type RiskLevel = "Normal" | "Moderate" | "High" | "Critical";

export const getRiskColor = (category: RiskLevel): string => {
  switch (category) {
    case "Critical": return "hsl(0, 72%, 51%)";
    case "High": return "hsl(25, 95%, 53%)";
    case "Moderate": return "hsl(45, 93%, 47%)";
    case "Normal": return "hsl(142, 71%, 45%)";
  }
};

export const getRiskBadgeClass = (category: RiskLevel): string => {
  switch (category) {
    case "Critical": return "risk-badge-critical";
    case "High": return "risk-badge-high";
    case "Moderate": return "risk-badge-moderate";
    case "Normal": return "risk-badge-normal";
  }
};
