"use client";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/context/BusinessContext";
import { Target, Plus, Check, Clock, Shuffle, ArrowRight } from "lucide-react";
import { useState } from "react";

function InsufficientData({ router }) {
  return (
    <div className="q-page-shell">
      <h1 className="q-page-title">Next Best Actions</h1>
      <div style={{ maxWidth: 520, margin: "60px auto", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16, opacity: 0.3 }}>🎯</div>
        <h2 style={{ fontWeight: 700, fontSize: "1.375rem", marginBottom: 12 }}>Insufficient data</h2>
        <p style={{ color: "var(--q-text-3)", lineHeight: 1.7, marginBottom: 28 }}>
          Actions are automatically generated and ranked by AI after analyzing your business data. Upload or enter your data to see personalized recommendations.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => router.push("/onboarding")} className="q-btn q-btn-primary q-btn-sm" style={{ gap: 6 }}><Plus size={14} /> Add Business Data</button>
          <button onClick={() => router.push("/onboarding")} className="q-btn q-btn-outline q-btn-sm">🎮 Explore Demo</button>
        </div>
      </div>
    </div>
  );
}

const DEMO_ACTIONS = [
  { id: 1, title: "Launch Customer Retention Campaign",   priority: "HIGH",   status: "Suggested",   impact: "+₹1.5L/mo", cost: "₹25K", roi: "5.2x",  confidence: 82, dueDate: "Oct 5",  owner: "—" },
  { id: 2, title: "Optimize Marketing Budget Allocation", priority: "HIGH",   status: "In Progress", impact: "+₹0.8L/mo", cost: "₹10K", roi: "7.1x",  confidence: 78, dueDate: "Sep 28", owner: "Marketing" },
  { id: 3, title: "Upsell Premium Bundle to Top Segment", priority: "MEDIUM", status: "Suggested",   impact: "+₹2.1L/mo", cost: "₹18K", roi: "11.7x", confidence: 74, dueDate: "Oct 12", owner: "—" },
  { id: 4, title: "Fix Cart Abandonment (Exit Intent)",   priority: "HIGH",   status: "Approved",    impact: "+₹0.7L/mo", cost: "₹5K",  roi: "14.0x", confidence: 85, dueDate: "Sep 22", owner: "Dev Team" },
  { id: 5, title: "Launch Referral Program",              priority: "MEDIUM", status: "Suggested",   impact: "+₹1.2L/mo", cost: "₹22K", roi: "5.5x",  confidence: 73, dueDate: "Oct 20", owner: "—" },
  { id: 6, title: "Re-engage Lapsed Customers",           priority: "MEDIUM", status: "Completed",   impact: "+₹0.9L/mo", cost: "₹12K", roi: "7.5x",  confidence: 69, dueDate: "Sep 15", owner: "Marketing" },
];

const STATUS_META = {
  Suggested:    { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  Approved:     { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
  "In Progress":{ color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
  Completed:    { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
};

function ActionCard({ action, onUpdate, router }) {
  const { title, priority, status, impact, cost, roi, confidence, dueDate, owner } = action;
  const meta = STATUS_META[status] || STATUS_META["Suggested"];
  return (
    <div className="q-card" style={{ padding: 20, opacity: status === "Completed" ? 0.7 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <span className={`q-badge ${priority === "HIGH" ? "q-badge-danger" : "q-badge-warning"}`}>{priority}</span>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>{status}</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {status === "Suggested" && (
            <button onClick={() => onUpdate("Approved")} className="q-btn q-btn-outline q-btn-sm" style={{ gap: 4, color: "#2563EB", borderColor: "#BFDBFE" }}><Check size={13} /> Approve</button>
          )}
          {status === "Approved" && (
            <button onClick={() => onUpdate("In Progress")} className="q-btn q-btn-blue q-btn-sm" style={{ gap: 4 }}><Clock size={13} /> Start</button>
          )}
          {status === "In Progress" && (
            <button onClick={() => onUpdate("Completed")} className="q-btn q-btn-sm" style={{ gap: 4, background: "#059669", color: "#fff" }}><Check size={13} /> Complete</button>
          )}
        </div>
      </div>
      <h3 style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: 12 }}>{title}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 12 }}>
        {[
          { k: "Impact",   v: impact,  c: "#059669" },
          { k: "Cost",     v: cost,    c: "var(--q-text-2)" },
          { k: "ROI",      v: roi,     c: "#2563EB" },
          { k: "Due",      v: dueDate, c: "var(--q-text-2)" },
          { k: "Owner",    v: owner,   c: "var(--q-text-3)" },
        ].map(({ k, v, c }) => (
          <div key={k} style={{ background: "var(--q-surface-2)", borderRadius: 6, padding: "8px 10px" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--q-text-4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{k}</div>
            <div style={{ fontWeight: 600, fontSize: "0.8125rem", color: c }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: "0.72rem", color: "var(--q-text-4)" }}>AI Confidence</span>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: confidence >= 80 ? "#059669" : "#D97706" }}>{confidence}%</span>
          </div>
          <div className="q-progress-track" style={{ height: 4 }}>
            <div className="q-progress-fill" style={{ width: `${confidence}%`, background: confidence >= 80 ? "#059669" : "#D97706" }} />
          </div>
        </div>
        <button onClick={() => router.push("/simulator")} className="q-btn q-btn-ghost q-btn-sm" style={{ gap: 4 }}><Shuffle size={13} /> Simulate</button>
      </div>
    </div>
  );
}

export default function ActionsPage() {
  const router = useRouter();
  const { isDemo, hasData, metrics, selected } = useBusiness();
  const [actions, setActions] = useState(null);
  const [statusFilter, setFilter] = useState("All");

  if (!selected || (!isDemo && !hasData)) return <InsufficientData router={router} />;

  // Lazily initialize actions from demo or API
  const resolvedActions = actions ?? (isDemo ? DEMO_ACTIONS : (metrics?.actions || []));

  const update = (id, status) => setActions(prev => (prev ?? resolvedActions).map(a => a.id === id ? { ...a, status } : a));

  const filtered = statusFilter === "All" ? resolvedActions : resolvedActions.filter(a => a.status === statusFilter);

  const counts = {
    total:      resolvedActions.length,
    suggested:  resolvedActions.filter(a => a.status === "Suggested").length,
    inProgress: resolvedActions.filter(a => a.status === "In Progress").length,
    completed:  resolvedActions.filter(a => a.status === "Completed").length,
  };

  return (
    <div className="q-page-shell">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h1 className="q-page-title">Next Best Actions</h1>
            <span className="q-badge q-badge-accent">AI Ranked</span>
            {isDemo && <span className="q-badge q-badge-neutral">Demo Data</span>}
          </div>
          <p className="q-page-subtitle">Recommendations ordered by expected impact · {selected?.businessName || selected?.name}</p>
        </div>
        <button className="q-btn q-btn-primary q-btn-sm" style={{ gap: 6 }}><Plus size={15} /> New Action</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Actions",      value: counts.total,      color: "var(--q-text-1)" },
          { label: "Awaiting Approval",  value: counts.suggested,  color: "#D97706" },
          { label: "In Progress",        value: counts.inProgress, color: "#7C3AED" },
          { label: "Completed",          value: counts.completed,  color: "#059669" },
        ].map(({ label, value, color }) => (
          <div key={label} className="q-card" style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--q-text-4)", marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["All", "Suggested", "Approved", "In Progress", "Completed"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`q-btn q-btn-sm ${statusFilter === f ? "q-btn-blue" : "q-btn-outline"}`}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: "48px 24px", textAlign: "center", background: "var(--q-surface)", border: "1px solid var(--q-border)", borderRadius: 14 }}>
          <div style={{ fontSize: "2rem", opacity: 0.3, marginBottom: 12 }}>🎯</div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No {statusFilter !== "All" ? statusFilter : ""} actions</div>
          <div style={{ fontSize: "0.875rem", color: "var(--q-text-3)" }}>No actions with the selected filter.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map(action => (
            <ActionCard key={action.id} action={action} onUpdate={(s) => update(action.id, s)} router={router} />
          ))}
        </div>
      )}
    </div>
  );
}
