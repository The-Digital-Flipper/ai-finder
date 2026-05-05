import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { KpiData } from '../data/mockData'

const severityStyles: Record<KpiData['severity'], { value: string; bg: string; border: string }> = {
  critical: {
    value: 'text-red-400',
    bg: 'bg-red-950/40',
    border: 'border-red-800/50',
  },
  high: {
    value: 'text-orange-400',
    bg: 'bg-orange-950/40',
    border: 'border-orange-800/50',
  },
  medium: {
    value: 'text-yellow-400',
    bg: 'bg-yellow-950/40',
    border: 'border-yellow-800/50',
  },
  low: {
    value: 'text-gray-400',
    bg: 'bg-gray-800/40',
    border: 'border-gray-700/50',
  },
  good: {
    value: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-800/50',
  },
}

const sparklineColor: Record<KpiData['severity'], string> = {
  critical: '#f87171',
  high: '#fb923c',
  medium: '#facc15',
  low: '#9ca3af',
  good: '#34d399',
}

interface Props {
  data: KpiData
  onClick?: () => void
}

export default function KpiCard({ data, onClick }: Props) {
  const styles = severityStyles[data.severity]
  const color = sparklineColor[data.severity]
  const isUp = data.deltaPositive

  return (
    <button
      onClick={onClick}
      className={`flex flex-col gap-2 p-4 rounded-xl border ${styles.bg} ${styles.border} hover:brightness-110 transition-all text-left flex-1 min-w-[150px]`}
    >
      <p className="text-xs text-gray-400 font-medium leading-tight">{data.label}</p>
      <p className={`text-3xl font-bold leading-none ${styles.value}`}>{data.value}</p>

      {/* Delta */}
      <div className="flex items-center gap-1">
        {isUp ? (
          <TrendingUp size={12} className="text-emerald-400" />
        ) : (
          <TrendingDown size={12} className="text-red-400" />
        )}
        <span className={`text-[11px] font-medium ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {data.delta}
        </span>
      </div>

      {/* Sparkline */}
      <div className="h-8 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.sparkline}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </button>
  )
}
