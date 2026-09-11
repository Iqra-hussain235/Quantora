"use client";

import cn from "@/lib/cn";

export default function SWOTForm({ data, setData, prev, submit }) {
  const swotFields = [
    { key: "strengths",    label: "Strengths",    placeholder: "What does your business do well?",       color: "focus:ring-green-500/60 focus:border-green-500/60" },
    { key: "weaknesses",   label: "Weaknesses",   placeholder: "What could be improved?",                color: "focus:ring-yellow-500/60 focus:border-yellow-500/60" },
    { key: "opportunities",label: "Opportunities",placeholder: "What external chances can you exploit?",  color: "focus:ring-blue-500/60 focus:border-blue-500/60" },
    { key: "threats",      label: "Threats",      placeholder: "What external risks could hurt you?",    color: "focus:ring-red-500/60 focus:border-red-500/60" },
  ];

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">SWOT Analysis</h2>
        <p className="text-white/40 text-sm mt-1">
          Analyze your strengths, weaknesses, opportunities, and threats
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {swotFields.map(({ key, label, placeholder, color }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wide">{label}</label>
              <textarea
              placeholder={placeholder}
              value={data[key]}
              onChange={(e) => setData({ ...data, [key]: e.target.value })}
              rows={4}
              className={cn(
                "px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 outline-none resize-none",
                color,
                "transition"
              )}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={prev}
          className="px-6 py-2.5 rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition"
        >
          ← Previous
        </button>
        <button
          onClick={submit}
          className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white px-10 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
        >
          Submit & Analyze 🚀
        </button>
      </div>
    </div>
  );
}