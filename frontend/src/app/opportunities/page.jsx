"use client";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/context/BusinessContext";
import { Lightbulb, Target, ArrowRight, Shuffle, Plus } from "lucide-react";
import { useState } from "react";

function InsufficientData({ router }) {
  return (
    <div className="q-page-shell">
      <h1 className="q-page-title">Opportunity Radar</h1>
      <div style={{ maxWidth: 520, margin: "60px auto", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16, opacity: 0.3 }}>🔍</div>
        <h2 style={{ fontWeight: 700, fontSize: "1.375rem", marginBottom: 12 }}>Insufficient data</h2>
        <p style={{ color: "var(--q-text-3)", lineHeight: 1.7, marginBottom: 28 }}>
          Opportunities are detected automatically from your business data. Upload or enter your data first to unlock AI-detected revenue opportunities.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => router.push("/onboarding")} className="q-btn q-btn-primary q-btn-sm" style={{ gap: 6 }}><Plus size={14} /> Add Business Data</button>
          <button onClick={() => router.push("/onboarding")} className="q-btn q-btn-outline q-btn-sm">🎮 Explore Demo</button>
        </div>
      </div>
    </div>
  );
}

const DEMO_OPPS = [
  { id: 1, title: "Upsell to High-Value Customer Segment", category: "Revenue",     potential: "₹2.8L/month", cost: "₹18K", roi: "15.6x", time: "21 days", confidence: 81, evidence: "Top 12% of customers show high purchase frequency but are not offered premium bundles.", how: "Create a premium bundle offer for customers with LTV > ₹12K." },
  { id: 2, title: "Expand Product C Across All Channels",  category: "Growth",      potential: "₹1.6L/month", cost: "₹8K",  roi: "20.0x", time: "14 days", confidence: 77, evidence: "Product C has the highest margin (50%) and fastest growth (+41%). Only on 2 of 5 channels.", how: "List Product C on all available channels. Allocate 15% of budget for campaigns." },
  { id: 3, title: "Launch Customer Referral Program",       category: "Acquisition", potential: "₹1.2L/month", cost: "₹22K", roi: "5.5x",  time: "30 days", confidence: 73, evidence: "17% of new customers come from word-of-mouth. No formal program exists.", how: "Give-₹500/get-₹500 referral program targeting high-NPS customers." },
  { id: 4, title: "Re-engage Lapsed Customers",             category: "Retention",   potential: "₹0.9L/month", cost: "₹12K", roi: "7.5x",  time: "14 days", confidence: 69, evidence: "812 customers who were active 3–6 months ago have not purchased since.", how: "3-touch email sequence with personalized recommendations and 15% discount." },
  { id: 5, title: "Optimize Checkout Conversion",           category: "Sales",       potential: "₹0.7L/month", cost: "₹5K",  roi: "14.0x", time: "7 days",  confidence: 85, evidence: "Cart abandonment rate is 68.4% vs benchmark of 52%.", how: "Add exit-intent popup with 10% discount. Simplify checkout to 2 steps." },
];

function OppCard({ opp, router }) {
  const [showHow, setShowHow] = useState(false);
  return (
    <div className="q-decision-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--q-text-1)", marginBottom: 6 }}>{opp.title}</h3>
          <span className="q-badge q-badge-info">{opp.category}</span>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Lightbulb size={17} color="#2563EB" />
        </div>
      </div>
      <p style={{ fontSize: "0.875rem", color: "var(--q-text-3)", lineHeight: 1.6, marginBottom: 14 }}>{opp.evidence}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
        {[
          { k: "Revenue Potential", v: opp.potential, c: "#059669" },
          { k: "Investment",        v: opp.cost,      c: "var(--q-text-2)" },
          { k: "ROI",               v: opp.roi,       c: "#2563EB" },
          { k: "Time to Impact",    v: opp.time,      c: "var(--q-text-2)" },
        ].map(({ k, v, c }) => (
          <div key={k} style={{ background: "var(--q-surface-2)", borderRadius: 8, padding: "10px" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--q-text-4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{k}</div>
            <div style={{ fontWeight: 700, fontSize: "0.875rem", color: c }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: "0.75rem", color: "var(--q-text-4)" }}>AI Confidence</span>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: opp.confidence >= 80 ? "#059669" : "#D97706" }}>{opp.confidence}%</span>
        </div>
        <div className="q-progress-track">
          <div className="q-progress-fill" style={{ width: `${opp.confidence}%`, background: opp.confidence >= 80 ? "#059669" : "#D97706" }} />
        </div>
      </div>
      {showHow && (
        <div style={{ padding: "12px 14px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, marginBottom: 12 }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#1D4ED8", textTransform: "uppercase", marginBottom: 6 }}>How to Execute</div>
          <p style={{ fontSize: "0.875rem", color: "#1D4ED8", lineHeight: 1.6 }}>{opp.how}</p>
        </div>
      )}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => setShowHow(!showHow)} className="q-btn q-btn-outline q-btn-sm">{showHow ? "Hide" : "How?"}</button>
        <button onClick={() => router.push("/simulator")} className="q-btn q-btn-outline q-btn-sm" style={{ gap: 5 }}><Shuffle size={13} />Simulate</button>
        <button onClick={() => router.push("/actions")} className="q-btn q-btn-blue q-btn-sm" style={{ gap: 5 }}><Target size={13} />Start Action <ArrowRight size={13} /></button>
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  const router = useRouter();
  const { isDemo, hasData, metrics, selected } = useBusiness();

  if (!selected || (!isDemo && !hasData)) return <InsufficientData router={router} />;

  const opps = isDemo ? DEMO_OPPS : (metrics?.opportunities || []);

  return (
    <div className="q-page-shell">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h1 className="q-page-title">Opportunity Radar</h1>
            <span className="q-badge q-badge-info">{opps.length} Found</span>
            {isDemo && <span className="q-badge q-badge-neutral">Demo Data</span>}
          </div>
          <p className="q-page-subtitle">AI-detected revenue opportunities ranked by ROI · {selected?.businessName || selected?.name}</p>
        </div>
        <button onClick={() => router.push("/actions")} className="q-btn q-btn-primary q-btn-sm" style={{ gap: 6 }}>
          <Target size={15} /> Start High-ROI Actions
        </button>
      </div>

      {opps.length === 0 ? (
        <div style={{ padding: "60px 24px", textAlign: "center", background: "var(--q-surface)", border: "1px solid var(--q-border)", borderRadius: 14 }}>
          <div style={{ fontSize: "2.5rem", opacity: 0.3, marginBottom: 14 }}>🔍</div>
          <div style={{ fontWeight: 600, fontSize: "1.0625rem", marginBottom: 6 }}>No opportunities detected yet</div>
          <div style={{ fontSize: "0.875rem", color: "var(--q-text-3)" }}>AI will analyze your data and surface opportunities as more data becomes available.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 }}>
          {opps.map(opp => <OppCard key={opp.id} opp={opp} router={router} />)}
        </div>
      )}
    </div>
  );
}
