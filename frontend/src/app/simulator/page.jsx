"use client";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/context/BusinessContext";
import { Shuffle, Play, Check, AlertTriangle, CheckCircle, Plus } from "lucide-react";
import { useState } from "react";

const SCENARIOS = [
  "Increase marketing budget",
  "Reduce product price by 10%",
  "Launch loyalty program",
  "Expand to new region",
  "Hire more sales reps",
  "Launch referral program",
  "Custom scenario",
];

function InsufficientData({ router }) {
  return (
    <div className="q-page-shell">
      <h1 className="q-page-title">Decision Simulator</h1>
      <div style={{ maxWidth: 520, margin: "60px auto", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16, opacity: 0.3 }}>🔀</div>
        <h2 style={{ fontWeight: 700, fontSize: "1.375rem", marginBottom: 12 }}>Insufficient data</h2>
        <p style={{ color: "var(--q-text-3)", lineHeight: 1.7, marginBottom: 28 }}>
          The Simulator projects outcomes based on your actual business metrics. Upload your data first, then simulate any business decision with AI.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => router.push("/onboarding")} className="q-btn q-btn-primary q-btn-sm" style={{ gap: 6 }}><Plus size={14} /> Add Business Data</button>
          <button onClick={() => router.push("/onboarding")} className="q-btn q-btn-outline q-btn-sm">🎮 Explore Demo</button>
        </div>
      </div>
    </div>
  );
}

function SimResult({ params, baseline }) {
  const { budget, conv, duration } = params;
  const budgetMult = 1 + (budget / 100);
  const convMult   = conv / (baseline.conversion || 3.2);
  const projRev    = Math.round((baseline.revenue || 0) * convMult * (1 + (budgetMult - 1) * 0.6));
  const projProfit = Math.round(projRev * 0.258 - ((baseline.revenue || 0) * (budgetMult - 1) * 0.21));
  const projCust   = Math.round((baseline.customers || 0) * convMult * (1 + (budgetMult - 1) * 0.3));
  const roi        = projProfit - (baseline.profit || 0) > 0
    ? (((projProfit - (baseline.profit || 0)) / Math.max(1, (baseline.revenue || 1) * (budgetMult - 1))) * 100).toFixed(1)
    : "-100";

  const fmt = (v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v.toLocaleString()}`;
  const isAttractive = projProfit > (baseline.profit || 0) && parseFloat(roi) > 0;

  const rows = [
    { label: "Revenue",   cur: fmt(baseline.revenue || 0),  sim: fmt(projRev),    up: projRev > (baseline.revenue || 0), delta: projRev - (baseline.revenue || 0) },
    { label: "Profit",    cur: fmt(baseline.profit || 0),   sim: fmt(projProfit), up: projProfit > (baseline.profit || 0), delta: projProfit - (baseline.profit || 0) },
    { label: "Customers", cur: (baseline.customers || 0).toLocaleString(), sim: projCust.toLocaleString(), up: projCust > (baseline.customers || 0), delta: projCust - (baseline.customers || 0) },
  ];

  return (
    <div className="q-fade-in">
      <div className="q-card" style={{ marginBottom: 20 }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--q-border)" }}>
          <h3 style={{ fontWeight: 700 }}>Simulation Results</h3>
          <p style={{ fontSize: "0.8125rem", color: "var(--q-text-3)", marginTop: 2 }}>
            +{budget}% budget · {conv}% conversion · {duration} days
          </p>
        </div>
        <div style={{ padding: 24 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "8px 12px", fontSize: "0.8125rem", fontWeight: 600, color: "var(--q-text-3)", background: "var(--q-surface-2)" }}>Metric</th>
                <th style={{ textAlign: "right", padding: "8px 12px", fontSize: "0.8125rem", fontWeight: 600, color: "var(--q-text-3)", background: "var(--q-surface-2)" }}>Current</th>
                <th style={{ textAlign: "right", padding: "8px 12px", fontSize: "0.8125rem", fontWeight: 700, color: "#2563EB", background: "#EFF6FF" }}>Simulated</th>
                <th style={{ textAlign: "right", padding: "8px 12px", fontSize: "0.8125rem", fontWeight: 600, color: "var(--q-text-3)", background: "var(--q-surface-2)" }}>Change</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ label, cur, sim, up, delta }) => (
                <tr key={label}>
                  <td style={{ padding: "12px", fontWeight: 500, borderBottom: "1px solid var(--q-border-subtle)" }}>{label}</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "var(--q-text-3)", borderBottom: "1px solid var(--q-border-subtle)" }}>{cur}</td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: 700, color: "#2563EB", background: "#EFF6FF22", borderBottom: "1px solid var(--q-border-subtle)" }}>{sim}</td>
                  <td style={{ padding: "12px", textAlign: "right", borderBottom: "1px solid var(--q-border-subtle)" }}>
                    <span style={{ color: up ? "#059669" : "#DC2626", fontWeight: 600 }}>{up ? "+" : "-"}{Math.abs(delta).toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ padding: "14px 16px", background: "var(--q-surface-2)", borderRadius: 10 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--q-text-4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Projected ROI</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: parseFloat(roi) > 0 ? "#059669" : "#DC2626" }}>{roi}%</div>
            </div>
            <div style={{ padding: "14px 16px", background: "var(--q-surface-2)", borderRadius: 10 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--q-text-4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Revenue Uplift</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#2563EB" }}>{fmt(projRev - (baseline.revenue || 0))}</div>
            </div>
          </div>

          <div style={{ padding: 16, borderRadius: 12, background: isAttractive ? "#ECFDF5" : "#FFFBEB", border: `1px solid ${isAttractive ? "#A7F3D0" : "#FDE68A"}` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              {isAttractive ? <CheckCircle size={18} color="#059669" style={{ marginTop: 2 }} /> : <AlertTriangle size={18} color="#D97706" style={{ marginTop: 2 }} />}
              <div>
                <div style={{ fontWeight: 700, color: isAttractive ? "#065F46" : "#92400E", marginBottom: 6 }}>AI Recommendation</div>
                <p style={{ fontSize: "0.875rem", color: isAttractive ? "#065F46" : "#92400E", lineHeight: 1.65 }}>
                  {isAttractive
                    ? `Scenario looks attractive. The ${budget}% budget increase generates positive ROI (${roi}%). Recommend proceeding if conversion can be maintained above ${(conv * 0.9).toFixed(1)}%.`
                    : `At ${conv}% conversion, this scenario has marginal returns. Consider optimizing conversion before increasing spend.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SimulatorPage() {
  const router = useRouter();
  const { isDemo, hasData, metrics, selected } = useBusiness();
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [budget, setBudget]     = useState(20);
  const [conv, setConv]         = useState(3.7);
  const [duration, setDuration] = useState(30);
  const [ran, setRan]           = useState(false);
  const [loading, setLoading]   = useState(false);

  if (!selected || (!isDemo && !hasData)) return <InsufficientData router={router} />;

  // Use real metrics as baseline, or demo defaults
  const baseline = isDemo
    ? { revenue: 1240000, profit: 320000, customers: 8420, conversion: 3.2 }
    : { revenue: metrics?.revenue || 0, profit: metrics?.profit || 0, customers: metrics?.customers || 0, conversion: metrics?.conversionRate || 3.2 };

  const fmt = (v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v?.toLocaleString() || 0}`;

  const runSim = async () => {
    setLoading(true); setRan(false);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false); setRan(true);
  };

  return (
    <div className="q-page-shell">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Shuffle size={20} color="#2563EB" />
        </div>
        <div>
          <h1 className="q-page-title">What If?</h1>
          <p className="q-page-subtitle">
            Simulate business decisions before you make them · {selected?.businessName || selected?.name}
            {isDemo && " (Demo)"}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24, alignItems: "flex-start" }}>
        <div>
          <div className="q-card" style={{ padding: 24, marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 18, fontSize: "0.9375rem" }}>Configure Scenario</h3>

            <div className="q-form-group" style={{ marginBottom: 18 }}>
              <label className="q-label">Scenario</label>
              <select className="q-input" value={scenario} onChange={e => setScenario(e.target.value)}>
                {SCENARIOS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="q-form-group" style={{ marginBottom: 18 }}>
              <label className="q-label">Marketing Budget Increase</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input type="range" min={0} max={100} value={budget} onChange={e => setBudget(+e.target.value)} style={{ flex: 1 }} />
                <span style={{ fontWeight: 700, minWidth: 44 }}>+{budget}%</span>
              </div>
            </div>

            <div className="q-form-group" style={{ marginBottom: 18 }}>
              <label className="q-label">Expected Conversion Rate</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input type="range" min={0.5} max={10} step={0.1} value={conv} onChange={e => setConv(+e.target.value)} style={{ flex: 1 }} />
                <span style={{ fontWeight: 700, minWidth: 40 }}>{conv}%</span>
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--q-text-4)", marginTop: 4 }}>Current: {baseline.conversion || "—"}%</div>
            </div>

            <div className="q-form-group" style={{ marginBottom: 24 }}>
              <label className="q-label">Simulation Duration</label>
              <select className="q-input" value={duration} onChange={e => setDuration(+e.target.value)}>
                {[7, 14, 30, 60, 90].map(d => <option key={d} value={d}>{d} days</option>)}
              </select>
            </div>

            <button className="q-btn q-btn-blue q-btn-lg" style={{ width: "100%", gap: 8 }} onClick={runSim} disabled={loading}>
              {loading ? <><div className="q-spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: "#fff", borderColor: "rgba(255,255,255,0.3)" }} /> Running...</> : <><Play size={17} /> Run Simulation</>}
            </button>
          </div>

          {/* Baseline */}
          <div className="q-card" style={{ padding: 20 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 14, fontSize: "0.875rem", color: "var(--q-text-3)" }}>YOUR CURRENT METRICS</h4>
            {[
              ["Revenue",   fmt(baseline.revenue)],
              ["Profit",    fmt(baseline.profit)],
              ["Customers", (baseline.customers || 0).toLocaleString()],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--q-border-subtle)" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--q-text-3)" }}>{k}</span>
                <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{v || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          {!ran && !loading && (
            <div className="q-empty q-card">
              <div className="q-empty-icon">🔀</div>
              <div className="q-empty-title">No simulation run yet</div>
              <div className="q-empty-desc">Configure your scenario on the left and click "Run Simulation" to see projected outcomes.</div>
            </div>
          )}
          {loading && (
            <div className="q-card" style={{ padding: 60, textAlign: "center" }}>
              <div className="q-spinner" style={{ width: 40, height: 40, borderWidth: 4, margin: "0 auto 20px" }} />
              <p style={{ color: "var(--q-text-3)" }}>Projecting outcomes from your data...</p>
            </div>
          )}
          {ran && !loading && <SimResult params={{ budget, conv, duration }} baseline={baseline} />}
        </div>
      </div>
    </div>
  );
}
