import { useEffect, useState } from "react";
import { getRiskColor, type PredictionResponse } from "@/types/aml";

interface RiskMeterProps {
  data: PredictionResponse;
}

const RiskMeter = ({ data }: RiskMeterProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const color = getRiskColor(data.risk_category);

  useEffect(() => {
    setAnimatedScore(0);
    const timer = setTimeout(() => {
      let current = 0;
      const step = data.risk_score / 60;
      const interval = setInterval(() => {
        current += step;
        if (current >= data.risk_score) {
          setAnimatedScore(data.risk_score);
          clearInterval(interval);
        } else {
          setAnimatedScore(current);
        }
      }, 16);
      return () => clearInterval(interval);
    }, 200);
    return () => clearTimeout(timer);
  }, [data.risk_score]);

  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-52 h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="12"
          />
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.05s linear", filter: `drop-shadow(0 0 8px ${color}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground">{animatedScore.toFixed(1)}%</span>
          <span className="text-xs text-muted-foreground font-medium mt-1">RISK SCORE</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className={`${data.risk_category === "Critical" ? "risk-badge-critical" : data.risk_category === "High" ? "risk-badge-high" : data.risk_category === "Moderate" ? "risk-badge-moderate" : "risk-badge-normal"} text-sm`}>
          {data.risk_category} Risk
        </span>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Model Confidence:</span>
          <span className="font-semibold text-foreground">{data.model_confidence}%</span>
        </div>
      </div>
    </div>
  );
};

export default RiskMeter;
