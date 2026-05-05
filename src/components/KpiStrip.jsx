function MiniSparkline({ values, color }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 56;
  const h = 24;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  const colorMap = {
    orange: "#f97316",
    red: "#ef4444",
    blue: "#3b82f6",
    purple: "#a855f7",
    green: "#22c55e",
  };

  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline
        points={pts}
        fill="none"
        stroke={colorMap[color] || "#6b7280"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const borderMap = {
  orange: "border-orange-500/40 hover:border-orange-500/70",
  red: "border-red-500/40 hover:border-red-500/70",
  blue: "border-blue-500/40 hover:border-blue-500/70",
  purple: "border-purple-500/40 hover:border-purple-500/70",
  green: "border-green-500/40 hover:border-green-500/70",
};

const textMap = {
  orange: "text-orange-400",
  red: "text-red-400",
  blue: "text-blue-400",
  purple: "text-purple-400",
  green: "text-green-400",
};

export default function KpiStrip({ data }) {
  return (
    <div className="grid grid-cols-5 gap-3 px-6 py-3 bg-gray-950 border-b border-gray-800 shrink-0">
      {data.map((kpi) => (
        <button
          key={kpi.id}
          title={kpi.detail}
          className={`bg-gray-900 border rounded-xl px-4 py-3 text-left transition-all cursor-pointer ${
            borderMap[kpi.color]
          }`}
        >
          <div className="text-xs text-gray-500 mb-1 truncate">{kpi.label}</div>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-0.5">
              <span className={`text-2xl font-bold ${textMap[kpi.color]}`}>
                {kpi.value}
              </span>
              {kpi.unit && (
                <span className="text-xs text-gray-600">{kpi.unit}</span>
              )}
            </div>
            <MiniSparkline values={kpi.sparkline} color={kpi.color} />
          </div>
          <div className="mt-1 text-xs">
            <span
              className={
                kpi.delta < 0
                  ? "text-green-400"
                  : kpi.id === "risk_score" || kpi.id === "critical_events"
                  ? "text-red-400"
                  : "text-green-400"
              }
            >
              {kpi.delta > 0 ? "▲" : "▼"} {Math.abs(kpi.delta)}% vs last 7d
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
