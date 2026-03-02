import RiskMeter from "./RiskMeter";
import RiskDrivers from "./RiskDrivers";
import { Brain, FileText } from "lucide-react";
import type { PredictionResponse } from "@/types/aml";

interface RiskIntelligencePanelProps {
  data: PredictionResponse;
}

const RiskIntelligencePanel = ({ data }: RiskIntelligencePanelProps) => {
  return (
    <div className="glass-card p-6 h-full flex flex-col gap-6 animate-fade-up">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-destructive/10">
          <Brain className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h2 className="section-title">Risk Intelligence</h2>
          <p className="text-xs text-muted-foreground mt-0.5">AI-powered behavioral risk assessment</p>
        </div>
      </div>

      <RiskMeter data={data} />
      <RiskDrivers data={data} />

      {/* AI Risk Narrative */}
      <div className="mt-2 p-4 rounded-xl bg-secondary/30 border border-glass-border">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Intelligence Report</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          "{data.explanation}"
        </p>
      </div>
    </div>
  );
};

export default RiskIntelligencePanel;
