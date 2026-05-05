import AppShell from './components/AppShell'
import TrialBanner from './components/TrialBanner'
import KpiStrip from './components/KpiStrip'
import PersonaTabs from './components/PersonaTabs'
import EventFeed from './components/EventFeed'
import ProofOfValuePanel from './components/ProofOfValuePanel'

export default function App() {
  return (
    <AppShell>
      {/* Trial conversion banner */}
      <TrialBanner />

      {/* KPI strip */}
      <KpiStrip />

      {/* Persona tabs */}
      <PersonaTabs />

      {/* Main content split: event feed + proof of value */}
      <div className="flex gap-5 px-5 pb-8">
        {/* Left: event feed (70%) */}
        <div className="flex-1 min-w-0">
          <EventFeed />
        </div>

        {/* Right: proof of value (30%) */}
        <div className="w-72 flex-shrink-0">
          <ProofOfValuePanel />
        </div>
      </div>
    </AppShell>
  )
}
