"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import BusinessForm from "@/components/forms/businessform";
import FinancialForm from "@/components/forms/financialform";
import MarketForm from "@/components/forms/marketform";
import CompetitorForm from "@/components/forms/competitorform";
import MetricForm from "@/components/forms/metricform";
import SWOTForm from "@/components/forms/swotform";
import ProgressBar from "@/components/forms/progressbar";
import { createBusiness } from "@/config/redux/action/bussinessAction";
import { addFinancial, addSwot, addMarketResearch, addMetrics } from "@/config/redux/action/analysisAction";

const TOTAL_STEPS = 6;

const STEP_LABELS = [
  "Business",
  "Financials",
  "Market",
  "Competitors",
  "Metrics",
  "SWOT",
];

export default function BusinessPage() {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const router = useRouter();

  const [data, setData] = useState({
    businessName: "", brandName: "", industry: "", stage: "",
    revenue: "", expenses: "",
    targetMarket: "", marketSize: "", customerType: "", marketTrend: "", marketPosition: "",
    competitorName: "", competitorStrength: "", competitorWeakness: "",
    cac: "", ltv: "", churnRate: "", conversionRate: "",
    strengths: "", weaknesses: "", opportunities: "", threats: "",
  });

  // Persist draft
  useEffect(() => {
    const saved = localStorage.getItem("businessDraft");
    if (saved) setData(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("businessDraft", JSON.stringify(data));
  }, [data]);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in. Redirecting to login...");
      router.push("/login");
    }
  }, [router]);

  const next = () => {
    if (step === 1 && (!data.businessName.trim() || !data.brandName.trim())) {
      alert("Please fill in Business Name and Brand Name."); return;
    }
    if (step === 2 && (!data.revenue.trim() || !data.expenses.trim())) {
      alert("Please fill in Revenue and Expenses."); return;
    }
    if (step === 3 && (!data.targetMarket.trim() || !data.marketSize.trim())) {
      alert("Please fill in Target Market and Market Size."); return;
    }
    if (step === 4 && !data.competitorName.trim()) {
      alert("Please fill in Competitor Name."); return;
    }
    if (step === 5 && (!data.cac.trim() || !data.ltv.trim())) {
      alert("Please fill in CAC and LTV."); return;
    }
    setStep((p) => p + 1);
  };

  const prev = () => setStep((p) => p - 1);

  const submit = async () => {
    try {
      if (!data.businessName) { alert("Fill required fields"); return; }

      const res = await dispatch(createBusiness(data));
      if (res.meta.requestStatus !== "fulfilled") throw new Error("Failed to create business record");

      const businessId = res.payload?._id;
      if (!businessId) throw new Error("Created business ID missing");

      await dispatch(addFinancial({ businessId, data: { revenue: data.revenue, expenses: data.expenses } }));
      await dispatch(addMarketResearch({ businessId, data: { targetMarket: data.targetMarket, marketSize: data.marketSize, customerType: data.customerType, marketTrend: data.marketTrend } }));
      await dispatch(addMetrics({ businessId, data: { cac: data.cac, ltv: data.ltv, churnRate: data.churnRate, conversionRate: data.conversionRate } }));
      await dispatch(addSwot({ businessId, data: { strengths: data.strengths, weaknesses: data.weaknesses, opportunities: data.opportunities, threats: data.threats } }));

      const ideaPrompt = `
Startup Name: ${data.businessName}
Brand: ${data.brandName}

Industry: ${data.industry}
Stage: ${data.stage}

Problem & Solution:
${data.strengths}

Weakness:
${data.weaknesses}

Opportunities:
${data.opportunities}

Threats:
${data.threats}

Target Market:
${data.targetMarket}
Customer Type: ${data.customerType}

Market:
- Market Size: ${data.marketSize}
- Trend: ${data.marketTrend}
- Position: ${data.marketPosition}

Competition:
- Competitor: ${data.competitorName}
- Strength: ${data.competitorStrength}
- Weakness: ${data.competitorWeakness}

Financials:
- Revenue: ${data.revenue}
- Expenses: ${data.expenses}
- CAC: ${data.cac}
- LTV: ${data.ltv}
- Churn Rate: ${data.churnRate}
- Conversion Rate: ${data.conversionRate}
`.trim();

      localStorage.setItem("startupIdea", JSON.stringify({ idea: ideaPrompt, name: data.businessName }));
      localStorage.setItem("flowType", "business");
      localStorage.removeItem("businessDraft");
      router.push("/analysis");
    } catch (error) {
      console.error("ERROR:", error);
      alert("Something went wrong ❌ " + (error.message || ""));
    }
  };

  return (
    <div className="min-h-full p-6 md:p-10">
      {/* PAGE TITLE */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">
          Analyze Your Startup
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Step <span className="text-blue-400 font-semibold">{step}</span> of{" "}
          <span className="text-white/60">{TOTAL_STEPS}</span> —{" "}
          <span className="text-white/60">{STEP_LABELS[step - 1]}</span>
        </p>
      </div>

      {/* PROGRESS BAR */}
      <div className="mb-8">
        <ProgressBar step={step} totalSteps={TOTAL_STEPS} />
      </div>

      {/* FORM CARD */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 md:p-10 max-w-4xl">
        {step === 1 && <BusinessForm   data={data} setData={setData} next={next} />}
        {step === 2 && <FinancialForm  data={data} setData={setData} next={next} prev={prev} />}
        {step === 3 && <MarketForm     data={data} setData={setData} next={next} prev={prev} />}
        {step === 4 && <CompetitorForm data={data} setData={setData} next={next} prev={prev} />}
        {step === 5 && <MetricForm     data={data} setData={setData} next={next} prev={prev} />}
        {step === 6 && <SWOTForm       data={data} setData={setData} prev={prev} submit={submit} />}
      </div>
    </div>
  );
}
