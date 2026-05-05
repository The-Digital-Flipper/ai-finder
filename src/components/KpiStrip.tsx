import KpiCard from './KpiCard'
import { kpiData } from '../data/mockData'

interface Props {
  onKpiClick?: (id: string) => void
}

export default function KpiStrip({ onKpiClick }: Props) {
  return (
    <div className="flex gap-3 px-5 py-4 flex-wrap">
      {kpiData.map((kpi) => (
        <KpiCard key={kpi.id} data={kpi} onClick={() => onKpiClick?.(kpi.id)} />
      ))}
    </div>
  )
}
