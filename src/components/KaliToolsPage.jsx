import { useState, useMemo } from "react";
import { kaliTools, kaliToolCategories } from "../data/mockData";

const categoryIcons = {
  "Information Gathering":   "🔭",
  "Vulnerability Analysis":  "🩺",
  "Web Application Analysis":"🌐",
  "Password Attacks":        "🔑",
  "Wireless Attacks":        "📡",
  "Exploitation Tools":      "💥",
  "Sniffing & Spoofing":     "👂",
  "Post Exploitation":       "🎯",
  "Forensics":               "🔬",
  "Reverse Engineering":     "⚙️",
  "Social Engineering":      "🎭",
  "Reporting Tools":         "📋",
  "Miscellaneous":           "🛠️",
};

function TagBadge({ tag }) {
  return (
    <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-gray-700/70 text-gray-400 font-mono">
      {tag}
    </span>
  );
}

function ToolCard({ tool }) {
  return (
    <div className="bg-gray-900 border border-gray-800 hover:border-blue-500/40 rounded-xl p-4 transition-colors group">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-sm font-semibold text-gray-100 group-hover:text-blue-300 transition-colors">
          {tool.name}
        </span>
        <span className="text-xs text-gray-600 font-mono shrink-0">{tool.id}</span>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed mb-2">{tool.description}</p>
      <div className="flex flex-wrap gap-1">
        {tool.tags.map((t) => (
          <TagBadge key={t} tag={t} />
        ))}
      </div>
    </div>
  );
}

export default function KaliToolsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return kaliTools.filter((tool) => {
      const matchCat =
        activeCategory === "All" || tool.category === activeCategory;
      const matchSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((t) => t.includes(q));
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const counts = useMemo(() => {
    const map = { All: kaliTools.length };
    kaliToolCategories.forEach((cat) => {
      map[cat] = kaliTools.filter((t) => t.category === cat).length;
    });
    return map;
  }, []);

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Category sidebar */}
      <aside className="w-52 shrink-0 border-r border-gray-800 bg-gray-950 overflow-y-auto py-3">
        <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Categories
        </div>
        <button
          onClick={() => setActiveCategory("All")}
          className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-lg mx-1 transition-colors ${
            activeCategory === "All"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          }`}
        >
          <span>All Tools</span>
          <span className={`text-xs ${activeCategory === "All" ? "text-blue-200" : "text-gray-600"}`}>
            {counts.All}
          </span>
        </button>
        <div className="mt-1 space-y-0.5">
          {kaliToolCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg mx-1 transition-colors text-left ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
            >
              <span className="text-base leading-none">{categoryIcons[cat]}</span>
              <span className="flex-1 truncate text-xs">{cat}</span>
              <span className={`text-xs shrink-0 ${activeCategory === cat ? "text-blue-200" : "text-gray-600"}`}>
                {counts[cat]}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-800 bg-gray-950 shrink-0">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search tools, tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <span className="text-xs text-gray-500">
            {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "All" && (
              <span className="ml-1">in <span className="text-gray-300">{activeCategory}</span></span>
            )}
          </span>
          {(search || activeCategory !== "All") && (
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Clear ✕
            </button>
          )}
        </div>

        {/* Category header */}
        {activeCategory !== "All" && (
          <div className="px-5 py-3 border-b border-gray-800 bg-gray-950 shrink-0 flex items-center gap-2">
            <span className="text-xl">{categoryIcons[activeCategory]}</span>
            <div>
              <div className="text-sm font-semibold text-gray-100">{activeCategory}</div>
              <div className="text-xs text-gray-500">{counts[activeCategory]} tools</div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-600">
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-sm">No tools match your search</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
