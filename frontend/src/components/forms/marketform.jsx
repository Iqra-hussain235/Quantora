"use client";

export default function MarketForm({ data, setData, next, prev }) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Market Analysis</h2>
        <p className="text-white/40 text-sm mt-1">
          Provide details about your target market and customers
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wide">Target Market</label>
          <input
            placeholder="e.g. Students, Businesses"
            value={data.targetMarket}
            onChange={(e) => setData({ ...data, targetMarket: e.target.value })}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wide">Market Size</label>
          <input
            placeholder="e.g. ₹10 Cr, Global"
            value={data.marketSize}
            onChange={(e) => setData({ ...data, marketSize: e.target.value })}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wide">Customer Type</label>
          <select
            value={data.customerType}
            onChange={(e) => setData({ ...data, customerType: e.target.value })}
            className="px-4 py-3 rounded-xl bg-[#1a1d27] border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500/60 transition"
          >
            <option value="">Select Customer Type</option>
            <option>B2B</option>
            <option>B2C</option>
            <option>B2B2C</option>
            <option>D2C</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wide">Market Trend</label>
          <select
            value={data.marketTrend}
            onChange={(e) => setData({ ...data, marketTrend: e.target.value })}
            className="px-4 py-3 rounded-xl bg-[#1a1d27] border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500/60 transition"
          >
            <option value="">Select Trend</option>
            <option>Growing</option>
            <option>Stable</option>
            <option>Declining</option>
          </select>
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