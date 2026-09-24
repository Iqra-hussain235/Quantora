"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Mail, Phone, Building2, Globe, Edit3, Lock, Shield,
  Camera, Star, CreditCard, Calendar, CheckCircle, TrendingUp
} from "lucide-react";

const ACTIVITY = [
  { action: "AI analysis run",           time: "2 hours ago",   icon: "🤖" },
  { action: "Retention campaign created", time: "Yesterday",     icon: "🎯" },
  { action: "Monthly report generated",  time: "Sep 10",         icon: "📄" },
  { action: "Business data uploaded",    time: "Sep 5",          icon: "📊" },
  { action: "Account created",           time: "Aug 28",         icon: "✅" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "Iqra Hussain",
    email: "iqra@novamart.com",
    phone: "+92 321 0000000",
    company: "NovaMart",
    website: "https://novamart.com",
    bio: "E-commerce entrepreneur focused on data-driven growth. Using Quantora to make smarter business decisions.",
    role: "Founder & CEO",
    timezone: "Asia/Karachi",
  });

  const save = (e) => {
    e.preventDefault();
    setEditing(false);
  };

  return (
    <div className="q-page-shell">
      <div className="q-page-header">
        <h1 className="q-page-title">My Profile</h1>
        <p className="q-page-subtitle">Manage your personal information and account preferences</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>
        {/* ── Left: Avatar + Plan + Activity ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Avatar Card */}
          <div className="q-card" style={{ padding: 28, textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block", marginBottom: 18 }}>
              <div className="q-avatar" style={{ width: 88, height: 88, fontSize: "2rem", margin: "0 auto", background: "linear-gradient(135deg, #8B1A1A, #C0392B)" }}>
                IH
              </div>
              <button style={{
                position: "absolute", bottom: 0, right: 0,
                width: 28, height: 28, borderRadius: "50%",
                background: "var(--q-blue)", border: "2px solid var(--q-surface)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>
                <Camera size={13} color="#fff" />
              </button>
            </div>
            <h2 style={{ fontWeight: 700, fontSize: "1.125rem", marginBottom: 4 }}>{form.name}</h2>
            <p style={{ fontSize: "0.875rem", color: "var(--q-text-3)", marginBottom: 6 }}>{form.role}</p>
            <p style={{ fontSize: "0.8125rem", color: "var(--q-text-4)", marginBottom: 18 }}>{form.company}</p>

            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 20 }}>
              {[{ n: "1", l: "Business" }, { n: "14", l: "Reports" }, { n: "28", l: "Actions" }].map(s => (
                <div key={s.l} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--q-text-1)" }}>{s.n}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--q-text-4)" }}>{s.l}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className={`q-btn q-btn-sm ${editing ? "q-btn-outline" : "q-btn-primary"}`}
              style={{ width: "100%", gap: 6 }}
            >
              <Edit3 size={14} /> {editing ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>

          {/* Subscription Card */}
          <div className="q-card" style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CreditCard size={16} color="#2563EB" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Subscription</h3>
            </div>

            <div style={{ padding: "14px 16px", background: "linear-gradient(135deg, #1D4ED8, #2563EB)", borderRadius: 10, color: "#fff", marginBottom: 14 }}>
              <div style={{ fontSize: "0.75rem", opacity: 0.8, marginBottom: 4 }}>Current Plan</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 8 }}>PRO</div>
              <div style={{ fontSize: "0.8125rem", opacity: 0.9 }}>Renews October 13, 2026</div>
            </div>

            {[
              { label: "AI Credits Used", value: "1,240 / 5,000", pct: 25, color: "#2563EB" },
              { label: "Businesses",       value: "1 / 5",         pct: 20, color: "#059669" },
              { label: "Reports",          value: "14 / 50",       pct: 28, color: "#7C3AED" },
            ].map(u => (
              <div key={u.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--q-text-3)" }}>{u.label}</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--q-text-1)" }}>{u.value}</span>
                </div>
                <div className="q-progress-track" style={{ height: 5 }}>
                  <div style={{ height: "100%", width: `${u.pct}%`, background: u.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}

            <button className="q-btn q-btn-outline q-btn-sm" style={{ width: "100%", gap: 6, marginTop: 6 }} onClick={() => router.push("/upgrade")}>
              <TrendingUp size={13} /> Upgrade Plan
            </button>
          </div>

          {/* Recent Activity */}
          <div className="q-card" style={{ padding: 22 }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: 16 }}>Recent Activity</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: "1rem", flexShrink: 0 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--q-text-1)", fontWeight: 500 }}>{a.action}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--q-text-4)", marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Profile Form ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Personal Info */}
          <div className="q-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>Personal Information</h3>
              {editing ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="q-btn q-btn-outline q-btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                  <button className="q-btn q-btn-primary q-btn-sm" onClick={save} style={{ gap: 5 }}>
                    <CheckCircle size={13} /> Save Changes
                  </button>
                </div>
              ) : (
                <button className="q-btn q-btn-ghost q-btn-sm" onClick={() => setEditing(true)} style={{ gap: 5 }}>
                  <Edit3 size={13} /> Edit
                </button>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { label: "Full Name",    key: "name",    icon: User,      type: "text" },
                { label: "Email",        key: "email",   icon: Mail,      type: "email" },
                { label: "Phone",        key: "phone",   icon: Phone,     type: "tel" },
                { label: "Company",      key: "company", icon: Building2, type: "text" },
                { label: "Website",      key: "website", icon: Globe,     type: "url" },
                { label: "Role",         key: "role",    icon: Star,      type: "text" },
              ].map(({ label, key, icon: Icon, type }) => (
                <div key={key} className="q-form-group">
                  <label className="q-label">
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Icon size={13} style={{ color: "var(--q-text-4)" }} /> {label}
                    </span>
                  </label>
                  {editing ? (
                    <input
                      type={type}
                      className="q-input"
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    />
                  ) : (
                    <div style={{ fontSize: "0.9375rem", color: "var(--q-text-1)", fontWeight: 500, padding: "9px 0", borderBottom: "1px solid var(--q-border-subtle)" }}>
                      {form[key] || <span style={{ color: "var(--q-text-4)" }}>Not set</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bio */}
            <div className="q-form-group" style={{ marginTop: 20 }}>
              <label className="q-label">Bio</label>
              {editing ? (
                <textarea
                  className="q-input"
                  rows={3}
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  style={{ resize: "vertical" }}
                />
              ) : (
                <p style={{ fontSize: "0.9375rem", color: "var(--q-text-2)", lineHeight: 1.7 }}>{form.bio}</p>
              )}
            </div>

            {/* Member Since */}
            <div style={{ marginTop: 24, padding: "14px 16px", background: "var(--q-surface-2)", borderRadius: 10, display: "flex", gap: 12, alignItems: "center" }}>
              <Calendar size={16} color="var(--q-text-4)" />
              <span style={{ fontSize: "0.875rem", color: "var(--q-text-3)" }}>
                Member since <strong style={{ color: "var(--q-text-1)" }}>August 28, 2026</strong> · 16 days active
              </span>
            </div>
          </div>

          {/* Security Card */}
          <div className="q-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={16} color="#059669" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>Security</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Password", value: "Last changed Aug 28, 2026", icon: Lock, action: "Change Password" },
                { label: "Two-Factor Authentication", value: "Not enabled", icon: Shield, action: "Enable 2FA", warning: true },
                { label: "Active Sessions", value: "1 active session (this device)", icon: CheckCircle, action: "Manage" },
              ].map(sec => (
                <div key={sec.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "var(--q-surface-2)", borderRadius: 10 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <sec.icon size={15} style={{ color: sec.warning ? "#DC2626" : "var(--q-text-3)", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--q-text-1)" }}>{sec.label}</div>
                      <div style={{ fontSize: "0.8125rem", color: sec.warning ? "#DC2626" : "var(--q-text-4)", marginTop: 2 }}>{sec.value}</div>
                    </div>
                  </div>
                  <button className="q-btn q-btn-outline q-btn-sm" onClick={() => router.push("/settings")}>
                    {sec.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
