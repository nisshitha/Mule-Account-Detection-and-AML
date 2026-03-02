import { Shield, Activity, User } from "lucide-react";

interface HeaderBarProps {
  role?: string;
}

const HeaderBar = ({ role }: HeaderBarProps) => {
  return (
    <header className="w-full border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              AML Risk Intelligence Engine
            </h1>
            <p className="text-xs text-muted-foreground tracking-wide">
              Explainable Behavioral Profiling &nbsp;|&nbsp; Real-Time Risk Scoring
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-risk-normal/10 border border-risk-normal/20 live-indicator">
            <Activity className="w-3.5 h-3.5 text-risk-normal" />
            <span className="text-xs font-semibold text-risk-normal tracking-wide uppercase">
              Analyst Logged In
            </span>
          </div>
          {role && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-glass-border">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Role: <span className="text-foreground">{role}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
