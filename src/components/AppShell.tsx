import { useState } from 'react'
import {
  LayoutDashboard,
  Search,
  ShieldCheck,
  FileText,
  Plug,
  Settings,
  ChevronDown,
  ChevronRight,
  Wrench,
  ScanLine,
  Globe,
  Database,
  Bell,
  HelpCircle,
  User,
  Menu,
  X,
} from 'lucide-react'

const primaryNav = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'investigate', label: 'Investigate', icon: Search },
  { id: 'protect', label: 'Protect', icon: ShieldCheck },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const toolsNav = [
  { id: 'scanner', label: 'Full Scanner', icon: ScanLine },
  { id: 'domains', label: 'Domain Watch', icon: Globe },
  { id: 'datamap', label: 'Data Map', icon: Database },
]

interface Props {
  children: React.ReactNode
}

export default function AppShell({ children }: Props) {
  const [active, setActive] = useState('dashboard')
  const [toolsOpen, setToolsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300 ${
          sidebarOpen ? 'w-56' : 'w-14'
        } flex-shrink-0`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-800">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <span className="text-sm font-bold text-white tracking-wide whitespace-nowrap">
              Browser Clarity
            </span>
          )}
        </div>

        {/* Primary nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {primaryNav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors ${
                active === id
                  ? 'bg-indigo-600/20 text-indigo-400 font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
            </button>
          ))}
        </nav>

        {/* Tools drawer */}
        <div className="px-2 pb-4 border-t border-gray-800 pt-3">
          <button
            onClick={() => setToolsOpen((o) => !o)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors"
          >
            <Wrench size={18} className="flex-shrink-0" />
            {sidebarOpen && (
              <>
                <span className="flex-1 text-left whitespace-nowrap">Tools</span>
                {toolsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </>
            )}
          </button>
          {toolsOpen && sidebarOpen && (
            <div className="ml-3 mt-1 space-y-1">
              {toolsNav.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors ${
                    active === id
                      ? 'bg-indigo-600/20 text-indigo-400 font-medium'
                      : 'text-gray-500 hover:bg-gray-800 hover:text-gray-100'
                  }`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-3 bg-gray-900 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="text-gray-400 hover:text-gray-100 transition-colors"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <span className="text-xs font-medium text-gray-500 bg-gray-800 px-2 py-1 rounded">
              Production — acme.com
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-400 hover:text-gray-100 transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                3
              </span>
            </button>
            <button className="text-gray-400 hover:text-gray-100 transition-colors">
              <HelpCircle size={18} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-7 h-7 bg-indigo-700 rounded-full flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <span className="text-sm text-gray-300 hidden sm:block">Jamie T.</span>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
