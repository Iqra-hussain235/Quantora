"use client";

export default function ProgressBar({ step, totalSteps = 6 }) {
  const percent = (step / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="w-full bg-white/8 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}