import { useState } from "react";
import { Info, Loader2, ScanSearch } from "lucide-react";
import type { PredictionRequest } from "@/types/aml";

interface AccountInputPanelProps {
  onSubmit: (data: PredictionRequest) => void;
  isLoading: boolean;
}

const fields: { key: keyof PredictionRequest; label: string; tooltip: string; placeholder: string }[] = [
  { key: "total_in", label: "Total Incoming Amount", tooltip: "Sum of all credits received in the account over the analysis period.", placeholder: "e.g. 150000" },
  { key: "total_out", label: "Total Outgoing Amount", tooltip: "Sum of all debits from the account over the analysis period.", placeholder: "e.g. 145000" },
  { key: "velocity", label: "Transaction Velocity", tooltip: "Average number of transactions per day during the observation window.", placeholder: "e.g. 12.5" },
  { key: "turnover_ratio", label: "Turnover Ratio", tooltip: "Ratio of total outflow to total inflow. Values close to 1.0 indicate pass-through behavior.", placeholder: "e.g. 0.96" },
  { key: "net_flow", label: "Net Flow", tooltip: "Difference between total incoming and outgoing amounts. Low values may indicate fund layering.", placeholder: "e.g. 5000" },
  { key: "fraud_ratio", label: "Fraud Ratio", tooltip: "Proportion of transactions flagged by fraud detection models.", placeholder: "e.g. 0.03" },
];

const AccountInputPanel = ({ onSubmit, isLoading }: AccountInputPanelProps) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: PredictionRequest = {
      total_in: parseFloat(values.total_in || "0"),
      total_out: parseFloat(values.total_out || "0"),
      velocity: parseFloat(values.velocity || "0"),
      turnover_ratio: parseFloat(values.turnover_ratio || "0"),
      net_flow: parseFloat(values.net_flow || "0"),
      fraud_ratio: parseFloat(values.fraud_ratio || "0"),
    };
    onSubmit(data);
  };

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <ScanSearch className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="section-title">Account Behavior Input</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Enter account metrics for risk analysis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-secondary-foreground">
                {field.label}
              </label>
              <div className="relative">
                <Info
                  className="w-3.5 h-3.5 text-muted-foreground/50 cursor-help"
                  onMouseEnter={() => setHoveredTooltip(field.key)}
                  onMouseLeave={() => setHoveredTooltip(null)}
                />
                {hoveredTooltip === field.key && (
                  <div className="absolute left-6 top-0 z-50 w-56 p-2.5 text-xs text-muted-foreground bg-card border border-glass-border rounded-lg shadow-xl">
                    {field.tooltip}
                  </div>
                )}
              </div>
            </div>
            <input
              type="number"
              step="any"
              className="input-field"
              placeholder={field.placeholder}
              value={values[field.key] || ""}
              onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
              required
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="gradient-btn w-full mt-6 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <ScanSearch className="w-4 h-4" />
              Analyze Account
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AccountInputPanel;
