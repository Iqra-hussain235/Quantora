// components/KPICard.jsx

export default function KPICard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">

      <p className="text-gray-500">{title}</p>

      <h2 className="text-2xl font-bold text-blue-600">
        {value}
      </h2>

    </div>
  );
}