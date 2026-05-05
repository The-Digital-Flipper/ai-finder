import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import KpiStrip from "./components/KpiStrip";
import PersonaTabs from "./components/PersonaTabs";
import EventFeed from "./components/EventFeed";
import ProofPanel from "./components/ProofPanel";
import { kpiData, events } from "./data/mockData";

const TRIAL_DAYS = 3;

export default function App() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [activePersona, setActivePersona] = useState("executive");

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <Sidebar active={activeNav} onSelect={setActiveNav} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header trialDaysLeft={TRIAL_DAYS} />
        <KpiStrip data={kpiData} />
        <PersonaTabs active={activePersona} onSelect={setActivePersona} />

        <div className="flex flex-1 min-h-0">
          <main className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 shrink-0">
              <div>
                <h1 className="text-base font-semibold text-gray-100">
                  {activePersona === "executive" && "Outcome Summary"}
                  {activePersona === "secops" && "Security Operations Feed"}
                  {activePersona === "privacy" && "Privacy & Compliance View"}
                  {activePersona === "developer" && "Developer Diagnostics"}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {activePersona === "executive" &&
                    "Key risk outcomes and business impact for leadership"}
                  {activePersona === "secops" &&
                    "Prioritised threat events sorted by severity"}
                  {activePersona === "privacy" &&
                    "Data handling gaps, consent issues, and regulatory flags"}
                  {activePersona === "developer" &&
                    "Headers, script anomalies, and API surface exposure"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                  Filter ▾
                </button>
                <button className="text-xs text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                  Sort: Severity ▾
                </button>
                <button className="text-xs text-blue-400 hover:text-blue-300 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 px-3 py-1.5 rounded-lg transition-colors font-medium">
                  + New Scan
                </button>
              </div>
            </div>

            <EventFeed events={events} />
          </main>

          <ProofPanel trialDaysLeft={TRIAL_DAYS} />
        </div>
      </div>
    </div>
  );
}
