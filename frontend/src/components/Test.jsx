"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const words = ["Analyze", "Grow", "Predict", "Optimize"];
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (index === words.length) return;

    if (subIndex === words[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), 1000);
      return;
    }

    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
      setText(words[index].substring(0, subIndex));
    }, deleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#020617] text-white">

      {/* Navbar */}
      <div className="flex justify-between items-center px-6 py-4">

        {/* 🔥 Animated Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14">

            {/* Blue Circle - Right Rotate */}
            <img
              src="/images/logo.png"
              alt="blue"
              className="absolute inset-0 animate-rotate-right"
            />

            {/* Golden Circle - Left Rotate */}
            {/* <img
              src="/images/logo.png"
              alt="gold"
              className="absolute inset-0 animate-rotate-left"
            /> */}

          </div>

          <h1 className="text-2xl font-bold text-blue-400">
            Quantora
          </h1>
        </div>

      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-20">

        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {text}
          <span className="text-blue-400"> Your Startup</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-8">
          Turn your business data into insights, performance scores, and growth strategies — all in one place.
        </p>

        <button
          onClick={() => router.push("/login")}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 rounded-base text-center leading- shadow-lg px-8 py-3 cursor-pointer rounded-lg text-lg font-semibold hover:scale-105 transition"
        >
          Start Analyzing
        </button>

      </div>

      {/* Features */}
      <div className="grid md:grid-cols-4 gap-6 px-6 mt-20">

        {[
          "📊 Business Analysis",
          "📈 Growth Prediction",
          "⚠ Risk Detection",
          "📑 Smart Reports"
        ].map((item, i) => (
          <div
            key={i}
            className="bg-blue-900 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent)] p-6 cursor-pointer rounded-xl shadow-lg hover:scale-105 transition"
          >
            <h3 className="text-lg font-semibold cursor-pointer">{item}</h3>
          </div>
        ))}

      </div>

      {/* How it Works */}
      <div className="mt-20 text-center px-6">

        <h2 className="text-3xl font-bold mb-8">
          How Quantora Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-blue-900 p-6 rounded-lg bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent)] hover:scale-105 transition">
            1️⃣ Create your business
          </div>

          <div className="bg-blue-900 p-6 rounded-lg bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent)] hover:scale-105 transition">
            2️⃣ Add financial & SWOT data
          </div>

          <div className="bg-blue-900 p-6 rounded-lg bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent)] hover:scale-105 transition">
            3️⃣ Get score & insights
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="mt-20 text-center text-gray-400 pb-6">
        © 2026 Quantora | Built with ❤️
      </div>

    </div>
  );
}




// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";


// export default function Home() {

//   const router = useRouter();

//   // Typing animation words
//   const words = ["Analyze", "Grow", "Predict", "Optimize"];
//   const [text, setText] = useState("");
//   const [index, setIndex] = useState(0);
//   const [subIndex, setSubIndex] = useState(0);
//   const [deleting, setDeleting] = useState(false);

//   useEffect(() => {

//     if (index === words.length) return;

//     if (subIndex === words[index].length + 1 && !deleting) {
//       setTimeout(() => setDeleting(true), 1000);
//       return;
//     }

//     if (subIndex === 0 && deleting) {
//       setDeleting(false);
//       setIndex((prev) => (prev + 1) % words.length);
//       return;
//     }

//     const timeout = setTimeout(() => {
//       setSubIndex((prev) => prev + (deleting ? -1 : 1));
//       setText(words[index].substring(0, subIndex));
//     }, deleting ? 50 : 100);

//     return () => clearTimeout(timeout);

//   }, [subIndex, index, deleting]);

//   // Redirect if logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) router.push("/dashboard");
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">

//       {/* Navbar */}
//       <div className="flex justify-between items-center px-6 py-4">

//         <div className="flex items-center gap-3">
//   {/* Blue rotating circle */}
//   <div className="w-10 h-10 animate-spin-slow">
//     <img src="/logo.png" alt="logo" className="object-contain" />
//   </div>

//   <h1 className="text-2xl font-bold text-blue-400">
//     Quantora
//   </h1>
// </div>

//         <div className="flex gap-4">

//           {/* <button
//             onClick={() => router.push("/login")}
//             className="border border-blue-400 px-4 py-1 rounded hover:bg-blue-600 transition"
//           >
//             Login
//           </button>

//           <button
//             onClick={() => router.push("/login")}
//             className="bg-blue-500 px-4 py-1 rounded hover:bg-blue-400 transition"
//           >
//             Get Started
//           </button> */}

//         </div>

//       </div>

//       {/* Hero Section */}
//       <div className="flex flex-col items-center justify-center text-center px-6 mt-20">

//         {/* Typing Heading */}
//         <h1 className="text-4xl md:text-6xl font-bold mb-6">

//           {text}
//           <span className="text-blue-400"> Your Startup</span>

//         </h1>

//         <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-8">

//           Turn your business data into insights, performance scores, and growth strategies — all in one place.

//         </p>

//         {/* Buttons */}
//         <div className="flex flex-col md:flex-row gap-4">

//           <button
//             onClick={() => router.push("/login")}
//             className="bg-blue-500 px-8 py-3 rounded-lg text-lg font-semibold hover:scale-105 transition"
//           >
//             Start Analyzing
//           </button>

//           {/* <button className="border border-blue-400 px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
//             View Demo
//           </button> */}

//         </div>

//       </div>

//       {/* Features Section */}
//       <div className="grid md:grid-cols-4 gap-6 px-6 mt-20">

//         {[
//           "📊 Business Analysis",
//           "📈 Growth Prediction",
//           "⚠ Risk Detection",
//           "📑 Smart Reports"
//         ].map((item, i) => (

//           <div
//             key={i}
//             className="bg-blue-900 p-6 rounded-xl shadow-lg hover:scale-105 transition"
//           >
//             <h3 className="text-lg font-semibold">{item}</h3>
//           </div>

//         ))}

//       </div>

//       {/* How it Works */}
//       <div className="mt-20 text-center px-6">

//         <h2 className="text-3xl font-bold mb-8">
//           How Quantora Works
//         </h2>

//         <div className="grid md:grid-cols-3 gap-6">

//           <div className="bg-blue-900 p-6 rounded-lg">
//             1️⃣ Create your business
//           </div>

//           <div className="bg-blue-900 p-6 rounded-lg">
//             2️⃣ Add financial & SWOT data
//           </div>

//           <div className="bg-blue-900 p-6 rounded-lg">
//             3️⃣ Get score & insights
//           </div>

//         </div>

//       </div>

//       {/* Footer */}
//       <div className="mt-20 text-center text-gray-400 pb-6">
//         © 2026 Quantora | Built with ❤️
//       </div>

//     </div>
//   );
// }























// "use client";

// import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

// export default function Test({ score }) {

//   const data = [
//     { name: "Stage 1", value: score * 0.4 },
//     { name: "Stage 2", value: score * 0.7 },
//     { name: "Final", value: score },
//   ];

//   return (
//     <LineChart width={400} height={250} data={data}>
//       <XAxis dataKey="name" />
//       <YAxis />
//       <Tooltip />
//       <Line type="monotone" dataKey="value" stroke="#2563eb" />
//     </LineChart>
//   );
// }