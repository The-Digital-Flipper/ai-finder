import { useState } from 'react'
import { ChevronDown, ChevronRight, Sparkles, AlertOctagon, AlertTriangle, Info, Minus } from 'lucide-react'
import { eventBundles } from '../data/mockData'
import type { Severity } from '../data/mockData'

const severityConfig: Record<
  Severity,
  { label: string; badge: string; icon: React.ReactNode; rowBg: string }
> = {
  critical: {
    label: 'CRITICAL',
    badge: 'bg-red-900/60 text-red-300 border-red-700/50',
    icon: <AlertOctagon size={14} className="text-red-400" />,
    rowBg: 'border-red-900/30 bg-red-950/20',
  },
  high: {
    label: 'HIGH',
    badge: 'bg-orange-900/60 text-orange-300 border-orange-700/50',
    icon: <AlertTriangle size={14} className="text-orange-400" />,
    rowBg: 'border-orange-900/30 bg-orange-950/20',
  },
  medium: {
    label: 'MEDIUM',
    badge: 'bg-yellow-900/60 text-yellow-300 border-yellow-700/50',
    icon: <Info size={14} className="text-yellow-400" />,
    rowBg: 'border-yellow-900/20 bg-yellow-950/10',
  },
  low: {
    label: 'LOW',
    badge: 'bg-gray-800 text-gray-400 border-gray-700/50',
    icon: <Minus size={14} className="text-gray-500" />,
    rowBg: 'border-gray-800 bg-gray-900/30',
  },
}

const severityOrder: Severity[] = ['critical', 'high', 'medium', 'low']

function EventBundle({
  bundle,
  defaultOpen,
}: {
  bundle: (typeof eventBundles)[number]
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const [showAI, setShowAI] = useState(false)
  const cfg = severityConfig[bundle.severity]

  return (
    <div className={`rounded-xl border ${cfg.rowBg} overflow-hidden`}>
      {/* Header row */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 hover:brightness-110 transition-all"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="flex-shrink-0">{cfg.icon}</span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.badge} flex-shrink-0`}
        >
          {cfg.label}
        </span>
        <span className="flex-1 text-left text-sm text-gray-200 font-medium">{bundle.title}</span>
        <span className="text-xs text-gray-500 flex-shrink-0">({bundle.count})</span>
        <span className="text-xs text-gray-600 flex-shrink-0 ml-1">{bundle.lastSeen}</span>
        <span className="flex-shrink-0 text-gray-500 ml-2">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>

      {/* Expanded body */}
      {open && (
        <div className="px-4 pb-4 space-y-3">
          {/* AI Summary */}
          <button
            onClick={() => setShowAI((s) => !s)}
            className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            <Sparkles size={13} />
            {showAI ? 'Hide impact explanation' : 'Explain impact'}
          </button>
          {showAI && (
            <p className="text-xs text-gray-300 leading-relaxed bg-indigo-950/40 border border-indigo-800/30 rounded-lg px-3 py-2">
              {bundle.aiSummary}
            </p>
          )}

          {/* Event list */}
          <div className="space-y-1.5">
            {bundle.events.map((ev, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[10px] text-gray-600 font-mono pt-0.5 flex-shrink-0 w-9">
                  {ev.time}
                </span>
                <span className="text-xs text-gray-400">{ev.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function EventFeed() {
  const sorted = [...eventBundles].sort(
    (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity),
  )

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-gray-300">Security Events</h2>
      {sorted.map((bundle) => (
        <EventBundle
          key={bundle.id}
          bundle={bundle}
          defaultOpen={bundle.severity === 'critical' || bundle.severity === 'high'}
        />
      ))}
    </div>
  )
}
