"use client";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/context/BusinessContext";
import { Flag, Plus, DollarSign, Users, TrendingUp, Target, Percent } from "lucide-react";
import { useState } from "react";

function GoalCard({ goal }) {
  const { title, icon: Icon, current, target, fmt, deadline, status, confidence } = goal;
  const colors = { "On Track": { c: "#059669", bg: "#ECFDF5", bar: "#059669" }, "Needs Work": { c: "#D97706", bg: "#FFFBEB", bar: "#D97706" }, "Behind": { c: "#DC2626", bg: "#FEF2F2", bar: "#DC2626" } };
  const meta = colors[status] || colors["On Track"];
  const isReduce = current > target;
  const progress = isReduce
    ? Math.max(0, Math.min(100, ((current * 1.2 - current) / (current * 1.2 - target)) * 100))
    : Math.min(100, (current / target) * 100);

  return (
    <div className="q-card" style={{ padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={17} style={{ color: meta.c }} />
          </div>
          <h3 style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--q-text-1)" }}>{title}</h3>
        </div>
        <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: meta.bg, color: meta.c, border: `1px solid ${meta.bg}` }}>{status}</span>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--q-text-4)", marginBottom: 2 }}>Current</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800 }}>{fmt(current)}</div>
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: meta.bar }}>{Math.round(progress)}%</div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--q-text-4)", marginBottom: 2 }}>Target</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800 }}>{fmt(target)}</div>
          </div>
        </div>
        <div className="q-progress-track" style={{ height: 8 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: meta.bar, borderRadius: 4 }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.8125rem", color: "var(--q-text-3)" }}>Deadline: <strong>{deadline}</strong></span>
        {confidence && <span style={{ fontSize: "0.8125rem", color: confidence >= 70 ? "#059669" : confidence >= 50 ? "#D97706" : "#DC2626", fontWeight: 600 }}>AI: {confidence}% confident</span>}
      </div>
    </div>
  );
}

const DEMO_GOALS = [
  { id: 1, title: "Reach ₹20L Monthly Revenue", icon: DollarSign, current: 1240000, target: 2000000, fmt: v => `₹${(v/100000).toFixed(1)}L`, deadline: "Dec 31, 2026", status: "On Track",   confidence: 76 },
  { id: 2, title: "Grow to 12,000 Customers",    icon: Users,      current: 8420,    target: 12000,   fmt: v => v.toLocaleString(),                deadline: "Mar 31, 2027", status: "On Track",   confidence: 68 },
  { id: 3, title: "Reduce Churn to 2.5%",        icon: TrendingUp, current: 4.2,     target: 2.5,     fmt: v => `${v}%`,                           deadline: "Dec 31, 2026", status: "Needs Work", confidence: 54 },
  { id: 4, title: "Achieve 40% Gross Margin",    icon: Percent,    current: 25.8,    target: 40,      fmt: v => `${v}%`,                           deadline: "Jun 30, 2027", status: "Behind",     confidence: 41 },
  { id: 5, title: "Reduce CAC Below ₹900",       icon: Target,     current: 1120,    target: 900,     fmt: v => `₹${v.toLocaleString()}`,          deadline: "Dec 31, 2026", status: "On Track",   confidence: 71 },
];

export default function GoalsPage() {
  const router = useRouter();
  const { isDemo, selected, metrics } = useBusiness();
  const goals = isDemo ? DEMO_GOALS : (metrics?.goals || []);

  return (
    <div className="q-page-shell">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h1 className="q-page-title">Business Goals</h1>
            <span className="q-badge q-badge-neutral">{goals.length} Active</span>
            {isDemo && <span className="q-badge q-badge-info">Demo Data</span>}
          </div>
          <p className="q-page-subtitle">Track progress toward your targets · AI uses these to rank recommendations</p>
        </div>
        <button className="q-btn q-btn-primary q-btn-sm" style={{ gap: 6 }}><Plus size={15} /> Add Goal</button>
      </div>

      {isDemo && (
        <div style={{ padding: 16, background: "#EFF6FF", borderRadius: 12, border: "1px solid #BFDBFE", marginBottom: 24, display: "flex", gap: 12 }}>
          <span style={{ fontSize: "1.25rem" }}>🤖</span>
          <p style={{ fontSize: "0.875rem", color: "#1D4ED8", lineHeight: 1.65 }}>
            <strong>AI is using your goals to rank actions.</strong> Your "Reach ₹20L revenue" goal drives 3 of your top 5 recommendations. Churn reduction goal needs attention — at current rate you may miss the Dec 31 target.
          </p>
        </div>
      )}

      {goals.length === 0 ? (
        <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", opacity: 0.3, marginBottom: 14 }}>🎯</div>
          <h2 style={{ fontWeight: 700, fontSize: "1.25rem", marginBottom: 12 }}>No goals yet</h2>
          <p style={{ color: "var(--q-text-3)", lineHeight: 1.7, marginBottom: 24 }}>
            Set revenue, customer, or efficiency goals. AI will use them to prioritize recommendations and track progress automatically.
          </p>
          <button className="q-btn q-btn-primary q-btn-sm" style={{ gap: 6 }}><Plus size={14} /> Set Your First Goal</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {goals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
        </div>
      )}
    </div>
  );
}
