/* ========================================
   AI FINDER — REPLIT-STYLE DASHBOARD JS
   ======================================== */

// ── Sidebar Navigation ─────────────────────────────────────
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

function navigateTo(sectionId) {
  navItems.forEach(n => n.classList.toggle('active', n.dataset.section === sectionId));
  sections.forEach(s => s.classList.toggle('active', s.id === `section-${sectionId}`));
}

navItems.forEach(n => n.addEventListener('click', e => {
  e.preventDefault();
  navigateTo(n.dataset.section);
}));

// ── Projects Store ─────────────────────────────────────────
const STORAGE_KEY = 'aifinder_projects';

function getProjects() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultProjects(); }
  catch { return defaultProjects(); }
}
function saveProjects(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }

function defaultProjects() {
  return [
    { id: 1, name: 'tube-shorts-pro',  stack: 'Node.js',  icon: '🎬', bg: '#1a1a40', desc: 'YouTube Shorts optimizer',      updatedAt: '2 days ago' },
    { id: 2, name: 'shopify-scraper',  stack: 'Python',   icon: '🛒', bg: '#1a3326', desc: 'E-commerce product crawler',    updatedAt: '4 days ago' },
    { id: 3, name: 'discord-mod-bot',  stack: 'Node.js',  icon: '🤖', bg: '#1e2151', desc: 'Moderation + slash commands',   updatedAt: '1 week ago' },
    { id: 4, name: 'ai-finder-api',    stack: 'Node.js',  icon: '🔍', bg: '#2d1b4e', desc: 'AI tool discovery API',         updatedAt: '2 weeks ago' },
    { id: 5, name: 'crypto-dashboard', stack: 'React',    icon: '📊', bg: '#1a2e1a', desc: 'Real-time price tracker',       updatedAt: '3 weeks ago' },
    { id: 6, name: 'todo-cli',         stack: 'Python',   icon: '✅', bg: '#2d1a00', desc: 'Command-line task manager',     updatedAt: '1 month ago' },
  ];
}

const stackIcons = { 'Node.js':'🟢', Python:'🐍', React:'⚛️', 'HTML/CSS/JS':'🌐', Go:'🐹', Rust:'🦀' };

// ── Render Projects ─────────────────────────────────────────
function renderProjects(filter = 'all') {
  const grid = document.getElementById('projectsGrid');
  let projects = getProjects();
  if (filter === 'apps') projects = projects.filter(p => !p.name.includes('bot') && !p.name.includes('api'));
  if (filter === 'bots') projects = projects.filter(p => p.name.includes('bot'));
  if (filter === 'apis') projects = projects.filter(p => p.name.includes('api'));

  grid.innerHTML = '';
  projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${i * 0.045}s`;
    card.innerHTML = `
      <div class="project-card-icon" style="background:${p.bg}">${p.icon}</div>
      <div class="project-card-info">
        <div class="project-name">${p.name}</div>
        <div class="project-meta">${stackIcons[p.stack] || ''} ${p.stack} · ${p.updatedAt}</div>
      </div>
      <div class="project-card-actions">
        <button class="card-action-btn delete-btn" data-id="${p.id}" title="Delete">✕</button>
      </div>
    `;
    card.addEventListener('click', e => {
      if (e.target.closest('.delete-btn')) return;
      openBuildModal(`Opening ${p.name}…`, p);
    });
    grid.appendChild(card);
  });

  // Delete buttons
  grid.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const deleted = getProjects().find(p => p.id === id);
      saveProjects(getProjects().filter(p => p.id !== id));
      renderProjects(currentTab);
      if (deleted) showToast(`Deleted "${deleted.name}"`, 'info');
    });
  });

  // Template cards
  document.querySelectorAll('.template-card').forEach(tc => {
    tc.addEventListener('click', () => {
      document.getElementById('promptInput').value = tc.dataset.tpl;
      navigateTo('home');
      document.getElementById('promptInput').focus();
    });
  });
}

let currentTab = 'all';
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentTab = tab.dataset.tab;
    renderProjects(currentTab);
  });
});
renderProjects();

// ── Limit banner close ──────────────────────────────────────
document.getElementById('limitClose').addEventListener('click', () => {
  document.getElementById('limitBanner').style.display = 'none';
});

// ── Create Project Modal ────────────────────────────────────
const modalOverlay  = document.getElementById('modalOverlay');
const newProjectName = document.getElementById('newProjectName');
const newProjectDesc = document.getElementById('newProjectDesc');

function openCreateModal(prefillName = '') {
  newProjectName.value = prefillName;
  newProjectDesc.value = '';
  modalOverlay.classList.add('open');
  setTimeout(() => newProjectName.focus(), 100);
}
function closeCreateModal() { modalOverlay.classList.remove('open'); }

document.getElementById('newProjectBtn').addEventListener('click',    () => openCreateModal());
document.getElementById('sidebarCreateBtn').addEventListener('click', () => openCreateModal());
document.getElementById('modalClose').addEventListener('click',        closeCreateModal);
document.getElementById('modalCancelBtn').addEventListener('click',    closeCreateModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeCreateModal(); });

let selectedStack = 'Node.js';
document.querySelectorAll('.stack-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.stack-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedStack = btn.dataset.stack;
  });
});

document.getElementById('modalCreateBtn').addEventListener('click', () => {
  const name = newProjectName.value.trim() || 'my-project';
  const desc = newProjectDesc.value.trim() || `${selectedStack} project`;
  const bgMap   = { 'Node.js':'#1a1a40', Python:'#1a3326', React:'#0a2840', 'HTML/CSS/JS':'#1a2d1a', Go:'#002d2d', Rust:'#2d1a00' };
  const iconMap = { 'Node.js':'🟢', Python:'🐍', React:'⚛️', 'HTML/CSS/JS':'🌐', Go:'🐹', Rust:'🦀' };
  const newP = { id: Date.now(), name: name.toLowerCase().replace(/\s+/g, '-'), stack: selectedStack,
                 icon: iconMap[selectedStack] || '📁', bg: bgMap[selectedStack] || '#1a1a2e', desc, updatedAt: 'just now' };
  const projects = getProjects();
  projects.unshift(newP);
  saveProjects(projects);
  closeCreateModal();
  renderProjects(currentTab);
  showToast(`✓ "${newP.name}" created`, 'success');
  openBuildModal(`Creating ${newP.name}…`, newP);
});

newProjectName.addEventListener('keypress', e => {
  if (e.key === 'Enter') document.getElementById('modalCreateBtn').click();
});

// ── Build Output Modal ──────────────────────────────────────
const buildOverlay   = document.getElementById('buildOverlay');
const buildTerminal  = document.getElementById('buildTerminal');
const buildActions   = document.getElementById('buildActions');
const buildModalTitle = document.getElementById('buildModalTitle');
let pendingProject   = null;

function openBuildModal(title, project) {
  pendingProject = project;
  buildModalTitle.textContent = title;
  buildTerminal.innerHTML = '';
  buildActions.style.display = 'none';
  buildOverlay.classList.add('open');

  const steps = [
    { text: `Initializing ${project.name}…`, cls: 't-info',    delay: 0 },
    { text: `Setting up ${project.stack} environment`,         delay: 380 },
    { text: 'Installing dependencies…',                        delay: 860 },
    { text: 'npm install  ✓',              cls: 't-success',   delay: 1500 },
    { text: 'Configuring dev server…',                         delay: 1900 },
    { text: 'Running health check…',        cls: 't-info',    delay: 2500 },
    { text: `✓ ${project.name} is ready on port 3000`, cls: 't-success', delay: 3100 },
  ];

  steps.forEach(({ text, cls = '', delay }) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = `terminal-line ${cls}`;
      line.innerHTML = `<span class="t-prompt">$</span> ${text}`;
      buildTerminal.appendChild(line);
      buildTerminal.scrollTop = buildTerminal.scrollHeight;
      if (delay === 3100) setTimeout(() => { buildActions.style.display = 'flex'; }, 350);
    }, delay);
  });
}

document.getElementById('buildModalClose').addEventListener('click', () => buildOverlay.classList.remove('open'));
buildOverlay.addEventListener('click', e => { if (e.target === buildOverlay) buildOverlay.classList.remove('open'); });

document.getElementById('openProjectBtn').addEventListener('click', () => {
  buildOverlay.classList.remove('open');
  if (pendingProject) openWorkspace(pendingProject);
});

// ── AI Prompt Submit ────────────────────────────────────────
async function submitPrompt(mode = 'build') {
  const text = document.getElementById('promptInput').value.trim();
  if (!text) { document.getElementById('promptInput').focus(); return; }

  const name = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().split(/\s+/).slice(0, 4).join('-');

  if (mode === 'plan') { openBuildModal(`Planning: ${name}`, { name, stack: 'Node.js' }); return; }

  const proj = { name, stack: 'Node.js', icon: '✨', bg: '#1e1a40', desc: text, updatedAt: 'just now' };
  openBuildModal(`Building ${name}…`, proj);

  try {
    await fetch('/api/build', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: text }) });
  } catch {}

  const projects = getProjects();
  projects.unshift({ ...proj, id: Date.now() });
  saveProjects(projects);
  renderProjects(currentTab);
  document.getElementById('promptInput').value = '';
}

document.getElementById('btnSubmit').addEventListener('click', () => submitPrompt('build'));
document.getElementById('btnPlan').addEventListener('click',   () => submitPrompt('plan'));
document.getElementById('promptInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submitPrompt('build');
});

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.getElementById('promptInput').value = chip.dataset.tpl;
    document.getElementById('promptInput').focus();
  });
});

const textarea = document.getElementById('promptInput');
textarea.addEventListener('input', () => {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 220) + 'px';
});

// ════════════════════════════════════════════════════════════
// WORKSPACE
// ════════════════════════════════════════════════════════════
const workspace = document.getElementById('workspace');
let activeProject = null;
let activeWsPane  = 'editor';

// Code samples per stack
const codeTemplates = {
  'Node.js': `const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from your app!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
  Python: `from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def hello():
    return jsonify({'message': 'Hello from your app!'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)`,
  React: `import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <h1>Hello from your React app!</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}`,
  'HTML/CSS/JS': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My App</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #0d0d0d; color: #fff; }
    h1 { color: #3b82f6; }
  </style>
</head>
<body>
  <h1>Hello from your App!</h1>
  <p>Edit this file to get started.</p>
  <script>
    console.log('App loaded!');
  </script>
</body>
</html>`,
  Go: `package main

import (
"encoding/json"
"fmt"
"net/http"
)

func main() {
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
w.Header().Set("Content-Type", "application/json")
json.NewEncoder(w).Encode(map[string]string{"message": "Hello from Go!"})
})
fmt.Println("Server running on :3000")
http.ListenAndServe(":3000", nil)
}`,
  Rust: `use std::io::{self, Write};

fn main() {
    println!("Hello from your Rust app!");
    print!("Enter your name: ");
    io::stdout().flush().unwrap();
    let mut name = String::new();
    io::stdin().read_line(&mut name).unwrap();
    println!("Hello, {}!", name.trim());
}`,
};

const filesByStack = {
  'Node.js':    [{ name: 'index.js', lang: 'JavaScript' }, { name: 'package.json', lang: 'JSON' }, { name: '.env', lang: 'ENV' }, { name: 'README.md', lang: 'Markdown' }],
  Python:       [{ name: 'main.py', lang: 'Python' }, { name: 'requirements.txt', lang: 'Text' }, { name: '.env', lang: 'ENV' }, { name: 'README.md', lang: 'Markdown' }],
  React:        [{ name: 'src/App.jsx', lang: 'JSX' }, { name: 'src/index.js', lang: 'JavaScript' }, { name: 'package.json', lang: 'JSON' }, { name: 'public/index.html', lang: 'HTML' }],
  'HTML/CSS/JS':[{ name: 'index.html', lang: 'HTML' }, { name: 'style.css', lang: 'CSS' }, { name: 'script.js', lang: 'JavaScript' }],
  Go:           [{ name: 'main.go', lang: 'Go' }, { name: 'go.mod', lang: 'Module' }, { name: 'README.md', lang: 'Markdown' }],
  Rust:         [{ name: 'src/main.rs', lang: 'Rust' }, { name: 'Cargo.toml', lang: 'TOML' }, { name: 'README.md', lang: 'Markdown' }],
};

function openWorkspace(project) {
  activeProject = project;
  workspace.classList.add('open');

  // panel project name
  document.getElementById('wsPanelProjectName').textContent = project.name;

  // update status bar
  const firstFile = (filesByStack[project.stack] || filesByStack['Node.js'])[0];
  document.getElementById('wsStatusProject').textContent = project.name;
  document.getElementById('wsStatusStack').textContent   = project.stack;
  document.getElementById('wsStatusFile').textContent    = firstFile?.name || 'index.js';

  // breadcrumb
  updateBreadcrumb(project, firstFile?.name || 'index.js');

  // build tab bar
  buildWsTabs(['editor', 'terminal', 'preview']);

  // render file tree
  renderFileTree(project.stack);

  // load code editor
  openWsPane('editor');
  loadCode(project.stack);

  // boot terminal
  bootTerminal(project);

  // init env panel
  initEnvPane(project.stack);

  // reset simulated app preview
  const simApp = document.getElementById('wsSimApp');
  if (simApp) {
    simApp.innerHTML = '<div class="ws-sim-loading" id="wsSimLoading"><div class="ws-sim-spinner"></div><span>Starting server…</span></div>';
  }

  // init git panel
  gitChanges = [];
  updateGitPanel();
}

function closeWorkspace() {
  workspace.classList.remove('open');
  activeProject = null;
}

document.getElementById('wsBackBtn').addEventListener('click', closeWorkspace);

// ── WS Tabs ──────────────────────────────────────────────────
const WS_TAB_LABELS = { editor: 'Code', terminal: 'Terminal', preview: 'Preview', publishing: '🌐 Publishing', integrations: '⚡ Integrations', database: '🗄 Database', storage: '📦 Storage', auth: '🔐 Auth' };
let openWsTabs = [];

function buildWsTabs(panes) {
  openWsTabs = [...panes];
  renderWsTabs();
}

function renderWsTabs() {
  const container = document.getElementById('wsTabs');
  container.innerHTML = '';

  openWsTabs.forEach(pane => {
    const tab = document.createElement('button');
    tab.className = `ws-tab${activeWsPane === pane ? ' active' : ''}`;
    tab.dataset.pane = pane;
    tab.innerHTML = `${WS_TAB_LABELS[pane] || pane}<button class="ws-tab-close" data-pane="${pane}">✕</button>`;
    tab.addEventListener('click', e => {
      if (e.target.closest('.ws-tab-close')) {
        closeWsTab(e.target.closest('.ws-tab-close').dataset.pane);
      } else {
        openWsPane(pane);
      }
    });
    container.appendChild(tab);
  });

  // + button
  const addBtn = document.createElement('button');
  addBtn.className = 'ws-tab-add';
  addBtn.textContent = '+';
  addBtn.title = 'Add tab';
  addBtn.addEventListener('click', openToolsPanel);
  container.appendChild(addBtn);
}

function openWsPane(pane) {
  activeWsPane = pane;
  document.querySelectorAll('.ws-editor-pane').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`pane-${pane}`);
  if (target) target.classList.add('active');
  renderWsTabs();
}

function closeWsTab(pane) {
  openWsTabs = openWsTabs.filter(t => t !== pane);
  if (activeWsPane === pane) activeWsPane = openWsTabs[0] || 'editor';
  if (!openWsTabs.includes(activeWsPane)) openWsTabs.push(activeWsPane);
  renderWsTabs();
  openWsPane(activeWsPane);
}

function addWsTab(pane) {
  if (!openWsTabs.includes(pane)) openWsTabs.push(pane);
  openWsPane(pane);
}

// ── File tree ────────────────────────────────────────────────
function renderFileTree(stack) {
  const files = filesByStack[stack] || filesByStack['Node.js'];
  const tree  = document.getElementById('wsFileTree');
  tree.innerHTML = '';

  files.forEach((f, i) => {
    const item = document.createElement('div');
    item.className = `ws-file-item${i === 0 ? ' active' : ''}`;
    item.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
      ${f.name}
    `;
    item.addEventListener('click', () => {
      tree.querySelectorAll('.ws-file-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      document.getElementById('wsCodeFilename').textContent = f.name;
      const sbFile = document.getElementById('wsStatusFile');
      if (sbFile) sbFile.textContent = f.name;
      document.getElementById('wsCodeLang') && (document.getElementById('wsCodeLang').textContent = f.lang);
      updateBreadcrumb(activeProject, f.name);
      openWsPane('editor');
    });
    tree.appendChild(item);
  });
}

// ── Code editor ──────────────────────────────────────────────
function highlightCode(raw, stack) {
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const isJS   = ['Node.js','React','HTML/CSS/JS'].includes(stack);
  const isPy   = stack === 'Python';
  const isGo   = stack === 'Go';
  const isRust = stack === 'Rust';

  const JS_KW  = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|import|export|default|from|class|extends|new|this|typeof|instanceof|async|await|try|catch|finally|throw|in|of|null|undefined|true|false|void|delete|require|module)\b/y;
  const PY_KW  = /\b(def|class|return|if|elif|else|for|while|import|from|as|in|not|and|or|True|False|None|with|try|except|finally|raise|pass|break|continue|lambda|yield|global|nonlocal|del|print)\b/y;
  const GO_KW  = /\b(func|var|const|type|struct|interface|package|import|return|if|else|for|range|switch|case|default|break|continue|go|chan|select|defer|map|nil|true|false|make|new|append|len|fmt|http|json)\b/y;
  const RS_KW  = /\b(fn|let|mut|const|use|mod|pub|struct|enum|impl|trait|return|if|else|for|while|loop|match|break|continue|self|Self|super|in|where|type|async|await|dyn|move|ref|crate|extern|unsafe|true|false|println|unwrap)\b/y;

  const patterns = [
    // single-line comments
    ...(isJS   ? [{ re: /\/\/.*/y,              cls:'hl-comment' }] : []),
    ...(isPy   ? [{ re: /#.*/y,                 cls:'hl-comment' }] : []),
    ...(isGo||isRust ? [{ re: /\/\/.*/y,        cls:'hl-comment' }] : []),
    // block comments
    ...(isJS||isGo||isRust ? [{ re: /\/\*[\s\S]*?\*\//y, cls:'hl-comment' }] : []),
    // triple-quoted strings (Python)
    ...(isPy   ? [{ re: /"""[\s\S]*?"""/y,      cls:'hl-string'  }] : []),
    // template literals
    ...(isJS   ? [{ re: /`(?:[^`\\]|\\.)*`/y,   cls:'hl-string'  }] : []),
    // regular strings
    { re: /"(?:[^"\\]|\\.)*"/y,                  cls:'hl-string'  },
    { re: /'(?:[^'\\]|\\.)*'/y,                  cls:'hl-string'  },
    // keywords
    ...(isJS   ? [{ re: JS_KW,                   cls:'hl-keyword' }] : []),
    ...(isPy   ? [{ re: PY_KW,                   cls:'hl-keyword' }] : []),
    ...(isGo   ? [{ re: GO_KW,                   cls:'hl-keyword' }] : []),
    ...(isRust ? [{ re: RS_KW,                   cls:'hl-keyword' }] : []),
    // class / type names (CapCase)
    { re: /\b([A-Z][a-zA-Z0-9]*)\b/y,            cls:'hl-class'   },
    // function calls
    { re: /\b([a-zA-Z_$]\w*)\s*(?=\()/y,         cls:'hl-function'},
    // numbers
    { re: /\b(\d+\.?\d*)\b/y,                     cls:'hl-number'  },
  ];

  let out = '';
  let pos = 0;

  while (pos < raw.length) {
    let matched = false;
    for (const { re, cls } of patterns) {
      re.lastIndex = pos;
      const m = re.exec(raw);
      if (m && m.index === pos) {
        out += `<span class="${cls}">${esc(m[0])}</span>`;
        pos += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) { out += esc(raw[pos]); pos++; }
  }
  return out;
}

function loadCode(stack) {
  const code    = codeTemplates[stack] || codeTemplates['Node.js'];
  const lines   = code.split('\n');
  const content = document.getElementById('wsCodeContent');
  const nums    = document.getElementById('wsLineNums');
  const file    = filesByStack[stack]?.[0];

  document.getElementById('wsCodeFilename').textContent = file ? file.name : 'index.js';

  content.innerHTML = highlightCode(code, stack);
  nums.innerHTML = lines.map((_, i) => `${i + 1}`).join('\n');
}

// ── Terminal ─────────────────────────────────────────────────
function bootTerminal(project) {
  const output = document.getElementById('wsTerminalOutput');
  output.innerHTML = '';

  const steps = [
    { text: `~ % cd ${project.name}`,                        cls: '',        delay: 0 },
    { text: `Setting up ${project.stack} environment…`,      cls: 'info',    delay: 300 },
    { text: 'Installing packages…',                          cls: '',        delay: 700 },
    { text: 'Done — packages installed',                     cls: 'success', delay: 1400 },
    { text: 'Starting dev server on port 3000…',             cls: 'info',    delay: 1700 },
    { text: `✓ ${project.name} is running at http://localhost:3000`, cls: 'success', delay: 2200 },
  ];

  steps.forEach(({ text, cls, delay }) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = `ws-term-line ${cls}`;
      line.textContent = text;
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    }, delay);
  });
}

// Terminal input
document.getElementById('wsTerminalInput').addEventListener('keypress', e => {
  if (e.key !== 'Enter') return;
  const val = e.target.value.trim();
  if (!val) return;
  const output = document.getElementById('wsTerminalOutput');
  const cmdLine = document.createElement('div');
  cmdLine.className = 'ws-term-line';
  cmdLine.textContent = `$ ${val}`;
  output.appendChild(cmdLine);
  const resp = document.createElement('div');
  resp.className = 'ws-term-line info';
  resp.textContent = simulateCommand(val);
  output.appendChild(resp);
  output.scrollTop = output.scrollHeight;
  e.target.value = '';
});

document.getElementById('wsTermClearBtn').addEventListener('click', () => {
  document.getElementById('wsTerminalOutput').innerHTML = '';
});

function simulateCommand(cmd) {
  if (/^ls/.test(cmd))       return 'index.js  package.json  node_modules  .env  README.md';
  if (/^pwd/.test(cmd))      return `/home/runner/${activeProject?.name || 'project'}`;
  if (/^npm /.test(cmd))     return 'npm: command executed successfully';
  if (/^python/.test(cmd))   return 'Python 3.11.0 — running…';
  if (/^node /.test(cmd))    return 'Node.js — process started';
  if (/^cat /.test(cmd))     return '(file contents would appear here)';
  if (/^clear/.test(cmd))    { document.getElementById('wsTerminalOutput').innerHTML = ''; return ''; }
  if (/^echo /.test(cmd))    return cmd.replace(/^echo\s+/, '');
  return `command not found: ${cmd.split(' ')[0]}`;
}

// Shell (left panel)
document.getElementById('wsShellInput').addEventListener('keypress', e => {
  if (e.key !== 'Enter') return;
  const val = e.target.value.trim();
  if (!val) return;
  const term = document.getElementById('wsShellTerm');
  const line = document.createElement('div');
  line.className = 'ws-shell-line';
  line.innerHTML = `<span class="ws-prompt">~$</span> ${val}`;
  term.appendChild(line);
  const out = document.createElement('div');
  out.className = 'ws-shell-line';
  out.style.color = '#888';
  out.textContent = simulateCommand(val);
  term.appendChild(out);
  term.scrollTop = term.scrollHeight;
  e.target.value = '';
});

// ── WS Icon bar ──────────────────────────────────────────────
document.querySelectorAll('.ws-icon[data-panel]').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.dataset.panel;
    if (panel === 'tools') { openToolsPanel(); return; }
    document.querySelectorAll('.ws-icon').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.ws-panel-content').forEach(p => p.classList.add('hidden'));
    const target = { files: 'wsPanelFiles', git: 'wsPanelGit', shell: 'wsPanelShell' }[panel];
    if (target) document.getElementById(target).classList.remove('hidden');
  });
});

// Workspace search icon opens tools panel
document.getElementById('wsSearchBtn').addEventListener('click', openToolsPanel);
// Republish → open Publishing pane
document.getElementById('wsRepublishBtn').addEventListener('click', () => addWsTab('publishing'));

// ════════════════════════════════════════════════════════════
// TOOLS PANEL
// ════════════════════════════════════════════════════════════
const toolsPanel   = document.getElementById('toolsPanel');
const toolsOverlay = document.getElementById('toolsPanelOverlay');
const toolsSearch  = document.getElementById('toolsSearchInput');
let toolsContext   = 'workspace'; // or 'dashboard'

const ALL_TOOLS = [
  { id: 'preview',      label: 'Preview',      desc: 'Preview your App' },
  { id: 'publishing',   label: 'Publishing',   desc: 'Publish a live, stable, public version of your App' },
  { id: 'integrations', label: 'Integrations', desc: 'Connect to Replit-native and external services' },
  { id: 'database',     label: 'Database',     desc: 'Stores structured data such as user profiles and game scores' },
  { id: 'storage',      label: 'App Storage',  desc: "Replit's built-in object storage for uploads" },
  { id: 'auth',         label: 'Auth',         desc: 'Let users log in to your App using a prebuilt login page' },
];

function openToolsPanel(ctx = null) {
  toolsContext = workspace.classList.contains('open') ? 'workspace' : 'dashboard';

  if (toolsContext === 'workspace') {
    toolsPanel.classList.remove('dashboard-mode');
    toolsPanel.style.top  = '40px';
    toolsPanel.style.left = '44px';
    toolsPanel.style.transform = '';
  } else {
    toolsPanel.classList.add('dashboard-mode');
    toolsPanel.style.top       = '';
    toolsPanel.style.left      = '';
    toolsPanel.style.transform = '';
  }

  toolsPanel.classList.add('open');
  toolsOverlay.classList.add('visible');
  toolsSearch.value = '';
  filterTools('');
  setTimeout(() => toolsSearch.focus(), 60);
}

function closeToolsPanel() {
  toolsPanel.classList.remove('open');
  toolsOverlay.classList.remove('visible');
}

toolsOverlay.addEventListener('click', closeToolsPanel);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeToolsPanel();
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openToolsPanel(); }
});

// Dashboard search btn
document.getElementById('searchBtn').addEventListener('click', () => openToolsPanel('dashboard'));

// Tool items — click navigates to the right pane
document.querySelectorAll('.tool-item').forEach(item => {
  item.addEventListener('click', () => {
    const tool = item.dataset.tool;
    closeToolsPanel();
    if (toolsContext === 'workspace') {
      addWsTab(tool);
    } else {
      // open workspace with a generic project and switch to that tool pane
      const proj = activeProject || { name: 'my-project', stack: 'Node.js', icon: '📁', bg: '#1a1a2e', desc: '', updatedAt: 'just now' };
      if (!workspace.classList.contains('open')) openWorkspace(proj);
      setTimeout(() => addWsTab(tool), 100);
    }
  });
});

// Search filter
toolsSearch.addEventListener('input', () => filterTools(toolsSearch.value));

function filterTools(query) {
  const q = query.toLowerCase().trim();
  const jumpSection   = document.getElementById('toolsJump');
  const suggestedSection = document.querySelector('#toolsPanel .tools-section:last-of-type');

  if (!q) {
    document.querySelectorAll('.tool-item').forEach(i => i.style.display = '');
    jumpSection.style.display = '';
    return;
  }

  jumpSection.style.display = 'none';
  document.querySelectorAll('.tool-item[data-tool]').forEach(item => {
    const tool = ALL_TOOLS.find(t => t.id === item.dataset.tool);
    const match = tool && (tool.label.toLowerCase().includes(q) || tool.desc.toLowerCase().includes(q));
    item.style.display = match ? '' : 'none';
  });
}

// ── Publish button in pane ───────────────────────────────────
document.getElementById('publishBtn').addEventListener('click', () => {
  const btn = document.getElementById('publishBtn');
  btn.textContent = 'Publishing…';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Published! Copy URL';
    btn.disabled = false;
    btn.style.background = '#22c55e';
    showToast('🚀 App published — live at your URL', 'success');
  }, 2200);
});

// ── Toast Notifications ──────────────────────────────────────
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-dot"></span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 320); }, 2800);
}

// ════════════════════════════════════════════════════════════
// BUILD PROGRESS BAR
// ════════════════════════════════════════════════════════════
const buildProgressFill = document.getElementById('buildProgressFill');

function startBuildProgress() {
  if (!buildProgressFill) return;
  buildProgressFill.style.width = '0%';
  const steps = [
    { w: '15%', delay: 100 }, { w: '35%', delay: 450 },
    { w: '55%', delay: 900 }, { w: '75%', delay: 1600 },
    { w: '90%', delay: 2100 }, { w: '100%', delay: 3200 },
  ];
  steps.forEach(({ w, delay }) => setTimeout(() => { buildProgressFill.style.width = w; }, delay));
}

// patch openBuildModal to kick off progress
const _origOpenBuildModal = openBuildModal;
function openBuildModal(title, project) {
  _origOpenBuildModal(title, project);
  startBuildProgress();
}

// ════════════════════════════════════════════════════════════
// PROJECT SEARCH FILTER
// ════════════════════════════════════════════════════════════
document.getElementById('projectsSearch').addEventListener('input', function () {
  const q = this.value.toLowerCase().trim();
  if (!q) { renderProjects(currentTab); return; }

  const grid = document.getElementById('projectsGrid');
  const projects = getProjects().filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.stack.toLowerCase().includes(q) ||
    (p.desc || '').toLowerCase().includes(q)
  );

  grid.innerHTML = '';
  if (projects.length === 0) {
    grid.innerHTML = `
      <div class="projects-empty">
        <div class="projects-empty-icon">🔍</div>
        <p>No projects found</p>
        <span>No results for "<strong>${q}</strong>" — <button onclick="document.getElementById('projectsSearch').value='';renderProjects('all')">clear filter</button></span>
      </div>`;
    return;
  }
  projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${i * 0.04}s`;
    card.innerHTML = `
      <div class="project-card-icon" style="background:${p.bg}">${p.icon}</div>
      <div class="project-card-info">
        <div class="project-name">${p.name}</div>
        <div class="project-meta">${stackIcons[p.stack] || ''} ${p.stack} · ${p.updatedAt}</div>
      </div>`;
    card.addEventListener('click', () => openBuildModal(`Opening ${p.name}…`, p));
    grid.appendChild(card);
  });
});

// also show empty state when tab returns 0 projects
const _origRenderProjects = renderProjects;
function renderProjects(filter) {
  _origRenderProjects(filter);
  const grid = document.getElementById('projectsGrid');
  if (grid && grid.children.length === 0) {
    grid.innerHTML = `
      <div class="projects-empty">
        <div class="projects-empty-icon">📭</div>
        <p>No projects here yet</p>
        <span><button onclick="openCreateModal()">Create your first project</button></span>
      </div>`;
  }
}

// ════════════════════════════════════════════════════════════
// CONTEXT MENU
// ════════════════════════════════════════════════════════════
const ctxMenu = document.getElementById('ctxMenu');
let ctxProject = null;

function openCtxMenu(e, project) {
  e.preventDefault();
  ctxProject = project;
  ctxMenu.classList.add('open');
  const x = Math.min(e.clientX, window.innerWidth  - 180);
  const y = Math.min(e.clientY, window.innerHeight - 120);
  ctxMenu.style.left = `${x}px`;
  ctxMenu.style.top  = `${y}px`;
}

function closeCtxMenu() { ctxMenu.classList.remove('open'); ctxProject = null; }

document.addEventListener('click',       closeCtxMenu);
document.addEventListener('contextmenu', e => {
  const card = e.target.closest('.project-card');
  if (!card) { closeCtxMenu(); return; }
  const name = card.querySelector('.project-name')?.textContent;
  const proj = getProjects().find(p => p.name === name);
  if (proj) openCtxMenu(e, proj);
});

document.getElementById('ctxOpen').addEventListener('click', () => {
  if (ctxProject) openBuildModal(`Opening ${ctxProject.name}…`, ctxProject);
});
document.getElementById('ctxDuplicate').addEventListener('click', () => {
  if (!ctxProject) return;
  const copy = { ...ctxProject, id: Date.now(), name: ctxProject.name + '-copy', updatedAt: 'just now' };
  const projects = getProjects();
  projects.unshift(copy);
  saveProjects(projects);
  renderProjects(currentTab);
  showToast(`Duplicated "${ctxProject.name}"`, 'info');
});
document.getElementById('ctxDelete').addEventListener('click', () => {
  if (!ctxProject) return;
  saveProjects(getProjects().filter(p => p.id !== ctxProject.id));
  renderProjects(currentTab);
  showToast(`Deleted "${ctxProject.name}"`, 'info');
});

// ════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS OVERLAY
// ════════════════════════════════════════════════════════════
const shortcutsOverlay = document.getElementById('shortcutsOverlay');

function openShortcuts()  { shortcutsOverlay.classList.add('open'); }
function closeShortcuts() { shortcutsOverlay.classList.remove('open'); }

document.getElementById('shortcutsClose').addEventListener('click', closeShortcuts);
shortcutsOverlay.addEventListener('click', e => { if (e.target === shortcutsOverlay) closeShortcuts(); });

document.addEventListener('keydown', e => {
  if (e.key === '?' && !e.ctrlKey && !e.metaKey && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
    openShortcuts();
  }
  if (e.key === 'Escape') closeShortcuts();
  // Ctrl+` → toggle terminal in workspace
  if ((e.ctrlKey || e.metaKey) && e.key === '`') {
    e.preventDefault();
    if (workspace.classList.contains('open')) {
      activeWsPane === 'terminal' ? openWsPane('editor') : openWsPane('terminal');
    }
  }
  // Ctrl+Shift+P → open AI assistant
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
    e.preventDefault();
    if (workspace.classList.contains('open')) toggleAiPanel();
  }
  // Ctrl+B → toggle file panel
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault();
    const panel = document.getElementById('wsPanel');
    if (panel) panel.style.display = panel.style.display === 'none' ? '' : 'none';
  }
  // Alt+← → back to dashboard
  if (e.altKey && e.key === 'ArrowLeft' && workspace.classList.contains('open')) {
    closeWorkspace();
  }
});

// ════════════════════════════════════════════════════════════
// RUN / STOP TOGGLE
// ════════════════════════════════════════════════════════════
let isRunning = false;
const wsRunBtn   = document.getElementById('wsRunBtn');
const wsRunLabel = document.getElementById('wsRunLabel');

wsRunBtn.addEventListener('click', () => {
  isRunning = !isRunning;
  wsRunBtn.classList.toggle('running', isRunning);
  wsRunLabel.textContent = isRunning ? 'Stop' : 'Run';
  wsRunBtn.querySelector('svg').innerHTML = isRunning
    ? '<rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" stroke="none"/>'
    : '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/>';
  if (isRunning) {
    showToast(`${activeProject?.name || 'App'} is running on port 3000`, 'success');
    document.getElementById('wsStatusFile') && (document.querySelector('.ws-status-dot').style.background = '#4ade80');
  } else {
    showToast('Server stopped', 'info');
    document.querySelector('.ws-status-dot') && (document.querySelector('.ws-status-dot').style.background = '#6b7280');
  }
});

// ════════════════════════════════════════════════════════════
// AI ASSISTANT PANEL
// ════════════════════════════════════════════════════════════
const wsAiPanel = document.getElementById('wsAiPanel');
const wsAiMessages = document.getElementById('wsAiMessages');
const wsAiInput    = document.getElementById('wsAiInput');
const wsAiBtn      = document.getElementById('wsAiBtn');

const AI_KNOWLEDGE = {
  database:    'To add a **Database**, open the Database tab from the Tools panel (Ctrl+K). AI Finder supports PostgreSQL — your connection string will be auto-injected as `DATABASE_URL` in your environment variables.',
  deploy:      'To **deploy your app**, click "Republish" in the top bar, or open the Publishing pane. Your app gets a live public URL instantly — zero config needed.',
  auth:        'To add **user authentication**, open the Auth tool (Tools panel → Auth). It supports email/password, Google, and GitHub OAuth out of the box — no extra packages required.',
  storage:     'To store **files and uploads**, open the App Storage tool. It provides S3-compatible object storage. Access it with the `@replit/object-storage` package.',
  integrations:'Popular **integrations** available: Stripe (payments), Discord (bots), SendGrid (email), Supabase (database), Twilio (SMS), GitHub (CI/CD). Open each from the Integrations pane.',
  error:       'For **debugging errors**: check the Terminal output, review your `package.json` start script, verify `.env` variables are set, and run `npm install` to refresh dependencies. The AI can also scan your code automatically.',
  test:        'To **run tests**, open the Terminal tab and run `npm test` (Node.js) or `pytest` (Python). You can also set up a `test` script in your `package.json` and it will appear in the Run menu.',
  git:         'Your project is **version controlled** with Git. The Source Control panel (left sidebar) shows your working tree. Commits are automatic on every deploy.',
  env:         '**Environment variables** are stored in your `.env` file. Access them in Node.js with `process.env.VARIABLE_NAME` or in Python with `os.environ["VARIABLE_NAME"]`. They are never exposed to the client.',
};

function getAiResponse(input) {
  const q = input.toLowerCase();
  if (/database|postgresql|sql|postgres/.test(q))      return AI_KNOWLEDGE.database;
  if (/deploy|publish|live|url|hosting/.test(q))       return AI_KNOWLEDGE.deploy;
  if (/auth|login|sign.?in|password|oauth/.test(q))    return AI_KNOWLEDGE.auth;
  if (/storage|upload|file|image|s3/.test(q))          return AI_KNOWLEDGE.storage;
  if (/integrat|stripe|discord|sendgrid|twilio/.test(q)) return AI_KNOWLEDGE.integrations;
  if (/error|bug|fix|crash|fail|broken/.test(q))       return AI_KNOWLEDGE.error;
  if (/test|spec|jest|pytest/.test(q))                 return AI_KNOWLEDGE.test;
  if (/git|commit|branch|version/.test(q))             return AI_KNOWLEDGE.git;
  if (/env|environment|secret|\.env/.test(q))          return AI_KNOWLEDGE.env;
  if (/hello|hi|hey/.test(q)) return `Hey! 👋 I'm your AI coding assistant. I can help with **databases**, **deployment**, **auth**, **integrations**, debugging, and more. What do you need?`;
  return `Great question! For *${input}*, I'd suggest starting by searching the docs (Ctrl+K → "Documentation"), or I can walk you through it step by step. What specifically are you trying to build?`;
}

async function typeIntoElement(el, text, speed = 14) {
  el.textContent = '';
  for (let i = 0; i < text.length; i++) {
    // parse simple **bold** markers
    const char = text[i];
    el.textContent += char;
    el.closest('.ws-ai-messages').scrollTop = el.closest('.ws-ai-messages').scrollHeight;
    await new Promise(r => setTimeout(r, speed));
  }
}

function addAiMessage(role, text) {
  const msg = document.createElement('div');
  msg.className = `ws-ai-msg ${role}`;
  msg.innerHTML = `
    <div class="ws-ai-msg-label">${role === 'ai' ? '✦ AI' : 'You'}</div>
    <div class="ws-ai-msg-bubble"></div>`;
  wsAiMessages.appendChild(msg);
  wsAiMessages.scrollTop = wsAiMessages.scrollHeight;
  return msg.querySelector('.ws-ai-msg-bubble');
}

async function sendAiMessage(text) {
  if (!text.trim()) return;
  wsAiInput.value = '';
  wsAiInput.disabled = true;

  addAiMessage('user', text).textContent = text;

  // typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'ws-ai-msg ai';
  typingEl.innerHTML = '<div class="ws-ai-msg-label">✦ AI</div><div class="ws-ai-typing"><span></span><span></span><span></span></div>';
  wsAiMessages.appendChild(typingEl);
  wsAiMessages.scrollTop = wsAiMessages.scrollHeight;

  await new Promise(r => setTimeout(r, 900 + Math.random() * 600));

  typingEl.remove();
  const responseBubble = addAiMessage('ai', '');

  // strip markdown bold for plain text display
  const response = getAiResponse(text);
  const clean = response.replace(/\*\*(.*?)\*\*/g, '$1');
  await typeIntoElement(responseBubble, clean, 12);

  wsAiInput.disabled = false;
  wsAiInput.focus();
}

function openAiPanel() {
  wsAiPanel.classList.add('open');
  wsAiBtn.classList.add('active');
  wsAiInput.focus();

  if (wsAiMessages.children.length === 0 && activeProject) {
    setTimeout(async () => {
      const bubble = addAiMessage('ai', '');
      const greeting = `Hi! I'm watching **${activeProject.name}** (${activeProject.stack}). Ask me anything — debugging, adding features, deployment, or integrations.`;
      const clean = greeting.replace(/\*\*(.*?)\*\*/g, '$1');
      await typeIntoElement(bubble, clean, 13);
    }, 180);
  }
}

function closeAiPanel() {
  wsAiPanel.classList.remove('open');
  wsAiBtn.classList.remove('active');
}

function toggleAiPanel() {
  wsAiPanel.classList.contains('open') ? closeAiPanel() : openAiPanel();
}

wsAiBtn.addEventListener('click', toggleAiPanel);
document.getElementById('wsAiClose').addEventListener('click', closeAiPanel);

wsAiInput.addEventListener('keypress', e => {
  if (e.key === 'Enter' && wsAiInput.value.trim()) sendAiMessage(wsAiInput.value.trim());
});
document.getElementById('wsAiSend').addEventListener('click', () => {
  if (wsAiInput.value.trim()) sendAiMessage(wsAiInput.value.trim());
});

// open AI panel and clear chat when a new workspace opens
const _origCloseWorkspace = closeWorkspace;
function closeWorkspace() {
  _origCloseWorkspace();
  closeAiPanel();
  wsAiMessages.innerHTML = '';
  isRunning = false;
  wsRunBtn.classList.remove('running');
  wsRunLabel.textContent = 'Run';
}

// ════════════════════════════════════════════════════════════
// THEME TOGGLE (dark / light)
// ════════════════════════════════════════════════════════════
(function initTheme() {
  const saved = localStorage.getItem('aifinder_theme');
  if (saved === 'light') document.body.classList.add('light-mode');
})();

document.getElementById('themeToggle').addEventListener('click', e => {
  e.stopPropagation();
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('aifinder_theme', isLight ? 'light' : 'dark');
  document.getElementById('themeToggle').textContent = isLight ? '🌙 Toggle Theme' : '☀️ Toggle Theme';
  showToast(isLight ? '☀️ Light mode on' : '🌙 Dark mode on', 'info');
});

// ════════════════════════════════════════════════════════════
// PROFILE DROPDOWN
// ════════════════════════════════════════════════════════════
const profileDropdown = document.getElementById('profileDropdown');

document.getElementById('workspaceSelector').addEventListener('click', e => {
  e.stopPropagation();
  profileDropdown.classList.toggle('open');
});
document.addEventListener('click', () => profileDropdown.classList.remove('open'));

// ════════════════════════════════════════════════════════════
// SHORTCUTS LINK IN SIDEBAR FOOTER
// ════════════════════════════════════════════════════════════
document.getElementById('openShortcutsLink').addEventListener('click', e => {
  e.preventDefault(); openShortcuts();
});

// ════════════════════════════════════════════════════════════
// NOTIFICATION BELL
// ════════════════════════════════════════════════════════════
const NOTIFICATIONS = [
  { type:'success', title:'Build succeeded',   desc:'tube-shorts-pro built in 2.1s',               time:'2 min ago',  unread:true  },
  { type:'info',    title:'App deployed',       desc:'Live at tube-shorts-pro.repl.co',              time:'5 min ago',  unread:true  },
  { type:'ai',      title:'AI suggestion',      desc:'Found 1 potential performance optimization',   time:'12 min ago', unread:true  },
  { type:'warn',    title:'Usage at 100%',      desc:'Agent credits exhausted — upgrade to continue', time:'1 hr ago',  unread:false },
];

const wsNotifBtn   = document.getElementById('wsNotifBtn');
const wsNotifPanel = document.getElementById('wsNotifPanel');
const wsNotifBadge = document.getElementById('wsNotifBadge');
const wsNotifList  = document.getElementById('wsNotifList');

function renderNotifications() {
  wsNotifList.innerHTML = '';
  NOTIFICATIONS.forEach(n => {
    const item = document.createElement('div');
    item.className = `ws-notif-item${n.unread ? ' unread' : ''}`;
    item.innerHTML = `
      <div class="ws-notif-dot ${n.type}"></div>
      <div class="ws-notif-content">
        <div class="ws-notif-title">${n.title}</div>
        <div class="ws-notif-desc">${n.desc}</div>
        <div class="ws-notif-time">${n.time}</div>
      </div>`;
    wsNotifList.appendChild(item);
  });
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;
  wsNotifBadge.textContent = unreadCount;
  wsNotifBadge.classList.toggle('hidden', unreadCount === 0);
}

wsNotifBtn.addEventListener('click', e => {
  e.stopPropagation();
  wsNotifPanel.classList.toggle('open');
  if (wsNotifPanel.classList.contains('open')) renderNotifications();
});

document.getElementById('wsNotifClear').addEventListener('click', () => {
  NOTIFICATIONS.forEach(n => n.unread = false);
  renderNotifications();
  wsNotifBadge.classList.add('hidden');
  showToast('All notifications marked as read', 'info');
});

document.addEventListener('click', e => {
  if (!wsNotifPanel.contains(e.target) && e.target !== wsNotifBtn) {
    wsNotifPanel.classList.remove('open');
  }
});

// ════════════════════════════════════════════════════════════
// MARKDOWN RENDERER & PREVIEW
// ════════════════════════════════════════════════════════════
const README_TEMPLATES = {
  'Node.js': (name) => `# ${name}

A Node.js application built with Express.

## Getting Started

\`\`\`bash
npm install
npm start
\`\`\`

## Features

- **REST API** with Express routing
- **Auto-restart** with nodemon in dev mode
- **Environment config** via \`.env\`

## Environment Variables

| Variable | Description |
|---|---|
| \`PORT\` | Server port (default 3000) |
| \`NODE_ENV\` | \`development\` or \`production\` |

## License

MIT © ${new Date().getFullYear()}`,

  Python: (name) => `# ${name}

A Python Flask REST API.

## Setup

\`\`\`bash
pip install -r requirements.txt
python main.py
\`\`\`

## Routes

- \`GET /\` — health check
- \`GET /api/data\` — fetch data

## License

MIT`,

  React: (name) => `# ${name}

A React application.

## Scripts

\`\`\`bash
npm install      # install deps
npm run dev      # start dev server
npm run build    # production build
\`\`\`

## Structure

\`\`\`
src/
  App.jsx
  index.js
public/
  index.html
\`\`\``,

  Go: (name) => `# ${name}

A Go HTTP server.

## Run

\`\`\`bash
go run main.go
\`\`\`

## Build

\`\`\`bash
go build -o app && ./app
\`\`\``,

  Rust: (name) => `# ${name}

A Rust CLI application.

## Run

\`\`\`bash
cargo run
\`\`\`

## Build

\`\`\`bash
cargo build --release
\`\`\``,

  'HTML/CSS/JS': (name) => `# ${name}

A static web app.

## Files

- \`index.html\` — main page
- \`style.css\`  — styles
- \`script.js\`  — logic

## Deploy

Drag the folder into any static host.`,
};

function md2html(md) {
  // process code blocks first (before escaping)
  const codeBlocks = [];
  md = md.replace(/```[\s\S]*?```/g, m => {
    codeBlocks.push(m.slice(3, m.lastIndexOf('```')).replace(/^[^\n]*\n/, ''));
    return `%%CODE${codeBlocks.length - 1}%%`;
  });

  // html-escape everything else
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  md = esc(md);

  // headings
  md = md.replace(/^# (.+)$/gm,  '<h1>$1</h1>');
  md = md.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  md = md.replace(/^### (.+)$/gm,'<h3>$1</h3>');
  // bold, italic, inline code
  md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  md = md.replace(/\*(.+?)\*/g,     '<em>$1</em>');
  md = md.replace(/`([^`]+)`/g,     '<code>$1</code>');
  // hr
  md = md.replace(/^---$/gm, '<hr>');
  // blockquote
  md = md.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
  // table rows (simple)
  md = md.replace(/^\|.*\|$/gm, m => `<span style="display:block;font-size:11px;color:#888;">${m}</span>`);
  // unordered list
  md = md.replace(/((?:^- .+\n?)+)/gm, m => `<ul>${m.replace(/^- (.+)$/gm,'<li>$1</li>')}</ul>`);
  // restore code blocks
  codeBlocks.forEach((code, i) => {
    const escaped = esc(code);
    md = md.replace(`%%CODE${i}%%`, `<pre><code>${escaped}</code></pre>`);
  });
  // paragraphs
  md = md.split(/\n{2,}/).map(para => {
    const t = para.trim();
    if (!t || t.startsWith('<h') || t.startsWith('<ul') || t.startsWith('<pre') || t.startsWith('<hr') || t.startsWith('<blockquote')) return t;
    return `<p>${t.replace(/\n/g,' ')}</p>`;
  }).join('\n');

  return md;
}

function showMarkdownPreview(filename, stack) {
  const codeBody = document.getElementById('wsCodeBody');
  const mdView   = document.getElementById('wsMdView');
  if (!codeBody || !mdView) return;

  const projectName = activeProject?.name || 'project';
  const rawMd = (README_TEMPLATES[stack] || README_TEMPLATES['Node.js'])(projectName);

  codeBody.style.display = 'none';
  mdView.style.display   = 'flex';
  mdView.style.flexDirection = 'column';
  mdView.innerHTML = md2html(rawMd);
  document.getElementById('wsCodeFilename').textContent = filename;
  const sbFile = document.getElementById('wsStatusFile');
  if (sbFile) sbFile.textContent = filename;
}

function showCodeView() {
  const codeBody = document.getElementById('wsCodeBody');
  const mdView   = document.getElementById('wsMdView');
  if (codeBody) codeBody.style.display = '';
  if (mdView)   mdView.style.display   = 'none';
}

// ════════════════════════════════════════════════════════════
// FILE TYPE ICONS (replace generic file icon in tree)
// ════════════════════════════════════════════════════════════
const FILE_ICON_MAP = {
  '.js':   { color:'#f7df1e', bg:'rgba(247,223,30,0.15)',  label:'JS'  },
  '.jsx':  { color:'#61dafb', bg:'rgba(97,218,251,0.15)',  label:'JSX' },
  '.ts':   { color:'#3178c6', bg:'rgba(49,120,198,0.2)',   label:'TS'  },
  '.py':   { color:'#4584b6', bg:'rgba(69,132,182,0.15)',  label:'PY'  },
  '.json': { color:'#fbbf24', bg:'rgba(251,191,36,0.15)',  label:'{ }' },
  '.html': { color:'#e34c26', bg:'rgba(227,76,38,0.15)',   label:'HTM' },
  '.css':  { color:'#a855f7', bg:'rgba(168,85,247,0.15)',  label:'CSS' },
  '.md':   { color:'#60a5fa', bg:'rgba(96,165,250,0.15)',  label:'MD'  },
  '.env':  { color:'#22c55e', bg:'rgba(34,197,94,0.15)',   label:'ENV' },
  '.go':   { color:'#00acd7', bg:'rgba(0,172,215,0.15)',   label:'GO'  },
  '.rs':   { color:'#dea584', bg:'rgba(222,165,132,0.2)',  label:'RS'  },
  '.toml': { color:'#9c4221', bg:'rgba(156,66,33,0.2)',    label:'TML' },
  '.mod':  { color:'#9ca3af', bg:'rgba(156,163,175,0.15)', label:'MOD' },
  '.txt':  { color:'#9ca3af', bg:'rgba(156,163,175,0.12)', label:'TXT' },
};

function getFileIconHtml(filename) {
  const ext = filename.includes('.') ? '.' + filename.split('.').pop() : '';
  const info = FILE_ICON_MAP[ext];
  if (!info) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  return `<span class="ws-file-ext" style="color:${info.color};background:${info.bg}">${info.label}</span>`;
}

// patch renderFileTree to use icons + handle .md preview
const _origRenderFileTree = renderFileTree;
function renderFileTree(stack) {
  const files = filesByStack[stack] || filesByStack['Node.js'];
  const tree  = document.getElementById('wsFileTree');
  tree.innerHTML = '';

  files.forEach((f, i) => {
    const item = document.createElement('div');
    item.className = `ws-file-item${i === 0 ? ' active' : ''}`;
    item.innerHTML = `${getFileIconHtml(f.name)} ${f.name}`;
    item.addEventListener('click', () => {
      tree.querySelectorAll('.ws-file-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      if (f.name.endsWith('.md')) {
        showMarkdownPreview(f.name, stack);
      } else {
        showCodeView();
        document.getElementById('wsCodeFilename').textContent = f.name;
        const sbFile = document.getElementById('wsStatusFile');
        if (sbFile) sbFile.textContent = f.name;
        const langEl = document.getElementById('wsCodeLang');
        if (langEl) langEl.textContent = f.lang;
      }
      openWsPane('editor');
    });
    tree.appendChild(item);
  });
}

// ════════════════════════════════════════════════════════════
// LINE COUNT IN STATUS BAR
// ════════════════════════════════════════════════════════════
const _origLoadCode = loadCode;
function loadCode(stack) {
  _origLoadCode(stack);
  showCodeView();
  const code = codeTemplates[stack] || codeTemplates['Node.js'];
  const lineCount = code.split('\n').length;
  // update status bar with "X lines" indicator
  const sbFile = document.getElementById('wsStatusFile');
  if (sbFile) {
    const file = (filesByStack[stack] || filesByStack['Node.js'])[0];
    sbFile.textContent = `${file?.name || 'index.js'} (${lineCount} lines)`;
  }
}



// ════════════════════════════════════════════════════════════
// CHARACTER COUNTER FOR PROMPT
// ════════════════════════════════════════════════════════════
(function initCharCounter() {
  const textarea = document.getElementById('promptInput');
  const counter  = document.getElementById('promptCharCount');
  if (!textarea || !counter) return;
  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    counter.textContent = len;
    counter.className = 'prompt-char-count' + (len > 800 ? ' over' : len > 500 ? ' warn' : '');
  });
})();

// ════════════════════════════════════════════════════════════
// CTRL+S SAVE FEEDBACK
// ════════════════════════════════════════════════════════════
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's' && workspace.classList.contains('open')) {
    e.preventDefault();
    const ind = document.getElementById('wsCodeSaveIndicator');
    if (!ind) return;
    ind.textContent = '✓ Saved';
    ind.style.opacity = '1';
    clearTimeout(ind._timer);
    ind._timer = setTimeout(() => { ind.style.opacity = '0'; }, 1800);
  }
});

// ════════════════════════════════════════════════════════════
// AI ENHANCE BUTTON
// ════════════════════════════════════════════════════════════
document.getElementById('wsCodeAiBtn').addEventListener('click', function () {
  const btn = this;
  btn.classList.add('loading');
  btn.textContent = '✦ Enhancing…';
  setTimeout(() => {
    btn.classList.remove('loading');
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px"><path d="M12 2a7 7 0 0 1 7 7c0 4-3 6-3 9H8c0-3-3-5-3-9a7 7 0 0 1 7-7z"/><line x1="8" y1="22" x2="16" y2="22"/><line x1="10" y1="18" x2="14" y2="18"/></svg> AI Enhance`;
    const content = document.getElementById('wsCodeContent');
    if (content) {
      const comment = activeProject?.stack === 'Python'
        ? '\n# ✦ AI: optimized for performance and readability'
        : '\n// ✦ AI: optimized for performance and readability';
      content.innerHTML += `<span class="hl-comment">${comment}</span>`;
    }
    showToast('✦ AI enhancement applied', 'info');
  }, 1600);
});

// ════════════════════════════════════════════════════════════
// DEPLOY URL DISPLAY
// ════════════════════════════════════════════════════════════
(function patchPublishBtn() {
  const btn = document.getElementById('publishBtn');
  if (!btn) return;
  // remove old inline listener; re-attach cleanly
  const freshBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(freshBtn, btn);

  freshBtn.addEventListener('click', () => {
    freshBtn.textContent = 'Publishing…';
    freshBtn.disabled = true;
    setTimeout(() => {
      freshBtn.textContent = '✓ Published';
      freshBtn.disabled = false;
      freshBtn.style.background = '#22c55e';

      const projectSlug = activeProject ? activeProject.name.toLowerCase().replace(/\s+/g,'-') : 'my-app';
      const url = `https://${projectSlug}.repl.co`;
      const box = document.getElementById('publishUrlBox');
      const inp = document.getElementById('publishUrlInput');
      if (box && inp) { inp.value = url; box.style.display = ''; }
      showToast('🚀 App deployed at ' + url, 'success');
    }, 2200);
  });

  document.getElementById('copyPublishUrl').addEventListener('click', () => {
    const inp = document.getElementById('publishUrlInput');
    if (!inp) return;
    navigator.clipboard?.writeText(inp.value).catch(() => {});
    const copyBtn = document.getElementById('copyPublishUrl');
    copyBtn.textContent = '✓ Copied!';
    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1800);
  });
})();

// ════════════════════════════════════════════════════════════
// ACTIVITY FEED
// ════════════════════════════════════════════════════════════
function renderActivityFeed() {
  const feedEl = document.getElementById('activityList');
  if (!feedEl) return;
  const projects = getProjects();
  const p0 = projects[0]?.name || 'my-app';
  const p1 = projects[1]?.name || 'discord-bot';
  const activities = [
    { cls:'success', icon:'✅', text:`${p0} built successfully`,                 time:'2 min ago' },
    { cls:'deploy',  icon:'🚀', text:`${p0} deployed to production`,             time:'4 min ago' },
    { cls:'ai',      icon:'✦',  text:`AI optimized 3 files in ${p0}`,           time:'18 min ago'},
    { cls:'update',  icon:'🔧', text:`${p1} updated — 2 files changed`,          time:'1 hr ago'  },
    { cls:'install', icon:'📦', text:`Installed 12 packages in ${p1}`,           time:'2 hrs ago' },
  ];
  feedEl.innerHTML = '';
  activities.forEach((a, i) => {
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.style.animationDelay = `${i * 0.06}s`;
    item.innerHTML = `
      <div class="activity-dot-wrap ${a.cls}">${a.icon}</div>
      <div class="activity-content">
        <span class="activity-text">${a.text}</span>
      </div>
      <span class="activity-time">${a.time}</span>`;
    feedEl.appendChild(item);
  });
}
renderActivityFeed();

// ════════════════════════════════════════════════════════════
// INLINE PROJECT RENAME (double-click on card)
// ════════════════════════════════════════════════════════════
document.getElementById('projectsGrid').addEventListener('dblclick', e => {
  const nameEl = e.target.closest('.project-name');
  if (!nameEl) return;
  const card = nameEl.closest('.project-card');
  if (!card) return;
  const currentName = nameEl.textContent;
  const input = document.createElement('input');
  input.className = 'project-name-input';
  input.value = currentName;
  nameEl.replaceWith(input);
  input.focus();
  input.select();

  function saveRename() {
    const newName = input.value.trim().toLowerCase().replace(/\s+/g,'-') || currentName;
    const nameSpan = document.createElement('div');
    nameSpan.className = 'project-name';
    nameSpan.textContent = newName;
    input.replaceWith(nameSpan);
    if (newName !== currentName) {
      const projects = getProjects();
      const p = projects.find(p => p.name === currentName);
      if (p) { p.name = newName; saveProjects(projects); showToast(`Renamed to "${newName}"`, 'info'); }
    }
  }
  input.addEventListener('blur', saveRename);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
    if (e.key === 'Escape') { input.value = currentName; input.blur(); }
  });
});

// ════════════════════════════════════════════════════════════
// KEYBOARD NAVIGATION IN TOOLS PANEL
// ════════════════════════════════════════════════════════════
(function initToolsKeyNav() {
  let focusIdx = -1;

  function getVisibleItems() {
    return [...document.querySelectorAll('.tool-item[data-tool]')].filter(i => i.style.display !== 'none');
  }
  function setFocus(idx) {
    const items = getVisibleItems();
    items.forEach(i => i.classList.remove('focused'));
    if (idx >= 0 && idx < items.length) {
      items[idx].classList.add('focused');
      items[idx].scrollIntoView({ block:'nearest' });
      focusIdx = idx;
    }
  }

  document.getElementById('toolsSearchInput').addEventListener('keydown', e => {
    if (!toolsPanel.classList.contains('open')) return;
    const items = getVisibleItems();
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocus(Math.min(focusIdx + 1, items.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setFocus(Math.max(focusIdx - 1, 0)); }
    if (e.key === 'Enter' && focusIdx >= 0 && items[focusIdx]) { items[focusIdx].click(); }
  });

  // reset on search change
  document.getElementById('toolsSearchInput').addEventListener('input', () => { focusIdx = -1; });
  // reset when panel opens
  const _origOpen = openToolsPanel;
  openToolsPanel = function(...args) { _origOpen(...args); focusIdx = -1; };
})();

// ════════════════════════════════════════════════════════════
// MOBILE HAMBURGER
// ════════════════════════════════════════════════════════════
(function initMobileNav() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const hamburger= document.getElementById('hamburgerBtn');
  if (!hamburger) return;

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  });
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  });
  // close on nav item click (mobile)
  document.querySelectorAll('.nav-item').forEach(n => {
    n.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
      }
    });
  });
})();

// ════════════════════════════════════════════════════════════
// ROTATING PLACEHOLDER IN PROMPT
// ════════════════════════════════════════════════════════════
(function initRotatingPlaceholder() {
  const textarea = document.getElementById('promptInput');
  if (!textarea) return;
  const placeholders = [
    'Describe your idea, Replit will bring it to life...',
    'Build a full-stack e-commerce site with React and Node.js',
    'Create a Discord bot that tracks server analytics',
    'Build a real-time chat app with WebSockets',
    'Create a Python scraper for product prices',
    'Build a REST API with authentication and rate limiting',
    'Create a dashboard to visualize CSV data',
    'Build a CLI tool to automate file organization',
    'Create a browser extension that saves reading lists',
    'Build a multiplayer game with Socket.io',
  ];
  let idx = 0;
  setInterval(() => {
    if (document.activeElement !== textarea) {
      idx = (idx + 1) % placeholders.length;
      textarea.style.transition = 'opacity 0.35s';
      textarea.style.opacity = '0';
      setTimeout(() => {
        textarea.setAttribute('placeholder', placeholders[idx]);
        textarea.style.opacity = '1';
      }, 350);
    }
  }, 5000);
})();

// ════════════════════════════════════════════════════════════
// CODE EDITOR CONTROLS (copy, font size, word wrap)
// ════════════════════════════════════════════════════════════
(function initCodeControls() {
  let fontSize = 12;
  let wordWrap = false;

  document.getElementById('wsCodeCopyBtn')?.addEventListener('click', function () {
    const code = document.getElementById('wsCodeContent')?.textContent || '';
    navigator.clipboard?.writeText(code).catch(() => {});
    this.textContent = '✓ Copied!';
    setTimeout(() => { this.textContent = '⎘ Copy'; }, 1800);
  });

  document.getElementById('wsFontIncBtn')?.addEventListener('click', () => {
    fontSize = Math.min(fontSize + 1, 20);
    const c = document.getElementById('wsCodeContent');
    const n = document.getElementById('wsLineNums');
    if (c) c.style.fontSize = `${fontSize}px`;
    if (n) n.style.fontSize = `${fontSize}px`;
  });

  document.getElementById('wsFontDecBtn')?.addEventListener('click', () => {
    fontSize = Math.max(fontSize - 1, 9);
    const c = document.getElementById('wsCodeContent');
    const n = document.getElementById('wsLineNums');
    if (c) c.style.fontSize = `${fontSize}px`;
    if (n) n.style.fontSize = `${fontSize}px`;
  });

  document.getElementById('wsWordWrapBtn')?.addEventListener('click', function () {
    wordWrap = !wordWrap;
    const c = document.getElementById('wsCodeContent');
    if (c) c.style.whiteSpace = wordWrap ? 'pre-wrap' : 'pre';
    this.classList.toggle('active', wordWrap);
  });
})();

// ════════════════════════════════════════════════════════════
// FAVOURITE STARS ON PROJECT CARDS
// ════════════════════════════════════════════════════════════
function getStarred() {
  try { return JSON.parse(localStorage.getItem('aifinder_starred') || '[]'); } catch { return []; }
}
function toggleStar(id) {
  let starred = getStarred();
  if (starred.includes(id)) {
    starred = starred.filter(s => s !== id);
  } else {
    starred.push(id);
  }
  localStorage.setItem('aifinder_starred', JSON.stringify(starred));
  return starred.includes(id);
}

// patch renderProjects to add star buttons and support 'starred' tab
const _origRenderProjectsForStar = renderProjects;
function renderProjects(filter) {
  _origRenderProjectsForStar(filter);
  const starred = getStarred();
  // add star buttons to each card
  document.querySelectorAll('.project-card').forEach(card => {
    if (card.querySelector('.card-star-btn')) return;
    const nameEl = card.querySelector('.project-name');
    if (!nameEl) return;
    const name = nameEl.textContent;
    const project = getProjects().find(p => p.name === name);
    if (!project) return;
    const starBtn = document.createElement('button');
    starBtn.className = 'card-star-btn' + (starred.includes(project.id) ? ' active' : '');
    starBtn.innerHTML = '⭐';
    starBtn.title = 'Favourite';
    starBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isNowStarred = toggleStar(project.id);
      starBtn.classList.toggle('active', isNowStarred);
      showToast(isNowStarred ? `⭐ Added to favourites` : `Removed from favourites`, 'info');
    });
    const actions = card.querySelector('.project-card-actions');
    if (actions) actions.insertBefore(starBtn, actions.firstChild);
  });
}

// support 'starred' tab
const _origTabBtns = document.querySelectorAll('.tab[data-tab]');
_origTabBtns.forEach(btn => {
  if (btn.dataset.tab === 'starred') {
    btn.addEventListener('click', () => {
      const grid = document.getElementById('projectsGrid');
      const starred = getStarred();
      const projects = getProjects().filter(p => starred.includes(p.id));
      grid.innerHTML = '';
      if (projects.length === 0) {
        grid.innerHTML = `<div class="projects-empty"><div class="projects-empty-icon">⭐</div><p>No favourites yet</p><span>Click the ⭐ on any project to add it here</span></div>`;
        return;
      }
      projects.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.animationDelay = `${i * 0.045}s`;
        card.innerHTML = `<div class="project-card-icon" style="background:${p.bg}">${p.icon}</div><div class="project-card-info"><div class="project-name">${p.name}</div><div class="project-meta">${p.stack} · ${p.updatedAt}</div></div><div class="project-card-actions"><button class="card-star-btn active" title="Favourite">⭐</button></div>`;
        card.addEventListener('click', () => openBuildModal(`Opening ${p.name}…`, p));
        grid.appendChild(card);
      });
    });
  }
});

// ════════════════════════════════════════════════════════════
// SEARCH RESULT TEXT HIGHLIGHTING
// ════════════════════════════════════════════════════════════
function hlMatch(text, q) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  return text.slice(0, i) + `<mark>${text.slice(i, i + q.length)}</mark>` + text.slice(i + q.length);
}

// Re-patch the project search to add highlighting
document.getElementById('projectsSearch').addEventListener('input', function () {
  const q = this.value.toLowerCase().trim();
  if (!q) return; // base handler already ran; let the previously attached handler handle reset
  const grid = document.getElementById('projectsGrid');
  // add highlighting to existing rendered cards
  grid.querySelectorAll('.project-card').forEach(card => {
    const nameEl = card.querySelector('.project-name');
    const metaEl = card.querySelector('.project-meta');
    if (nameEl && !nameEl.querySelector('input')) nameEl.innerHTML = hlMatch(nameEl.textContent, q);
    if (metaEl) metaEl.innerHTML = hlMatch(metaEl.textContent, q);
  });
});

// ════════════════════════════════════════════════════════════
// GREETING TYPING ANIMATION
// ════════════════════════════════════════════════════════════
(function typeGreeting() {
  const el = document.querySelector('.prompt-heading');
  if (!el) return;
  const fullText = el.textContent;
  el.textContent = '';
  el.classList.add('typing');
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += fullText[i++];
    if (i >= fullText.length) {
      clearInterval(timer);
      el.classList.remove('typing');
    }
  }, 28);
})();

// ════════════════════════════════════════════════════════════
// SKELETON LOADER FOR PROJECTS
// ════════════════════════════════════════════════════════════
(function initSkeletonLoader() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const card = document.createElement('div');
    card.className = 'skeleton-card';
    card.innerHTML = `<div class="sk-circle"></div><div class="sk-lines"><div class="sk-line" style="width:70%"></div><div class="sk-line sk-line-short"></div></div>`;
    grid.appendChild(card);
  }
  setTimeout(() => renderProjects('all'), 400);
})();

// ════════════════════════════════════════════════════════════
// CTRL+F FIND BAR
// ════════════════════════════════════════════════════════════
(function initFindBar() {
  const findBar   = document.getElementById('wsFindBar');
  const findInput = document.getElementById('wsFindInput');
  const findCount = document.getElementById('wsFindCount');
  const findClose = document.getElementById('wsFindClose');
  if (!findBar) return;

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'f' && workspace.classList.contains('open')) {
      e.preventDefault();
      findBar.style.display = '';
      findInput.focus();
      findInput.select();
    }
    if (e.key === 'Escape' && findBar.style.display !== 'none') {
      findBar.style.display = 'none';
    }
  });

  findClose.addEventListener('click', () => { findBar.style.display = 'none'; });

  findInput.addEventListener('input', () => {
    const q = findInput.value.trim();
    if (!q) { findCount.textContent = ''; return; }
    const text = document.getElementById('wsCodeContent')?.textContent || '';
    try {
      const matches = [...text.matchAll(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi'))];
      findCount.textContent = matches.length
        ? `${matches.length} match${matches.length !== 1 ? 'es' : ''}`
        : 'No results';
      findCount.style.color = matches.length ? '#22c55e' : '#ef4444';
    } catch { findCount.textContent = 'Invalid pattern'; }
  });
})();

// ════════════════════════════════════════════════════════════
// OPEN FILES TAB BAR
// ════════════════════════════════════════════════════════════
let openFilesList = [];
let currentOpenFileName = null;

function renderOpenFilesBar(stack) {
  const bar = document.getElementById('wsOpenFilesBar');
  if (!bar) return;
  bar.innerHTML = '';
  openFilesList.forEach(file => {
    const tab = document.createElement('div');
    tab.className = `ws-open-file-tab${file.name === currentOpenFileName ? ' active' : ''}`;
    tab.innerHTML = `${getFileIconHtml(file.name)}<span style="margin-left:2px">${file.name}</span><button class="ws-open-file-tab-close" title="Close">✕</button>`;
    tab.addEventListener('click', e => {
      if (e.target.closest('.ws-open-file-tab-close')) {
        openFilesList = openFilesList.filter(f => f.name !== file.name);
        if (currentOpenFileName === file.name) {
          currentOpenFileName = openFilesList[openFilesList.length - 1]?.name || null;
        }
        renderOpenFilesBar(stack);
      } else {
        currentOpenFileName = file.name;
        if (file.name.endsWith('.md')) {
          showMarkdownPreview(file.name, stack);
        } else {
          showCodeView();
          document.getElementById('wsCodeFilename').textContent = file.name;
          const sbFile = document.getElementById('wsStatusFile');
          if (sbFile) sbFile.textContent = file.name;
        }
        renderOpenFilesBar(stack);
      }
    });
    bar.appendChild(tab);
  });
}

// patch renderFileTree to also open files in bar
const _rftForOpenFiles = renderFileTree;
function renderFileTree(stack) {
  _rftForOpenFiles(stack);
  openFilesList = [];
  currentOpenFileName = (filesByStack[stack] || filesByStack['Node.js'])[0]?.name || null;
  openFilesList.push((filesByStack[stack] || filesByStack['Node.js'])[0]);
  renderOpenFilesBar(stack);

  // attach open-in-bar to each file-item click
  const tree = document.getElementById('wsFileTree');
  tree.querySelectorAll('.ws-file-item').forEach((item, idx) => {
    const f = (filesByStack[stack] || filesByStack['Node.js'])[idx];
    if (!f) return;
    item.addEventListener('click', () => {
      currentOpenFileName = f.name;
      if (!openFilesList.find(o => o.name === f.name)) openFilesList.push(f);
      renderOpenFilesBar(stack);
    });
  });
}

// ════════════════════════════════════════════════════════════
// SPLIT VIEW
// ════════════════════════════════════════════════════════════
let splitActive = false;
document.getElementById('wsSplitBtn')?.addEventListener('click', function () {
  splitActive = !splitActive;
  document.getElementById('wsEditor').classList.toggle('split-active', splitActive);
  this.classList.toggle('ws-split-btn-active', splitActive);
  if (splitActive) {
    showToast('Split view enabled', 'info');
    // show preview in right pane after short delay
    setTimeout(buildSimApp, 800);
  } else {
    showToast('Split view off', 'info');
    openWsPane(activeWsPane);
  }
});

// ════════════════════════════════════════════════════════════
// SIMULATED APP PREVIEW
// ════════════════════════════════════════════════════════════
function buildSimApp() {
  const container = document.getElementById('wsSimApp');
  if (!container) return;
  const name = activeProject?.name || 'my-app';
  const stack = activeProject?.stack || 'Node.js';
  const displayName = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const content = document.createElement('div');
  content.className = 'ws-sim-content';
  content.innerHTML = `
    <div class="ws-sim-navbar">
      <span>${displayName}</span>
      <div class="ws-sim-nav-links"><span>Home</span><span>About</span><span>API</span><span>Docs</span></div>
    </div>
    <div class="ws-sim-hero">
      <h1>${displayName}</h1>
      <p>Built with ${stack} · Running on port 3000</p>
      <button class="ws-sim-cta">Get Started →</button>
    </div>
    <div class="ws-sim-cards">
      <div class="ws-sim-card">
        <div class="ws-sim-card-title">⚡ Fast</div>
        <div class="ws-sim-card-text">Optimised for performance and scalability.</div>
        <div class="ws-sim-status-badge">● Live</div>
      </div>
      <div class="ws-sim-card">
        <div class="ws-sim-card-title">🔒 Secure</div>
        <div class="ws-sim-card-text">Built-in auth, CORS, and rate limiting.</div>
      </div>
      <div class="ws-sim-card">
        <div class="ws-sim-card-title">🚀 Deployed</div>
        <div class="ws-sim-card-text">Live at <a href="#" style="color:#3b82f6">${name}.repl.co</a></div>
      </div>
    </div>`;

  const loading = document.getElementById('wsSimLoading');
  if (loading) loading.style.display = 'none';
  // animate in
  content.style.opacity = '0';
  container.appendChild(content);
  setTimeout(() => { content.style.transition = 'opacity 0.4s'; content.style.opacity = '1'; }, 50);
}

// Auto-load preview when switching to preview pane
const _origOpenWsPane = openWsPane;
function openWsPane(pane) {
  _origOpenWsPane(pane);
  if (pane === 'preview') {
    const loading = document.getElementById('wsSimLoading');
    const existing = document.querySelector('.ws-sim-content');
    if (!existing) {
      if (loading) loading.style.display = '';
      setTimeout(buildSimApp, 1200);
    }
  }
}

// Refresh button
document.getElementById('wsPreviewRefresh')?.addEventListener('click', () => {
  const app = document.getElementById('wsSimApp');
  if (!app) return;
  const old = app.querySelector('.ws-sim-content');
  if (old) old.remove();
  const loading = document.getElementById('wsSimLoading');
  if (loading) loading.style.display = '';
  setTimeout(buildSimApp, 1000);
  showToast('Preview refreshed', 'info');
});

// ════════════════════════════════════════════════════════════
// GIT COMMIT UI
// ════════════════════════════════════════════════════════════
let gitChanges = [];

function updateGitPanel() {
  const status  = document.getElementById('wsGitStatus');
  const changed = document.getElementById('wsGitChanges');
  if (!status || !changed) return;

  if (gitChanges.length === 0) {
    status.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" style="width:13px;height:13px;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg><span>No changes</span>`;
    changed.innerHTML = '';
  } else {
    status.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" style="width:13px;height:13px;flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span style="color:var(--text)">${gitChanges.length} change${gitChanges.length !== 1 ? 's' : ''}</span>`;
    changed.innerHTML = gitChanges.map(c => `
      <div class="ws-git-change-item">
        <div class="ws-git-change-letter ${c.type}">${c.type}</div>
        <span style="color:var(--text-muted)">${c.file}</span>
      </div>`).join('');
  }
}

document.getElementById('wsGitCommitBtn')?.addEventListener('click', () => {
  const msg = document.getElementById('wsGitMsg')?.value.trim();
  if (!msg) { showToast('Add a commit message first', 'error'); return; }
  const btn = document.getElementById('wsGitCommitBtn');
  btn.textContent = 'Committing…';
  setTimeout(() => {
    gitChanges = [];
    updateGitPanel();
    document.getElementById('wsGitMsg').value = '';
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/></svg> Commit`;
    showToast(`✓ Committed: "${msg}"`, 'success');
  }, 900);
});

// simulate dirty state after AI enhance
const _wsAiEnhanceBtn = document.getElementById('wsCodeAiBtn');
_wsAiEnhanceBtn?.addEventListener('click', () => {
  setTimeout(() => {
    const file = document.getElementById('wsCodeFilename')?.textContent || 'index.js';
    if (!gitChanges.find(c => c.file === file)) {
      gitChanges.push({ type: 'M', file });
      updateGitPanel();
    }
  }, 1700);
}, true);

// FILE SIZE IN STATUS BAR (update after loadCode)
const _origLoadCodeForSize = loadCode;
function loadCode(stack) {
  _origLoadCodeForSize(stack);
  const code = codeTemplates[stack] || codeTemplates['Node.js'];
  const bytes = new TextEncoder().encode(code).length;
  const label = bytes < 1024 ? `${bytes} B` : `${(bytes/1024).toFixed(1)} KB`;
  const sbFile = document.getElementById('wsStatusFile');
  if (sbFile) {
    const file = (filesByStack[stack] || filesByStack['Node.js'])[0];
    sbFile.textContent = `${file?.name || 'index.js'} · ${label}`;
  }
}

// ════════════════════════════════════════════════════════════
// ACCENT COLOR PICKER
// ════════════════════════════════════════════════════════════
(function initAccentPicker() {
  const savedColor = localStorage.getItem('aifinder_accent') || '#3b82f6';
  document.documentElement.style.setProperty('--accent', savedColor);
  document.documentElement.style.setProperty('--accent-hov', savedColor);

  function markActiveDot(color) {
    document.querySelectorAll('.accent-dot').forEach(d => {
      d.classList.toggle('active', d.dataset.color === color);
    });
  }
  markActiveDot(savedColor);

  document.querySelectorAll('.accent-dot').forEach(dot => {
    dot.addEventListener('click', e => {
      e.stopPropagation();
      const c = dot.dataset.color;
      document.documentElement.style.setProperty('--accent', c);
      document.documentElement.style.setProperty('--accent-hov', c);
      localStorage.setItem('aifinder_accent', c);
      markActiveDot(c);
      showToast('Accent color updated', 'info');
    });
  });
})();

// ════════════════════════════════════════════════════════════
// BREADCRUMB BAR
// ════════════════════════════════════════════════════════════
function updateBreadcrumb(project, file) {
  const bcProject = document.getElementById('wsBcProject');
  const bcFile    = document.getElementById('wsBcFile');
  if (bcProject) bcProject.textContent = project?.name || 'project';
  if (bcFile)    bcFile.textContent = file || 'index.js';
}

document.getElementById('wsBcHome')?.addEventListener('click', closeWorkspace);

// ════════════════════════════════════════════════════════════
// ENV VARIABLES EDITOR
// ════════════════════════════════════════════════════════════
const ENV_DEFAULTS_BY_STACK = {
  'Node.js': [
    { key: 'PORT', val: '3000' },
    { key: 'NODE_ENV', val: 'development' },
    { key: 'DATABASE_URL', val: '' },
    { key: 'SECRET_KEY', val: '' },
  ],
  Python: [
    { key: 'PORT', val: '8080' },
    { key: 'FLASK_ENV', val: 'development' },
    { key: 'DATABASE_URL', val: '' },
  ],
  React: [
    { key: 'REACT_APP_API_URL', val: 'http://localhost:3001' },
    { key: 'REACT_APP_ENV', val: 'development' },
  ],
};

function createEnvRow(key = '', val = '') {
  const list = document.getElementById('wsEnvList');
  if (!list) return;
  const row = document.createElement('div');
  row.className = 'ws-env-row';
  row.innerHTML = `
    <input class="ws-env-key" placeholder="KEY" value="${key}" />
    <span class="ws-env-eq">=</span>
    <input class="ws-env-val" placeholder="value" value="${val}" type="${key.toLowerCase().includes('secret') || key.toLowerCase().includes('key') || key.toLowerCase().includes('password') ? 'password' : 'text'}" />
    <button class="ws-env-del" title="Delete">✕</button>`;
  row.querySelector('.ws-env-del').addEventListener('click', () => row.remove());
  list.appendChild(row);
}

function initEnvPane(stack) {
  const pane = document.getElementById('pane-secrets');
  if (!pane) return;
  const existingEditor = pane.querySelector('.ws-env-editor');
  if (existingEditor) existingEditor.remove();

  const tmpl = document.getElementById('paneSecretsTemplate');
  if (!tmpl) return;
  pane.appendChild(tmpl.content.cloneNode(true));

  const defaults = ENV_DEFAULTS_BY_STACK[stack] || ENV_DEFAULTS_BY_STACK['Node.js'];
  defaults.forEach(({ key, val }) => createEnvRow(key, val));

  document.getElementById('wsEnvAddBtn')?.addEventListener('click', () => createEnvRow());
  document.getElementById('wsEnvSaveBtn')?.addEventListener('click', () => showToast('🔐 Secrets saved securely', 'success'));
}

// ════════════════════════════════════════════════════════════
// TERMINAL COMMAND HISTORY
// ════════════════════════════════════════════════════════════
const termHistory = [];
let termHistoryIdx = -1;

(function initTermHistory() {
  const termInput = document.getElementById('wsTermInput');
  if (!termInput) return;

  termInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (termHistory.length === 0) return;
      termHistoryIdx = Math.min(termHistoryIdx + 1, termHistory.length - 1);
      termInput.value = termHistory[termHistoryIdx];
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      termHistoryIdx = Math.max(termHistoryIdx - 1, -1);
      termInput.value = termHistoryIdx >= 0 ? termHistory[termHistoryIdx] : '';
    }
  });

  // patch terminal submit
  const _origTermSubmit = termInput._submitHandler;
  termInput.form?.addEventListener('submit', e => { e.preventDefault(); });

  // intercept Enter
  termInput.addEventListener('keypress', e => {
    if (e.key === 'Enter' && termInput.value.trim()) {
      const cmd = termInput.value.trim();
      if (termHistory[0] !== cmd) termHistory.unshift(cmd);
      if (termHistory.length > 50) termHistory.pop();
      termHistoryIdx = -1;
    }
  });
})();

// ════════════════════════════════════════════════════════════
// PROJECT QUICK ACTION BUTTONS (hover)
// ════════════════════════════════════════════════════════════
function addQuickActionsToCard(card, project) {
  if (card.querySelector('.project-quick-actions')) return;
  const qa = document.createElement('div');
  qa.className = 'project-quick-actions';
  qa.innerHTML = `
    <button class="pqa-btn" data-action="open">Open</button>
    <button class="pqa-btn" data-action="terminal">Terminal</button>
    <button class="pqa-btn" data-action="share">Share</button>`;
  qa.addEventListener('click', e => {
    const action = e.target.dataset.action;
    if (!action) return;
    if (action === 'open')     { openBuildModal(`Opening ${project.name}…`, project); }
    if (action === 'terminal') { openBuildModal(`Opening ${project.name}…`, project); setTimeout(() => openWsPane('terminal'), 600); }
    if (action === 'share')    {
      const url = `https://${project.name.toLowerCase().replace(/\s+/g,'-')}.repl.co`;
      navigator.clipboard?.writeText(url).catch(() => {});
      showToast(`Link copied: ${url}`, 'success');
    }
  });
  card.appendChild(qa);
}

// patch renderProjects to add quick actions
const _renderProjectsForQA = renderProjects;
function renderProjects(filter) {
  _renderProjectsForQA(filter);
  document.querySelectorAll('.project-card').forEach(card => {
    const nameEl = card.querySelector('.project-name');
    if (!nameEl) return;
    const proj = getProjects().find(p => p.name === nameEl.textContent);
    if (proj) addQuickActionsToCard(card, proj);
  });
}

// ════════════════════════════════════════════════════════════
// CPU / MEMORY METER IN STATUS BAR
// ════════════════════════════════════════════════════════════
(function initMeters() {
  const sb = document.getElementById('wsStatusbar');
  if (!sb) return;
  const right = sb.querySelector('.ws-status-right');
  if (!right) return;

  const cpuSpan = document.createElement('span');
  cpuSpan.className = 'ws-status-item ws-status-meter';
  cpuSpan.innerHTML = `<span id="cpuLabel" style="font-size:10px">CPU</span><div class="ws-meter-bar"><div class="ws-meter-fill" id="cpuFill" style="width:14%"></div></div><span id="cpuPct">14%</span>`;

  const memSpan = document.createElement('span');
  memSpan.className = 'ws-status-item ws-status-meter';
  memSpan.innerHTML = `<span style="font-size:10px">MEM</span><div class="ws-meter-bar"><div class="ws-meter-fill" id="memFill" style="width:38%"></div></div><span id="memMB">97 MB</span>`;

  right.insertBefore(memSpan, right.firstChild);
  right.insertBefore(cpuSpan, right.firstChild);

  let cpu = 14, mem = 97;
  setInterval(() => {
    if (!workspace.classList.contains('open')) return;
    cpu = Math.max(2, Math.min(95, cpu + (Math.random() * 8 - 4)));
    mem = Math.max(60, Math.min(240, mem + (Math.random() * 8 - 4)));
    const cpuFill = document.getElementById('cpuFill');
    const memFill = document.getElementById('memFill');
    if (cpuFill) {
      cpuFill.style.width = cpu.toFixed(0) + '%';
      cpuFill.className = `ws-meter-fill${cpu > 75 ? ' high' : cpu > 50 ? ' warn' : ''}`;
    }
    if (memFill) { memFill.style.width = (mem / 256 * 100).toFixed(0) + '%'; }
    const cpuEl = document.getElementById('cpuPct');
    const memEl = document.getElementById('memMB');
    if (cpuEl) cpuEl.textContent = cpu.toFixed(0) + '%';
    if (memEl) memEl.textContent = mem.toFixed(0) + ' MB';
  }, 2000);
})();

// ════════════════════════════════════════════════════════════
// COMMAND PALETTE SEARCH HISTORY
// ════════════════════════════════════════════════════════════
(function initPaletteHistory() {
  const PALETTE_HISTORY_KEY = 'aifinder_palette_history';
  function getPaletteHistory() {
    try { return JSON.parse(localStorage.getItem(PALETTE_HISTORY_KEY) || '[]'); } catch { return []; }
  }
  function savePaletteHistory(arr) {
    localStorage.setItem(PALETTE_HISTORY_KEY, JSON.stringify(arr.slice(0, 5)));
  }
  function renderHistory() {
    const jump = document.getElementById('toolsJump');
    if (!jump) return;
    const hist = getPaletteHistory();
    const existingHist = document.getElementById('toolsHistory');
    if (existingHist) existingHist.remove();
    if (hist.length === 0) return;
    const section = document.createElement('div');
    section.id = 'toolsHistory';
    section.innerHTML = `<div class="tools-section-title">Recent</div>` +
      hist.map(q => `<div class="tools-history-item" data-q="${q}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;color:var(--text-dim);flex-shrink:0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>${q}</span></div>`).join('');
    jump.insertAdjacentElement('beforebegin', section);

    section.querySelectorAll('.tools-history-item').forEach(item => {
      item.addEventListener('click', () => {
        const search = document.getElementById('toolsSearchInput');
        if (search) { search.value = item.dataset.q; search.dispatchEvent(new Event('input')); }
      });
    });
  }

  const search = document.getElementById('toolsSearchInput');
  search?.addEventListener('keypress', e => {
    if (e.key === 'Enter' && search.value.trim()) {
      const hist = getPaletteHistory();
      const q = search.value.trim();
      savePaletteHistory([q, ...hist.filter(h => h !== q)]);
    }
  });

  // show history when panel opens
  const _openToolsPanelPatched = openToolsPanel;
  openToolsPanel = function(...args) {
    _openToolsPanelPatched(...args);
    setTimeout(renderHistory, 50);
  };
})();

// ════════════════════════════════════════════════════════════
// DRAG TO REORDER PROJECTS
// ════════════════════════════════════════════════════════════
(function initDragReorder() {
  let dragSrc = null;

  function handleDragStart(e) {
    dragSrc = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  }
  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
  }
  function handleDragLeave() { this.classList.remove('drag-over'); }
  function handleDrop(e) {
    e.stopPropagation();
    this.classList.remove('drag-over');
    if (dragSrc === this) return;

    // swap in projects array
    const projects = getProjects();
    const srcName  = dragSrc.querySelector('.project-name')?.textContent;
    const dstName  = this.querySelector('.project-name')?.textContent;
    const si = projects.findIndex(p => p.name === srcName);
    const di = projects.findIndex(p => p.name === dstName);
    if (si !== -1 && di !== -1) {
      [projects[si], projects[di]] = [projects[di], projects[si]];
      saveProjects(projects);
      renderProjects(currentTab);
    }
  }
  function handleDragEnd() {
    document.querySelectorAll('.project-card').forEach(c => {
      c.classList.remove('dragging', 'drag-over');
    });
    dragSrc = null;
  }

  function attachDragHandlers() {
    document.querySelectorAll('.project-card').forEach(card => {
      card.setAttribute('draggable', 'true');
      card.addEventListener('dragstart',  handleDragStart);
      card.addEventListener('dragover',   handleDragOver);
      card.addEventListener('dragleave',  handleDragLeave);
      card.addEventListener('drop',       handleDrop);
      card.addEventListener('dragend',    handleDragEnd);
    });
  }

  // attach after each render
  const _rp = renderProjects;
  function renderProjects(filter) {
    _rp(filter);
    attachDragHandlers();
  }
})();

// ════════════════════════════════════════════════════════════
// ANIMATED STATS COUNTERS
// ════════════════════════════════════════════════════════════
function animateCounter(el, target, duration = 900) {
  let startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function refreshStats() {
  const projects = getProjects();
  const pe = document.getElementById('statProjects');
  const de = document.getElementById('statDeploys');
  const ae = document.getElementById('statAiRuns');
  if (pe) animateCounter(pe, projects.length);
  if (de) animateCounter(de, projects.length * 3 + 12);
  if (ae) animateCounter(ae, projects.length * 7 + 31);
}
refreshStats();

// ════════════════════════════════════════════════════════════
// CTRL+ENTER TO SUBMIT PROMPT
// ════════════════════════════════════════════════════════════
document.getElementById('promptInput')?.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('btnSubmit')?.click();
  }
});

// ════════════════════════════════════════════════════════════
// INVITE COLLABORATORS DIALOG
// ════════════════════════════════════════════════════════════
const inviteOverlay = document.getElementById('inviteOverlay');
const wsInviteBtn   = document.getElementById('wsInviteBtn');
const inviteClose   = document.getElementById('inviteClose');

wsInviteBtn?.addEventListener('click', () => {
  const slug = activeProject?.name?.toLowerCase().replace(/\s+/g,'-') || 'project';
  const linkEl = document.getElementById('inviteLink');
  if (linkEl) linkEl.value = `https://replit.com/join/${slug}-${Math.random().toString(36).slice(2,8)}`;
  inviteOverlay.style.display = '';
});
inviteClose?.addEventListener('click', () => { inviteOverlay.style.display = 'none'; });
inviteOverlay?.addEventListener('click', e => { if (e.target === inviteOverlay) inviteOverlay.style.display = 'none'; });

document.getElementById('inviteSubmitBtn')?.addEventListener('click', () => {
  const email = document.getElementById('inviteEmail')?.value.trim();
  const role  = document.getElementById('inviteRole')?.value;
  if (!email || !email.includes('@')) { showToast('Enter a valid email address', 'error'); return; }
  const list = document.getElementById('inviteList');
  if (list) {
    const letter = email[0].toUpperCase();
    const item = document.createElement('div');
    item.className = 'invite-list-item';
    item.innerHTML = `<div class="invite-avatar" style="background:linear-gradient(135deg,#8b5cf6,#ec4899)">${letter}</div><div class="invite-item-info"><span>${email}</span><span class="invite-role-tag">${role}</span></div><span class="invite-status pending">⏳ Pending</span>`;
    list.appendChild(item);
  }
  document.getElementById('inviteEmail').value = '';
  showToast(`Invite sent to ${email}`, 'success');
});

document.getElementById('copyInviteLink')?.addEventListener('click', () => {
  const link = document.getElementById('inviteLink')?.value;
  navigator.clipboard?.writeText(link).catch(() => {});
  const btn = document.getElementById('copyInviteLink');
  btn.textContent = '✓ Copied!';
  setTimeout(() => { btn.textContent = 'Copy'; }, 1800);
});

// ════════════════════════════════════════════════════════════
// PROJECT TAGS
// ════════════════════════════════════════════════════════════
const STACK_TAGS = {
  'Node.js':    [{ label:'backend', bg:'rgba(34,197,94,0.12)', color:'#22c55e' }, { label:'api', bg:'rgba(59,130,246,0.12)', color:'#60a5fa' }],
  Python:       [{ label:'python', bg:'rgba(59,130,246,0.12)', color:'#60a5fa' }, { label:'ai', bg:'rgba(167,139,250,0.12)', color:'#a78bfa' }],
  React:        [{ label:'frontend', bg:'rgba(97,218,251,0.12)', color:'#22d3ee' }, { label:'react', bg:'rgba(59,130,246,0.12)', color:'#60a5fa' }],
  Go:           [{ label:'go', bg:'rgba(0,172,215,0.12)', color:'#22d3ee' }, { label:'backend', bg:'rgba(34,197,94,0.12)', color:'#22c55e' }],
  Rust:         [{ label:'rust', bg:'rgba(222,165,132,0.15)', color:'#fca5a5' }, { label:'systems', bg:'rgba(251,191,36,0.12)', color:'#fbbf24' }],
  'HTML/CSS/JS':[{ label:'web', bg:'rgba(239,68,68,0.1)', color:'#f87171' }, { label:'frontend', bg:'rgba(97,218,251,0.12)', color:'#22d3ee' }],
};

function addTagsToCard(card, stack) {
  if (card.querySelector('.project-tags')) return;
  const tags = STACK_TAGS[stack] || STACK_TAGS['Node.js'];
  const info = card.querySelector('.project-card-info');
  if (!info) return;
  const container = document.createElement('div');
  container.className = 'project-tags';
  tags.forEach(t => {
    const span = document.createElement('span');
    span.className = 'project-tag';
    span.textContent = '#' + t.label;
    span.style.background = t.bg;
    span.style.color = t.color;
    container.appendChild(span);
  });
  info.appendChild(container);
}

const _rpForTags = renderProjects;
function renderProjects(filter) {
  _rpForTags(filter);
  document.querySelectorAll('.project-card').forEach(card => {
    const metaEl = card.querySelector('.project-meta');
    const stack  = metaEl?.textContent?.split(' · ')[0]?.trim() || 'Node.js';
    addTagsToCard(card, stack);
  });
}

// ════════════════════════════════════════════════════════════
// PACKAGE MANAGER
// ════════════════════════════════════════════════════════════
const PACKAGES_BY_STACK = {
  'Node.js': [
    { name: 'express', ver: '^4.18.2' },
    { name: 'dotenv',  ver: '^16.0.3' },
    { name: 'cors',    ver: '^2.8.5' },
    { name: 'nodemon', ver: '^3.0.1', dev: true },
  ],
  Python: [
    { name: 'flask',    ver: '3.0.0' },
    { name: 'requests', ver: '2.31.0' },
    { name: 'python-dotenv', ver: '1.0.0' },
  ],
  React: [
    { name: 'react',       ver: '^18.2.0' },
    { name: 'react-dom',   ver: '^18.2.0' },
    { name: 'vite',        ver: '^5.0.0', dev: true },
    { name: 'tailwindcss', ver: '^3.3.0', dev: true },
  ],
  Go: [
    { name: 'github.com/gin-gonic/gin', ver: 'v1.9.1' },
    { name: 'github.com/joho/godotenv', ver: 'v1.5.1' },
  ],
  Rust: [
    { name: 'tokio',  ver: '1.35.0' },
    { name: 'axum',   ver: '0.7.2' },
    { name: 'serde',  ver: '1.0.193' },
  ],
  'HTML/CSS/JS': [
    { name: 'parcel', ver: '^2.10.3', dev: true },
    { name: 'lodash', ver: '^4.17.21' },
  ],
};

function initPackagesPane(stack) {
  const list = document.getElementById('wsPackageList');
  if (!list) return;
  list.innerHTML = '';
  const pkgs = PACKAGES_BY_STACK[stack] || PACKAGES_BY_STACK['Node.js'];
  pkgs.forEach(pkg => addPackageItem(list, pkg));
}

function addPackageItem(list, pkg) {
  const item = document.createElement('div');
  item.className = 'ws-pkg-item';
  item.innerHTML = `
    <div class="ws-pkg-info">
      <div class="ws-pkg-name">${pkg.name}</div>
      <div class="ws-pkg-ver">${pkg.ver}${pkg.dev ? ' (dev)' : ''}</div>
    </div>
    <button class="ws-pkg-remove" title="Remove">✕</button>`;
  item.querySelector('.ws-pkg-remove').addEventListener('click', () => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(8px)';
    item.style.transition = '0.2s';
    setTimeout(() => item.remove(), 200);
    showToast(`Removed ${pkg.name}`, 'info');
  });
  list.appendChild(item);
}

document.getElementById('wsPackageInstall')?.addEventListener('click', () => {
  const input = document.getElementById('wsPackageSearch');
  const name = input?.value.trim();
  if (!name) { showToast('Enter a package name', 'error'); return; }
  const btn = document.getElementById('wsPackageInstall');
  btn.textContent = 'Installing…';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Install';
    btn.disabled = false;
    const list = document.getElementById('wsPackageList');
    if (list) addPackageItem(list, { name, ver: 'latest' });
    input.value = '';
    showToast(`✓ Installed ${name}`, 'success');
  }, 1400);
});

// ════════════════════════════════════════════════════════════
// BUILD CONFIGURATION
// ════════════════════════════════════════════════════════════
const BUILD_DEFAULTS = {
  'Node.js':    { run: 'node index.js', install: 'npm install', build: '', port: '3000' },
  Python:       { run: 'python main.py', install: 'pip install -r requirements.txt', build: '', port: '8080' },
  React:        { run: 'npm run dev', install: 'npm install', build: 'npm run build', port: '5173' },
  Go:           { run: 'go run main.go', install: '', build: 'go build -o app', port: '8080' },
  Rust:         { run: 'cargo run', install: '', build: 'cargo build --release', port: '3000' },
  'HTML/CSS/JS':{ run: 'npx parcel index.html', install: 'npm install', build: 'npx parcel build index.html', port: '1234' },
};

function initBuildConfig(stack) {
  const cfg = BUILD_DEFAULTS[stack] || BUILD_DEFAULTS['Node.js'];
  const r = document.getElementById('bcfgRun');
  const i = document.getElementById('bcfgInstall');
  const b = document.getElementById('bcfgBuild');
  const p = document.getElementById('bcfgPort');
  if (r) r.value = cfg.run;
  if (i) i.value = cfg.install;
  if (b) b.value = cfg.build;
  if (p) p.value = cfg.port;
}

document.getElementById('bcfgSave')?.addEventListener('click', () => showToast('✓ Build config saved', 'success'));

// ════════════════════════════════════════════════════════════
// ERROR / WARNING MARKERS IN CODE GUTTER
// ════════════════════════════════════════════════════════════
const MOCK_ERRORS = {
  'Node.js': [{ line: 5, type: 'warn', msg: 'Unused variable "app"' }, { line: 12, type: 'error', msg: 'Missing semicolon' }],
  Python:    [{ line: 3, type: 'warn', msg: 'Import "os" not used' }],
  React:     [{ line: 8, type: 'warn', msg: 'Hook dependency array may be incomplete' }],
};

function addErrorMarkers(stack) {
  const lineNums = document.getElementById('wsLineNums');
  if (!lineNums) return;
  const errors = MOCK_ERRORS[stack] || [];
  const lines = lineNums.querySelectorAll('.ln');
  errors.forEach(err => {
    const lineEl = lines[err.line - 1];
    if (!lineEl) return;
    if (lineEl.querySelector('.ws-gutter-error, .ws-gutter-warn')) return;
    const marker = document.createElement('span');
    marker.className = err.type === 'error' ? 'ws-gutter-error' : 'ws-gutter-warn';
    marker.textContent = err.type === 'error' ? '●' : '▲';
    marker.title = err.msg;
    lineEl.appendChild(marker);
  });
}

// patch loadCode to add markers after loading
const _loadCodeForMarkers = loadCode;
function loadCode(stack) {
  _loadCodeForMarkers(stack);
  setTimeout(() => {
    addErrorMarkers(stack);
    initPackagesPane(stack);
    initBuildConfig(stack);
  }, 80);
}

// ════════════════════════════════════════════════════════════
// WORKSPACE FADE-IN
// ════════════════════════════════════════════════════════════
(function patchWorkspaceFadeIn() {
  const wsBody = document.querySelector('.ws-body');
  if (!wsBody) return;
  const _orig = openWorkspace;
  const observer = new MutationObserver(() => {
    if (workspace.classList.contains('open')) {
      wsBody.style.opacity = '0';
      wsBody.style.transform = 'translateY(6px)';
      wsBody.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      requestAnimationFrame(() => {
        setTimeout(() => {
          wsBody.style.opacity = '1';
          wsBody.style.transform = 'translateY(0)';
        }, 80);
      });
    }
  });
  observer.observe(workspace, { attributes: true, attributeFilter: ['class'] });
})();

// ════════════════════════════════════════════════════════════
// WHAT'S NEW BANNER
// ════════════════════════════════════════════════════════════
(function initWhatsNew() {
  const banner = document.getElementById('whatsNewBanner');
  const close  = document.getElementById('closeWhatsNew');
  if (!banner) return;
  if (localStorage.getItem('aifinder_whatsnew_dismissed')) banner.classList.add('hidden');
  close?.addEventListener('click', () => {
    banner.classList.add('hidden');
    localStorage.setItem('aifinder_whatsnew_dismissed', '1');
  });
})();

// ════════════════════════════════════════════════════════════
// SECTION FADE TRANSITIONS
// ════════════════════════════════════════════════════════════
const _origNavigateTo = navigateTo;
function navigateTo(sectionId) {
  _origNavigateTo(sectionId);
  const activeSection = document.getElementById(`section-${sectionId}`);
  if (activeSection) {
    activeSection.classList.remove('fade-in');
    void activeSection.offsetWidth; // reflow
    activeSection.classList.add('fade-in');
  }
}

// ════════════════════════════════════════════════════════════
// DOCS SEARCH FILTER
// ════════════════════════════════════════════════════════════
document.getElementById('docsSearch')?.addEventListener('input', function () {
  const q = this.value.toLowerCase().trim();
  document.querySelectorAll('#docList .doc-item').forEach(item => {
    const title = item.dataset.title?.toLowerCase() || item.textContent.toLowerCase();
    item.classList.toggle('hidden', q.length > 0 && !title.includes(q));
  });
});

// ════════════════════════════════════════════════════════════
// TEMPLATES GALLERY
// ════════════════════════════════════════════════════════════
const TEMPLATES = [
  { icon:'🌐', name:'Full-Stack Web App',   meta:'React + Node.js + Express', stack:'React',  tags:['frontend','backend'], prompt:'Build a full-stack web app with React and Node.js', bg:'#1e3a5f' },
  { icon:'🔌', name:'REST API',             meta:'Python + Flask + SQLite',   stack:'Python', tags:['backend','api'],      prompt:'Create a Python Flask REST API with SQLite database', bg:'#1a3326' },
  { icon:'🤖', name:'Discord Bot',          meta:'discord.js + Node.js',      stack:'Node.js',tags:['bot','discord'],      prompt:'Build a Discord bot with slash commands and moderation', bg:'#1e2151' },
  { icon:'✨', name:'AI Chatbot',           meta:'OpenAI + Streaming',         stack:'Node.js',tags:['ai','chatbot'],       prompt:'Create an AI chatbot with streaming responses and memory', bg:'#2d1b4e' },
  { icon:'📱', name:'Telegram Bot',         meta:'telegraf + Node.js',         stack:'Node.js',tags:['bot','telegram'],     prompt:'Build a Telegram bot with inline keyboards', bg:'#0a2d42' },
  { icon:'📊', name:'Analytics Dashboard',  meta:'Chart.js + Express',         stack:'Node.js',tags:['frontend','data'],    prompt:'Create a data dashboard with charts and real-time updates', bg:'#2d1a00' },
  { icon:'🛒', name:'E-commerce Store',     meta:'React + Stripe + Node.js',   stack:'React',  tags:['frontend','payments'],prompt:'Build a full e-commerce store with cart and Stripe', bg:'#1a2530' },
  { icon:'🐍', name:'Data Analysis Tool',   meta:'Python + pandas + Flask',    stack:'Python', tags:['python','data'],      prompt:'Create a Python data analysis web app with charts', bg:'#1a2a1a' },
  { icon:'⚡', name:'Go REST API',          meta:'Go + Gin + PostgreSQL',       stack:'Go',     tags:['backend','go'],       prompt:'Build a fast REST API with Go, Gin and PostgreSQL', bg:'#0d2230' },
  { icon:'🎮', name:'Multiplayer Game',     meta:'Socket.io + Node.js',        stack:'Node.js',tags:['realtime','game'],    prompt:'Build a real-time multiplayer game with WebSockets', bg:'#2a1a2e' },
  { icon:'📝', name:'Blog CMS',            meta:'React + MDX + Node.js',       stack:'React',  tags:['frontend','cms'],     prompt:'Create a blog CMS with markdown editor and preview', bg:'#1e2030' },
  { icon:'🔧', name:'CLI Tool',            meta:'Node.js + Commander',         stack:'Node.js',tags:['cli','tool'],         prompt:'Build a CLI tool with argument parsing in Node.js', bg:'#202020' },
];

const TAG_COLORS = {
  frontend:['#22d3ee','rgba(34,211,238,0.12)'], backend:['#22c55e','rgba(34,197,94,0.12)'],
  api:['#60a5fa','rgba(96,165,250,0.12)'], bot:['#a78bfa','rgba(167,139,250,0.12)'],
  discord:['#818cf8','rgba(129,140,248,0.12)'], telegram:['#38bdf8','rgba(56,189,248,0.12)'],
  ai:['#f472b6','rgba(244,114,182,0.12)'], chatbot:['#c084fc','rgba(192,132,252,0.12)'],
  data:['#fbbf24','rgba(251,191,36,0.12)'], python:['#4ade80','rgba(74,222,128,0.12)'],
  go:['#22d3ee','rgba(34,211,238,0.12)'], realtime:['#fb923c','rgba(251,146,60,0.12)'],
  game:['#f87171','rgba(248,113,113,0.12)'], payments:['#4ade80','rgba(74,222,128,0.12)'],
  cms:['#818cf8','rgba(129,140,248,0.12)'], cli:['#94a3b8','rgba(148,163,184,0.12)'],
  tool:['#94a3b8','rgba(148,163,184,0.12)'],
};

function renderTemplatesGallery(filter) {
  const grid = document.getElementById('tplGrid');
  if (!grid) return;
  const toShow = filter === 'all' ? TEMPLATES
    : TEMPLATES.filter(t => t.stack === filter || t.tags.includes(filter));
  grid.innerHTML = '';
  toShow.forEach((tpl, i) => {
    const card = document.createElement('div');
    card.className = 'tpl-card';
    card.style.animationDelay = `${i * 0.04}s`;
    const tagHtml = tpl.tags.map(tag => {
      const [c, bg] = TAG_COLORS[tag] || ['#94a3b8','rgba(148,163,184,0.12)'];
      return `<span class="tpl-card-tag" style="background:${bg};color:${c}">${tag}</span>`;
    }).join('');
    card.innerHTML = `
      <div class="tpl-card-banner" style="background:${tpl.bg}">${tpl.icon}</div>
      <div class="tpl-card-body">
        <div class="tpl-card-name">${tpl.name}</div>
        <div class="tpl-card-meta">${tpl.meta}</div>
        <div class="tpl-card-tags">${tagHtml}</div>
        <button class="tpl-card-use">Use Template →</button>
      </div>`;
    card.querySelector('.tpl-card-use').addEventListener('click', e => {
      e.stopPropagation();
      document.getElementById('promptInput').value = tpl.prompt;
      document.getElementById('promptCharCount').textContent = tpl.prompt.length;
      navigateTo('home');
      document.getElementById('promptInput').focus();
      showToast(`Template loaded: ${tpl.name}`, 'success');
    });
    grid.appendChild(card);
  });
}

document.querySelectorAll('.tpl-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tpl-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTemplatesGallery(btn.dataset.stack);
  });
});
renderTemplatesGallery('all');

// ════════════════════════════════════════════════════════════
// BUILD LOG DOWNLOAD
// ════════════════════════════════════════════════════════════
document.getElementById('downloadBuildLog')?.addEventListener('click', () => {
  const lines = [...document.querySelectorAll('#buildTerminal .terminal-line')]
    .map(l => l.textContent).join('\n');
  const blob = new Blob([lines], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `build-log-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Build log downloaded', 'info');
});

// ════════════════════════════════════════════════════════════
// CONFETTI ON BUILD SUCCESS
// ════════════════════════════════════════════════════════════
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = '';
  const ctx = canvas.getContext('2d');
  const pieces = [];
  const COLORS = ['#3b82f6','#8b5cf6','#22c55e','#fbbf24','#ec4899','#f97316'];
  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 100,
      r: 4 + Math.random() * 5,
      d: 2 + Math.random() * 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngle: Math.random() * Math.PI * 2,
      tiltAngleInc: 0.05 + Math.random() * 0.1,
    });
  }
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.ellipse(p.x, p.y, p.r, p.r * 0.6, p.tilt, 0, Math.PI * 2);
      ctx.fill();
      p.y += p.d;
      p.tilt += Math.sin(p.tiltAngle) * 0.5;
      p.tiltAngle += p.tiltAngleInc;
    });
    frame++;
    if (frame < 180) requestAnimationFrame(draw);
    else { canvas.style.display = 'none'; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }
  requestAnimationFrame(draw);
}

// hook into openProjectBtn click
document.getElementById('openProjectBtn')?.addEventListener('click', launchConfetti);

// ════════════════════════════════════════════════════════════
// RECENTLY OPENED WORKSPACES
// ════════════════════════════════════════════════════════════
function getRecentProjects() {
  try { return JSON.parse(localStorage.getItem('aifinder_recent') || '[]'); } catch { return []; }
}
function trackRecentProject(project) {
  let recent = getRecentProjects();
  recent = [project.id, ...recent.filter(id => id !== project.id)].slice(0, 5);
  localStorage.setItem('aifinder_recent', JSON.stringify(recent));
}

// patch openWorkspace to track recents
const _origOpenWorkspaceForRecent = openWorkspace;
function openWorkspace(project) {
  _origOpenWorkspaceForRecent(project);
  trackRecentProject(project);
}

// ════════════════════════════════════════════════════════════
// ENHANCED LEARN SECTION
// ════════════════════════════════════════════════════════════
const LESSONS = [
  { icon:'🚀', title:'Getting Started', desc:'Set up your first project in under 5 minutes.', difficulty:'beginner', duration:'5 min' },
  { icon:'🌐', title:'Web Development', desc:'HTML, CSS, JavaScript, React, Node.js — all in one place.', difficulty:'beginner', duration:'30 min' },
  { icon:'🐍', title:'Python Basics', desc:'Variables, functions, loops, and real projects.', difficulty:'beginner', duration:'45 min' },
  { icon:'🤖', title:'AI & Machine Learning', desc:'Build with OpenAI, HuggingFace, and LangChain.', difficulty:'intermediate', duration:'1 hr' },
  { icon:'🔌', title:'APIs & Databases', desc:'Connect your app to the world with REST and SQL.', difficulty:'intermediate', duration:'1 hr' },
  { icon:'📦', title:'Deployment', desc:'Ship your project to a live URL in one click.', difficulty:'beginner', duration:'15 min' },
  { icon:'⚡', title:'Performance Optimization', desc:'Make your app blazing fast with caching and CDN.', difficulty:'advanced', duration:'1.5 hr' },
  { icon:'🔒', title:'Security Best Practices', desc:'Protect your app from common vulnerabilities.', difficulty:'intermediate', duration:'45 min' },
];

function getLearnProgress() {
  try { return JSON.parse(localStorage.getItem('aifinder_learn') || '[]'); } catch { return []; }
}
function saveLearnProgress(arr) { localStorage.setItem('aifinder_learn', JSON.stringify(arr)); }

function renderLearnSection() {
  const grid = document.getElementById('learnGrid');
  if (!grid) return;
  const completed = getLearnProgress();
  grid.innerHTML = '';
  LESSONS.forEach((lesson, i) => {
    const isDone = completed.includes(i);
    const card = document.createElement('div');
    card.className = `learn-card${isDone ? ' completed' : ''}`;
    card.style.animationDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <div class="learn-icon">${lesson.icon}</div>
      <h4>${lesson.title}${isDone ? ' <span class="learn-check">✓</span>' : ''}</h4>
      <p>${lesson.desc}</p>
      <div class="learn-card-footer">
        <span class="learn-difficulty ${lesson.difficulty}">${lesson.difficulty}</span>
        <span class="learn-duration">⏱ ${lesson.duration}</span>
      </div>
      <button class="learn-start-btn">${isDone ? '✓ Completed' : 'Start Lesson →'}</button>`;
    card.querySelector('.learn-start-btn').addEventListener('click', e => {
      e.stopPropagation();
      if (!isDone) {
        const prog = getLearnProgress();
        prog.push(i);
        saveLearnProgress(prog);
        showToast(`🎉 "${lesson.title}" completed!`, 'success');
        renderLearnSection();
        updateLearnProgress();
      }
    });
    grid.appendChild(card);
  });
  updateLearnProgress();
}

function updateLearnProgress() {
  const completed = getLearnProgress();
  const total = LESSONS.length;
  const done  = completed.length;
  const doneEl  = document.getElementById('learnDoneCount');
  const totalEl = document.getElementById('learnTotalCount');
  const fill    = document.getElementById('learnProgFill');
  if (doneEl)  doneEl.textContent = done;
  if (totalEl) totalEl.textContent = total;
  if (fill)    fill.style.width = `${(done / total) * 100}%`;
}
renderLearnSection();

// ════════════════════════════════════════════════════════════
// CODE MINIMAP RENDERER
// ════════════════════════════════════════════════════════════
function renderMinimap(stack) {
  const minimap = document.getElementById('wsCodeMinimap');
  if (!minimap) return;
  const code = codeTemplates[stack] || '';
  const lines = code.split('\n');
  const colors = {
    comment:  '#444',
    keyword:  '#569cd6',
    string:   '#ce9178',
    function: '#4ec9b0',
    blank:    'transparent',
    normal:   '#555',
  };
  minimap.innerHTML = lines.slice(0, 100).map(line => {
    const t = line.trim();
    let color = colors.normal;
    if (!t) color = colors.blank;
    else if (t.startsWith('//') || t.startsWith('#'))  color = colors.comment;
    else if (/\b(function|const|let|var|def|class|import|from|return|if|for|while)\b/.test(t)) color = colors.keyword;
    else if (/'.*'|".*"/.test(t)) color = colors.string;
    const w = Math.min(44, Math.max(4, Math.round(t.length * 0.4)));
    return `<div class="mm-line" style="width:${w}px;background:${color}"></div>`;
  }).join('');
}

// patch loadCode to also render minimap
const _loadCodeForMinimap = loadCode;
function loadCode(stack) {
  _loadCodeForMinimap(stack);
  setTimeout(() => renderMinimap(stack), 60);
}

// ════════════════════════════════════════════════════════════
// CODE FORMATTER BUTTON
// ════════════════════════════════════════════════════════════
document.getElementById('wsFormatBtn')?.addEventListener('click', function () {
  this.textContent = '…';
  this.disabled = true;
  setTimeout(() => {
    this.textContent = '✓';
    this.disabled = false;
    // Re-render code (just triggers a visual reload)
    if (activeProject) loadCode(activeProject.stack);
    const ind = document.getElementById('wsCodeSaveIndicator');
    if (ind) { ind.textContent = '✓ Formatted'; ind.style.opacity = '1'; clearTimeout(ind._timer); ind._timer = setTimeout(() => { ind.style.opacity = '0'; this.textContent = '{ }'; }, 2000); }
  }, 700);
});

// ════════════════════════════════════════════════════════════
// AI MODEL SELECTOR
// ════════════════════════════════════════════════════════════
document.getElementById('wsAiModelSel')?.addEventListener('change', function () {
  const names = { gpt4o:'GPT-4o', gpt4:'GPT-4 Turbo', claude3:'Claude 3.5', gemini:'Gemini 1.5', llama:'Llama 3.3' };
  showToast(`AI model switched to ${names[this.value] || this.value}`, 'info');
});

// ════════════════════════════════════════════════════════════
// EXPORT PROJECT (simulated ZIP)
// ════════════════════════════════════════════════════════════
document.getElementById('wsExportBtn')?.addEventListener('click', () => {
  const btn = document.getElementById('wsExportBtn');
  showToast('Bundling project…', 'info');
  btn.disabled = true;
  setTimeout(() => {
    btn.disabled = false;
    const projectName = activeProject?.name || 'project';
    const code = codeTemplates[activeProject?.stack || 'Node.js'] || '';
    const blob = new Blob([code], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `${projectName}.zip.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`✓ ${projectName} exported`, 'success');
  }, 1200);
});

// ════════════════════════════════════════════════════════════
// MOBILE BOTTOM BAR NAV
// ════════════════════════════════════════════════════════════
document.querySelectorAll('.mbb-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mbb-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    navigateTo(btn.dataset.section);
  });
});
