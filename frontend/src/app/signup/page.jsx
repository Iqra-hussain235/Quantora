"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "@/config/redux/action/authAction";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Sparkles, Check, ShieldCheck, Zap, BarChart3, Bot } from "lucide-react";

const PERKS = [
  { icon: BarChart3, text: "Real-time business analytics" },
  { icon: Bot, text: "AI Business Doctor — ask anything" },
  { icon: Zap, text: "Next Best Actions ranked by AI" },
  { icon: ShieldCheck, text: "Risk Radar — early warning system" },
];

export default function Signup() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [showCfm, setShowCfm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const passwordStrength = (p) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = passwordStrength(form.password);
  const strengthColors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  const strengthLabels = ["", "Too weak", "Weak", "Good", "Strong"];

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (!agreed) { setError("Please accept the terms to continue."); return; }
    setLoading(true); setError("");
    const res = await dispatch(registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password }));
    if (res.meta.requestStatus === "fulfilled") {
      router.replace("/onboarding");
    } else {
      setError(res.payload || "Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    border: "1.5px solid #e2e8f0", borderRadius: 10,
    fontSize: "0.9375rem", color: "#0f172a", background: "#fff",
    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "Inter, sans-serif" }}>

      {/* ══ LEFT panel ══════════════════════════════════════════════════ */}
      <div style={{
        flex: "0 0 44%",
        background: "linear-gradient(150deg, #0a0e1a 0%, #0d1b2a 40%, #0f2744 100%)",
        display: "flex", flexDirection: "column",
        padding: "52px 60px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-10%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,26,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 72, position: "relative", zIndex: 1 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#8B1A1A,#C0392B)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(139,26,26,0.4)" }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <span style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 800, letterSpacing: "-0.025em" }}>Quantora</span>
        </div>

        <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
          <h1 style={{ color: "#fff", fontSize: "2.375rem", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 18 }}>
            Start making smarter<br />
            <span style={{ background: "linear-gradient(90deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>decisions today.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", lineHeight: 1.75, marginBottom: 40 }}>
            Free to start. No credit card needed. Join thousands of entrepreneurs using Quantora to grow smarter.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 48 }}>
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={15} color="rgba(255,255,255,0.65)" />
                </div>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9375rem" }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Free badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 100, padding: "6px 16px" }}>
            <Check size={13} color="#22c55e" />
            <span style={{ color: "#86efac", fontSize: "0.8125rem", fontWeight: 600 }}>Free plan — no credit card required</span>
          </div>
        </div>
      </div>

      {/* ══ RIGHT — form ════════════════════════════════════════════════ */}
      <div style={{ flex: 1, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 40px" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.625rem", fontWeight: 800, color: "#0f172a", marginBottom: 8, letterSpacing: "-0.025em" }}>Create your account</h2>
            <p style={{ color: "#64748b", fontSize: "0.9375rem" }}>
              Already have one?{" "}
              <button onClick={() => router.push("/login")} style={{ color: "#2563eb", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Sign in</button>
            </p>
          </div>

          {error && (
            <div style={{ marginBottom: 18, padding: "13px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, display: "flex", gap: 10 }}>
              <span>⚠️</span>
              <span style={{ fontSize: "0.875rem", color: "#dc2626" }}>{error}</span>
            </div>
          )}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: 6 }}>Full Name</label>
              <input style={inputStyle} placeholder="Iqra Hussain" value={form.name} onChange={e => set("name", e.target.value)} required
                onFocus={e => e.target.style.borderColor = "#2563eb"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email address</label>
              <input style={inputStyle} type="email" placeholder="you@company.com" value={form.email} onChange={e => set("email", e.target.value)} required autoComplete="email"
                onFocus={e => e.target.style.borderColor = "#2563eb"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...inputStyle, paddingRight: 44 }} type={showPwd ? "text" : "password"} placeholder="Min. 6 characters" value={form.password} onChange={e => set("password", e.target.value)} required
                  onFocus={e => e.target.style.borderColor = "#2563eb"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColors[strength] : "#e2e8f0", transition: "background 0.2s" }} />
                  ))}
                  <span style={{ fontSize: "0.75rem", color: strengthColors[strength], fontWeight: 600, marginLeft: 8, whiteSpace: "nowrap" }}>{strengthLabels[strength]}</span>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: 6 }}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...inputStyle, paddingRight: 44, borderColor: form.confirm && form.confirm !== form.password ? "#ef4444" : "#e2e8f0" }} type={showCfm ? "text" : "password"} placeholder="Repeat password" value={form.confirm} onChange={e => set("confirm", e.target.value)} required
                  onFocus={e => e.target.style.borderColor = "#2563eb"}
                  onBlur={e => e.target.style.borderColor = form.confirm && form.confirm !== form.password ? "#ef4444" : "#e2e8f0"}
                />
                <button type="button" onClick={() => setShowCfm(!showCfm)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                  {showCfm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p style={{ fontSize: "0.8125rem", color: "#ef4444", marginTop: 5 }}>Passwords don't match</p>
              )}
            </div>

            {/* Terms */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 22 }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3, flexShrink: 0, width: 16, height: 16, accentColor: "#2563eb" }} />
              <span style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.5 }}>
                I agree to the <a href="#" style={{ color: "#2563eb" }}>Terms of Service</a> and <a href="#" style={{ color: "#2563eb" }}>Privacy Policy</a>
              </span>
            </label>

            <button type="submit" disabled={loading}
              style={{
                width: "100%", padding: "13px 24px",
                background: loading ? "#475569" : "linear-gradient(135deg,#1e3a8a,#2563eb)",
                color: "#fff", border: "none", borderRadius: 10,
                fontSize: "0.9375rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontFamily: "inherit", boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
              }}>
              {loading ? (
                <><div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "q-spin 0.6s linear infinite" }} />Creating account...</>
              ) : (
                <>Create Account <ArrowRight size={17} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}