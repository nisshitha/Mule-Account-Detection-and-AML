import { useState, useEffect } from "react";
import axios from "axios";
import HeaderBar from "@/components/HeaderBar";
import AccountInputPanel from "@/components/AccountInputPanel";
import RiskIntelligencePanel from "@/components/RiskIntelligencePanel";
import BehavioralAnalytics from "@/components/BehavioralAnalytics";
import ComplianceScorecard from "@/components/ComplianceScorecard";
import AccessControlScreen from "@/components/AccessControlScreen";
import { Shield } from "lucide-react";
import type { PredictionRequest, PredictionResponse } from "@/types/aml";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [inputData, setInputData] = useState<PredictionRequest | null>(null);

  const handleLogin = (role: string) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setShowNotification(true);
  };

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleSubmit = async (data: PredictionRequest) => {
    setIsLoading(true);
    setInputData(data);
    try {
      const response = await axios.post<PredictionResponse>("http://127.0.0.1:8000/predict", data);
      setResult(response.data);
    } catch (err) {
      console.error("Prediction API error:", err);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <AccessControlScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Access Granted Notification */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl bg-risk-normal/15 border border-risk-normal/30 backdrop-blur-xl animate-fade-up">
          <p className="text-sm font-medium text-risk-normal">
            Access Granted – AML Monitoring Console Activated
          </p>
        </div>
      )}

      <HeaderBar role={userRole} />

      <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AccountInputPanel onSubmit={handleSubmit} isLoading={isLoading} />

          {result ? (
            <RiskIntelligencePanel data={result} />
          ) : (
            <div className="glass-card p-6 flex flex-col items-center justify-center gap-4 min-h-[500px]">
              <div className="p-4 rounded-2xl bg-secondary/30 border border-glass-border">
                <Shield className="w-12 h-12 text-muted-foreground/30" />
              </div>
              <div className="text-center">
                <p className="text-muted-foreground font-medium">Awaiting Analysis</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Submit account data to generate risk intelligence</p>
              </div>
            </div>
          )}
        </div>

        {/* Full width sections */}
        {result && inputData && (
          <>
            <BehavioralAnalytics inputData={inputData} />
            <ComplianceScorecard inputData={inputData} />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
