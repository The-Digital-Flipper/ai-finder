import { useState } from "react";
import { navItems } from "../data/mockData";

export default function Sidebar({ active, onSelect }) {
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col py-4 shrink-0">
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            BC
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">
            Browser Clarity
          </span>
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              active === item.id
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-2 mt-2">
        <button
          onClick={() => setToolsOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          <span>Tools</span>
          <span className="text-xs">{toolsOpen ? "▲" : "▼"}</span>
        </button>
        {toolsOpen && (
          <div className="mt-1 pl-3 space-y-0.5">
            {["Packet Capture", "Cookie Inspector", "Header Analyser", "Script Profiler"].map(
              (t) => (
                <button
                  key={t}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors"
                >
                  {t}
                </button>
              )
            )}
          </div>
        )}
      </div>

      <div className="px-4 mt-4 pt-4 border-t border-gray-800">
        <div className="text-xs text-gray-600">v2.4.1 · acmecorp.com</div>
      </div>
    </aside>
  );
}
