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

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function defaultProjects() {
  return [
    { id: 1, name: 'tube-shorts-pro',    stack: 'Node.js',    icon: '🎬', bg: '#1a1a40', desc: 'YouTube Shorts optimizer', updatedAt: '2 days ago' },
    { id: 2, name: 'shopify-scraper',    stack: 'Python',     icon: '🛒', bg: '#1a3326', desc: 'E-commerce product crawler', updatedAt: '4 days ago' },
    { id: 3, name: 'discord-mod-bot',    stack: 'Node.js',    icon: '🤖', bg: '#1e2151', desc: 'Moderation + slash commands', updatedAt: '1 week ago' },
    { id: 4, name: 'ai-finder-api',      stack: 'Node.js',    icon: '🔍', bg: '#2d1b4e', desc: 'AI tool discovery API', updatedAt: '2 weeks ago' },
    { id: 5, name: 'crypto-dashboard',   stack: 'React',      icon: '📊', bg: '#1a2e1a', desc: 'Real-time price tracker', updatedAt: '3 weeks ago' },
    { id: 6, name: 'todo-cli',           stack: 'Python',     icon: '✅', bg: '#2d1a00', desc: 'Command-line task manager', updatedAt: '1 month ago' },
  ];
}

const stackIcons = {
  'Node.js': '🟢', Python: '🐍', React: '⚛️',
  'HTML/CSS/JS': '🌐', Go: '🐹', Rust: '🦀',
};

// ── Render Projects ─────────────────────────────────────────
function renderProjects(filter = 'all') {
  const grid = document.getElementById('projectsGrid');
  let projects = getProjects();

  if (filter === 'apps')  projects = projects.filter(p => !p.name.includes('bot') && !p.name.includes('api'));
  if (filter === 'bots')  projects = projects.filter(p => p.name.includes('bot'));
  if (filter === 'apis')  projects = projects.filter(p => p.name.includes('api'));

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

  // Add project cards also to templates section
  const templatesGrid = document.querySelector('#section-templates .projects-grid');
  if (templatesGrid) {
    templatesGrid.querySelectorAll('.template-card').forEach(tc => {
      tc.addEventListener('click', () => {
        const tpl = tc.dataset.tpl;
        document.getElementById('promptInput').value = tpl;
        navigateTo('home');
        document.getElementById('promptInput').focus();
      });
    });
  }

  // Delete buttons
  grid.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const projects = getProjects().filter(p => p.id !== id);
      saveProjects(projects);
      renderProjects(currentTab);
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
const modalOverlay = document.getElementById('modalOverlay');
const newProjectName = document.getElementById('newProjectName');
const newProjectDesc = document.getElementById('newProjectDesc');

function openCreateModal(prefillName = '') {
  newProjectName.value = prefillName;
  newProjectDesc.value = '';
  modalOverlay.classList.add('open');
  setTimeout(() => newProjectName.focus(), 100);
}

function closeCreateModal() {
  modalOverlay.classList.remove('open');
}

document.getElementById('newProjectBtn').addEventListener('click', () => openCreateModal());
document.getElementById('sidebarCreateBtn').addEventListener('click', () => openCreateModal());
document.getElementById('modalClose').addEventListener('click', closeCreateModal);
document.getElementById('modalCancelBtn').addEventListener('click', closeCreateModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeCreateModal(); });

// Stack picker
let selectedStack = 'Node.js';
document.querySelectorAll('.stack-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.stack-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedStack = btn.dataset.stack;
  });
});

// Create project confirm
document.getElementById('modalCreateBtn').addEventListener('click', () => {
  const name = newProjectName.value.trim() || 'my-project';
  const desc = newProjectDesc.value.trim() || `${selectedStack} project`;
  const bgMap = { 'Node.js':'#1a1a40', Python:'#1a3326', React:'#0a2840', 'HTML/CSS/JS':'#1a2d1a', Go:'#002d2d', Rust:'#2d1a00' };
  const iconMap2 = { 'Node.js':'🟢', Python:'🐍', React:'⚛️', 'HTML/CSS/JS':'🌐', Go:'🐹', Rust:'🦀' };

  const projects = getProjects();
  const newP = {
    id: Date.now(),
    name: name.toLowerCase().replace(/\s+/g, '-'),
    stack: selectedStack,
    icon: iconMap2[selectedStack] || '📁',
    bg: bgMap[selectedStack] || '#1a1a2e',
    desc,
    updatedAt: 'just now',
  };
  projects.unshift(newP);
  saveProjects(projects);
  closeCreateModal();
  renderProjects(currentTab);
  openBuildModal(`Creating ${newP.name}…`, newP);
});

// Enter key in modal
newProjectName.addEventListener('keypress', e => {
  if (e.key === 'Enter') document.getElementById('modalCreateBtn').click();
});

// ── Build Output Modal ──────────────────────────────────────
const buildOverlay = document.getElementById('buildOverlay');
const buildTerminal = document.getElementById('buildTerminal');
const buildActions  = document.getElementById('buildActions');
const buildModalTitle = document.getElementById('buildModalTitle');

function openBuildModal(title, project) {
  buildModalTitle.textContent = title;
  buildTerminal.innerHTML = '';
  buildActions.style.display = 'none';
  buildOverlay.classList.add('open');

  const steps = [
    { text: `Initializing ${project.name}…`, cls: 't-info', delay: 0 },
    { text: `Setting up ${project.stack} environment`, cls: '', delay: 400 },
    { text: 'Installing dependencies…', cls: '', delay: 900 },
    { text: 'npm install  (or pip install)  ✓', cls: 't-success', delay: 1600 },
    { text: 'Configuring dev server…', cls: '', delay: 2100 },
    { text: 'Running health check…', cls: 't-info', delay: 2700 },
    { text: `✓ ${project.name} is ready on port 3000`, cls: 't-success', delay: 3300 },
  ];

  steps.forEach(({ text, cls, delay }) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = `terminal-line ${cls}`;
      line.innerHTML = `<span class="t-prompt">$</span> ${text}`;
      buildTerminal.appendChild(line);
      buildTerminal.scrollTop = buildTerminal.scrollHeight;
      if (delay === 3300) {
        setTimeout(() => { buildActions.style.display = 'flex'; }, 400);
      }
    }, delay);
  });
}

document.getElementById('buildModalClose').addEventListener('click', () => {
  buildOverlay.classList.remove('open');
});
buildOverlay.addEventListener('click', e => {
  if (e.target === buildOverlay) buildOverlay.classList.remove('open');
});
document.getElementById('openProjectBtn').addEventListener('click', () => {
  buildOverlay.classList.remove('open');
});

// ── AI Prompt Submit ────────────────────────────────────────
async function submitPrompt(mode = 'build') {
  const text = document.getElementById('promptInput').value.trim();
  if (!text) {
    document.getElementById('promptInput').focus();
    return;
  }

  // Slugify as project name
  const name = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join('-');

  if (mode === 'plan') {
    openBuildModal(`Planning: ${name}`, { name, stack: 'Node.js' });
    return;
  }

  // Build mode — call API
  const fakeProject = { name, stack: 'Node.js', icon: '✨', bg: '#1e1a40', desc: text, updatedAt: 'just now' };
  openBuildModal(`Building ${name}…`, fakeProject);

  try {
    await fetch('/api/build', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text }),
    });
  } catch {
    // server might not have this route yet — terminal output is sufficient UX
  }

  // Save as new project
  const projects = getProjects();
  projects.unshift({ ...fakeProject, id: Date.now() });
  saveProjects(projects);
  renderProjects(currentTab);
  document.getElementById('promptInput').value = '';
}

document.getElementById('btnSubmit').addEventListener('click', () => submitPrompt('build'));
document.getElementById('btnPlan').addEventListener('click',   () => submitPrompt('plan'));

document.getElementById('promptInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submitPrompt('build');
});

// ── Template chips ──────────────────────────────────────────
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.getElementById('promptInput').value = chip.dataset.tpl;
    document.getElementById('promptInput').focus();
  });
});

// ── Workspace selector (decorative dropdown feel) ───────────
document.getElementById('workspaceSelector').addEventListener('click', () => {
  // could open a workspace switcher — wired as no-op for now
});

// ── Auto-resize textarea ────────────────────────────────────
const textarea = document.getElementById('promptInput');
textarea.addEventListener('input', () => {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 220) + 'px';
});
