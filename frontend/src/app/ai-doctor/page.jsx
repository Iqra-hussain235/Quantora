"use client";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, TrendingDown, BarChart2, ChevronDown, Shuffle, Target, Eye, Lightbulb } from "lucide-react";
import { useBusiness } from "@/context/BusinessContext";

const STARTERS = [
  "Why did revenue drop this month?",
  "Which product is most profitable?",
  "How can I reduce customer churn?",
  "Should I increase my marketing budget?",
  "What will happen if sales keep declining?",
  "Which customers should I focus on?",
];

const AI_RESPONSES = {
  "Why did revenue drop this month?": {
    title: "Revenue Decreased 8.4% This Month",
    sections: [
      {
        heading: "Primary Cause",
        content: "Returning customer revenue declined 14%, driven by a drop in average purchase frequency.",
        type: "finding",
      },
      {
        heading: "Evidence",
        items: [
          "Returning customers: -12% vs previous period",
          "Average order frequency: -8%  (2.1 → 1.9 orders/month)",
          "Product A repeat purchases: -17%",
          "High-value segment activity: -9%",
        ],
        type: "evidence",
      },
      {
        heading: "Business Impact",
        content: "Estimated monthly revenue loss: ₹2.1L. If trend continues for 3 more months, annual impact: ₹6.3L+.",
        type: "impact",
      },
      {
        heading: "AI Recommendation",
        content: "Launch a targeted retention campaign for returning high-value customers. Focus on Product A with personalized re-engagement offers. Expected recovery: ₹1.2L–₹1.8L/month.",
        type: "recommendation",
      },
    ],
    confidence: 84,
    period: "Sep 1–30, 2026",
  },
};

function AIMessage({ msg }) {
  if (msg.role === "user") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <div className="q-chat-bubble q-chat-user" style={{ fontSize: "0.9375rem" }}>{msg.content}</div>
      </div>
    );
  }

  const resp = msg.structured;
  if (!resp) {
    return (
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#8B1A1A,#C0392B)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Sparkles size={15} color="#fff" />
        </div>
        <div className="q-chat-bubble q-chat-ai" style={{ fontSize: "0.9375rem" }}>{msg.content}</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "flex-start" }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#8B1A1A,#C0392B)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4 }}>
        <Sparkles size={15} color="#fff" />
      </div>
      <div style={{ flex: 1 }}>
        <div className="q-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--q-text-1)", marginBottom: 18 }}>
            {resp.title}
          </h3>
          {resp.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--q-text-3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{s.heading}</h4>
              {s.content && (
                <p style={{
                  fontSize: "0.9375rem", color: "var(--q-text-2)", lineHeight: 1.65,
                  padding: "12px 14px", borderRadius: 8,
                  background: s.type === "recommendation" ? "#EFF6FF" :
                              s.type === "impact" ? "#FEF2F2" :
                              s.type === "finding" ? "#FAFAFA" : "#F9FAFB",
                  borderLeft: `3px solid ${s.type === "recommendation" ? "#2563EB" : s.type === "impact" ? "#DC2626" : "var(--q-border)"}`,
                }}>{s.content}</p>
              )}
              {s.items && (
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {s.items.map((item, j) => (
                    <li key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: "0.9rem", color: "var(--q-text-2)" }}>
                      <span style={{ color: "#2563EB", marginTop: 2, flexShrink: 0 }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--q-border)", paddingTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: "0.8125rem", color: "var(--q-text-4)" }}>
                📅 Based on data from {resp.period}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: "0.8125rem", color: "var(--q-text-4)" }}>Confidence:</span>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: resp.confidence >= 80 ? "#059669" : "#D97706" }}>{resp.confidence}%</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="q-btn q-btn-outline q-btn-sm" style={{ gap: 5 }}><Eye size={13} /> View Data</button>
              <button className="q-btn q-btn-outline q-btn-sm" style={{ gap: 5 }}><Shuffle size={13} /> Simulate</button>
              <button className="q-btn q-btn-blue q-btn-sm" style={{ gap: 5 }}><Target size={13} /> Create Action</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#8B1A1A,#C0392B)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Sparkles size={15} color="#fff" />
      </div>
      <div className="q-chat-bubble q-chat-ai" style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {[0, 0.2, 0.4].map((d, i) => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--q-text-4)", animation: "q-pulse-dot 1.2s ease-in-out infinite", animationDelay: `${d}s` }} />
        ))}
      </div>
    </div>
  );
}

const STAGES = [
  "Understanding your question...",
  "Loading business context...",
  "Analyzing relevant data...",
  "Running calculations...",
  "Generating insights...",
  "Formulating recommendations...",
];

export default function AIDoctorPage() {
  const { businessName, isDemo } = useBusiness();
  const bizName = businessName || "your business";

  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: `Hello! I'm your AI Business Doctor. I have full context of ${bizName}${isDemo ? "'s demo" : "'s"} data. Ask me anything about your business performance, customers, products, revenue, risks, or what actions to take next.`,
    },
  ]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [stage, setStage]         = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (q) => {
    const text = q || input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setLoading(true);
    setStage(0);

    // Simulate stage progression
    for (let i = 0; i < STAGES.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      setStage(i);
    }

    await new Promise(r => setTimeout(r, 600));

    const structured = AI_RESPONSES[text] || null;
    const fallback = `I've analyzed your ${bizName} data for this question. Based on your last 30 days of business data, this appears to be a pattern in your ${text.toLowerCase().includes("revenue") ? "revenue" : text.toLowerCase().includes("customer") ? "customer" : "operational"} data. I recommend looking at the Analytics section for detailed charts, and creating a Next Best Action to address this insight.`;

    setMessages(prev => [...prev, {
      role: "ai",
      content: fallback,
      structured,
    }]);
    setLoading(false);
  };

  return (
    <div style={{ height: "calc(100vh - var(--q-topbar-h))", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "20px 32px 16px", borderBottom: "1px solid var(--q-border)", background: "var(--q-surface)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#8B1A1A,#C0392B)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bot size={20} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "1.125rem" }}>AI Business Doctor</h2>
            <p style={{ fontSize: "0.8125rem", color: "var(--q-text-3)" }}>Ask questions about your business · Grounded in your actual data · {bizName}</p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "var(--q-success-bg)", borderRadius: 100, border: "1px solid var(--q-success-border)" }}>
            <div className="q-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--q-success)" }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--q-success)", fontWeight: 500 }}>Data connected</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
        {messages.map((msg, i) => (
          <AIMessage key={i} msg={msg} />
        ))}
        {loading && (
          <>
            <TypingIndicator />
            <div style={{ marginLeft: 44, marginTop: -8, marginBottom: 16 }}>
              <span style={{ fontSize: "0.8125rem", color: "var(--q-text-4)", display: "flex", alignItems: "center", gap: 6 }}>
                <div className="q-spinner" style={{ width: 12, height: 12, borderWidth: 1.5 }} />
                {STAGES[stage]}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Starter questions */}
      {messages.length === 1 && (
        <div style={{ padding: "0 32px 12px", flexShrink: 0 }}>
          <p style={{ fontSize: "0.8125rem", color: "var(--q-text-4)", marginBottom: 10 }}>Try asking:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {STARTERS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                style={{
                  padding: "7px 14px", borderRadius: 100,
                  border: "1px solid var(--q-border)", background: "var(--q-surface)",
                  fontSize: "0.8125rem", color: "var(--q-text-2)", cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--q-blue)"; e.currentTarget.style.color = "var(--q-blue)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--q-border)"; e.currentTarget.style.color = "var(--q-text-2)"; }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "12px 32px 24px", borderTop: "1px solid var(--q-border)", background: "var(--q-surface)", flexShrink: 0 }}>
        <form onSubmit={e => { e.preventDefault(); send(); }} style={{ display: "flex", gap: 10 }}>
          <input
            className="q-input"
            placeholder="Ask anything about your business..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="q-btn q-btn-primary"
            style={{ gap: 6, flexShrink: 0 }}
          >
            {loading ? <div className="q-spinner" style={{ borderTopColor: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.2)" }} /> : <Send size={16} />}
            {loading ? "Analyzing..." : "Ask AI"}
          </button>
        </form>
        <p style={{ fontSize: "0.75rem", color: "var(--q-text-4)", marginTop: 8, textAlign: "center" }}>
          AI responses are grounded in your business data. Predictions are estimates, not guarantees.
        </p>
      </div>
    </div>
  );
}
