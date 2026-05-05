const tabs = [
  {
    id: "executive",
    label: "Executive View",
    description: "High-level outcomes and risk exposure",
  },
  {
    id: "secops",
    label: "Security Ops",
    description: "Threat events, alerts, and response queue",
  },
  {
    id: "privacy",
    label: "Privacy / Compliance",
    description: "Data handling, consent gaps, and regulations",
  },
  {
    id: "developer",
    label: "Developer",
    description: "Headers, scripts, and API surface analysis",
  },
];

export default function PersonaTabs({ active, onSelect }) {
  return (
    <div className="flex items-center gap-1 px-6 py-2 bg-gray-950 border-b border-gray-800 shrink-0">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          title={tab.description}
          onClick={() => onSelect(tab.id)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            active === tab.id
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
