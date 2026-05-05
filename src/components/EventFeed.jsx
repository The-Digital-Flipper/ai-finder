import { useState } from "react";

const severityConfig = {
  critical: {
    label: "Critical",
    bg: "bg-red-500/10",
    border: "border-red-500/40",
    badge: "bg-red-500/20 text-red-400 border border-red-500/30",
    dot: "bg-red-500",
  },
  high: {
    label: "High",
    bg: "bg-orange-500/10",
    border: "border-orange-500/40",
    badge: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    dot: "bg-orange-500",
  },
  medium: {
    label: "Medium",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    badge: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    dot: "bg-yellow-500",
  },
  low: {
    label: "Low",
    bg: "bg-gray-800/60",
    border: "border-gray-700/50",
    badge: "bg-gray-700/50 text-gray-400 border border-gray-600/30",
    dot: "bg-gray-500",
  },
};

function groupEvents(events) {
  const groups = {};
  events.forEach((e) => {
    const key = `${e.severity}__${e.type}__${e.domain}`;
    if (groups[key]) {
      groups[key].totalCount += e.count;
      groups[key].events.push(e);
    } else {
      groups[key] = { ...e, totalCount: e.count, events: [e] };
    }
  });
  return Object.values(groups);
}

function EventRow({ event }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = severityConfig[event.severity];
  const isBundle = event.totalCount > 1;

  return (
    <div
      className={`rounded-lg border ${cfg.border} ${cfg.bg} transition-all`}
    >
      <button
        className="w-full flex items-start gap-3 px-4 py-3 text-left"
        onClick={() => isBundle && setExpanded((v) => !v)}
      >
        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
              {cfg.label}
            </span>
            <span className="text-sm text-gray-200 font-medium">{event.type}</span>
            {isBundle && (
              <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-full">
                {event.totalCount} events
              </span>
            )}
            <span className="text-xs text-gray-600 ml-auto shrink-0">
              {event.timestamp}
            </span>
          </div>
          <div className="mt-0.5 text-xs text-gray-400 truncate">
            {event.description}
          </div>
          <div className="mt-0.5 text-xs text-blue-400/70 font-mono truncate">
            {event.domain}
          </div>
        </div>
        {isBundle && (
          <span className="text-gray-600 text-xs mt-1 shrink-0">
            {expanded ? "▲" : "▼"}
          </span>
        )}
      </button>

      {expanded && event.events.length > 1 && (
        <div className="px-9 pb-3 space-y-1">
          {event.events.map((e) => (
            <div key={e.id} className="text-xs text-gray-500 flex gap-2">
              <span className="font-mono text-gray-600">{e.timestamp}</span>
              <span>{e.description}</span>
            </div>
          ))}
        </div>
      )}

      <div className="px-9 pb-2 flex items-center gap-3">
        <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
          Explain impact ✦
        </button>
        <button className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          Dismiss
        </button>
        <button className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          Investigate →
        </button>
      </div>
    </div>
  );
}

export default function EventFeed({ events }) {
  const [showLow, setShowLow] = useState(false);

  const critical = events.filter((e) => e.severity === "critical");
  const high = events.filter((e) => e.severity === "high");
  const medium = events.filter((e) => e.severity === "medium");
  const low = events.filter((e) => e.severity === "low");

  const grouped = (arr) => groupEvents(arr);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-5">
      {critical.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              ● Critical
            </span>
            <span className="text-xs text-gray-600">({critical.length})</span>
          </div>
          <div className="space-y-2">
            {grouped(critical).map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {high.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
              ● High
            </span>
            <span className="text-xs text-gray-600">({high.length})</span>
          </div>
          <div className="space-y-2">
            {grouped(high).map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {medium.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
              ● Medium
            </span>
            <span className="text-xs text-gray-600">({medium.length})</span>
          </div>
          <div className="space-y-2">
            {grouped(medium).map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {low.length > 0 && (
        <section>
          <button
            onClick={() => setShowLow((v) => !v)}
            className="flex items-center gap-2 mb-2 text-left w-full group"
          >
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-gray-400 transition-colors">
              ● Low severity — {low.length} events
            </span>
            <span className="text-xs text-gray-700 group-hover:text-gray-500 transition-colors">
              {showLow ? "(hide)" : "(show)"}
            </span>
          </button>
          {showLow && (
            <div className="space-y-2">
              {grouped(low).map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
