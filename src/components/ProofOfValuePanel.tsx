import { proofOfValue } from '../data/mockData'
import { ShieldCheck, Ban, Cookie, Share2, FileBarChart } from 'lucide-react'

export default function ProofOfValuePanel() {
  const pov = proofOfValue

  return (
    <div className="flex flex-col gap-4 p-5 bg-gray-900 rounded-xl border border-gray-800 h-fit sticky top-4">
      <div className="flex items-center gap-2">
        <ShieldCheck size={16} className="text-indigo-400" />
        <h2 className="text-sm font-semibold text-gray-200">Proof of Value in this Session</h2>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Ban size={14} className="text-red-400" />
            Leaks prevented
          </div>
          <span className="text-lg font-bold text-red-400">{pov.leaksPrevented}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <ShieldCheck size={14} className="text-emerald-400" />
            Tracking attempts prevented
          </div>
          <span className="text-lg font-bold text-emerald-400">
            {pov.trackersBlocked.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Cookie size={14} className="text-orange-400" />
            Sensitive cookies protected
          </div>
          <span className="text-lg font-bold text-orange-400">
            {pov.sensitiveCookiesProtected}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800" />

      {/* Blocked vendor categories */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Top Blocked Vendor Categories
        </p>
        <div className="space-y-2">
          {pov.blockedVendors.map((v) => (
            <div key={v.category} className="flex items-center gap-2">
              <div className="flex-1 text-xs text-gray-400">{v.category}</div>
              <div className="text-xs font-semibold text-indigo-400">{v.count}</div>
              {/* Mini bar */}
              <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${(v.count / pov.blockedVendors[0].count) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800" />

      {/* CTAs */}
      <button className="flex items-center justify-center gap-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg px-4 py-2">
        <Share2 size={14} />
        Share with team
      </button>
      <button className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-lg px-4 py-2.5">
        <FileBarChart size={14} />
        Generate ROI Report
      </button>
    </div>
  )
}
