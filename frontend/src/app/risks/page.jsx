"use client";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/context/BusinessContext";
import { AlertTriangle, Target, ArrowRight, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useState } from "react";

// ── Shared empty state ────────────────────────────────────────────────────────
function InsufficientData({ page, router }) {
  return (
    <div className="q-page-shell">
      <h1 className="q-page-title">{page}</h1>
      <div style={{ maxWidth: 520, margin: "60px auto", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16, opacity: 0.3 }}>⚠️</div>
        <h2 style={{ fontWeight: 700, fontSize: "1.375rem", marginBottom: 12 }}>Insufficient data</h2>
        <p style={{ color: "var(--q-text-3)", lineHeight: 1.7, marginBottom: 28 }}>
          {page} are generated from your business data. Upload or enter your data first, and Quantora will automatically detect and display results here.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => router.push("/onboarding")} className="q-btn q-btn-primary q-btn-sm" style={{ gap: 6 }}><Plus size={14} /> Add Business Data</button>
          <button onClick={() => router.push("/onboarding")} className="q-btn q-btn-outline q-btn-sm">🎮 Explore Demo</button>
        </div>
      </div>
    </div>
  );
}

// ── Demo Risk data (NovaMart only) ─────────────────────────────────────────
const DEMO_RISKS = [
  { id: 1, title: "High-Value Customer Churn Risk", probability: 68, impact: "Critical", severity: "high", potential: "₹6.2L", evidence: "43 high-value customers show declining purchase activity over the past 21 days.", cause: "Post-summer seasonal decline combined with competitive pricing.", recommendation: "Launch personalized win-back campaign with exclusive offers for at-risk segment.", category: "Customers", trend: "worsening" },
  { id: 2, title: "Marketing Budget Inefficiency",  probability: 74, impact: "High", severity: "high",  potential: "₹1.8L/month", evidence: "Marketing spend increased 21% but conversions only improved 4%.", cause: "Budget over-allocated to display ads, under-allocated to email/retargeting.", recommendation: "Reallocate 30% of display budget to email and retargeting.", category: "Marketing", trend: "worsening" },
  { id: 3, title: "Product D Revenue Decline",       probability: 82, impact: "High", severity: "medium", potential: "₹0.96L/month", evidence: "Product D revenue down 18% over 3 months.", cause: "Aging product nearing end-of-life cycle.", recommendation: "Consider product refresh or price reduction.", category: "Products", trend: "stable" },
  { id: 4, title: "Revenue Concentration Risk",      probability: 55, impact: "Medium", severity: "medium", potential: "₹3.2L exposure", evidence: "Top 12% of customers contribute 48% of revenue.", cause: "Organic customer concentration without intentional diversification.", recommendation: "Develop acquisition strategy to grow mid-tier segment.", category: "Revenue", trend: "stable" },
];

const SEV = {
  high:   { dot: "#DC2626", bg: "#FEF2F2", border: "#FECACA", badge: "q-badge-danger" },
  medium: { dot: "#D97706", bg: "#FFFBEB", border: "#FDE68A", badge: "q-badge-warning" },
  low:    { dot: "#059669", bg: "#ECFDF5", border: "#A7F3D0", badge: "q-badge-success" },
};

function RiskCard({ risk, router }) {
  const [open, setOpen] = useState(false);
  const c = SEV[risk.severity];
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, padding: 20 }}>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: c.dot + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <AlertTriangle size={18} style={{ color: c.dot }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>{risk.title}</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <span className={`q-badge ${c.badge}`}>{risk.impact} Impact</span>
                <span className="q-badge q-badge-neutral">{risk.category}</span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ position: "relative", width: 56, height: 56 }}>
                <svg viewBox="0 0 56 56" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="28" cy="28" r="22" fill="none" stroke={c.dot + "30"} strokeWidth="5" />
                  <circle cx="28" cy="28" r="22" fill="none" stroke={c.dot} strokeWidth="5"
                    strokeDasharray={`${(risk.probability / 100) * 138.2} 138.2`} strokeLinecap="round" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: c.dot }}>{risk.probability}%</span>
                </div>
              </div>
              <span style={{ fontSize: "0.65rem", color: "var(--q-text-4)" }}>Probability</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "8px 12px" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--q-text-4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Revenue at Risk</div>
              <div style={{ fontWeight: 700, color: c.dot }}>{risk.potential}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "8px 12px" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--q-text-4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Trend</div>
              <div style={{ fontWeight: 600, color: risk.trend === "worsening" ? "#DC2626" : "#D97706" }}>
                {risk.trend === "worsening" ? "↗ Worsening" : "→ Stable"}
              </div>
            </div>
          </div>
          <p style={{ fontSize: "0.875rem", color: "var(--q-text-2)", lineHeight: 1.6, marginBottom: 12 }}><strong>Evidence:</strong> {risk.evidence}</p>
          {open && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              <div style={{ padding: "10px 12px", background: "rgba(255,255,255,0.7)", borderRadius: 8 }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--q-text-4)", textTransform: "uppercase", marginBottom: 5 }}>Root Cause</div>
                <p style={{ fontSize: "0.875rem", color: "var(--q-text-2)", lineHeight: 1.6 }}>{risk.cause}</p>
              </div>
              <div style={{ padding: "10px 12px", background: "rgba(255,255,255,0.7)", borderRadius: 8 }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--q-text-4)", textTransform: "uppercase", marginBottom: 5 }}>AI Recommendation</div>
                <p style={{ fontSize: "0.875rem", color: "var(--q-text-2)", lineHeight: 1.6 }}>{risk.recommendation}</p>
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setOpen(!open)} className="q-btn q-btn-outline q-btn-sm" style={{ gap: 5 }}>
              {open ? <><ChevronUp size={13} />Less</> : <><ChevronDown size={13} />Details</>}
            </button>
            <button onClick={() => router.push("/actions")} className="q-btn q-btn-sm" style={{ gap: 5, background: c.dot, color: "#fff" }}>
              <Target size={13} /> Create Action <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RisksPage() {
  const router = useRouter();
  const { isDemo, hasData, metrics, selected } = useBusiness();
  const [filter, setFilter] = useState("All");

  // If no business or no data → show "Insufficient data"
  if (!selected || (!isDemo && !hasData)) {
    return <InsufficientData page="Risk Radar" router={router} />;
  }

  // Use demo risks or API risks
  const allRisks = isDemo ? DEMO_RISKS : (metrics?.risks || []);
  const filtered = filter === "All" ? allRisks : allRisks.filter(r => r.severity === filter.toLowerCase());

  return (
    <div className="q-page-shell">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h1 className="q-page-title">Risk Radar</h1>
            {allRisks.filter(r => r.severity === "high").length > 0 && (
              <span className="q-badge q-badge-danger">{allRisks.filter(r => r.severity === "high").length} Critical</span>
            )}
            {isDemo && <span className="q-badge q-badge-info">Demo Data</span>}
          </div>
          <p className="q-page-subtitle">AI-detected risks ranked by probability × impact · {selected?.businessName || selected?.name}</p>
        </div>
        <button className="q-btn q-btn-outline q-btn-sm" onClick={() => router.push("/ai-doctor")} style={{ gap: 6 }}>🤖 Ask AI About Risks</button>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Risks",     value: allRisks.length,                             color: "var(--q-text-1)" },
          { label: "Critical / High", value: allRisks.filter(r => r.severity === "high").length,   color: "#DC2626" },
          { label: "Medium",          value: allRisks.filter(r => r.severity === "medium").length,  color: "#D97706" },
          { label: "Revenue at Risk", value: allRisks.length === 0 ? "—" : "Calculated",           color: "#DC2626" },
        ].map(({ label, value, color }) => (
          <div key={label} className="q-card" style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--q-text-4)", marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["All", "High", "Medium", "Low"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`q-btn q-btn-sm ${filter === f ? "q-btn-blue" : "q-btn-outline"}`}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: "48px 24px", textAlign: "center", background: "var(--q-surface)", border: "1px solid var(--q-border)", borderRadius: 14 }}>
          <div style={{ fontSize: "2rem", opacity: 0.3, marginBottom: 12 }}>✅</div>
          <div style={{ fontWeight: 600, color: "var(--q-text-1)", marginBottom: 6 }}>No risks found</div>
          <div style={{ fontSize: "0.875rem", color: "var(--q-text-3)" }}>No {filter.toLowerCase()} severity risks detected in your current data.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map(r => <RiskCard key={r.id} risk={r} router={router} />)}
        </div>
      )}
    </div>
  );
}
