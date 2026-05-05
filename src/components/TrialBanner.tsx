import { useState } from 'react'
import { X, CheckCircle2, Circle, Zap } from 'lucide-react'

const checklist = [
  { id: 1, label: 'Connect 3 key sites', done: true },
  { id: 2, label: 'Run 1 full scan', done: true },
  { id: 3, label: 'Export baseline report', done: false },
]

export default function TrialBanner() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="flex items-center justify-between gap-4 bg-indigo-950/70 border border-indigo-700/50 px-5 py-3 flex-wrap gap-y-2">
      {/* Left: countdown */}
      <div className="flex items-center gap-2">
        <Zap size={16} className="text-indigo-400 flex-shrink-0" />
        <p className="text-sm text-indigo-200">
          <span className="font-semibold text-white">3 days left</span> to export your first
          security baseline
        </p>
      </div>

      {/* Middle: checklist */}
      <div className="flex items-center gap-4">
        {checklist.map((item) => (
          <div key={item.id} className="flex items-center gap-1.5 text-xs">
            {item.done ? (
              <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
            ) : (
              <Circle size={14} className="text-gray-500 flex-shrink-0" />
            )}
            <span className={item.done ? 'text-emerald-300' : 'text-gray-400'}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Right: CTAs */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 transition-colors text-white px-4 py-1.5 rounded-lg">
          Upgrade Now
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
