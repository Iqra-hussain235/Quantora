"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Download, Share2, RefreshCw, Plus, Clock, CheckCircle, AlertCircle, Loader } from "lucide-react";

const REPORTS = [
  { id: 1, title: "September 2026 — Monthly Business Review", type: "Monthly Review",   status: "Ready",      date: "Sep 30, 2026", pages: 18, size: "2.4 MB" },
  { id: 2, title: "Q3 2026 — Quarterly Business Review",      type: "Quarterly Review", status: "Ready",      date: "Sep 30, 2026", pages: 34, size: "5.1 MB" },
  { id: 3, title: "September 2026 — AI Insights Report",      type: "AI Insights",      status: "Ready",      date: "Sep 28, 2026", pages: 12, size: "1.8 MB" },
  { id: 4, title: "September 2026 — Customer Intelligence",   type: "Customer Report",  status: "Ready",      date: "Sep 27, 2026", pages: 22, size: "3.2 MB" },
  { id: 5, title: "October 2026 — Risk Assessment Report",    type: "Risk Report",      status: "Generating", date: "Oct 1, 2026",  pages: null, size: null },
  { id: 6, title: "NovaMart Investor Readiness Report",       type: "Investor Report",  status: "Draft",      date: "Sep 25, 2026", pages: 28, size: null },
];

const REPORT_TYPES = [
  { icon: "📊", label: "Monthly Review",   desc: "Full business performance review" },
  { icon: "📈", label: "Quarterly Review", desc: "Comprehensive Q/Q analysis" },
  { icon: "🤖", label: "AI Insights",      desc: "AI-detected patterns and recommendations" },
  { icon: "👥", label: "Customer Report",  desc: "Customer intelligence and segmentation" },
  { icon: "⚠️", label: "Risk Report",     desc: "Risk assessment and mitigation" },
  { icon: "💼", label: "Investor Report",  desc: "Investor-ready business summary" },
];

const STATUS_META = {
  Ready:      { icon: CheckCircle, color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", label: "Ready" },
  Generating: { icon: Loader,      color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", label: "Generating" },
  Draft:      { icon: AlertCircle, color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", label: "Draft" },
  Failed:     { icon: AlertCircle, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", label: "Failed" },
};

export default function ReportsPage() {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setGenerating(false);
    alert("Report generation started. It will be ready in a few minutes.");
  };

  return (
    <div className="q-page-shell">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 className="q-page-title">Reports</h1>
          <p className="q-page-subtitle">Generate, view, and share business reports · NovaMart</p>
        </div>
        <button onClick={generate} disabled={generating} className="q-btn q-btn-primary q-btn-sm" style={{ gap: 6 }}>
          {generating ? <><div className="q-spinner" style={{ width: 14, height: 14, borderWidth: 2, borderTopColor: "#fff", borderColor: "rgba(255,255,255,0.3)" }} /> Generating...</> : <><Plus size={15} /> Generate Report</>}
        </button>
      </div>

      {/* Report type cards */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 14 }}>Generate New Report</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
          {REPORT_TYPES.map(({ icon, label, desc }) => (
            <button
              key={label}
              onClick={generate}
              style={{
                background: "var(--q-surface)", border: "1px solid var(--q-border)", borderRadius: 12,
                padding: "16px", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--q-blue)"; e.currentTarget.style.boxShadow = "var(--q-shadow-md)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--q-border)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{icon}</div>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--q-text-1)", marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--q-text-4)" }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Report list */}
      <div className="q-card">
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--q-border)" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem" }}>Your Reports</h2>
        </div>
        <div>
          {REPORTS.map((report, i) => {
            const meta = STATUS_META[report.status];
            const StatusIcon = meta.icon;
            return (
              <div key={report.id} style={{ padding: "16px 24px", borderBottom: i < REPORTS.length - 1 ? "1px solid var(--q-border-subtle)" : "none", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--q-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileText size={18} color="var(--q-text-3)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--q-text-1)", marginBottom: 4 }}>{report.title}</div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <span className="q-badge q-badge-neutral">{report.type}</span>
                    <span style={{ fontSize: "0.8125rem", color: "var(--q-text-4)" }}>{report.date}</span>
                    {report.pages && <span style={{ fontSize: "0.8125rem", color: "var(--q-text-4)" }}>{report.pages} pages</span>}
                    {report.size && <span style={{ fontSize: "0.8125rem", color: "var(--q-text-4)" }}>{report.size}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: meta.color, padding: "3px 10px", borderRadius: 100, background: meta.bg, border: `1px solid ${meta.border}`, display: "flex", alignItems: "center", gap: 5 }}>
                    <StatusIcon size={12} className={report.status === "Generating" ? "q-pulse" : ""} />
                    {meta.label}
                  </span>
                  {report.status === "Ready" && (
                    <>
                      <button className="q-btn q-btn-ghost q-btn-sm q-btn-icon" title="Download"><Download size={15} /></button>
                      <button className="q-btn q-btn-ghost q-btn-sm q-btn-icon" title="Share"><Share2 size={15} /></button>
                      <button className="q-btn q-btn-ghost q-btn-sm q-btn-icon" title="Regenerate"><RefreshCw size={15} /></button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
