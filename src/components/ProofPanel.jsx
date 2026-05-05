import { proofOfValue, trialChecklist } from "../data/mockData";

export default function ProofPanel({ trialDaysLeft }) {
  const pov = proofOfValue;
  const checklist = trialChecklist;
  const done = checklist.filter((c) => c.done).length;

  return (
    <aside className="w-72 shrink-0 border-l border-gray-800 bg-gray-950 overflow-y-auto flex flex-col">
      {/* Proof of value */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-200">
            Proof of Value — This Session
          </span>
          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            Share ↗
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: "Leaks Prevented", value: pov.leaksPrevented, color: "text-purple-400" },
            { label: "Trackers Blocked", value: pov.trackersBlocked, color: "text-blue-400" },
            { label: "Cookies Protected", value: pov.cookiesProtected, color: "text-green-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-800/60 rounded-lg p-2 text-center"
            >
              <div className={`text-xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 leading-tight mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-1.5 mb-3">
          <div className="text-xs text-gray-500 mb-1">Top blocked categories</div>
          {pov.topCategories.map((cat) => {
            const max = pov.topCategories[0].count;
            const pct = Math.round((cat.count / max) * 100);
            return (
              <div key={cat.label}>
                <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                  <span>{cat.label}</span>
                  <span className="text-gray-600">{cat.count}</span>
                </div>
                <div className="h-1 bg-gray-800 rounded-full">
                  <div
                    className="h-1 bg-blue-500/60 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button className="w-full py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
          Generate ROI Report ↗
        </button>
      </div>

      {/* Trial checklist */}
      {trialDaysLeft !== null && (
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-gray-200">
              Trial Activation
            </span>
            <span className="text-xs text-gray-500">
              {done}/{checklist.length}
            </span>
          </div>
          <p className="text-xs text-amber-400/80 mb-3">
            ⏳ {trialDaysLeft} days left to export your first security baseline
          </p>
          <div className="w-full h-1.5 bg-gray-800 rounded-full mb-3">
            <div
              className="h-1.5 bg-amber-500 rounded-full transition-all"
              style={{ width: `${(done / checklist.length) * 100}%` }}
            />
          </div>
          <ul className="space-y-2">
            {checklist.map((item) => (
              <li key={item.id} className="flex items-center gap-2 text-sm">
                <span
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 text-xs ${
                    item.done
                      ? "bg-green-600 border-green-600 text-white"
                      : "border-gray-600"
                  }`}
                >
                  {item.done && "✓"}
                </span>
                <span className={item.done ? "text-gray-500 line-through" : "text-gray-300"}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
          <button className="mt-3 w-full py-1.5 text-xs font-medium border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors">
            Export Security Baseline
          </button>
        </div>
      )}

      {/* Executive report CTA */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-3">
          <div className="text-sm font-semibold text-gray-200 mb-1">
            Executive Report
          </div>
          <p className="text-xs text-gray-500 mb-3">
            One-click export of risk posture, blocked threats, and compliance
            gaps for leadership review.
          </p>
          <button className="w-full py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            Generate Executive Report
          </button>
        </div>
      </div>
    </aside>
  );
}
