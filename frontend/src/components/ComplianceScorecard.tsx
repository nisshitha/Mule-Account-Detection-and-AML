import { ShieldCheck, ClipboardList } from "lucide-react";
import type { PredictionRequest } from "@/types/aml";

interface ComplianceScorecardProps {
  inputData: PredictionRequest;
}

type Status = "risk" | "monitoring" | "stable";

const getStatus = (label: string, data: PredictionRequest): Status => {
  switch (label) {
    case "High Velocity":
      return data.txn_velocity > 20 ? "risk" : data.txn_velocity > 10 ? "monitoring" : "stable";
    case "High Turnover":
      return data.turnover_ratio > 0.9 ? "risk" : data.turnover_ratio > 0.75 ? "monitoring" : "stable";
    case "Net Retention Stability":
      return data.net_flow < 1000 ? "risk" : data.net_flow < 10000 ? "monitoring" : "stable";
    case "Fraud Exposure":
      return data.fraud_ratio > 0.05 ? "risk" : data.fraud_ratio > 0.02 ? "monitoring" : "stable";
    default:
      return "stable";
  }
};

const statusConfig: Record<Status, { icon: string; label: string; className: string }> = {
  risk: { icon: "❌", label: "Risk", className: "risk-badge-critical" },
  monitoring: { icon: "⚠️", label: "Monitoring", className: "risk-badge-moderate" },
  stable: { icon: "✅", label: "Stable", className: "risk-badge-normal" },
};

const indicators = ["High Velocity", "High Turnover", "Net Retention Stability", "Fraud Exposure"];

const ComplianceScorecard = ({ inputData }: ComplianceScorecardProps) => {
  return (
    <div className="glass-card p-6 animate-fade-up-delay-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-risk-normal/10">
          <ClipboardList className="w-5 h-5 text-risk-normal" />
        </div>
        <h2 className="section-title">AML Monitoring Summary</h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-glass-border">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary/30">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Indicator</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Value</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {indicators.map((ind, i) => {
              const status = getStatus(ind, inputData);
              const config = statusConfig[status];
              const value = ind === "High Velocity" ? inputData.txn_velocity
                : ind === "High Turnover" ? inputData.turnover_ratio
                : ind === "Net Retention Stability" ? inputData.net_flow.toLocaleString()
                : (inputData.fraud_ratio * 100).toFixed(1) + "%";

              return (
                <tr key={ind} className={`border-t border-glass-border ${i % 2 === 0 ? "bg-secondary/10" : ""}`}>
                  <td className="px-4 py-3 text-sm font-medium text-foreground flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                    {ind}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{value}</td>
                  <td className="px-4 py-3">
                    <span className={config.className}>
                      {config.icon} {config.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplianceScorecard;
