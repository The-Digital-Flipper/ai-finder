import { useState } from 'react'
import { executiveCards } from '../data/mockData'
import { eventBundles } from '../data/mockData'
import { AlertTriangle, CheckCircle2, Lock, Code2 } from 'lucide-react'

const TABS = [
  { id: 'executive', label: 'Executive View', icon: CheckCircle2 },
  { id: 'secops', label: 'Security Ops', icon: AlertTriangle },
  { id: 'compliance', label: 'Privacy / Compliance', icon: Lock },
  { id: 'developer', label: 'Developer', icon: Code2 },
]

function ExecutiveView() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {executiveCards.map((card) => (
        <div
          key={card.id}
          className={`flex flex-col gap-2 p-4 rounded-xl border ${card.bg} ${card.border}`}
        >
          <p className="text-xs text-gray-400 font-medium">{card.title}</p>
          <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          <p className="text-xs text-gray-400 leading-relaxed">{card.detail}</p>
        </div>
      ))}
    </div>
  )
}

const severityBadge: Record<string, string> = {
  critical: 'bg-red-900/60 text-red-300 border-red-700/50',
  high: 'bg-orange-900/60 text-orange-300 border-orange-700/50',
  medium: 'bg-yellow-900/60 text-yellow-300 border-yellow-700/50',
  low: 'bg-gray-800 text-gray-400 border-gray-700/50',
}

function SecOpsView() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 bg-gray-900/60">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Severity
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Event Group
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Count
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Last Seen
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {eventBundles.map((bundle) => (
            <tr key={bundle.id} className="hover:bg-gray-800/40 transition-colors">
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${severityBadge[bundle.severity]}`}
                >
                  {bundle.severity.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-200">{bundle.title}</td>
              <td className="px-4 py-3 text-gray-300 font-mono">{bundle.count}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">{bundle.lastSeen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const complianceData = [
  { label: 'Unauthorized PII transmission', status: 'blocked', count: 47 },
  { label: 'Third-party cookie violations', status: 'blocked', count: 24 },
  { label: 'Sensitive permission exposure', status: 'blocked', count: 5 },
  { label: 'GDPR-covered data fields at risk', status: 'mitigated', count: 12 },
  { label: 'CCPA opt-out violations prevented', status: 'blocked', count: 8 },
]

function ComplianceView() {
  return (
    <div className="space-y-3">
      {complianceData.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
            <span className="text-sm text-gray-200">{item.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-emerald-400">{item.count}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-300 border border-emerald-700/40 capitalize">
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

const scriptRisks = [
  { origin: 'ad-network.co', type: 'Fingerprinting', risk: 'critical', blocked: true },
  { origin: 'cdn3.io', type: 'Cryptominer', risk: 'critical', blocked: true },
  { origin: 'analytics.io', type: 'PII Beacon', risk: 'high', blocked: true },
  { origin: 'rec.fullstory.com', type: 'Session Recorder', risk: 'high', blocked: true },
  { origin: 'segment.io', type: 'Unapproved Analytics', risk: 'medium', blocked: false },
  { origin: 'hotjar.com', type: 'Heatmap', risk: 'low', blocked: false },
]

function DeveloperView() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-sm font-mono">
        <thead>
          <tr className="border-b border-gray-800 bg-gray-900/60">
            <th className="px-4 py-3 text-left text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider">
              Origin
            </th>
            <th className="px-4 py-3 text-left text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider">
              Script Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider">
              Risk
            </th>
            <th className="px-4 py-3 text-left text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {scriptRisks.map((s, i) => (
            <tr key={i} className="hover:bg-gray-800/40 transition-colors">
              <td className="px-4 py-3 text-gray-300">{s.origin}</td>
              <td className="px-4 py-3 text-gray-400 font-sans">{s.type}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border font-sans ${severityBadge[s.risk]}`}
                >
                  {s.risk.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3 font-sans">
                {s.blocked ? (
                  <span className="text-red-400 text-xs">BLOCKED</span>
                ) : (
                  <span className="text-yellow-400 text-xs">MONITORING</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function PersonaTabs() {
  const [activeTab, setActiveTab] = useState('executive')

  return (
    <div className="px-5 pb-4">
      {/* Tab bar */}
      <div className="flex gap-1 mb-4 border-b border-gray-800">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === id
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-200'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'executive' && <ExecutiveView />}
      {activeTab === 'secops' && <SecOpsView />}
      {activeTab === 'compliance' && <ComplianceView />}
      {activeTab === 'developer' && <DeveloperView />}
    </div>
  )
}
