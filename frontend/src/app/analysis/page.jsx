"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import { useEffect, useState } from "react";
import cn from "@/lib/cn";
import { useRouter } from "next/navigation";

export default function AnalysisPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("Your Business");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [flow, setFlow] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    const f = localStorage.getItem("flowType");
    setFlow(f);
  }, []);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        if (!flow) return; // wait until flow is initialized
        if (flow === "existing") {
          setError("Existing business selected: go to Dashboard and click 'View' on a business.");
          setLoading(false);
          return;
        }

        const saved = localStorage.getItem("startupIdea");
        if (!saved) {
          setError("No startup data found. Please fill in the idea/business form first.");
          setLoading(false);
          return;
        }

        const { idea, name } = JSON.parse(saved);
        if (name) setBusinessName(name);

        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_BASE}/api/ai/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea }),
        });


        if (!res.ok) {
          // attempt to extract a helpful message from the error body
          let errBody = null;
          try { errBody = await res.json(); } catch (e) { /* ignore */ }
          const errMessage = errBody?.error?.message || errBody?.error || errBody?.message || errBody || `Server error: ${res.status}`;
          throw new Error(errMessage);
        }

        const json = await res.json();
        console.debug("analysis response json:", json);
        let data = json;
        if (json && json.data !== undefined) {
          data = Array.isArray(json.data) ? (json.data[0] ?? json.data) : json.data;
        }
        setAnalysis(data);
      } catch (err) {
        console.error("Error fetching analysis:", err);
        // Network errors in fetch surface as TypeError: Failed to fetch
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        if (err instanceof TypeError && /Failed to fetch/i.test(err.message)) {
          setError(`Cannot reach analysis API at ${API_BASE}. Make sure the backend is running (cd backend && npm run dev).`);
        } else {
          setError(err.message || "Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [flow]);

  // Show upgrade popup after 10 seconds
  useEffect(() => {
    if (!loading && !error) {
      const timer = setTimeout(() => setShowUpgrade(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [loading, error]);

  const [fileData, setFileData] = useState("");

useEffect(() => {
  const saved = localStorage.getItem("analysisResult");

  if (saved) {
    const parsed = JSON.parse(saved);
    setFileData(parsed.extractedData || "");
  }
}, []);

  const score        = analysis?.score?.total ?? 0;
  const grade        = analysis?.score?.grade ?? "—";
  const verdict      = analysis?.score?.verdict ?? "";
  const riskTier     = analysis?.risk?.tier ?? "Unknown";
  const vcScore      = analysis?.vc_readiness?.score ?? 0;
  const vcTier       = analysis?.vc_readiness?.tier ?? "—";
  const clarityScore    = analysis?.nlp?.clarity_score ?? 0;
  const uniquenessScore = analysis?.nlp?.uniqueness_score ?? 0;
  const marketScore     = analysis?.score?.market_opportunity ?? 0;
  const execReadiness   = analysis?.score?.execution_readiness ?? 0;

  const barChartData = [
    { name: "Clarity",     value: clarityScore },
    { name: "Uniqueness",  value: uniquenessScore },
    { name: "Market Opp", value: marketScore },
    { name: "Execution",   value: execReadiness },
    { name: "Competitive", value: analysis?.score?.competitive_position ?? 0 },
  ];

  const radarData = [
    { subject: "Clarity",    A: clarityScore },
    { subject: "Uniqueness", A: uniquenessScore },
    { subject: "Market",     A: marketScore },
    { subject: "Execution",  A: execReadiness },
    { subject: "VC Ready",   A: vcScore },
  ];

  const riskColor =
    riskTier === "Low"    ? "text-green-400"
    : riskTier === "Medium" ? "text-yellow-400"
    : "text-red-400";

  const scoreColor =
    score >= 75 ? "text-green-400"
    : score >= 50 ? "text-yellow-400"
    : "text-red-400";

  // safe className helper to avoid falsey fragments in template strings
  // (imported lazily below where JSX runs)

    

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-5 p-10">
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-lg font-semibold text-white">Analyzing your startup...</p>
          <p className="text-sm text-white/40 mt-1">This may take up to 60 seconds</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4 p-10 text-center">
        <div className="text-5xl">⚠️</div>
        <p className="text-2xl font-bold text-white">Analysis Failed</p>
        <p className="text-white/50 max-w-md">{error}</p>
        {/* <button
          onClick={() => router.push("/business")}
          className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition"
        >
          ← Go back to form
        </button> */}
        <button
  onClick={() => {
    if (flow === "idea") router.push("/idea-flow");
    if(flow ==="business") router.push("/business");
    else if (flow === "existing") router.push("/business-upload");
     className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition"
  }}
>
  ← Back to Form
</button>
      </div>
    );
  }
  

  // ── Result ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              📊 {businessName}
            </h1>
            <p className="text-white/40 text-sm mt-1">AI-powered startup evaluation · {verdict}</p>
          </div>
          <div className={cn("text-4xl font-black flex-shrink-0", scoreColor)}>
            {score.toFixed(1)}
            <span className="text-base font-semibold text-white/30 ml-1">/ 100</span>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="AI Score"         value={`${score.toFixed(1)} (${grade})`} color={scoreColor} />
          <KPICard label="Risk Level"        value={riskTier}                          color={riskColor} />
          <KPICard label="VC Readiness"      value={`${vcScore.toFixed(1)} — ${vcTier}`} color="text-violet-400" />
          <KPICard
            label="Processing Time"
            value={analysis?.processing_time_seconds ? `${analysis.processing_time_seconds}s` : "—"}
            color="text-blue-400"
          />
        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="📊 Score Breakdown">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip
                  formatter={(v) => v.toFixed(1)}
                  contentStyle={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="🕸️ Radar Overview">
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                <Tooltip
                  formatter={(v) => v.toFixed(1)}
                  contentStyle={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* MARKET + COMPETITORS */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="📈 Market Intelligence">
            <dl className="space-y-2 text-sm">
              <InfoRow label="Industry"         value={analysis?.market?.industry} />
              <InfoRow label="Market Size"      value={`$${analysis?.market?.market_size_usd_bn ?? "—"}B`} />
              <InfoRow label="CAGR"             value={`${analysis?.market?.cagr_percent ?? "—"}%`} />
              <InfoRow label="VC Activity"      value={analysis?.market?.vc_activity} />
              <InfoRow label="Investor Interest" value={analysis?.market?.investor_interest} />
            </dl>
            {analysis?.market?.top_trends?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wide mb-2">Top Trends</p>
                <ul className="space-y-1 text-sm text-white/60">
                  {analysis.market.top_trends.map((t, i) => <li key={i}>• {t}</li>)}
                </ul>
              </div>
            )}
          </Card>

          <Card title="🏁 Competition">
            <dl className="space-y-2 text-sm">
              <InfoRow label="Saturation" value={analysis?.competitors?.saturation} />
              <InfoRow label="Intensity"  value={analysis?.competitors?.intensity?.toFixed(1)} />
              <InfoRow label="Direct"     value={analysis?.competitors?.direct_count} />
              <InfoRow label="Indirect"   value={analysis?.competitors?.indirect_count} />
            </dl>
            {analysis?.competitors?.direct_competitors?.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wide">Direct Competitors</p>
                {analysis.competitors.direct_competitors.map((c, i) => (
                  <div key={i} className="border border-white/8 rounded-xl p-3 text-sm">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">{c.name}</span>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full",
                        c.threat_level === "High" ? "bg-red-500/20 text-red-400"
                        : c.threat_level === "Medium" ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                      )}>{c.threat_level} threat</span>
                    </div>
                    <p className="text-white/50 mt-1">{c.differentiator}</p>
                    {c.funding && <p className="text-white/30 text-xs mt-0.5">Funding: {c.funding}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* GROWTH PROJECTIONS */}
        {analysis?.growth && (
          <Card title="🚀 Growth Projections">
            <div className="grid sm:grid-cols-3 gap-4 text-center mb-4">
              {[
                { label: "TAM", value: `$${analysis.growth.tam_usd_bn}B`, color: "text-blue-400" },
                { label: "SAM", value: `$${analysis.growth.sam_usd_bn}B`, color: "text-violet-400" },
                { label: "SOM", value: `$${analysis.growth.som_usd_mn}M`, color: "text-purple-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white/5 rounded-xl p-4 border border-white/8">
                  <p className="text-xs text-white/40 mb-1">{label}</p>
                  <p className={cn("text-2xl font-bold", color)}>{value}</p>
                </div>
              ))}
            </div>
            <dl className="space-y-2 text-sm">
              <InfoRow label="Year 1 Revenue" value={analysis.growth.year_1_revenue} />
              <InfoRow label="Year 3 Revenue" value={analysis.growth.year_3_revenue} />
              <InfoRow label="GTM Strategy"   value={analysis.growth.gtm_strategy} />
            </dl>
            {analysis.growth.recommended_channels?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.growth.recommended_channels.map((ch, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-500/15 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">{ch}</span>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* RISK FACTORS */}
        {analysis?.risk && (
          <Card title="⚠️ Risk Assessment">
            <p className="text-sm text-white/60 mb-3">{analysis.risk.summary}</p>
            {analysis.risk.factors?.length > 0 && (
              <div className="space-y-2">
                {analysis.risk.factors.map((f, i) => (
                  <div key={i} className="border border-white/8 rounded-xl p-3 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{f.category}</span>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full",
                        f.level === "High" ? "bg-red-500/20 text-red-400"
                        : f.level === "Medium" ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                      )}>{f.level}</span>
                    </div>
                    <p className="text-white/50">{f.description}</p>
                    {f.mitigation && <p className="text-white/30 text-xs mt-1">💡 {f.mitigation}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* AI INSIGHTS */}
        <Card title="🤖 AI Insights">
          {analysis?.insights?.one_liner && (
            <p className="text-base italic text-white/50 mb-5">"{analysis.insights.one_liner}"</p>
          )}
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <InsightList title="✅ Strengths"     items={analysis?.insights?.strengths}     color="green" />
            <InsightList title="⚠️ Weaknesses"   items={analysis?.insights?.weaknesses}    color="yellow" />
            <InsightList title="🌱 Opportunities" items={analysis?.insights?.opportunities} color="blue" />
            <InsightList title="🔴 Threats"      items={analysis?.insights?.threats}       color="red" />
          </div>
          {analysis?.insights?.red_flags?.length > 0 && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="font-semibold text-red-400 mb-2">🚩 Red Flags</p>
              <ul className="space-y-1 text-sm text-red-300">
                {analysis.insights.red_flags.map((f, i) => <li key={i}>• {f}</li>)}
              </ul>
            </div>
          )}
          {analysis?.insights?.strategic_recommendations?.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold text-white mb-2">📋 Strategic Recommendations</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-white/60">
                {analysis.insights.strategic_recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ol>
            </div>
          )}
        </Card>

        {/* VC READINESS */}
        {analysis?.vc_readiness && (
          <Card title="💼 VC Readiness">
            <p className="text-sm text-white/60 mb-3">{analysis.vc_readiness.pitch_advice}</p>
            {analysis.vc_readiness.recommended_investors?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {analysis.vc_readiness.recommended_investors.map((inv, i) => (
                  <span key={i} className="px-3 py-1 bg-violet-500/15 text-violet-400 border border-violet-500/20 rounded-full text-xs font-medium">{inv}</span>
                ))}
              </div>
            )}
            {analysis.vc_readiness.missing_items?.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wide mb-1">Missing Items</p>
                <ul className="list-disc list-inside text-sm text-red-400 space-y-1">
                  {analysis.vc_readiness.missing_items.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            )}
          </Card>
        )}

        {/* EXECUTIVE SUMMARY */}
        {analysis?.insights?.executive_summary && (
          <Card title="📄 Executive Summary">
            <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">
              {analysis.insights.executive_summary}
            </p>
          </Card>
        )}


        <div className="bg-white p-6 rounded-xl shadow mt-6">
  <h2 className="font-semibold mb-2">📄 Extracted Data</h2>

  <p className="text-sm text-gray-600 max-h-40 overflow-auto">
    {fileData || "No file data"}
  </p>
</div>

      </div>

      {/* UPGRADE POPUP */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-blue-900 shadow-2xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-white mb-2">🚀 Unlock Full Potential</h2>
            <p className="text-gray-300 mb-4">
              Get detailed insights, export reports, and advanced analytics.
            </p>
            <button
              onClick={() => router.push("/upgrade")}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold transition mb-2"
            >
              Upgrade Now
            </button>
            <button
              onClick={() => setShowUpgrade(false)}
              className="text-gray-400 hover:text-white text-sm"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Card({ title, children }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
      <h2 className="font-semibold text-white mb-4">{title}</h2>
      {children}
    </div>
  );
}

function KPICard({ label, value, color = "text-white" }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 text-center">
      <p className="text-xs text-white/30 uppercase tracking-wide mb-1">{label}</p>
      <p className={cn("text-xl font-bold", color)}>{value ?? "—"}</p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-white/40 shrink-0">{label}:</dt>
      <dd className="font-medium text-white/80 text-right">{value ?? "—"}</dd>
    </div>
  );
}

function InsightList({ title, items, color }) {
  const styles = {
    green:  "bg-green-500/10 border-green-500/20 text-green-300",
    yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-300",
    blue:   "bg-blue-500/10 border-blue-500/20 text-blue-300",
    red:    "bg-red-500/10 border-red-500/20 text-red-300",
  }[color] ?? "bg-white/5 border-white/10 text-white/60";

  if (!items?.length) return null;
  return (
    <div className={cn("rounded-xl p-4 border", styles)}>
      <p className="font-semibold mb-2">{title}</p>
      <ul className="space-y-1 text-sm opacity-90">
        {items.map((item, i) => <li key={i}>• {item}</li>)}
      </ul>
    </div>
  );
}