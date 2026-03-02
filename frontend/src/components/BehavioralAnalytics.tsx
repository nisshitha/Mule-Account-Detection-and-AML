import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AlertTriangle, BarChart3, Activity } from "lucide-react";
import type { PredictionRequest } from "@/types/aml";

interface BehavioralAnalyticsProps {
  inputData: PredictionRequest;
}

const BehavioralAnalytics = ({ inputData }: BehavioralAnalyticsProps) => {
  const barData = [
    { name: "Inflow", value: inputData.total_in, fill: "hsl(217, 91%, 60%)" },
    { name: "Outflow", value: inputData.total_out, fill: "hsl(262, 60%, 55%)" },
  ];

  const turnoverClose = inputData.turnover_ratio > 0.85;
  const velocityMax = 30;
  const turnoverMax = 1.0;

  return (
    <div className="glass-card p-6 animate-fade-up-delay-1">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <h2 className="section-title">Behavioral Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inflow vs Outflow */}
        <div className="p-4 rounded-xl bg-secondary/20 border border-glass-border">
          <h3 className="text-sm font-semibold text-secondary-foreground mb-4">Inflow vs Outflow Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 20%)" />
              <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222, 40%, 12%)",
                  border: "1px solid hsl(222, 20%, 24%)",
                  borderRadius: "12px",
                  color: "hsl(210, 40%, 93%)",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {turnoverClose && (
            <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-risk-moderate/10 border border-risk-moderate/20 text-risk-moderate text-xs font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              High Turnover Behavior Detected
            </div>
          )}
        </div>

        {/* Velocity & Turnover Indicators */}
        <div className="p-4 rounded-xl bg-secondary/20 border border-glass-border">
          <h3 className="text-sm font-semibold text-secondary-foreground mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Velocity & Turnover Indicators
          </h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Transaction Velocity</span>
                <span className="font-semibold text-foreground">{inputData.txn_velocity}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-secondary/50">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min((inputData.txn_velocity / velocityMax) * 100, 100)}%`,
                    background: inputData.txn_velocity > 15 ? "hsl(25, 95%, 53%)" : "hsl(217, 91%, 60%)",
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Turnover Ratio</span>
                <span className="font-semibold text-foreground">{inputData.turnover_ratio}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-secondary/50">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min((inputData.turnover_ratio / turnoverMax) * 100, 100)}%`,
                    background: inputData.turnover_ratio > 0.85 ? "hsl(0, 72%, 51%)" : "hsl(142, 71%, 45%)",
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Net Flow</span>
                <span className="font-semibold text-foreground">{inputData.net_flow.toLocaleString()}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-secondary/50">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(Math.abs(inputData.net_flow) / (inputData.total_in || 1) * 100, 100)}%`,
                    background: "hsl(217, 91%, 60%)",
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Fraud Ratio</span>
                <span className="font-semibold text-foreground">{(inputData.fraud_ratio * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-secondary/50">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(inputData.fraud_ratio * 100 * 10, 100)}%`,
                    background: inputData.fraud_ratio > 0.05 ? "hsl(0, 72%, 51%)" : "hsl(142, 71%, 45%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehavioralAnalytics;
