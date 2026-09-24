"use client";
import { useState } from "react";
import { Bell, AlertTriangle, TrendingUp, Lightbulb, FileText, Check, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

const NOTIFS = [
  { id: 1, type: "risk",        icon: AlertTriangle, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", title: "Customer Churn Risk Elevated",   body: "High-value customer churn probability increased to 68%. 43 customers at risk. Revenue exposure: ₹6.2L.", time: "2 hours ago",    read: false },
  { id: 2, type: "opportunity", icon: Lightbulb,     color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", title: "New Opportunity Detected",        body: "Upsell opportunity identified in top-customer segment. Estimated value: ₹2.8L/month.", time: "4 hours ago",    read: false },
  { id: 3, type: "revenue",     icon: TrendingUp,    color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", title: "Revenue Trend Alert",             body: "Revenue declined 8.4% over the last 14 days. This may require immediate attention.", time: "Yesterday",       read: false },
  { id: 4, type: "report",      icon: FileText,      color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", title: "Monthly Report Ready",           body: "Your September 2026 Monthly Business Review has been generated and is ready to view.", time: "Yesterday",       read: true },
  { id: 5, type: "ai",          icon: Bell,          color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", title: "AI Insight: Marketing ROI Drop", body: "AI detected that your marketing ROI dropped from 4.2x to 3.1x. Cause identified: budget allocation mismatch.", time: "2 days ago",     read: true },
  { id: 6, type: "risk",        icon: AlertTriangle, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", title: "Product D Demand Declining",      body: "Product D revenue declined 18% over 3 months. Consider pricing or product refresh.", time: "3 days ago",     read: true },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifs, setNotifs] = useState(NOTIFS);
  const [filter, setFilter] = useState("All");

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead    = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const unread = notifs.filter(n => !n.read).length;
  const filtered = filter === "All" ? notifs : notifs.filter(n => n.type === filter.toLowerCase());

  return (
    <div className="q-page-shell" style={{ maxWidth: 800 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h1 className="q-page-title">Notifications</h1>
            {unread > 0 && <span className="q-badge q-badge-danger">{unread} new</span>}
          </div>
          <p className="q-page-subtitle">Alerts, opportunities, and AI insights for NovaMart</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {unread > 0 && <button onClick={markAllRead} className="q-btn q-btn-outline q-btn-sm" style={{ gap: 5 }}><Check size={14} /> Mark all read</button>}
          <button onClick={() => router.push("/settings")} className="q-btn q-btn-ghost q-btn-sm" style={{ gap: 5 }}><Settings size={14} /> Preferences</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["All", "Risk", "Opportunity", "Revenue", "Report", "AI"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`q-btn q-btn-sm ${filter === f ? "q-btn-blue" : "q-btn-outline"}`}>{f}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(notif => {
          const { icon: Icon, color, bg, border, title, body, time, read } = notif;
          return (
            <div
              key={notif.id}
              style={{
                padding: "16px 20px", borderRadius: 12, border: `1px solid ${read ? "var(--q-border)" : border}`,
                background: read ? "var(--q-surface)" : bg, cursor: "pointer", transition: "all 0.2s",
                display: "flex", gap: 14, alignItems: "flex-start", position: "relative",
              }}
              onClick={() => markRead(notif.id)}
            >
              {!read && <div style={{ position: "absolute", top: 18, right: 18, width: 8, height: 8, borderRadius: "50%", background: "#DC2626" }} />}
              <div style={{ width: 36, height: 36, borderRadius: 8, background: color + (read ? "15" : "25"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={17} style={{ color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: read ? 500 : 700, fontSize: "0.9375rem", color: "var(--q-text-1)", marginBottom: 5 }}>{title}</div>
                <p style={{ fontSize: "0.875rem", color: "var(--q-text-3)", lineHeight: 1.6, marginBottom: 6 }}>{body}</p>
                <span style={{ fontSize: "0.75rem", color: "var(--q-text-4)" }}>{time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
