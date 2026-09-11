"use client";

import { useState } from "react";
import API from "@/config/api";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { useEffect } from "react";

export default function BusinessUpload() {
  const router = useRouter();

  const [form, setForm] = useState({
    businessName: "",
    platform: "",
    location: "",
    branches: "",
    branchLocations: [],
    file: null,
  });
  

  

  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm({ ...form, file: files[0] });
      setFileName(files[0].name);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to upload business data. Redirecting to login...");
      router.push("/login");
    }
    // load edit data when coming from sidebar edit
    try {
      const edit = localStorage.getItem("existingEdit");
      if (edit) {
        const obj = JSON.parse(edit);
        setForm((prev) => ({ ...prev, ...obj }));
        localStorage.removeItem("existingEdit");
      }
    } catch (e) {
      console.warn(e);
    }
  }, [router]);
  const submitHandler = async (e) => {
  e.preventDefault();

  try {

    // ✅ 1. FormData create
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "branchLocations") {
        formData.append(key, JSON.stringify(form[key]));
      } else {
        formData.append(key, form[key]);
      }
    });

    // ✅ 2. SAVE IN DATABASE
    const res = await API.post("/existing-business", formData);

    console.log("DB SAVE:", res.data);

    // ✅ 3. AI ANALYSIS via FastAPI `app.py` (/analyze)
    const API_BASE = process.env.NEXT_PUBLIC_PY_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const aiRes = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea: JSON.stringify(form) }) // send business data as idea text
    });

    const result = await aiRes.json();

    console.log("AI RESULT:", result);

    // ✅ 4. STORE RESULT
    localStorage.setItem("analysisResult", JSON.stringify(result));
    localStorage.setItem("flowType", "existing");
    // persist the submitted existing business so sidebar can show it and allow edits
    localStorage.setItem("existingData", JSON.stringify(form));

    // ✅ 5. REDIRECT
    router.push("/analysis");

  } catch (error) {
    console.log(error);
    alert("Something went wrong ❌");
  }
};

  // const submitHandler = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       throw new Error("Missing auth token. Please login.");
  //     }

  //     const formData = new FormData();

  //     Object.keys(form).forEach((key) => {
  //       if (key === "branchLocations") {
  //         formData.append(key, JSON.stringify(form[key]));
  //       } else {
  //         formData.append(key, form[key]);
  //       }
  //     });

  //     await API.post("/existing-business", formData);

  //     router.push("/analysis");
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0B1F3A] to-black flex items-center justify-center p-6">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-3xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-10 space-y-6"
      >
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Business Intelligence Upload
          </h2>
          <p className="text-gray-400 text-sm">
            Add your business data to generate smart analytics insights
          </p>
        </div>

        {/* INPUT GRID */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="businessName"
            placeholder="Business Name"
            className="input"
            value={form.businessName}
            onChange={handleChange}
          />

          <input
            name="platform"
            placeholder="Website / App"
            className="input"
            value={form.platform}
            onChange={handleChange}
          />
        </div>

        {/* LOCATION */}
        <div className="space-y-3">
          <label className="label">Business Location</label>

          {/* Location input (plain text) */}
          <input
            name="location"
            placeholder="Business Location (city, address, or coordinates)"
            className="input"
            value={form.location}
            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
          />
        </div>

        {/* BRANCHES */}
        <div>
          <input
            name="branches"
            type="number"
            placeholder="Number of Branches"
            className="input"
            value={form.branches}
            onChange={handleChange}
          />
        </div>

        {/* BRANCH LOCATIONS */}
        {Array.from({ length: form.branches || 0 }).map((_, i) => (
          <input
            key={i}
            placeholder={`Branch ${i + 1} Location`}
            className="input"
            value={form.branchLocations?.[i] || ""}
            onChange={(e) => {
              const arr = [...(form.branchLocations || [])];
              arr[i] = e.target.value;
              setForm({ ...form, branchLocations: arr });
            }}
          />
        ))}

        {/* FILE UPLOAD */}
        <label className="cursor-pointer">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-600/40 rounded-2xl p-8 hover:bg-blue-600/10 transition">
            <UploadCloud className="w-10 h-10 text-blue-400 mb-2" />
            <p className="text-gray-300">Upload your files</p>
            <p className="text-xs text-gray-500">PDF, CSV, DOCX</p>

            {fileName && (
              <p className="mt-2 text-green-400 text-sm">{fileName}</p>
            )}
          </div>

          <input type="file" hidden onChange={handleChange} />
        </label>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:opacity-90 transition p-3 rounded-xl text-white font-semibold shadow-lg"
        >
          {loading ? "Analyzing..." : "Analyze Business"}
        </button>
      </form>

      {/* GLOBAL STYLES */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          outline: none;
          transition: 0.3s;
        }

        .input:focus {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }

        .label {
          font-size: 14px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
