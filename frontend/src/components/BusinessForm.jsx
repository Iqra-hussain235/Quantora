// components/BusinessForm.jsx
"use client";

import { useState } from "react";

export default function BusinessForm({ onSubmit }) {

  const [data, setData] = useState({});

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(data);
    }} className="flex flex-col gap-3">

      <input placeholder="Business Name"
        onChange={(e) => setData({ ...data, businessName: e.target.value })}
      />

      <input placeholder="Brand Name"
        onChange={(e) => setData({ ...data, brandName: e.target.value })}
      />

      <button className="bg-blue-600 text-white p-2 rounded">
        Create
      </button>

    </form>
  );
}