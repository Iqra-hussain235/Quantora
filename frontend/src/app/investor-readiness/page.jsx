"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle, CheckCircle, XCircle,
  FileText, ArrowRight, Target, BarChart2
} from "lucide-react";

const CATEGORIES = [
  { key: "market",     label: "Market",       score: 82, weight: 15, color: "#2563EB",
    notes: "Growing market, clear demand validated", items: ["TAM clearly defined", "Market growing 29% YoY", "Customer pain validated"] },
  { key: "traction",   label: "Traction",     score: 74, weight: 15, color: "#7C3AED",
    notes: "Good growth but MoM acceleration needed", items: ["8,420 active customers", "+6.8% MoM growth", "Returning rate: 95.8%"] },
  { key: "revenue",    label: "Revenue",      score: 71, weight: 15, color: "#059669",
    notes: "₹12.4L/mo but needs better predictability", items: ["₹12.4L monthly revenue", "14.2% growth rate", "3 revenue streams"] },
  { key: "growth",     label: "Growth",       score: 68, weight: 10, color: "#059669",
    notes: "Solid but needs to show exponential potential", items: ["Consistent upward trend", "Geographic expansion possible", "Product line expanding"] },
  { key: "unit_econ",  label: "Unit Economics",score: 65, weight: 15, color: "#D97706",
    notes: "Margins need improvement for scale", items: ["CAC: ₹1,120 (needs <₹900)", "LTV:CAC ratio: 5.0x", "Gross margin: 25.8% (target 40%)"] },
  { key: "team",       label: "Team",         score: 78, weight: 10, color: "#2563EB",
    notes: "Founder-led, needs team expansion plan", items: ["Experienced founder", "Clear domain expertise", "Advisors in place"] },
  { key: "product",    label: "Product",      score: 80, weight: 10, color: "#059669",
    notes: "Strong NPS, room to expand features", items: ["4.2/5 avg product rating", "Unique customization USP", "Repeat purchase rate: 18%"] },
  { key: "competitive",label: "Competitive",  score: 72, weight: 5, color: "#7C3AED",
    notes: "Clear differentiation vs incumbents", items: ["Price-value differentiation", "Customer service moat", "Customization advantage"] },
  { key: "financials", label: "Financials",   score: 70, weight: 5, color: "#D97706",
    notes: "Needs 18-month runway and forecasts", items: ["Revenue forecast needed", "Unit economics improving", "Burn rate sustainable"] },
];

const overallScore = Math.round(
  CATEGORIES.reduce((s, c) => s + (c.score * c.weight / 100), 0)
);

const MISSING = [
  "18-month financial model and projections",
  "Cap table and equity structure",
  "Team bios and LinkedIn profiles",
  "Detailed competitive moat documentation",
  "Customer acquisition strategy document",
];

const IMPROVEMENTS = [
  { area: "Unit Economics", action: "Reduce CAC from ₹1,120 to below ₹900 via retention campaigns", impact: "+5 pts" },
  { area: "Revenue Quality", action: "Add subscription/recurring revenue stream to improve predictability", impact: "+8 pts" },
  { area: "Gross Margin",   action: "Optimize Product C bundle pricing to improve blended margin to 35%+", impact: "+7 pts" },
  { area: "Growth Story",   action: "Document 3-year growth roadmap with milestones for investors", impact: "+6 pts" },
];

function ScoreRing({ score, size = 80 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const prog = (score / 100) * circ;
  const color = score >= 75 ? "#059669" : score >= 60 ? "#D97706" : "#DC2626";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--q-surface-3)" strokeWidth={7} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={7}
          strokeDasharray={`${prog} ${circ - prog}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size > 60 ? "1.375rem" : "0.9rem", fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
      </div>
    </div>
  );
}

export default function InvestorReadinessPage() {
  const router = useRouter();
  const [tab, setTab] = useState("overview");

  const readinessLabel = overallScore >= 80 ? "Investor Ready" : overallScore >= 65 ? "Nearly Ready" : overallScore >= 50 ? "Needs Work" : "Early Stage";
  const readinessColor = overallScore >= 80 ? "#059669" : overallScore >= 65 ? "#D97706" : "#DC2626";

  return (
    <div className="q-page-shell">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h1 className="q-page-title">Investor Readiness</h1>
            <span className="q-badge" style={{ background: readinessColor + "18", color: readinessColor, border: `1px solid ${readinessColor}40`, fontSize: "0.75rem", fontWeight: 700, padding: "2px 10px", borderRadius: 100 }}>
              {readinessLabel}
            </span>
          </div>
          <p className="q-page-subtitle">How ready is NovaMart for investor conversations and fundraising?</p>
        </div>
        <button className="q-btn q-btn-primary q-btn-sm" onClick={() => router.push("/reports")} style={{ gap: 5 }}>
          <FileText size={14} /> Generate Investor Report
        </button>
      </div>

      {/* ── Big Score ── */}
      <div className="q-card" style={{ padding: 32, marginBottom: 28 }}>
        <div style={{ display: "flex", gap: 36, alignItems: "center", flexWrap: "wrap" }}>
          {/* Score Ring */}
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ position: "relative", width: 140, height: 140 }}>
              <svg width={140} height={140} viewBox="0 0 140 140">
                <circle cx={70} cy={70} r={58} fill="none" stroke="var(--q-surface-3)" strokeWidth={12} />
                <circle
                  cx={70} cy={70} r={58} fill="none"
                  stroke={readinessColor} strokeWidth={12}
                  strokeDasharray={`${(overallScore / 100) * (2 * Math.PI * 58)} ${2 * Math.PI * 58}`}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "2.25rem", fontWeight: 900, color: readinessColor, lineHeight: 1 }}>{overallScore}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--q-text-4)", marginTop: 2 }}>/100</span>
              </div>
            </div>
            <div style={{ marginTop: 12, fontWeight: 700, color: readinessColor, fontSize: "1rem" }}>{readinessLabel}</div>
          </div>

          {/* Breakdown bars */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {CATEGORIES.map(c => (
              <div key={c.key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--q-text-2)", fontWeight: 500 }}>{c.label}</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: c.score >= 75 ? "#059669" : c.score >= 60 ? "#D97706" : "#DC2626" }}>{c.score}</span>
                </div>
                <div className="q-progress-track" style={{ height: 6 }}>
                  <div style={{ height: "100%", width: `${c.score}%`, background: c.score >= 75 ? "#059669" : c.score >= 60 ? "#D97706" : "#DC2626", borderRadius: 3, transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>

          {/* AI Note */}
          <div style={{ padding: 18, background: "#EFF6FF", borderRadius: 12, border: "1px solid #BFDBFE", maxWidth: 280 }}>
            <div style={{ fontWeight: 700, color: "#1D4ED8", fontSize: "0.875rem", marginBottom: 8 }}>AI Assessment</div>
            <p style={{ fontSize: "0.8125rem", color: "#1D4ED8", lineHeight: 1.65 }}>
              NovaMart shows strong market fit and product validation. To improve investor readiness, focus on improving unit economics (CAC, margin) and adding recurring revenue. With 4 key improvements, you could reach 85+ score.
            </p>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="q-tabs" style={{ marginBottom: 24 }}>
        {["overview", "details", "missing", "improvements"].map(t => (
          <button key={t} className={`q-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
            {t === "overview" ? "Category Scores" : t === "details" ? "Detailed Analysis" : t === "missing" ? "Missing Info" : "How to Improve"}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {CATEGORIES.map(c => (
            <div key={c.key} className="q-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 14 }}>
                <ScoreRing score={c.score} size={64} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--q-text-1)", marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--q-text-4)" }}>Weight: {c.weight}%</div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--q-text-3)", marginTop: 6, lineHeight: 1.5 }}>{c.notes}</p>
                </div>
              </div>
              {c.items.map(item => (
                <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <CheckCircle size={12} color="#059669" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8125rem", color: "var(--q-text-2)" }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === "missing" && (
        <div className="q-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <AlertTriangle size={18} color="#DC2626" />
            <h3 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Missing Information for Investors</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {MISSING.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "14px 16px", background: "#FEF2F2", borderRadius: 10, border: "1px solid #FECACA", alignItems: "center" }}>
                <XCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: "0.9rem", color: "#991B1B" }}>{item}</span>
                <button className="q-btn q-btn-sm q-btn-outline" style={{ marginLeft: "auto", flexShrink: 0, gap: 4 }}>
                  Add <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "improvements" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {IMPROVEMENTS.map((imp, i) => (
            <div key={i} className="q-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <span className="q-badge q-badge-neutral" style={{ marginBottom: 8 }}>{imp.area}</span>
                  <h4 style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--q-text-1)", marginTop: 8 }}>{imp.action}</h4>
                </div>
                <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "#059669", whiteSpace: "nowrap", marginLeft: 16 }}>{imp.impact}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="q-btn q-btn-outline q-btn-sm" onClick={() => router.push("/simulator")} style={{ gap: 4 }}>
                  <BarChart2 size={13} /> Simulate Impact
                </button>
                <button className="q-btn q-btn-primary q-btn-sm" onClick={() => router.push("/actions")} style={{ gap: 4 }}>
                  <Target size={13} /> Create Action
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "details" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {CATEGORIES.map(c => (
            <div key={c.key} className="q-card" style={{ padding: 22 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 14 }}>
                <ScoreRing score={c.score} size={56} />
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{c.label} <span style={{ fontSize: "0.8125rem", color: "var(--q-text-4)", fontWeight: 400 }}>({c.weight}% weight)</span></h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--q-text-3)", marginTop: 4 }}>{c.notes}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {c.items.map(item => (
                  <div key={item} style={{ display: "flex", gap: 6, alignItems: "center", padding: "6px 12px", background: "#ECFDF5", borderRadius: 100, border: "1px solid #A7F3D0" }}>
                    <CheckCircle size={12} color="#059669" />
                    <span style={{ fontSize: "0.8125rem", color: "#065F46" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
