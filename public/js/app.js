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
  projects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
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
      saveProjects(getProjects().filter(p => p.id !== id));
      renderProjects(currentTab);
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

  // build tab bar
  buildWsTabs(['editor', 'terminal', 'preview']);

  // render file tree
  renderFileTree(project.stack);

  // load code editor
  openWsPane('editor');
  loadCode(project.stack);

  // boot terminal
  bootTerminal(project);
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
      document.getElementById('wsCodeLang') && (document.getElementById('wsCodeLang').textContent = f.lang);
      openWsPane('editor');
    });
    tree.appendChild(item);
  });
}

// ── Code editor ──────────────────────────────────────────────
function loadCode(stack) {
  const code    = codeTemplates[stack] || codeTemplates['Node.js'];
  const lines   = code.split('\n');
  const content = document.getElementById('wsCodeContent');
  const nums    = document.getElementById('wsLineNums');
  const file    = filesByStack[stack]?.[0];

  document.getElementById('wsCodeFilename').textContent = file ? file.name : 'index.js';

  content.textContent = code;
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
  }, 2200);
});
