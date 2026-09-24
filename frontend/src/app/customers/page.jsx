"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users, UserPlus, UserX, TrendingDown, TrendingUp, Search,
  Filter, Download, ChevronRight, Star, AlertTriangle, ArrowUpRight,
  BarChart2, Target, Bot, Activity
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ── Demo Data ─────────────────────────────────────────────────────────────────
const SEGMENT_DATA = [
  { month: "Apr", new: 340, returning: 510, churned: 42 },
  { month: "May", new: 380, returning: 560, churned: 38 },
  { month: "Jun", new: 310, returning: 590, churned: 51 },
  { month: "Jul", new: 420, returning: 610, churned: 35 },
  { month: "Aug", new: 460, returning: 650, churned: 44 },
  { month: "Sep", new: 480, returning: 630, churned: 49 },
];

const SEGMENTS = [
  { id: "high_value",    label: "High Value",     count: 1024, revenue: "₹6.2L", clv: "₹8,420", badge: "q-badge-info",    icon: Star,          color: "#2563EB", bg: "#EFF6FF", risk: null,     trend: "+12%" },
  { id: "new",          label: "New Customers",   count: 480,  revenue: "₹1.1L", clv: "₹2,300", badge: "q-badge-success", icon: UserPlus,      color: "#059669", bg: "#ECFDF5", risk: null,     trend: "+8.6%" },
  { id: "at_risk",      label: "At Risk",         count: 213,  revenue: "₹1.4L", clv: "₹6,580", badge: "q-badge-danger",  icon: AlertTriangle, color: "#DC2626", bg: "#FEF2F2", risk: "HIGH",   trend: "-9%" },
  { id: "loyal",        label: "Loyal",           count: 2890, revenue: "₹3.8L", clv: "₹5,200", badge: "q-badge-success", icon: Activity,      color: "#059669", bg: "#ECFDF5", risk: null,     trend: "+4.2%" },
  { id: "low_engage",   label: "Low Engagement",  count: 1840, revenue: "₹0.9L", clv: "₹1,480", badge: "q-badge-warning", icon: TrendingDown,  color: "#D97706", bg: "#FFFBEB", risk: "MEDIUM", trend: "-2.1%" },
  { id: "churned",      label: "Churned",         count: 354,  revenue: "—",     clv: "—",       badge: "q-badge-neutral", icon: UserX,         color: "#9CA3AF", bg: "#F9FAFB", risk: null,     trend: "+1 mo" },
];

const CUSTOMERS = [
  { id: "C-8820", name: "Priya Sharma",    segment: "High Value",    revenue: "₹48,200", orders: 24, lastOrder: "3 days ago", clv: "₹1.2L", churnRisk: 12,  status: "Active" },
  { id: "C-7741", name: "Rajan Mehta",     segment: "At Risk",       revenue: "₹31,500", orders: 8,  lastOrder: "42 days ago",clv: "₹80K",  churnRisk: 78,  status: "At Risk" },
  { id: "C-6612", name: "Ananya Patel",    segment: "Loyal",         revenue: "₹22,800", orders: 19, lastOrder: "7 days ago", clv: "₹68K",  churnRisk: 8,   status: "Active" },
  { id: "C-9933", name: "Vikram Singh",    segment: "New Customers", revenue: "₹4,200",  orders: 2,  lastOrder: "5 days ago", clv: "₹12K",  churnRisk: 31,  status: "Active" },
  { id: "C-5500", name: "Deepa Nair",      segment: "At Risk",       revenue: "₹18,900", orders: 5,  lastOrder: "61 days ago",clv: "₹55K",  churnRisk: 84,  status: "At Risk" },
  { id: "C-4421", name: "Suresh Iyer",     segment: "High Value",    revenue: "₹61,800", orders: 32, lastOrder: "1 day ago",  clv: "₹1.8L", churnRisk: 6,   status: "Active" },
  { id: "C-3310", name: "Kavitha Kumar",   segment: "Low Engagement",revenue: "₹3,100",  orders: 3,  lastOrder: "28 days ago",clv: "₹9K",   churnRisk: 45,  status: "Warning" },
  { id: "C-2209", name: "Arjun Reddy",     segment: "Loyal",         revenue: "₹27,400", orders: 21, lastOrder: "4 days ago", clv: "₹82K",  churnRisk: 11,  status: "Active" },
  { id: "C-1180", name: "Meera Joshi",     segment: "Churned",       revenue: "₹9,200",  orders: 4,  lastOrder: "92 days ago",clv: "₹28K",  churnRisk: 96,  status: "Churned" },
  { id: "C-0991", name: "Kiran Bhat",      segment: "High Value",    revenue: "₹44,100", orders: 27, lastOrder: "2 days ago", clv: "₹1.3L", churnRisk: 9,   status: "Active" },
];

const STATUS_COLORS = {
  "Active":  { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  "At Risk": { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  "Warning": { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  "Churned": { color: "#9CA3AF", bg: "#F9FAFB", border: "#E5E7EB" },
};

export default function CustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [segFilter, setSegFilter] = useState("All");
  const [sortBy, setSortBy] = useState("revenue");

  const filtered = CUSTOMERS.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchSeg = segFilter === "All" || c.segment === segFilter;
    return matchSearch && matchSeg;
  });

  return (
    <div className="q-page-shell">
      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h1 className="q-page-title">Customer Intelligence</h1>
            <span className="q-badge q-badge-info">8,420 Total</span>
          </div>
          <p className="q-page-subtitle">Understand, segment, and act on your customer base · NovaMart</p>
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
          { label: "Total Customers",   value: "8,420",  delta: "+6.8%",  up: true,  icon: Users,      color: "#2563EB" },
          { label: "New This Month",    value: "480",    delta: "+4.3%",  up: true,  icon: UserPlus,   color: "#059669" },
          { label: "Retention Rate",    value: "95.8%",  delta: "+1.1%",  up: true,  icon: Activity,   color: "#7C3AED" },
          { label: "At Risk",           value: "213",    delta: "+18",    up: false, icon: AlertTriangle, color: "#DC2626" },
          { label: "Avg. CLV",          value: "₹5,640", delta: "+9.2%",  up: true,  icon: TrendingUp, color: "#D97706" },
        ].map(({ label, value, delta, up, icon: Icon, color }) => (
          <div key={label} className="q-kpi-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span className="q-kpi-label">{label}</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <div className="q-kpi-value">{value}</div>
            <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <span className={up ? "q-delta-up" : "q-delta-down"}>{up ? "▲" : "▼"} {delta}</span>
              <span className="q-kpi-sub">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── AI Alert ── */}
      <div style={{ padding: "14px 18px", background: "#FEF2F2", borderRadius: 12, border: "1px solid #FECACA", marginBottom: 24, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 700, color: "#DC2626", fontSize: "0.9375rem", marginBottom: 4 }}>
            43 High-Value Customers Showing Declining Activity
          </div>
          <p style={{ fontSize: "0.875rem", color: "#991B1B", lineHeight: 1.6 }}>
            These customers contributed ₹4.8L last month but purchase frequency dropped 23% in the last 30 days. 
            Immediate retention action is recommended.
          </p>
        </div>
        <button className="q-btn q-btn-sm" style={{ background: "#DC2626", color: "#fff", flexShrink: 0, gap: 5 }} onClick={() => router.push("/actions")}>
          Create Action <ChevronRight size={13} />
        </button>
      </div>

      {/* ── Chart + Segments Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Customer Trend Chart */}
        <div className="q-card" style={{ padding: 0 }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--q-border)" }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Customer Trend</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--q-text-3)", marginTop: 3 }}>New, returning & churned by month</p>
          </div>
          <div style={{ padding: "16px 22px 12px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={SEGMENT_DATA} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--q-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--q-text-4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--q-text-4)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--q-border)", boxShadow: "var(--q-shadow-md)", fontSize: 12 }} />
                <Bar dataKey="new" name="New" fill="#2563EB" radius={[3, 3, 0, 0]} />
                <Bar dataKey="returning" name="Returning" fill="#7C3AED" radius={[3, 3, 0, 0]} />
                <Bar dataKey="churned" name="Churned" fill="#DC2626" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="q-card" style={{ padding: 0 }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--q-border)" }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Customer Segments</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--q-text-3)", marginTop: 3 }}>Click a segment to filter the table below</p>
          </div>
          <div style={{ padding: "10px 12px" }}>
            {SEGMENTS.map(seg => {
              const Icon = seg.icon;
              return (
                <button
                  key={seg.id}
                  onClick={() => setSegFilter(segFilter === seg.label ? "All" : seg.label)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, width: "100%",
                    padding: "10px 12px", borderRadius: 8, border: "1px solid transparent",
                    background: segFilter === seg.label ? seg.bg : "transparent",
                    borderColor: segFilter === seg.label ? seg.color + "40" : "transparent",
                    cursor: "pointer", textAlign: "left", transition: "all 0.15s", marginBottom: 2,
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{ width: 30, height: 30, borderRadius: 6, background: seg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={14} style={{ color: seg.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--q-text-1)" }}>{seg.label}</span>
                      <span style={{ fontSize: "0.875rem", fontWeight: 700, color: seg.color }}>{seg.count.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--q-text-4)" }}>Avg CLV: {seg.clv}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--q-text-4)" }}>Rev: {seg.revenue}</span>
                    </div>
                  </div>
                  {seg.risk && (
                    <span className={`q-badge ${seg.risk === "HIGH" ? "q-badge-danger" : "q-badge-warning"}`} style={{ fontSize: "0.6rem", flexShrink: 0 }}>{seg.risk}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Customer Table ── */}
      <div className="q-card">
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--q-border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <h3 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
            All Customers {segFilter !== "All" && <span style={{ color: "var(--q-text-3)", fontWeight: 400 }}>— {segFilter}</span>}
            <span style={{ marginLeft: 8, fontSize: "0.8125rem", color: "var(--q-text-4)", fontWeight: 400 }}>({filtered.length})</span>
          </h3>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--q-text-4)" }} />
              <input
                className="q-input"
                style={{ paddingLeft: 32, width: 220, fontSize: "0.875rem" }}
                placeholder="Search customers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {segFilter !== "All" && (
              <button className="q-btn q-btn-outline q-btn-sm" onClick={() => setSegFilter("All")}>
                Clear Filter
              </button>
            )}
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="q-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Segment</th>
                <th>Revenue</th>
                <th>Orders</th>
                <th>Last Order</th>
                <th>Lifetime Value</th>
                <th>Churn Risk</th>
                <th>Status</th>
                <th style={{ width: 80 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const statusMeta = STATUS_COLORS[c.status];
                const riskColor = c.churnRisk >= 70 ? "#DC2626" : c.churnRisk >= 40 ? "#D97706" : "#059669";
                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="q-avatar" style={{ width: 32, height: 32, fontSize: "0.75rem", background: `linear-gradient(135deg, #${Math.abs(c.id.charCodeAt(2) * 123456) % 0xFFFFFF | 0x400000}40, #${Math.abs(c.id.charCodeAt(3) * 654321) % 0xFFFFFF | 0x004040}40)`, color: "var(--q-text-1)", border: "1px solid var(--q-border)" }}>
                          {c.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--q-text-1)" }}>{c.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--q-text-4)" }}>{c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: "0.8125rem", color: "var(--q-text-2)" }}>{c.segment}</span></td>
                    <td><span style={{ fontWeight: 600, color: "var(--q-text-1)" }}>{c.revenue}</span></td>
                    <td><span style={{ color: "var(--q-text-2)" }}>{c.orders}</span></td>
                    <td><span style={{ fontSize: "0.8125rem", color: "var(--q-text-3)" }}>{c.lastOrder}</span></td>
                    <td><span style={{ fontWeight: 600, color: "#2563EB" }}>{c.clv}</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="q-progress-track" style={{ width: 50, height: 4 }}>
                          <div style={{ height: "100%", width: `${c.churnRisk}%`, background: riskColor, borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: riskColor }}>{c.churnRisk}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: statusMeta.bg, color: statusMeta.color, border: `1px solid ${statusMeta.border}` }}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="q-btn q-btn-ghost q-btn-icon q-btn-sm" title="View profile">
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="q-empty">
              <div className="q-empty-icon">👤</div>
              <div className="q-empty-title">No customers found</div>
              <div className="q-empty-desc">Try adjusting your search or filter.</div>
            </div>
          )}
        </div>
        <div style={{ padding: "14px 22px", borderTop: "1px solid var(--q-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8125rem", color: "var(--q-text-4)" }}>Showing {filtered.length} of {CUSTOMERS.length} customers</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="q-btn q-btn-outline q-btn-sm">Previous</button>
            <button className="q-btn q-btn-blue q-btn-sm">1</button>
            <button className="q-btn q-btn-outline q-btn-sm">2</button>
            <button className="q-btn q-btn-outline q-btn-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
