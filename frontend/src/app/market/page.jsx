"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Globe, TrendingUp, BarChart2, Users, Target,
  Bot
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell
} from "recharts";

const COMPETITORS = [
  {
    name: "FitLife Pro",   market: "30%", pricing: "₹4,999–₹18,999", focus: "Premium Wearables",
    strengths: ["Brand recognition", "App ecosystem"],
    weaknesses: ["High price point", "Limited customization"],
    threat: "HIGH", score: 82,
  },
  {
    name: "NovaMart (You)", market: "18%", pricing: "₹2,999–₹12,999", focus: "Value + Customization",
    strengths: ["Price-value ratio", "Customer service", "Customization"],
    weaknesses: ["Lower brand awareness", "Smaller catalog"],
    threat: null, score: 71,
  },
  {
    name: "ActiveZone",    market: "22%", pricing: "₹3,499–₹14,999", focus: "Mass Market",
    strengths: ["Distribution", "Variety"],
    weaknesses: ["Average quality", "No premium tier"],
    threat: "MEDIUM", score: 68,
  },
  {
    name: "PureTrack",     market: "12%", pricing: "₹1,499–₹7,999", focus: "Budget",
    strengths: ["Lowest price", "Wide availability"],
    weaknesses: ["Quality issues", "Poor retention"],
    threat: "LOW", score: 51,
  },
  {
    name: "EliteWear",     market: "8%",  pricing: "₹8,999–₹24,999", focus: "Ultra Premium",
    strengths: ["Premium brand", "Loyal niche"],
    weaknesses: ["Very niche", "Small market"],
    threat: "LOW", score: 74,
  },
];

const MARKET_DATA = [
  { year: "2023", size: 8200 },
  { year: "2024", size: 10800 },
  { year: "2025", size: 14200 },
  { year: "2026", size: 18400 },
  { year: "2027E", size: 23800 },
  { year: "2028E", size: 29600 },
];

const RADAR_DATA = [
  { subject: "Price",       You: 88, Leader: 42 },
  { subject: "Quality",     You: 72, Leader: 90 },
  { subject: "Brand",       You: 54, Leader: 92 },
  { subject: "Distribution",You: 61, Leader: 84 },
  { subject: "UX/App",      You: 68, Leader: 88 },
  { subject: "Support",     You: 85, Leader: 70 },
  { subject: "Customization",You: 91, Leader: 45 },
];

const TRENDS = [
  { icon: "📱", trend: "Wearable health tracking demand +34% YoY", sentiment: "positive" },
  { icon: "🌿", trend: "Eco-friendly product lines growing 52% in target demographic", sentiment: "positive" },
  { icon: "💳", trend: "BNPL (Buy Now Pay Later) adoption increasing checkout rates 18%", sentiment: "positive" },
  { icon: "⚡", trend: "Same-day delivery now expected by 42% of online shoppers", sentiment: "warning" },
  { icon: "🤖", trend: "AI-personalized recommendations driving 2.8x higher conversion", sentiment: "positive" },
  { icon: "🏷️", trend: "Value-consciousness increasing post-inflation — price sensitivity up 21%", sentiment: "warning" },
];

export default function MarketPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  return (
    <div className="q-page-shell">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h1 className="q-page-title">Market Intelligence</h1>
            <span className="q-badge q-badge-info">Updated Sep 2026</span>
          </div>
          <p className="q-page-subtitle">Market size, trends, competitor analysis, and strategic positioning · Wearables & Fitness India</p>
        </div>
        <button className="q-btn q-btn-primary q-btn-sm" onClick={() => router.push("/ai-doctor")} style={{ gap: 5 }}>
          <Bot size={14} /> Ask AI About Market
        </button>
      </div>

      {/* ── Market KPIs ── */}
      <div className="q-kpi-grid" style={{ marginBottom: 28 }}>
        {[
          { label: "Total Addressable Market", value: "₹184 Cr", delta: "+18.4%", up: true, icon: Globe,    color: "#2563EB" },
          { label: "Your Market Share",         value: "18%",     delta: "+2.1%",  up: true, icon: Target,   color: "#059669" },
          { label: "Competitors Tracked",       value: "4",       delta: "Active", up: true, icon: Users,    color: "#7C3AED" },
          { label: "Market Growth Rate",        value: "+29.3%",  delta: "YoY",    up: true, icon: TrendingUp,color: "#D97706" },
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
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Market Size Chart */}
        <div className="q-card" style={{ padding: 0 }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--q-border)" }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Market Size Growth (₹ Cr)</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--q-text-3)", marginTop: 3 }}>India Wearables & Fitness Tech · 2023–2028E</p>
          </div>
          <div style={{ padding: "20px 22px 12px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MARKET_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--q-border)" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "var(--q-text-4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--q-text-4)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}Cr`} width={65} />
                <Tooltip formatter={v => [`₹${v} Cr`]} contentStyle={{ borderRadius: 8, border: "1px solid var(--q-border)", fontSize: 12 }} />
                <Bar dataKey="size" name="Market Size" radius={[4, 4, 0, 0]} barSize={32}>
                  {MARKET_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.year.includes("E") ? "#93C5FD" : "#2563EB"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p style={{ fontSize: "0.75rem", color: "var(--q-text-4)", textAlign: "center", marginTop: 4 }}>Bars in blue = actual · Light blue = estimated</p>
          </div>
        </div>

        {/* Competitive Radar */}
        <div className="q-card" style={{ padding: 0 }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--q-border)" }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Competitive Position</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--q-text-3)", marginTop: 3 }}>You vs Market Leader (FitLife Pro)</p>
          </div>
          <div style={{ padding: "16px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="var(--q-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "var(--q-text-3)" }} />
                <PolarRadiusAxis tick={{ fontSize: 8, fill: "var(--q-text-4)" }} domain={[0, 100]} />
                <Radar name="NovaMart" dataKey="You" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} />
                <Radar name="FitLife Pro" dataKey="Leader" stroke="#DC2626" fill="#DC2626" fillOpacity={0.1} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--q-border)", fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 3, background: "#2563EB", borderRadius: 2, display: "inline-block" }} /><span style={{ fontSize: "0.75rem", color: "var(--q-text-3)" }}>NovaMart</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 3, background: "#DC2626", borderRadius: 2, display: "inline-block" }} /><span style={{ fontSize: "0.75rem", color: "var(--q-text-3)" }}>FitLife Pro</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Strategic Insight ── */}
      <div style={{ padding: "16px 20px", background: "#EFF6FF", borderRadius: 12, border: "1px solid #BFDBFE", marginBottom: 28, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <Bot size={20} color="#2563EB" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 700, color: "#1D4ED8", fontSize: "0.9375rem", marginBottom: 6 }}>AI Strategic Insight</div>
          <p style={{ fontSize: "0.875rem", color: "#1D4ED8", lineHeight: 1.7 }}>
            FitLife Pro is the market leader but is significantly more expensive and less customizable. 
            <strong> Your strongest competitive advantages are price-value ratio and customer customization (scores: 88 and 91).</strong> 
            Opportunity: target FitLife Pro's price-sensitive customers with a "Premium Quality, Better Price" campaign. 
            The eco-friendly trend (+52%) aligns well with your EcoStrap product — consider expanding this line aggressively.
          </p>
        </div>
        <button className="q-btn q-btn-sm q-btn-outline" style={{ flexShrink: 0 }} onClick={() => router.push("/simulator")}>Simulate</button>
      </div>

      {/* ── Competitor Table ── */}
      <div className="q-card" style={{ marginBottom: 28 }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--q-border)" }}>
          <h3 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Competitor Analysis</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="q-table">
            <thead>
              <tr>
                <th>Competitor</th>
                <th>Market Share</th>
                <th>Pricing</th>
                <th>Focus</th>
                <th>Strengths</th>
                <th>Weaknesses</th>
                <th>Threat</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITORS.map(c => (
                <tr key={c.name} style={{ background: c.name.includes("NovaMart") ? "#EFF6FF" : undefined }}>
                  <td>
                    <div style={{ fontWeight: 600, color: c.name.includes("NovaMart") ? "#2563EB" : "var(--q-text-1)", fontSize: "0.875rem" }}>
                      {c.name.includes("NovaMart") ? "⭐ " : ""}{c.name}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="q-progress-track" style={{ width: 50, height: 5 }}>
                        <div style={{ height: "100%", width: `${parseInt(c.market)}%`, background: c.name.includes("NovaMart") ? "#2563EB" : "var(--q-text-3)", borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{c.market}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: "0.8125rem" }}>{c.pricing}</td>
                  <td><span className="q-badge q-badge-neutral" style={{ fontSize: "0.72rem" }}>{c.focus}</span></td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {c.strengths.map(s => <span key={s} style={{ fontSize: "0.75rem", color: "#059669" }}>✓ {s}</span>)}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {c.weaknesses.map(w => <span key={w} style={{ fontSize: "0.75rem", color: "#DC2626" }}>✗ {w}</span>)}
                    </div>
                  </td>
                  <td>
                    {c.threat ? (
                      <span className={`q-badge ${c.threat === "HIGH" ? "q-badge-danger" : c.threat === "MEDIUM" ? "q-badge-warning" : "q-badge-neutral"}`}>
                        {c.threat}
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.8125rem", color: "#2563EB", fontWeight: 600 }}>You</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="q-progress-track" style={{ width: 40, height: 5 }}>
                        <div style={{ height: "100%", width: `${c.score}%`, background: c.score >= 75 ? "#059669" : c.score >= 60 ? "#D97706" : "#DC2626", borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: "0.875rem", fontWeight: 700 }}>{c.score}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Market Trends ── */}
      <div className="q-card" style={{ padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <TrendingUp size={17} color="#059669" />
          <h3 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Market Trends</h3>
          <span className="q-badge q-badge-success">6 Active Trends</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {TRENDS.map((t, i) => (
            <div key={i} style={{
              padding: "14px 16px", borderRadius: 10,
              background: t.sentiment === "positive" ? "#ECFDF5" : "#FFFBEB",
              border: `1px solid ${t.sentiment === "positive" ? "#A7F3D0" : "#FDE68A"}`,
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{t.icon}</span>
              <p style={{ fontSize: "0.875rem", color: t.sentiment === "positive" ? "#065F46" : "#92400E", lineHeight: 1.6 }}>{t.trend}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
