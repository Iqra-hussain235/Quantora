"use client";

export default function MetricForm({ data, setData, next, prev }) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Key Metrics</h2>
        <p className="text-white/40 text-sm mt-1">
          Track important business metrics to measure growth and performance
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wide">Customer Acquisition Cost (CAC)</label>
          <input
            placeholder="e.g. ₹500"
            value={data.cac}
            onChange={(e) => setData({ ...data, cac: e.target.value })}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wide">Lifetime Value (LTV)</label>
          <input
            placeholder="e.g. ₹5000"
            value={data.ltv}
            onChange={(e) => setData({ ...data, ltv: e.target.value })}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wide">Churn Rate (%)</label>
          <input
            placeholder="e.g. 5"
            value={data.churnRate}
            onChange={(e) => setData({ ...data, churnRate: e.target.value })}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wide">Conversion Rate (%)</label>
          <input
            placeholder="e.g. 12"
            value={data.conversionRate}
            onChange={(e) => setData({ ...data, conversionRate: e.target.value })}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={prev}
          className="px-6 py-2.5 rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition"
        >
          ← Previous
        </button>
        <button
          onClick={next}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}