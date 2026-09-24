"use client";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/context/BusinessContext";
import { TrendingUp, Users, DollarSign, ShoppingCart, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const TABS = ["Overview", "Revenue", "Sales", "Customers", "Products", "Marketing", "Profitability"];

function InsufficientData({ router }) {
  return (
    <div className="q-page-shell">
      <div className="q-page-header">
        <h1 className="q-page-title">Analytics</h1>
      </div>
      <div style={{ maxWidth: 520, margin: "60px auto", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16, opacity: 0.3 }}>📊</div>
        <h2 style={{ fontWeight: 700, fontSize: "1.375rem", marginBottom: 12 }}>Insufficient data</h2>
        <p style={{ color: "var(--q-text-3)", lineHeight: 1.7, marginBottom: 28 }}>
          Analytics are calculated from your uploaded business data. Upload a CSV or Excel file with your sales, revenue, or customer data to unlock full analytics.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => router.push("/onboarding")} className="q-btn q-btn-primary q-btn-sm" style={{ gap: 6 }}><Plus size={14} /> Upload Data</button>
          <button onClick={() => router.push("/onboarding")} className="q-btn q-btn-outline q-btn-sm">🎮 Explore Demo</button>
        </div>
      </div>
    </div>
  );
}

const DEMO_MONTHLY = [
  { month: "Apr", revenue: 820000, profit: 210000, expenses: 610000, customers: 7640 },
  { month: "May", revenue: 940000, profit: 250000, expenses: 690000, customers: 7820 },
  { month: "Jun", revenue: 890000, profit: 230000, expenses: 660000, customers: 7950 },
  { month: "Jul", revenue: 1050000, profit: 280000, expenses: 770000, customers: 8100 },
  { month: "Aug", revenue: 1180000, profit: 310000, expenses: 870000, customers: 8280 },
  { month: "Sep", revenue: 1240000, profit: 320000, expenses: 920000, customers: 8420 },
];

const DEMO_PRODUCTS = [
  { name: "Product A — SmartBand Pro",  revenue: 520000, profit: 190000, margin: 36.5, growth: 22, units: 1840 },
  { name: "Product B — ActiveWear X",   revenue: 340000, profit: 68000,  margin: 20.0, growth: 8,  units: 1230 },
  { name: "Product C — FitPack Bundle", revenue: 220000, profit: 110000, margin: 50.0, growth: 41, units: 620 },
  { name: "Product D — PremiumCase",    revenue: 160000, profit: 22000,  margin: 13.8, growth: -4, units: 2900 },
];

const fmt = (v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`;

export default function AnalyticsPage() {
  const router = useRouter();
  const { isDemo, hasData, metrics, selected } = useBusiness();
  const [tab, setTab] = useState("Overview");

  if (!selected || (!isDemo && !hasData)) return <InsufficientData router={router} />;

  // Use demo or real monthly data
  const monthly  = isDemo ? DEMO_MONTHLY  : (metrics?.monthlyChart || []);
  const products  = isDemo ? DEMO_PRODUCTS : (metrics?.products || []);

  // Compute KPIs from data
  const totalRevenue = monthly.reduce((s, m) => s + (m.revenue || 0), 0);
  const totalProfit  = monthly.reduce((s, m) => s + (m.profit  || 0), 0);
  const lastCustomers = monthly[monthly.length - 1]?.customers || 0;

  const KPIS = [
    { label: "Total Revenue",   value: monthly.length ? fmt(totalRevenue) : "—",           delta: "+14.2%", up: true,  icon: DollarSign, color: "#2563EB" },
    { label: "Net Profit",      value: monthly.length ? fmt(totalProfit)  : "—",           delta: "+9.4%",  up: true,  icon: TrendingUp, color: "#059669" },
    { label: "Total Customers", value: lastCustomers ? lastCustomers.toLocaleString() : "—", delta: "+6.8%", up: true, icon: Users,       color: "#7C3AED" },
    { label: "Total Orders",    value: metrics?.totalOrders ? metrics.totalOrders.toLocaleString() : "—", delta: "+11.3%", up: true, icon: ShoppingCart, color: "#D97706" },
  ];

  return (
    <div className="q-page-shell">
      <div className="q-page-header">
        <h1 className="q-page-title">Analytics</h1>
        <p className="q-page-subtitle">
          {selected?.businessName || selected?.name} · {isDemo ? "Demo Data — NovaMart" : "Your Data"}
        </p>
      </div>

      {/* Tabs */}
      <div className="q-tabs" style={{ marginBottom: 28 }}>
        {TABS.map(t => (
          <button key={t} className={`q-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {/* KPIs */}
      <div className="q-kpi-grid" style={{ marginBottom: 24 }}>
        {KPIS.map(({ label, value, delta, up, icon: Icon, color }) => (
          <div key={label} className="q-kpi-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span className="q-kpi-label">{label}</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <div className="q-kpi-value">{value}</div>
            {value !== "—" && (
              <div style={{ marginTop: 6 }}>
                <span className={up ? "q-delta-up" : "q-delta-down"}>{up ? "▲" : "▼"} {delta}</span>
                <span className="q-kpi-sub" style={{ marginLeft: 6 }}>vs previous period</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      {monthly.length > 0 ? (
        <div className="q-card" style={{ marginBottom: 24 }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--q-border)" }}>
            <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>Revenue vs Profit Trend</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--q-text-3)", marginTop: 2 }}>Monthly performance from your data</p>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--q-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--q-text-4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--q-text-4)" }} axisLine={false} tickLine={false} tickFormatter={v => fmt(v)} width={60} />
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ borderRadius: 8, border: "1px solid var(--q-border)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#revG)" />
                <Area type="monotone" dataKey="profit"  name="Profit"  stroke="#059669" strokeWidth={2.5} fill="url(#profG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div style={{ padding: "40px 24px", textAlign: "center", background: "var(--q-surface)", border: "1px solid var(--q-border)", borderRadius: 14, marginBottom: 24 }}>
          <div style={{ fontSize: "1.75rem", opacity: 0.3, marginBottom: 10 }}>📈</div>
          <div style={{ fontWeight: 600, color: "var(--q-text-3)" }}>No chart data yet</div>
          <div style={{ fontSize: "0.875rem", color: "var(--q-text-4)", marginTop: 6 }}>Upload time-series data to see trend charts.</div>
        </div>
      )}

      {/* AI Insight */}
      {isDemo && (
        <div style={{ padding: 16, background: "#EFF6FF", borderRadius: 12, border: "1px solid #BFDBFE", marginBottom: 24, display: "flex", gap: 12 }}>
          <span style={{ fontSize: "1.25rem" }}>🤖</span>
          <div>
            <div style={{ fontWeight: 600, color: "#1D4ED8", marginBottom: 4 }}>AI Revenue Insight (Demo)</div>
            <p style={{ fontSize: "0.875rem", color: "#1D4ED8", lineHeight: 1.6 }}>
              Revenue grew 14.2% overall, primarily driven by Product A (+22%) and returning customers (+8%). Product D shows declining demand — consider a pricing or promotion review.
            </p>
          </div>
        </div>
      )}

      {/* Product table */}
      {products.length > 0 && (
        <div className="q-card">
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--q-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>Product Performance</h3>
            <button className="q-btn q-btn-ghost q-btn-sm" onClick={() => router.push("/products")} style={{ gap: 4 }}>View All <ChevronRight size={14} /></button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="q-table">
              <thead>
                <tr>
                  <th>Product</th><th>Revenue</th><th>Profit</th><th>Margin</th><th>Growth</th><th>Units</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.name}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td>{fmt(p.revenue)}</td>
                    <td>{fmt(p.profit)}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="q-progress-track" style={{ width: 60, height: 4 }}>
                          <div style={{ height: "100%", width: `${p.margin}%`, background: p.margin > 35 ? "#059669" : p.margin > 20 ? "#D97706" : "#DC2626", borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: "0.875rem" }}>{p.margin}%</span>
                      </div>
                    </td>
                    <td><span className={p.growth >= 0 ? "q-delta-up" : "q-delta-down"}>{p.growth >= 0 ? "▲" : "▼"} {Math.abs(p.growth)}%</span></td>
                    <td style={{ color: "var(--q-text-3)" }}>{p.units?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
