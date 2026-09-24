"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "@/config/redux/action/authAction";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Sparkles, TrendingUp, Shield, Zap, BarChart3, Bot } from "lucide-react";

const STATS = [
  { value: "10K+",  label: "Businesses Analyzed" },
  { value: "94%",   label: "Decision Accuracy" },
  { value: "3.8x",  label: "Average ROI" },
];

const FEATURES = [
  { icon: BarChart3, label: "Revenue & Profit Tracking",      desc: "Real-time analytics from your data" },
  { icon: Bot,       label: "AI Business Doctor",             desc: "Ask anything about your business" },
  { icon: Zap,       label: "Next Best Actions",              desc: "AI-ranked action recommendations" },
  { icon: Shield,    label: "Risk Radar",                     desc: "Early warning system for your business" },
];

export default function Login() {
  const dispatch = useDispatch();
  const router   = useRouter();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError("");
    const res = await dispatch(loginUser({ email: email.trim(), password }));
    if (res.meta.requestStatus === "fulfilled") {
      router.replace("/dashboard");
    } else {
      setError(res.payload || "Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "Inter, sans-serif" }}>

      {/* ══ LEFT — brand panel ══════════════════════════════════════════ */}
      <div style={{
        flex: "0 0 52%",
        background: "linear-gradient(150deg, #0a0e1a 0%, #0d1b2a 40%, #0f2744 100%)",
        display: "flex", flexDirection: "column",
        padding: "52px 60px", position: "relative", overflow: "hidden",
      }}>
        {/* background glow blobs */}
        <div style={{ position: "absolute", top: "-10%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,26,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%",  left:  "-8%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        {/* dot grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 72, position: "relative", zIndex: 1 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#8B1A1A,#C0392B)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(139,26,26,0.4)" }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <span style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 800, letterSpacing: "-0.025em" }}>Quantora</span>
        </div>

        {/* Hero text */}
        <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(139,26,26,0.25)", border: "1px solid rgba(192,57,43,0.4)", borderRadius: 100, padding: "5px 14px", marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", animation: "q-pulse-dot 2s ease-in-out infinite" }} />
            <span style={{ color: "#fca5a5", fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.02em" }}>AI Business Decision Intelligence</span>
          </div>

          <h1 style={{ color: "#fff", fontSize: "2.75rem", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.035em", marginBottom: 22 }}>
            Turn your business<br />
            <span style={{ background: "linear-gradient(90deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>data into decisions.</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.52)", fontSize: "1.0625rem", lineHeight: 1.75, maxWidth: 400, marginBottom: 48 }}>
            Quantora diagnoses your business problems, predicts what comes next, simulates decisions, and recommends the best action.
          </p>

          {/* Features grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 52 }}>
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{ display: "flex", gap: 12, padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={16} color="rgba(255,255,255,0.65)" />
                </div>
                <div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontSize: "1.625rem", fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: 4 }}>{value}</div>
                <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.02em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ RIGHT — form panel ══════════════════════════════════════════ */}
      <div style={{
        flex: 1,
        background: "#f8fafc",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 40px",
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Form header */}
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", marginBottom: 8, letterSpacing: "-0.025em" }}>
              Welcome back
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.9375rem", lineHeight: 1.6 }}>
              Sign in to your workspace and continue making smarter decisions.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: 20, padding: "13px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>⚠️</span>
              <span style={{ fontSize: "0.875rem", color: "#dc2626", lineHeight: 1.5 }}>{error}</span>
            </div>
          )}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{
                  width: "100%", padding: "11px 14px",
                  border: "1.5px solid #e2e8f0", borderRadius: 10,
                  fontSize: "0.9375rem", color: "#0f172a", background: "#fff",
                  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "#2563eb"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>Password</label>
                <button type="button" onClick={() => router.push("/forgot-password")}
                  style={{ fontSize: "0.8125rem", color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{
                    width: "100%", padding: "11px 44px 11px 14px",
                    border: "1.5px solid #e2e8f0", borderRadius: 10,
                    fontSize: "0.9375rem", color: "#0f172a", background: "#fff",
                    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#2563eb"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4 }}>
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              style={{
                marginTop: 24,
                width: "100%", padding: "13px 24px",
                background: loading ? "#475569" : "linear-gradient(135deg,#1e3a8a,#2563eb)",
                color: "#fff", border: "none", borderRadius: 10,
                fontSize: "0.9375rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontFamily: "inherit", transition: "opacity 0.2s",
                boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.92"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "q-spin 0.6s linear infinite" }} />
                  Signing in...
                </>
              ) : (
                <>Sign In <ArrowRight size={17} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "28px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            <span style={{ fontSize: "0.8125rem", color: "#94a3b8", fontWeight: 500 }}>New to Quantora?</span>
            <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          </div>

          {/* Create account */}
          <button
            onClick={() => router.push("/signup")}
            style={{
              width: "100%", padding: "12px 24px",
              background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10,
              fontSize: "0.9375rem", fontWeight: 600, color: "#0f172a",
              cursor: "pointer", fontFamily: "inherit", display: "flex",
              alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#2563eb"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#0f172a"; }}
          >
            Create a free account <ArrowRight size={16} />
          </button>

          <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "#94a3b8", marginTop: 24 }}>
            By signing in you agree to our{" "}
            <a href="#" style={{ color: "#2563eb", textDecoration: "none" }}>Terms</a>{" "}and{" "}
            <a href="#" style={{ color: "#2563eb", textDecoration: "none" }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}