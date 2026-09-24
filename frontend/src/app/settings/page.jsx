"use client";
import { useState } from "react";
import { User, Lock, Bell, Building2, Users, CreditCard, Bot, Database, Plug, ChevronRight, Save, Eye, EyeOff } from "lucide-react";

const TABS = [
  { id: "account",       icon: User,      label: "Account" },
  { id: "security",      icon: Lock,      label: "Security" },
  { id: "notifications", icon: Bell,      label: "Notifications" },
  { id: "organization",  icon: Building2, label: "Organization" },
  { id: "team",          icon: Users,     label: "Team" },
  { id: "subscription",  icon: CreditCard,label: "Subscription" },
  { id: "ai",            icon: Bot,       label: "AI Preferences" },
  { id: "data",          icon: Database,  label: "Data & Privacy" },
  { id: "integrations",  icon: Plug,      label: "Integrations" },
];

function SaveBtn({ loading }) {
  return (
    <button className={`q-btn ${loading ? "q-btn-outline" : "q-btn-blue"} q-btn-sm`} style={{ gap: 6 }}>
      {loading ? <><div className="q-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving...</> : <><Save size={14} /> Save Changes</>}
    </button>
  );
}

function FieldRow({ label, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24, paddingBottom: 20, borderBottom: "1px solid var(--q-border-subtle)", marginBottom: 20 }}>
      <div>
        <div style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--q-text-2)", marginBottom: 2 }}>{label}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function SectionHeader({ title, desc, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <h3 style={{ fontWeight: 700, fontSize: "1.0625rem", marginBottom: 4 }}>{title}</h3>
        {desc && <p style={{ fontSize: "0.875rem", color: "var(--q-text-3)" }}>{desc}</p>}
      </div>
      {action}
    </div>
  );
}

function AccountTab() {
  const [name, setName]   = useState("Iqra Hussain");
  const [email, setEmail] = useState("iqra@novamart.com");
  const [phone, setPhone] = useState("+92 300 1234567");
  const [tz, setTz]       = useState("Asia/Karachi");

  return (
    <div>
      <SectionHeader title="Account Settings" desc="Manage your personal information and preferences" />
      <FieldRow label="Full Name">
        <input className="q-input" value={name} onChange={e => setName(e.target.value)} style={{ maxWidth: 340 }} />
      </FieldRow>
      <FieldRow label="Email Address">
        <input className="q-input" type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ maxWidth: 340 }} />
        <span className="q-badge q-badge-success" style={{ marginTop: 8, display: "inline-flex" }}>Verified</span>
      </FieldRow>
      <FieldRow label="Phone Number">
        <input className="q-input" value={phone} onChange={e => setPhone(e.target.value)} style={{ maxWidth: 240 }} />
      </FieldRow>
      <FieldRow label="Timezone">
        <select className="q-input" value={tz} onChange={e => setTz(e.target.value)} style={{ maxWidth: 280 }}>
          <option value="Asia/Karachi">Asia/Karachi (PKT +5:00)</option>
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="Europe/London">London (GMT)</option>
        </select>
      </FieldRow>
      <SaveBtn />
    </div>
  );
}

function NotifTab() {
  const [prefs, setPrefs] = useState({
    riskAlerts: true, opportunities: true, weeklyReport: true,
    aiInsights: true, emailNotifs: true, revenueAlerts: false,
  });
  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  const items = [
    { key: "emailNotifs",  label: "Email Notifications",    desc: "Receive all notifications via email" },
    { key: "riskAlerts",   label: "Risk Alerts",            desc: "Notify when new risks are detected" },
    { key: "opportunities",label: "Opportunity Alerts",     desc: "Notify when new opportunities are found" },
    { key: "revenueAlerts",label: "Revenue Alerts",         desc: "Alert when revenue changes significantly" },
    { key: "weeklyReport", label: "Weekly Business Brief",  desc: "Send weekly summary every Monday" },
    { key: "aiInsights",   label: "AI Insights Digest",     desc: "Daily AI insights summary" },
  ];

  return (
    <div>
      <SectionHeader title="Notification Preferences" desc="Control which alerts and digests you receive" />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map(({ key, label, desc }) => (
          <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "var(--q-surface-2)", borderRadius: 10 }}>
            <div>
              <div style={{ fontWeight: 500, fontSize: "0.9375rem", color: "var(--q-text-1)" }}>{label}</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--q-text-4)", marginTop: 2 }}>{desc}</div>
            </div>
            <label style={{ position: "relative", display: "inline-block", width: 44, height: 24, flexShrink: 0 }}>
              <input type="checkbox" checked={prefs[key]} onChange={() => toggle(key)} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{
                position: "absolute", inset: 0, borderRadius: 12, cursor: "pointer",
                background: prefs[key] ? "#2563EB" : "var(--q-surface-3)", transition: "background 0.2s",
              }}>
                <span style={{
                  position: "absolute", top: 3, left: prefs[key] ? 23 : 3, width: 18, height: 18,
                  borderRadius: "50%", background: "#fff", transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </span>
            </label>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20 }}><SaveBtn /></div>
    </div>
  );
}

function SubscriptionTab() {
  return (
    <div>
      <SectionHeader title="Subscription & Billing" desc="Manage your Quantora plan and usage" />
      <div style={{ padding: 24, background: "linear-gradient(135deg,#1e3a5f,#0f1f3d)", borderRadius: 16, marginBottom: 24, color: "#fff" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, marginBottom: 12 }}>Current Plan</div>
        <div style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 4 }}>Free Plan</div>
        <div style={{ opacity: 0.6, fontSize: "0.9rem", marginBottom: 20 }}>1 business · Basic analytics · 10 AI credits/month</div>
        <button className="q-btn" style={{ background: "#8B1A1A", color: "#fff", gap: 6 }}>Upgrade to Pro — ₹2,999/mo</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
        {[
          { label: "AI Credits Used",      value: "7 / 10",   bar: 70 },
          { label: "Businesses",           value: "1 / 1",    bar: 100 },
          { label: "Storage Used",         value: "120 MB",   bar: 12 },
        ].map(({ label, value, bar }) => (
          <div key={label} className="q-card" style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--q-text-4)", marginBottom: 8 }}>{label}</div>
            <div style={{ fontWeight: 700, fontSize: "1.25rem", color: "var(--q-text-1)", marginBottom: 10 }}>{value}</div>
            <div className="q-progress-track" style={{ height: 4 }}>
              <div style={{ height: "100%", width: `${bar}%`, background: bar >= 90 ? "#DC2626" : "#2563EB", borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="q-card" style={{ padding: 20 }}>
        <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Compare Plans</h4>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 12px", background: "var(--q-surface-2)", fontWeight: 600, color: "var(--q-text-3)" }}>Feature</th>
              <th style={{ textAlign: "center", padding: "8px 12px", background: "var(--q-surface-2)", fontWeight: 600, color: "var(--q-text-3)" }}>Free</th>
              <th style={{ textAlign: "center", padding: "8px 12px", background: "#EFF6FF", fontWeight: 700, color: "#2563EB" }}>Pro</th>
              <th style={{ textAlign: "center", padding: "8px 12px", background: "var(--q-surface-2)", fontWeight: 600, color: "var(--q-text-3)" }}>Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Businesses", "1", "5", "Unlimited"],
              ["AI Credits/month", "10", "200", "Unlimited"],
              ["AI Business Doctor", "✓", "✓", "✓"],
              ["Decision Simulator", "—", "✓", "✓"],
              ["Predictions", "—", "✓", "✓"],
              ["Team Members", "1", "5", "Unlimited"],
            ].map(([feat, ...vals]) => (
              <tr key={feat}>
                <td style={{ padding: "10px 12px", color: "var(--q-text-2)", borderBottom: "1px solid var(--q-border-subtle)" }}>{feat}</td>
                {vals.map((v, i) => (
                  <td key={i} style={{ padding: "10px 12px", textAlign: "center", borderBottom: "1px solid var(--q-border-subtle)", color: v === "—" ? "var(--q-text-4)" : "var(--q-text-1)", background: i === 1 ? "#EFF6FF22" : "none", fontWeight: i === 1 ? 600 : 400 }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState("account");

  const renderContent = () => {
    switch (tab) {
      case "account":       return <AccountTab />;
      case "notifications": return <NotifTab />;
      case "subscription":  return <SubscriptionTab />;
      default:
        return (
          <div className="q-empty">
            <div className="q-empty-icon">⚙️</div>
            <div className="q-empty-title">{TABS.find(t => t.id === tab)?.label} Settings</div>
            <div className="q-empty-desc">This settings section is coming soon. Check back in a future update.</div>
          </div>
        );
    }
  };

  return (
    <div className="q-page-shell">
      <div style={{ marginBottom: 28 }}>
        <h1 className="q-page-title">Settings</h1>
        <p className="q-page-subtitle">Manage your account, preferences, team, and subscription</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, alignItems: "flex-start" }}>
        {/* Tab list */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {TABS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 8, border: "none",
                background: tab === id ? "#EFF6FF" : "transparent",
                color: tab === id ? "#2563EB" : "var(--q-text-3)",
                fontWeight: tab === id ? 600 : 500, fontSize: "0.9rem",
                cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <Icon size={16} />
              {label}
              {tab === id && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="q-card" style={{ padding: 28 }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
