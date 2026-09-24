"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp, Users, DollarSign, AlertTriangle, Activity,
  ChevronRight, Bot, BarChart2, Info
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, Legend
} from "recharts";

// ── Historical + Forecast Data ────────────────────────────────────────────────
const REVENUE_FORECAST = [
  { month: "Apr", actual: 8.2,  forecast: null, low: null, high: null },
  { month: "May", actual: 9.4,  forecast: null, low: null, high: null },
  { month: "Jun", actual: 8.9,  forecast: null, low: null, high: null },
  { month: "Jul", actual: 10.5, forecast: null, low: null, high: null },
  { month: "Aug", actual: 11.8, forecast: null, low: null, high: null },
  { month: "Sep", actual: 12.4, forecast: 12.4, low: 12.4, high: 12.4 },
  { month: "Oct", actual: null, forecast: 13.8, low: 12.9, high: 14.7 },
  { month: "Nov", actual: null, forecast: 15.1, low: 14.0, high: 16.2 },
  { month: "Dec", actual: null, forecast: 16.8, low: 15.4, high: 18.2 },
  { month: "Jan", actual: null, forecast: 17.9, low: 16.1, high: 19.7 },
  { month: "Feb", actual: null, forecast: 19.2, low: 17.1, high: 21.3 },
  { month: "Mar", actual: null, forecast: 20.6, low: 18.2, high: 23.0 },
];

const CUSTOMER_FORECAST = [
  { month: "Apr", actual: 7640, forecast: null },
  { month: "May", actual: 7820, forecast: null },
  { month: "Jun", actual: 7950, forecast: null },
  { month: "Jul", actual: 8100, forecast: null },
  { month: "Aug", actual: 8280, forecast: null },
  { month: "Sep", actual: 8420, forecast: 8420 },
  { month: "Oct", actual: null, forecast: 8810 },
  { month: "Nov", actual: null, forecast: 9240 },
  { month: "Dec", actual: null, forecast: 9720 },
  { month: "Jan", actual: null, forecast: 10150 },
  { month: "Feb", actual: null, forecast: 10640 },
  { month: "Mar", actual: null, forecast: 11180 },
];

const CHURN_FORECAST = [
  { month: "Apr", actual: 5.1, forecast: null },
  { month: "May", actual: 4.8, forecast: null },
  { month: "Jun", actual: 5.3, forecast: null },
  { month: "Jul", actual: 4.6, forecast: null },
  { month: "Aug", actual: 4.5, forecast: null },
  { month: "Sep", actual: 4.2, forecast: 4.2 },
  { month: "Oct", actual: null, forecast: 4.0 },
  { month: "Nov", actual: null, forecast: 3.8 },
  { month: "Dec", actual: null, forecast: 3.5 },
  { month: "Jan", actual: null, forecast: 3.4 },
  { month: "Feb", actual: null, forecast: 3.2 },
  { month: "Mar", actual: null, forecast: 3.0 },
];

const FORECASTS = [
  {
    id: "revenue",    label: "Revenue Forecast",     icon: DollarSign,
    color: "#2563EB", current: "₹12.4L", predicted: "₹20.6L",
    horizon: "March 2027", confidence: 78, change: "+66.1%",
    assumption: "Assumes 14% MoM growth maintained with retention improvements",
    data: REVENUE_FORECAST, dataKey: "actual", forecastKey: "forecast",
    yFormatter: v => v ? `₹${v}L` : "",
    tooltip: v => v ? `₹${v}L` : "N/A",
  },
  {
    id: "customers",  label: "Customer Growth",      icon: Users,
    color: "#7C3AED", current: "8,420", predicted: "11,180",
    horizon: "March 2027", confidence: 72, change: "+32.8%",
    assumption: "Assumes consistent new customer acquisition at current CAC",
    data: CUSTOMER_FORECAST, dataKey: "actual", forecastKey: "forecast",
    yFormatter: v => v ? `${(v/1000).toFixed(1)}K` : "",
    tooltip: v => v ? v.toLocaleString() : "N/A",
  },
  {
    id: "churn",      label: "Churn Rate Forecast",  icon: AlertTriangle,
    color: "#DC2626", current: "4.2%", predicted: "3.0%",
    horizon: "March 2027", confidence: 68, change: "-1.2%",
    assumption: "Assumes retention campaign launches within 14 days",
    data: CHURN_FORECAST, dataKey: "actual", forecastKey: "forecast",
    yFormatter: v => v ? `${v}%` : "",
    tooltip: v => v ? `${v}%` : "N/A",
  },
];

function ForecastCard({ f, active, onSelect }) {
  const Icon = f.icon;
  const isChurn = f.id === "churn";
  return (
    <div
      className="q-kpi-card"
      style={{
        cursor: "pointer",
        border: `1px solid ${active ? f.color : "var(--q-border)"}`,
        background: active ? f.color + "08" : "var(--q-surface)",
        transition: "all 0.2s",
      }}
      onClick={onSelect}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span className="q-kpi-label">{f.label}</span>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: f.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} style={{ color: f.color }} />
        </div>
      </div>
      <div style={{ fontSize: "0.75rem", color: "var(--q-text-4)", marginBottom: 4 }}>Current</div>
      <div className="q-kpi-value" style={{ fontSize: "1.375rem", marginBottom: 8 }}>{f.current}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "0.72rem", color: "var(--q-text-4)", marginBottom: 2 }}>Projected ({f.horizon})</div>
          <div style={{ fontWeight: 700, color: f.color, fontSize: "1rem" }}>{f.predicted}</div>
        </div>
        <span className={isChurn ? "q-delta-up" : "q-delta-up"} style={{ color: isChurn ? "#059669" : "#059669" }}>
          {isChurn ? "▼" : "▲"} {f.change}
        </span>
      </div>
    </div>
  );
}

export default function PredictionsPage() {
  const router = useRouter();
  const [active, setActive] = useState("revenue");

  const currentF = FORECASTS.find(f => f.id === active);

  return (
    <div className="q-page-shell">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h1 className="q-page-title">Business Predictions</h1>
            <span className="q-badge q-badge-info">AI Forecasts</span>
          </div>
          <p className="q-page-subtitle">
            Forward-looking projections based on historical trends · NovaMart · 6-month horizon
          </p>
        </div>
        <button className="q-btn q-btn-primary q-btn-sm" onClick={() => router.push("/ai-doctor")} style={{ gap: 5 }}>
          <Bot size={14} /> Ask About Forecasts
        </button>
      </div>

      {/* ── Disclaimer ── */}
      <div style={{ padding: "12px 16px", background: "#FFFBEB", borderRadius: 10, border: "1px solid #FDE68A", marginBottom: 24, display: "flex", gap: 12, alignItems: "center" }}>
        <Info size={16} color="#D97706" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: "0.8125rem", color: "#92400E", lineHeight: 1.6 }}>
          <strong>Predictions are estimates, not guarantees.</strong> Forecasts are based on historical patterns and stated assumptions. 
          Actual results may vary due to market conditions, competition, and operational changes.
        </p>
      </div>

      {/* ── Forecast Selector Cards ── */}
      <div className="q-kpi-grid" style={{ marginBottom: 28 }}>
        {FORECASTS.map(f => (
          <ForecastCard key={f.id} f={f} active={active === f.id} onSelect={() => setActive(f.id)} />
        ))}
        {/* Placeholder for profit */}
        <div className="q-kpi-card" style={{ opacity: 0.6, cursor: "default" }}>
          <span className="q-kpi-label">Profit Forecast</span>
          <div style={{ marginTop: 16, fontSize: "0.875rem", color: "var(--q-text-4)" }}>
            More data needed to generate profit forecast. Upload expense data to enable.
          </div>
        </div>
      </div>

      {/* ── Main Chart ── */}
      {currentF && (
        <div className="q-card" style={{ marginBottom: 24 }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--q-border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>{currentF.label}</h3>
              <p style={{ fontSize: "0.8125rem", color: "var(--q-text-3)" }}>
                Historical (solid) · Projected (dashed) · Apr 2026 – Mar 2027
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--q-text-4)", marginBottom: 4 }}>AI Confidence</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="q-progress-track" style={{ width: 80, height: 6 }}>
                  <div style={{ height: "100%", width: `${currentF.confidence}%`, background: currentF.confidence >= 75 ? "#059669" : "#D97706", borderRadius: 3 }} />
                </div>
                <span style={{ fontWeight: 700, color: currentF.confidence >= 75 ? "#059669" : "#D97706", fontSize: "0.875rem" }}>{currentF.confidence}%</span>
              </div>
            </div>
          </div>

          <div style={{ padding: "24px" }}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={currentF.data}>
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentF.color} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={currentF.color} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentF.color} stopOpacity={0.08} />
                    <stop offset="95%" stopColor={currentF.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--q-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--q-text-4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--q-text-4)" }} axisLine={false} tickLine={false} tickFormatter={currentF.yFormatter} width={55} />
                <Tooltip
                  formatter={(v, name) => [currentF.tooltip(v), name === currentF.dataKey ? "Actual" : "Projected"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid var(--q-border)", boxShadow: "var(--q-shadow-md)", fontSize: 12 }}
                />
                <ReferenceLine x="Sep" stroke="var(--q-border)" strokeDasharray="4 2" label={{ value: "Today", position: "top", fontSize: 11, fill: "var(--q-text-4)" }} />
                <Area type="monotone" dataKey={currentF.dataKey} name="Actual" stroke={currentF.color} strokeWidth={2.5} fill="url(#actualGrad)" connectNulls={false} dot={{ r: 3, fill: currentF.color }} />
                <Area type="monotone" dataKey={currentF.forecastKey} name="Projected" stroke={currentF.color} strokeWidth={2} strokeDasharray="6 3" fill="url(#forecastGrad)" connectNulls dot={false} />
              </AreaChart>
            </ResponsiveContainer>

            <div style={{ marginTop: 16, padding: "12px 16px", background: "var(--q-surface-2)", borderRadius: 10 }}>
              <span style={{ fontSize: "0.8125rem", color: "var(--q-text-3)" }}>
                <strong style={{ color: "var(--q-text-2)" }}>Key Assumption:</strong> {currentF.assumption}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── AI Commentary ── */}
      <div style={{ padding: "18px 22px", background: "#EFF6FF", borderRadius: 12, border: "1px solid #BFDBFE", marginBottom: 24, display: "flex", gap: 14 }}>
        <Bot size={20} color="#2563EB" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 700, color: "#1D4ED8", fontSize: "0.9375rem", marginBottom: 6 }}>AI Forecast Commentary</div>
          <p style={{ fontSize: "0.875rem", color: "#1D4ED8", lineHeight: 1.7 }}>
            Revenue trajectory is positive, projecting ₹20.6L by March 2027 — 
            this represents your <strong>₹20L goal timeline aligning well</strong>. 
            The primary risk to this forecast is continued churn pressure from high-value customers. 
            If churn remains above 4.5%, the revenue forecast reduces to ₹17.8L (projected shortfall: ₹2.8L). 
            <strong> Recommended: launch retention campaign within 14 days to stay on track.</strong>
          </p>
        </div>
        <button className="q-btn q-btn-sm q-btn-outline" style={{ flexShrink: 0, gap: 4 }} onClick={() => router.push("/simulator")}>
          Simulate
        </button>
      </div>

      {/* ── Forecast Summary Table ── */}
      <div className="q-card">
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--q-border)" }}>
          <h3 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>6-Month Forecast Summary</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="q-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue (Projected)</th>
                <th>Customers (Projected)</th>
                <th>Churn (Projected)</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {[
                { month: "October 2026",  rev: "₹13.8L", cust: "8,810",  churn: "4.0%", conf: 82 },
                { month: "November 2026", rev: "₹15.1L", cust: "9,240",  churn: "3.8%", conf: 78 },
                { month: "December 2026", rev: "₹16.8L", cust: "9,720",  churn: "3.5%", conf: 74 },
                { month: "January 2027",  rev: "₹17.9L", cust: "10,150", churn: "3.4%", conf: 70 },
                { month: "February 2027", rev: "₹19.2L", cust: "10,640", churn: "3.2%", conf: 65 },
                { month: "March 2027",    rev: "₹20.6L", cust: "11,180", churn: "3.0%", conf: 60 },
              ].map(r => (
                <tr key={r.month}>
                  <td style={{ fontWeight: 500 }}>{r.month}</td>
                  <td style={{ fontWeight: 600, color: "#2563EB" }}>{r.rev}</td>
                  <td style={{ color: "var(--q-text-2)" }}>{r.cust}</td>
                  <td style={{ color: "#059669" }}>{r.churn}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="q-progress-track" style={{ width: 50, height: 4 }}>
                        <div style={{ height: "100%", width: `${r.conf}%`, background: r.conf >= 75 ? "#059669" : r.conf >= 65 ? "#D97706" : "#DC2626", borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{r.conf}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
