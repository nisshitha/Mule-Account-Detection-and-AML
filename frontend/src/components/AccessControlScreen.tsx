import { useState, useRef, useEffect } from "react";
import { Shield, Lock, ChevronDown } from "lucide-react";

const CORRECT_PIN = "202525";

const ROLES = [
  "AML Compliance Officer",
  "Risk Monitoring Analyst",
  "Financial Crime Investigator",
  "Senior Compliance Manager",
];

interface AccessControlScreenProps {
  onLogin: (role: string) => void;
}

const AccessControlScreen = ({ onLogin }: AccessControlScreenProps) => {
  const [pin, setPin] = useState<string[]>(Array(6).fill(""));
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isPinComplete = pin.every((d) => d !== "");
  const isValid = isPinComplete && selectedRole !== "";

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    setError("");
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newPin = [...pin];
      newPin[index - 1] = "";
      setPin(newPin);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newPin = [...pin];
    for (let i = 0; i < 6; i++) {
      newPin[i] = pasted[i] || "";
    }
    setPin(newPin);
    const nextEmpty = newPin.findIndex((d) => d === "");
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleSubmit = () => {
    if (!isValid) return;
    const entered = pin.join("");
    if (entered === CORRECT_PIN) {
      onLogin(selectedRole);
    } else {
      setError("Invalid Access Code. Authorized Personnel Only.");
      setPin(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass-card p-10 w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              AML Risk Intelligence Engine
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Internal Monitoring Portal – Authorized Access
            </p>
          </div>
        </div>

        {/* PIN Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Access Code
            </label>
          </div>
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {pin.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit ? "•" : ""}
                onChange={(e) => {
                  const raw = e.target.value.replace(/•/g, "");
                  handleDigitChange(i, raw);
                }}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold bg-secondary/50 border border-glass-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 caret-transparent"
              />
            ))}
          </div>
          {error && (
            <p className="text-center text-sm text-destructive mt-3 animate-fade-up">
              {error}
            </p>
          )}
        </div>

        {/* Role Dropdown */}
        <div className="mb-8">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider block mb-3">
            Select Role
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleOpen(!isRoleOpen)}
              className="input-field flex items-center justify-between cursor-pointer"
            >
              <span className={selectedRole ? "text-foreground" : "text-muted-foreground/50"}>
                {selectedRole || "Choose your role..."}
              </span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isRoleOpen ? "rotate-180" : ""}`} />
            </button>
            {isRoleOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-card p-1.5 z-50 animate-fade-up">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role);
                      setIsRoleOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
                      selectedRole === role
                        ? "bg-primary/15 text-primary"
                        : "text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="gradient-btn w-full text-center"
        >
          Authorize Access
        </button>

        <p className="text-center text-xs text-muted-foreground/40 mt-6">
          Restricted System – Unauthorized access is prohibited
        </p>
      </div>
    </div>
  );
};

export default AccessControlScreen;
