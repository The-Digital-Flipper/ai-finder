export default function Header({ trialDaysLeft }) {
  return (
    <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-sm">Environment:</span>
        <select className="bg-gray-800 text-gray-200 text-sm border border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-blue-500">
          <option>Production</option>
          <option>Staging</option>
          <option>Development</option>
        </select>
        <span className="h-4 w-px bg-gray-700" />
        <span className="text-gray-400 text-sm">acmecorp.com</span>
      </div>

      <div className="flex items-center gap-4">
        {trialDaysLeft !== null && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1.5">
            <span className="text-amber-400 text-xs font-semibold">
              ⏳ {trialDaysLeft} days left in trial
            </span>
            <button className="text-xs bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold px-2 py-0.5 rounded transition-colors">
              Upgrade
            </button>
          </div>
        )}

        <button
          title="Help"
          className="text-gray-500 hover:text-gray-300 text-lg transition-colors"
        >
          ?
        </button>

        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold">
            JD
          </div>
          <span className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors">
            Jane Doe
          </span>
        </div>
      </div>
    </header>
  );
}
