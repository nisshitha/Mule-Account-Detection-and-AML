import { AlertTriangle, ShieldCheck } from "lucide-react";
import type { PredictionResponse } from "@/types/aml";

interface RiskDriversProps {
  data: PredictionResponse;
}

const RiskDrivers = ({ data }: RiskDriversProps) => {
  return (
    <div className="space-y-3">
      <h3 className="section-title flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-risk-high" />
        AI Risk Drivers
      </h3>
      <div className="flex flex-wrap gap-2">
        {data.top_risk_drivers.map((driver, i) => {
          const isPositive = !driver.toLowerCase().includes("stable") && !driver.toLowerCase().includes("low") && !driver.toLowerCase().includes("normal") && !driver.toLowerCase().includes("retention");
          return (
            <div
              key={i}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                isPositive
                  ? "bg-destructive/10 text-destructive border border-destructive/20"
                  : "bg-risk-normal/10 text-risk-normal border border-risk-normal/20"
              }`}
            >
              {isPositive ? (
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
              )}
              {driver}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiskDrivers;
