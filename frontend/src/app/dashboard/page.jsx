"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBusiness, NOVAMART_METRICS } from "@/context/BusinessContext";
import {
  TrendingUp, TrendingDown, AlertTriangle, Target,
  ArrowRight, Bot, Shuffle, Users, Activity, DollarSign,
  UserX, ChevronRight, Zap, Plus, BarChart3,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useState } from "react";

// ── Reusable: No-data empty state card ───────────────────────────────────────
function EmptyCard({ icon, title, desc, action, onAction }) {
  return (
    <div style={{ padding: "40px 24px", textAlign: "center", background: "var(--q-surface)", border: "1px solid var(--q-border)", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: "2rem", marginBottom: 12, opacity: 0.35 }}>{icon}</div>
      <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--q-text-1)", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: "0.875rem", color: "var(--q-text-3)", maxWidth: 280, lineHeight: 1.6, marginBottom: action ? 18 : 0 }}>{desc}</div>
      {action && (
        <button onClick={onAction} className="q-btn q-btn-primary q-btn-sm" style={{ gap: 6 }}>
          <Plus size={14} /> {action}
        </button>
      )}
    </div>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KPICard({ label, value, delta, up, sub, icon: Icon, color, noData }) {
  return (
    <div className="q-kpi-card" style={{ cursor: "default" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span className="q-kpi-label">{label}</span>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      {noData ? (
        <>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--q-text-4)" }}>—</div>
          <div style={{ fontSize: "0.8125rem", color: "var(--q-text-4)", marginTop: 8 }}>No data yet</div>
        </>
      ) : (
        <>
          <div className="q-kpi-value">{value}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
            {delta && <span className={up ? "q-delta-up" : "q-delta-down"}>{up ? "▲" : "▼"} {delta}</span>}
            {sub && <span className="q-kpi-sub">{sub}</span>}
          </div>
        </>
      )}
    </div>
  );
}

// ── Health Score ring ─────────────────────────────────────────────────────────
function HealthScore({ score, breakdown }) {
  if (!score) {
    return (
      <div className="q-card" style={{ padding: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 16 }}>Business Health Score</h3>
        <div className="q-empty" style={{ padding: "32px 0" }}>
          <div style={{ fontSize: "2rem", marginBottom: 10, opacity: 0.3 }}>📊</div>
          <div style={{ fontWeight: 600, color: "var(--q-text-3)" }}>Insufficient data</div>
          <div style={{ fontSize: "0.875rem", color: "var(--q-text-4)", marginTop: 6 }}>Upload or enter business data to generate a health score.</div>
        </div>
      </div>
    );
  }

  const circumference = 2 * Math.PI * 52;
  const progress = (score / 100) * circumference;

  return (
    <div className="q-card" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>Business Health Score</h3>
          <p style={{ fontSize: "0.875rem", color: "var(--q-text-3)" }}>Based on your actual data</p>
        </div>
        <span className={`q-badge ${score >= 70 ? "q-badge-success" : score >= 50 ? "q-badge-warning" : "q-badge-danger"}`}>
          {score >= 70 ? "Healthy" : score >= 50 ? "Needs Work" : "At Risk"}
        </span>
      </div>
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width={124} height={124} viewBox="0 0 124 124">
            <circle cx={62} cy={62} r={52} fill="none" stroke="var(--q-surface-3)" strokeWidth={10} />
            <circle cx={62} cy={62} r={52} fill="none" stroke="#2563EB" strokeWidth={10}
              strokeDasharray={`${progress} ${circumference - progress}`}
              strokeLinecap="round" transform="rotate(-90 62 62)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "1.875rem", fontWeight: 800, color: "var(--q-text-1)", lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--q-text-4)", marginTop: 2 }}>/ 100</span>
          </div>
        </div>
        {breakdown && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            {breakdown.map(({ label, score: s, bar }) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--q-text-3)" }}>{label}</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{s}</span>
                </div>
                <div className="q-progress-track" style={{ height: 4 }}>
                  <div style={{ height: "100%", width: `${s}%`, background: bar, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Demo banner ───────────────────────────────────────────────────────────────
function DemoBanner({ onExit }) {
  return (
    <div style={{ padding: "12px 20px", background: "linear-gradient(135deg,#1e3a8a,#2563eb)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: "1.125rem" }}>🎮</span>
        <span style={{ color: "#fff", fontSize: "0.9375rem", fontWeight: 600 }}>Demo Mode — You're viewing NovaMart sample data.</span>
      </div>
      <button onClick={onExit} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, fontFamily: "inherit", whiteSpace: "nowrap" }}>
        Use My Data →
      </button>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const { isDemo, selected, metrics, loading, businessName, exitDemoMode, hasData } = useBusiness();
  const [activeChart, setActiveChart] = useState("revenue");

  const now  = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // ── No business selected yet ──────────────────────────────────────────────
  if (!selected && !loading) {
    return (
      <div className="q-page-shell">
        <div style={{ maxWidth: 600, margin: "60px auto", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 20 }}>👋</div>
          <h1 style={{ fontWeight: 800, fontSize: "1.75rem", marginBottom: 12 }}>Welcome to Quantora</h1>
          <p style={{ color: "var(--q-text-3)", fontSize: "1.0625rem", lineHeight: 1.7, marginBottom: 32 }}>
            To get started, set up your business or explore the platform with our demo business.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/onboarding")} className="q-btn q-btn-primary q-btn-lg" style={{ gap: 8 }}>
              <Plus size={18} /> Set Up My Business
            </button>
            <button onClick={() => router.push("/onboarding")} className="q-btn q-btn-outline q-btn-lg" style={{ gap: 8 }}>
              🎮 Explore Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="q-page-shell">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16 }}>
          <div className="q-spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
          <p style={{ color: "var(--q-text-3)" }}>Loading dashboard for {businessName}...</p>
        </div>
      </div>
    );
  }

  // ── Resolve data source (demo has full data, real user may have none) ─────
  const m = isDemo ? NOVAMART_METRICS : metrics;
  const noData = !m;

  // Build KPI list — always show the cards, show "—" when no data
  const fmt = (v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`;
  const KPIs = [
    { label: "Revenue",      value: m ? fmt(m.revenue ?? 0)                      : "₹0",  delta: m?.revenueDelta,   up: true,  sub: "vs last period",        icon: DollarSign, color: "#2563EB" },
    { label: "Net Profit",   value: m ? fmt(m.profit ?? 0)                        : "₹0",  delta: m?.profitDelta,    up: true,  sub: m?.profitDelta ? "" : "",  icon: TrendingUp, color: "#059669" },
    { label: "Customers",    value: m ? (m.customers ?? 0).toLocaleString()       : "0",   delta: m?.customersDelta, up: true,  sub: "total active",           icon: Users,      color: "#7C3AED" },
    { label: "Churn Rate",   value: m ? `${m.churnRate ?? 0}%`                    : "0%",  delta: undefined,          up: false, sub: "monthly",               icon: UserX,      color: "#DC2626" },
    { label: "Health Score", value: m?.healthScore != null ? `${m.healthScore}/100` : "0/100", delta: undefined, up: true, sub: m?.healthScore ? "AI-calculated" : "", icon: Activity, color: "#D97706" },
  ];

  return (
    <div className="q-page-shell-full">
      {isDemo && <DemoBanner onExit={() => { exitDemoMode(); router.push("/onboarding"); }} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 28 }} className="q-fade-in">
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 700, color: "var(--q-text-1)", marginBottom: 6 }}>
            {greeting} 👋
          </h1>
          <p style={{ color: "var(--q-text-3)", fontSize: "0.9375rem" }}>
            {businessName ? `${businessName}` : "Your workspace"}{noData && !isDemo ? " · Add data to see insights" : " · Last 30 days"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="q-btn q-btn-outline q-btn-sm" onClick={() => router.push("/ai-doctor")} style={{ gap: 6 }}>
            <Bot size={15} /> Ask AI Doctor
          </button>
          <button className="q-btn q-btn-primary q-btn-sm" onClick={() => router.push("/simulator")} style={{ gap: 6 }}>
            <Shuffle size={15} /> Simulate
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="q-kpi-grid" style={{ marginBottom: 28 }}>
        {KPIs.map((k, i) => (
          <div key={k.label} className={`q-fade-in-${Math.min(i + 1, 5)}`}>
            <KPICard {...k} noData={noData} />
          </div>
        ))}
      </div>

      {/* Health Score + Brief */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <HealthScore score={m?.healthScore} breakdown={m?.breakdown} />

        {/* Brief */}
        <div className="q-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={16} color="#D97706" />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>Today's Business Brief</h3>
          </div>

          {noData ? (
            <div className="q-empty" style={{ padding: "28px 0" }}>
              <div style={{ fontSize: "1.5rem", opacity: 0.3, marginBottom: 10 }}>📋</div>
              <div style={{ fontWeight: 600, color: "var(--q-text-3)" }}>No data yet</div>
              <div style={{ fontSize: "0.875rem", color: "var(--q-text-4)", marginTop: 6, maxWidth: 240 }}>
                Upload a CSV/Excel file or enter metrics manually to see your daily brief.
              </div>
              <button onClick={() => router.push("/onboarding")} className="q-btn q-btn-blue q-btn-sm" style={{ marginTop: 14, gap: 5 }}>
                <Plus size={13} /> Add Business Data
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Overall Health", value: m.healthScore != null ? `${m.healthScore} — ${m.healthScore >= 70 ? "Healthy" : "Needs Work"}` : "0 — No data", icon: m.healthScore >= 70 ? "✅" : "⚠️" },
                { label: "Revenue",        value: m.revenue != null ? fmt(m.revenue) : "₹0",                   icon: "📈" },
                { label: "Customers",      value: (m.customers ?? 0).toLocaleString(),                          icon: "👥" },
                { label: "Churn Rate",     value: `${m.churnRate ?? 0}%`,                                       icon: "📉" },
              ].map(({ label, value, icon }) => (

                <div key={label} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "var(--q-surface-2)", borderRadius: 10 }}>
                  <span style={{ fontSize: "1rem", flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "var(--q-text-4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--q-text-1)", fontWeight: 500 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {m?.alerts && m.alerts.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <AlertTriangle size={18} color="#DC2626" />
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Needs Your Attention</h2>
            <span className="q-badge q-badge-danger">{m.alerts.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {m.alerts.map((alert) => (
              <div key={alert.id} style={{ padding: "16px 20px", background: alert.severity === "high" ? "#FEF2F2" : "#FFFBEB", border: `1px solid ${alert.severity === "high" ? "#FECACA" : "#FDE68A"}`, borderRadius: 12, display: "flex", gap: 14 }}>
                <AlertTriangle size={18} style={{ color: alert.severity === "high" ? "#DC2626" : "#D97706", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: 4 }}>{alert.title}</div>
                  <p style={{ fontSize: "0.875rem", color: "var(--q-text-3)", lineHeight: 1.6 }}>{alert.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart */}
      {m?.revenueChart && (
        <div style={{ marginBottom: 28 }}>
          <div className="q-card">
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--q-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>Performance Trend</h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--q-text-3)", marginTop: 3 }}>Revenue and profit over time</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {["revenue", "customers"].map(t => (
                  <button key={t} className={`q-tab q-btn-sm${activeChart === t ? " active" : ""}`} onClick={() => setActiveChart(t)} style={{ padding: "5px 12px", fontSize: "0.8125rem", border: "none", background: activeChart === t ? "var(--q-blue-subtle)" : "none", color: activeChart === t ? "var(--q-blue)" : "var(--q-text-3)", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
                    {t === "revenue" ? "Revenue" : "Customers"}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <ResponsiveContainer width="100%" height={220}>
                {activeChart === "revenue" ? (
                  <AreaChart data={m.revenueChart}>
                    <defs>
                      <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="profG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--q-border)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--q-text-4)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "var(--q-text-4)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--q-border)" }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563EB" strokeWidth={2} fill="url(#revG)" />
                    <Area type="monotone" dataKey="profit"  name="Profit"  stroke="#059669" strokeWidth={2} fill="url(#profG)" />
                  </AreaChart>
                ) : (
                  <BarChart data={m.customerChart || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--q-border)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--q-text-4)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "var(--q-text-4)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--q-border)" }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="new"       name="New"       fill="#2563EB" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="returning" name="Returning" fill="#7C3AED" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="churned"   name="Churned"   fill="#DC2626" radius={[3, 3, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* No chart data empty state */}
      {!m?.revenueChart && !noData && (
        <EmptyCard icon="📈" title="No chart data yet" desc="Upload your sales or revenue data to see trend charts." action="Upload Data" onAction={() => router.push("/onboarding")} />
      )}

      {/* Full empty state */}
      {noData && (
        <div style={{ marginBottom: 28 }}>
          <EmptyCard
            icon="📂"
            title="No business data yet"
            desc="Upload a CSV/Excel file with your sales, revenue, or customer data to unlock insights, AI analysis, risk detection, and recommendations."
            action="Upload Data Now"
            onAction={() => router.push("/onboarding")}
          />
        </div>
      )}

      {/* Next Best Actions CTA */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Target size={18} color="#8B1A1A" />
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Next Best Actions</h2>
            {!noData && <span className="q-badge q-badge-accent">AI Ranked</span>}
          </div>
          <button className="q-btn q-btn-ghost q-btn-sm" style={{ gap: 4 }} onClick={() => router.push("/actions")}>
            All Actions <ChevronRight size={14} />
          </button>
        </div>
        {noData ? (
          <EmptyCard icon="🎯" title="No actions yet" desc="Actions are generated automatically once you upload business data and AI analyzes it." />
        ) : (
          <div style={{ padding: 20, background: "var(--q-surface)", border: "1px solid var(--q-border)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Target size={20} color="#8B1A1A" />
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{m?.actions?.length || 0} recommendations available</div>
                <div style={{ fontSize: "0.875rem", color: "var(--q-text-3)" }}>View all AI-ranked action recommendations</div>
              </div>
            </div>
            <button onClick={() => router.push("/actions")} className="q-btn q-btn-primary q-btn-sm" style={{ gap: 6 }}>
              View Actions <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
