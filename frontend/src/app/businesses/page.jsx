"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, Plus, TrendingUp, Users, DollarSign, Activity,
  MoreHorizontal, Settings, Eye, ChevronRight, ArrowUpRight,
  Sparkles, Globe
} from "lucide-react";

const BUSINESSES = [
  {
    id: "biz-001",
    name: "NovaMart",
    industry: "E-commerce",
    type: "B2C",
    revenue: "₹12.4L/mo",
    customers: "8,420",
    health: 82,
    healthLabel: "Healthy",
    healthColor: "#059669",
    growth: "+14.2%",
    status: "active",
    logo: "N",
    logoColor: "#2563EB",
    lastActive: "Active now",
    risks: 2,
    opportunities: 5,
  },
];

function BusinessCard({ biz, onSelect, router }) {
  const [menu, setMenu] = useState(false);

  return (
    <div
      className="q-card q-card-hover"
      style={{ padding: 24, cursor: "pointer", position: "relative" }}
      onClick={() => onSelect(biz.id)}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: `linear-gradient(135deg, ${biz.logoColor}, ${biz.logoColor}99)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: "1.25rem",
          }}>
            {biz.logo}
          </div>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--q-text-1)", marginBottom: 4 }}>{biz.name}</h3>
            <div style={{ display: "flex", gap: 6 }}>
              <span className="q-badge q-badge-neutral">{biz.industry}</span>
              <span className="q-badge q-badge-neutral">{biz.type}</span>
            </div>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <button
            className="q-btn q-btn-ghost q-btn-icon"
            onClick={e => { e.stopPropagation(); setMenu(!menu); }}
            style={{ borderRadius: 8 }}
          >
            <MoreHorizontal size={16} />
          </button>
          {menu && (
            <div style={{
              position: "absolute", top: "100%", right: 0, zIndex: 10,
              background: "var(--q-surface)", border: "1px solid var(--q-border)",
              borderRadius: 10, boxShadow: "var(--q-shadow-lg)", minWidth: 160, marginTop: 4,
            }}>
              {[
                { label: "View Dashboard", icon: Eye, path: "/dashboard" },
                { label: "Settings", icon: Settings, path: "/settings" },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={e => { e.stopPropagation(); router.push(item.path); setMenu(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", width: "100%", border: "none", background: "none", cursor: "pointer", fontSize: "0.875rem", color: "var(--q-text-2)", fontFamily: "inherit" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--q-surface-2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
                >
                  <item.icon size={14} /> {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Health Score */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "var(--q-surface-2)", borderRadius: 10, marginBottom: 18 }}>
        <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}>
          <svg width={44} height={44} viewBox="0 0 44 44">
            <circle cx={22} cy={22} r={17} fill="none" stroke="var(--q-surface-3)" strokeWidth={5} />
            <circle
              cx={22} cy={22} r={17} fill="none"
              stroke={biz.healthColor} strokeWidth={5}
              strokeDasharray={`${(biz.health / 100) * (2 * Math.PI * 17)} ${2 * Math.PI * 17}`}
              strokeLinecap="round"
              transform="rotate(-90 22 22)"
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: biz.healthColor }}>{biz.health}</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.75rem", color: "var(--q-text-4)" }}>Business Health</div>
          <div style={{ fontWeight: 700, color: biz.healthColor, fontSize: "0.9375rem" }}>{biz.healthLabel}</div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--q-text-4)" }}>Growth</div>
          <div style={{ fontWeight: 700, color: "#059669", fontSize: "0.9375rem" }}>{biz.growth}</div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
        {[
          { label: "Revenue", value: biz.revenue, icon: DollarSign, color: "#2563EB" },
          { label: "Customers", value: biz.customers, icon: Users, color: "#7C3AED" },
          { label: "Last Active", value: biz.lastActive, icon: Activity, color: "#059669" },
        ].map(kpi => (
          <div key={kpi.label} style={{ textAlign: "center", padding: "10px 8px", background: "var(--q-surface-2)", borderRadius: 8 }}>
            <div style={{ fontSize: "0.65rem", color: "var(--q-text-4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{kpi.label}</div>
            <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--q-text-1)" }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Alerts Row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {biz.risks > 0 && (
          <span className="q-badge q-badge-danger">{biz.risks} Risks</span>
        )}
        {biz.opportunities > 0 && (
          <span className="q-badge q-badge-info">{biz.opportunities} Opportunities</span>
        )}
      </div>

      <button
        className="q-btn q-btn-primary q-btn-sm"
        style={{ width: "100%", gap: 6 }}
        onClick={e => { e.stopPropagation(); router.push("/dashboard"); }}
      >
        Open Command Center <ChevronRight size={14} />
      </button>
    </div>
  );
}

export default function BusinessesPage() {
  const router = useRouter();
  const [businesses] = useState(BUSINESSES);

  return (
    <div className="q-page-shell">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 className="q-page-title">My Businesses</h1>
          <p className="q-page-subtitle">Manage all your businesses from one place</p>
        </div>
        <button
          className="q-btn q-btn-primary q-btn-sm"
          onClick={() => router.push("/onboarding")}
          style={{ gap: 6 }}
        >
          <Plus size={15} /> Add Business
        </button>
      </div>

      {/* ── Active Businesses ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Active Businesses</h2>
          <span className="q-badge q-badge-neutral">{businesses.length}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
          {businesses.map(biz => (
            <BusinessCard key={biz.id} biz={biz} onSelect={() => router.push("/dashboard")} router={router} />
          ))}

          {/* Add New Business Card */}
          <button
            onClick={() => router.push("/onboarding")}
            style={{
              padding: 24, borderRadius: 16, border: "2px dashed var(--q-border)",
              background: "transparent", cursor: "pointer", fontFamily: "inherit",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 14, minHeight: 280, transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.background = "#EFF6FF"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--q-border)"; e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--q-surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={24} color="var(--q-text-4)" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--q-text-2)", marginBottom: 6 }}>Add New Business</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--q-text-4)" }}>Validate a new idea or analyze an existing business</div>
            </div>
          </button>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="q-card" style={{ padding: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: 20 }}>Portfolio Overview</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
          {[
            { label: "Total Businesses",       value: "1",       icon: Building2,   color: "#2563EB" },
            { label: "Combined Revenue",        value: "₹12.4L",  icon: DollarSign,  color: "#059669" },
            { label: "Total Customers",         value: "8,420",   icon: Users,       color: "#7C3AED" },
            { label: "Avg Business Health",     value: "82",      icon: Activity,    color: "#D97706" },
            { label: "AI Credits Used",         value: "124",     icon: Sparkles,    color: "#8B1A1A" },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: "center", padding: "16px 12px", background: "var(--q-surface-2)", borderRadius: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: stat.color + "18", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                <stat.icon size={15} style={{ color: stat.color }} />
              </div>
              <div style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--q-text-1)", marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--q-text-4)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
