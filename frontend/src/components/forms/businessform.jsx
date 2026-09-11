"use client";

export default function BusinessForm({ data, setData, next }) {
  const industries = [
    "Technology", "Healthcare", "Education", "Finance", "Retail",
    "E-commerce", "Real Estate", "Manufacturing", "Automobile",
    "Food & Beverage", "Hospitality", "Travel & Tourism",
    "Media & Entertainment", "Telecommunications", "Energy",
    "Agriculture", "Construction", "Logistics & Supply Chain",
    "Fashion & Apparel", "Beauty & Cosmetics", "Sports & Fitness",
    "Gaming", "Legal Services", "Consulting", "Marketing & Advertising",
    "HR & Recruitment", "Pharmaceuticals", "Biotechnology", "Insurance",
    "FinTech", "EdTech", "HealthTech", "AI & Machine Learning",
    "Cybersecurity", "Blockchain & Crypto", "Cloud Computing", "SaaS",
    "Non-Profit", "Government", "Other",
  ];

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Business Information</h2>
        <p className="text-white/40 text-sm mt-1">
          Enter your core business details to get started
        </p>
      </div>

      {/* FIELDS */}
      <div className="grid md:grid-cols-2 gap-4">

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wide">Business Name *</label>
          <input
            placeholder="e.g. Acme Corp"
            value={data.businessName}
            required
            onChange={(e) => setData((prev) => ({ ...prev, businessName: e.target.value }))}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wide">Brand Name</label>
          <input
            placeholder="e.g. Acme"
            value={data.brandName}
            onChange={(e) => setData({ ...data, brandName: e.target.value })}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wide">Industry</label>
          <select
            value={data.industry}
            onChange={(e) => setData({ ...data, industry: e.target.value })}
            className="px-4 py-3 rounded-xl bg-[#1a1d27] border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition"
          >
            <option value="">Select Industry</option>
            {industries.map((ind, i) => (
              <option key={i} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wide">Stage</label>
          <select
            value={data.stage}
            onChange={(e) => setData({ ...data, stage: e.target.value })}
            className="px-4 py-3 rounded-xl bg-[#1a1d27] border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition"
          >
            <option value="">Select Stage</option>
            <option>Idea</option>
            <option>Startup</option>
            <option>Growth</option>
            <option>Scaling</option>
          </select>
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={next}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}