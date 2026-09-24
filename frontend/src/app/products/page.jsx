"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package, TrendingUp, TrendingDown, Search, Download,
  ChevronRight, Star, AlertTriangle, BarChart2, Lightbulb,
  ArrowUpRight, Activity, Bot
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

// ── Demo Data ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "P-001", name: "SmartBand Pro",    category: "Wearables",
    revenue: 520000, profit: 190000, cost: 330000, margin: 36.5,
    units: 1840, growth: 22, stock: 420, rating: 4.8,
    status: "Best Seller", trend: "up",
    monthly: [620, 680, 590, 720, 810, 900, 950, 1040, 1120, 1280, 1560, 1840],
  },
  {
    id: "P-002", name: "ActiveWear X",     category: "Apparel",
    revenue: 340000, profit: 68000, cost: 272000, margin: 20.0,
    units: 1230, growth: 8, stock: 680, rating: 4.2,
    status: "Growing", trend: "up",
    monthly: [820, 890, 910, 950, 980, 1010, 1040, 1080, 1120, 1150, 1200, 1230],
  },
  {
    id: "P-003", name: "FitPack Bundle",   category: "Bundles",
    revenue: 220000, profit: 110000, cost: 110000, margin: 50.0,
    units: 620, growth: 41, stock: 180, rating: 4.9,
    status: "High Margin", trend: "up",
    monthly: [120, 150, 180, 210, 280, 340, 380, 420, 460, 510, 570, 620],
  },
  {
    id: "P-004", name: "PremiumCase",      category: "Accessories",
    revenue: 160000, profit: 22000, cost: 138000, margin: 13.8,
    units: 2900, growth: -4, stock: 1200, rating: 3.6,
    status: "At Risk", trend: "down",
    monthly: [3200, 3100, 3050, 3000, 2970, 2940, 2920, 2910, 2900, 2900, 2900, 2900],
  },
  {
    id: "P-005", name: "EcoStrap",         category: "Accessories",
    revenue: 88000, profit: 40000, cost: 48000, margin: 45.5,
    units: 880, growth: 18, stock: 340, rating: 4.5,
    status: "Growing", trend: "up",
    monthly: [400, 440, 490, 530, 580, 620, 670, 710, 760, 800, 840, 880],
  },
];

const CHART_DATA = PRODUCTS.map(p => ({
  name: p.name.split(" ")[0],
  revenue: p.revenue / 100000,
  profit: p.profit / 100000,
  margin: p.margin,
}));

const STATUS_META = {
  "Best Seller": { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
  "Growing":     { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  "High Margin": { color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
  "At Risk":     { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  "Stable":      { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
};

const fmt = (v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`;

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("revenue");
  const [selected, setSelected] = useState(null);

  const filtered = PRODUCTS
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "revenue") return b.revenue - a.revenue;
      if (sort === "profit") return b.profit - a.profit;
      if (sort === "margin") return b.margin - a.margin;
      if (sort === "growth") return b.growth - a.growth;
      if (sort === "units") return b.units - a.units;
      return 0;
    });

  const totalRevenue = PRODUCTS.reduce((s, p) => s + p.revenue, 0);
  const totalProfit  = PRODUCTS.reduce((s, p) => s + p.profit, 0);
  const avgMargin    = PRODUCTS.reduce((s, p) => s + p.margin, 0) / PRODUCTS.length;
  const totalUnits   = PRODUCTS.reduce((s, p) => s + p.units, 0);

  return (
    <div className="q-page-shell">
      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h1 className="q-page-title">Product Intelligence</h1>
            <span className="q-badge q-badge-neutral">{PRODUCTS.length} Products</span>
          </div>
          <p className="q-page-subtitle">Revenue, profitability, and demand analytics per product · NovaMart</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="q-btn q-btn-outline q-btn-sm" style={{ gap: 5 }}>
            <Download size={14} /> Export
          </button>
          <button className="q-btn q-btn-primary q-btn-sm" onClick={() => router.push("/ai-doctor")} style={{ gap: 5 }}>
            <Bot size={14} /> Ask AI
          </button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="q-kpi-grid" style={{ marginBottom: 28 }}>
        {[
          { label: "Total Revenue",  value: fmt(totalRevenue),           delta: "+14.2%",  up: true,  icon: BarChart2,   color: "#2563EB" },
          { label: "Total Profit",   value: fmt(totalProfit),            delta: "+9.4%",   up: true,  icon: TrendingUp,  color: "#059669" },
          { label: "Avg Margin",     value: `${avgMargin.toFixed(1)}%`,  delta: "+2.1%",   up: true,  icon: Activity,    color: "#7C3AED" },
          { label: "Units Sold",     value: totalUnits.toLocaleString(), delta: "+11.8%",  up: true,  icon: Package,     color: "#D97706" },
        ].map(({ label, value, delta, up, icon: Icon, color }) => (
          <div key={label} className="q-kpi-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span className="q-kpi-label">{label}</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <div className="q-kpi-value">{value}</div>
            <div style={{ marginTop: 6, display: "flex", gap: 6, alignItems: "center" }}>
              <span className={up ? "q-delta-up" : "q-delta-down"}>{up ? "▲" : "▼"} {delta}</span>
              <span className="q-kpi-sub">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── AI Insight ── */}
      <div style={{ padding: "14px 18px", background: "#EFF6FF", borderRadius: 12, border: "1px solid #BFDBFE", marginBottom: 24, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <Lightbulb size={18} color="#2563EB" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: "#1D4ED8", fontSize: "0.9375rem", marginBottom: 4 }}>
            AI Product Intelligence
          </div>
          <p style={{ fontSize: "0.875rem", color: "#1D4ED8", lineHeight: 1.6 }}>
            <strong>FitPack Bundle</strong> has the highest margin (50%) but only 620 units sold — significant upsell potential. 
            <strong> PremiumCase</strong> generates revenue but low margin (13.8%) with declining demand — review pricing or discontinue. 
            <strong>SmartBand Pro</strong> is your star product driving 41.3% of total revenue.
          </p>
        </div>
        <button className="q-btn q-btn-sm q-btn-outline" style={{ flexShrink: 0, gap: 5 }} onClick={() => router.push("/simulator")}>
          <BarChart2 size={13} /> Simulate
        </button>
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Revenue vs Profit Bar */}
        <div className="q-card" style={{ padding: 0 }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--q-border)" }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Revenue vs Profit by Product</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--q-text-3)", marginTop: 3 }}>In Lakhs (₹L)</p>
          </div>
          <div style={{ padding: "20px 22px 12px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={CHART_DATA} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--q-border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--q-text-4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--q-text-4)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}L`} />
                <Tooltip formatter={(v) => [`₹${v}L`]} contentStyle={{ borderRadius: 8, border: "1px solid var(--q-border)", fontSize: 12 }} />
                <Bar dataKey="revenue" name="Revenue" fill="#2563EB" radius={[3, 3, 0, 0]} barSize={18} />
                <Bar dataKey="profit" name="Profit" fill="#059669" radius={[3, 3, 0, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Margin by Product */}
        <div className="q-card" style={{ padding: 0 }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--q-border)" }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Gross Margin by Product</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--q-text-3)", marginTop: 3 }}>Higher is better</p>
          </div>
          <div style={{ padding: "18px 22px" }}>
            {PRODUCTS.map(p => (
              <div key={p.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--q-text-2)", fontWeight: 500 }}>{p.name}</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: p.margin >= 40 ? "#059669" : p.margin >= 20 ? "#D97706" : "#DC2626" }}>{p.margin}%</span>
                </div>
                <div className="q-progress-track" style={{ height: 6 }}>
                  <div style={{ height: "100%", width: `${p.margin}%`, borderRadius: 3, transition: "width 0.8s ease", background: p.margin >= 40 ? "#059669" : p.margin >= 20 ? "#D97706" : "#DC2626" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Product Table ── */}
      <div className="q-card">
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--q-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <h3 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>All Products</h3>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--q-text-4)" }} />
              <input
                className="q-input"
                style={{ paddingLeft: 32, width: 200, fontSize: "0.875rem" }}
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="q-input"
              style={{ width: 140, fontSize: "0.875rem" }}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="revenue">Sort: Revenue</option>
              <option value="profit">Sort: Profit</option>
              <option value="margin">Sort: Margin</option>
              <option value="growth">Sort: Growth</option>
              <option value="units">Sort: Units</option>
            </select>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="q-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Revenue</th>
                <th>Profit</th>
                <th>Margin</th>
                <th>Units Sold</th>
                <th>Growth</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const meta = STATUS_META[p.status] || STATUS_META["Stable"];
                return (
                  <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => setSelected(selected === p.id ? null : p.id)}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--q-surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Package size={15} style={{ color: "var(--q-text-3)" }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--q-text-1)", fontSize: "0.875rem" }}>{p.name}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--q-text-4)" }}>{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="q-badge q-badge-neutral">{p.category}</span></td>
                    <td><span style={{ fontWeight: 600, color: "var(--q-text-1)" }}>{fmt(p.revenue)}</span></td>
                    <td><span style={{ fontWeight: 600, color: "#059669" }}>{fmt(p.profit)}</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="q-progress-track" style={{ width: 44, height: 4 }}>
                          <div style={{ height: "100%", width: `${p.margin}%`, background: p.margin >= 40 ? "#059669" : p.margin >= 20 ? "#D97706" : "#DC2626", borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: p.margin >= 40 ? "#059669" : p.margin >= 20 ? "#D97706" : "#DC2626" }}>{p.margin}%</span>
                      </div>
                    </td>
                    <td><span style={{ color: "var(--q-text-2)" }}>{p.units.toLocaleString()}</span></td>
                    <td>
                      <span className={p.growth >= 0 ? "q-delta-up" : "q-delta-down"}>
                        {p.growth >= 0 ? "▲" : "▼"} {Math.abs(p.growth)}%
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.8125rem", color: p.stock < 200 ? "#DC2626" : "var(--q-text-2)", fontWeight: p.stock < 200 ? 700 : 400 }}>
                        {p.stock} {p.stock < 200 && <span style={{ fontSize: "0.7rem" }}>⚠ Low</span>}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Cross-Sell Opportunities ── */}
      <div className="q-card" style={{ marginTop: 20, padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <Lightbulb size={17} color="#D97706" />
          <h3 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>AI Cross-Sell Opportunities</h3>
          <span className="q-badge q-badge-warning">3 Detected</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {[
            { from: "SmartBand Pro", to: "EcoStrap", potential: "₹44K/mo", confidence: 81, reason: "78% of SmartBand buyers haven't purchased a strap yet." },
            { from: "ActiveWear X", to: "FitPack Bundle", potential: "₹38K/mo", confidence: 74, reason: "Bundle buyers spend 2.4x more on average." },
            { from: "PremiumCase", to: "SmartBand Pro", potential: "₹22K/mo", confidence: 68, reason: "Case buyers often upgrade to full wearable within 60 days." },
          ].map((op, i) => (
            <div key={i} style={{ padding: 16, background: "var(--q-surface-2)", borderRadius: 10, border: "1px solid var(--q-border)" }}>
              <div style={{ fontSize: "0.8125rem", color: "var(--q-text-3)", marginBottom: 8 }}>
                <strong style={{ color: "var(--q-text-1)" }}>{op.from}</strong> → <strong style={{ color: "#2563EB" }}>{op.to}</strong>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "var(--q-text-3)", lineHeight: 1.6, marginBottom: 12 }}>{op.reason}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#059669" }}>{op.potential}</span>
                <span style={{ fontSize: "0.8125rem", color: "var(--q-text-4)" }}>Confidence: {op.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
