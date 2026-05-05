/* ========================
   TUBE SHORTS PRO — APP.JS
   ======================== */

// ── Navigation ──────────────────────────────────────────────
const navItems  = document.querySelectorAll('.nav-item');
const pages     = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');

const pageTitles = {
  dashboard:  'Dashboard',
  titles:     'Title Optimizer',
  thumbnails: 'Thumbnail Studio',
  analytics:  'Analytics',
  seo:        'SEO Checker',
};

function navigateTo(pageId) {
  navItems.forEach(n => n.classList.toggle('active', n.dataset.page === pageId));
  pages.forEach(p => p.classList.toggle('active', p.id === `page-${pageId}`));
  pageTitle.textContent = pageTitles[pageId] || pageId;

  if (pageId === 'analytics' && !document.getElementById('analyticsContent').querySelector('.analytics-grid')) {
    loadAnalytics();
  }
}

navItems.forEach(n => n.addEventListener('click', e => {
  e.preventDefault();
  navigateTo(n.dataset.page);
}));

// Buttons with data-goto
document.querySelectorAll('[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.goto));
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar    = document.getElementById('sidebar');
menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));

// ── Dashboard: load top videos ───────────────────────────────
async function loadTopVideos() {
  try {
    const res = await fetch('/api/analytics/overview');
    const data = await res.json();
    const container = document.getElementById('topVideos');
    container.innerHTML = '';
    data.topVideos.forEach((v, i) => {
      const row = document.createElement('div');
      row.className = 'video-row';
      row.innerHTML = `
        <span class="video-rank">#${i + 1}</span>
        <div class="video-info">
          <div class="video-title">${v.title}</div>
          <div class="video-meta">
            <span>👁 ${v.views.toLocaleString()} views</span>
            <span>❤ ${v.likes.toLocaleString()} likes</span>
          </div>
        </div>
        <span class="video-ctr">${v.ctr} CTR</span>
      `;
      container.appendChild(row);
    });
  } catch {
    document.getElementById('topVideos').innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding:12px 0;">Could not load data.</p>';
  }
}

loadTopVideos();

// ── Title Optimizer ──────────────────────────────────────────
document.getElementById('titleOptimizeBtn').addEventListener('click', async () => {
  const topic = document.getElementById('titleTopic').value.trim();
  if (!topic) { alert('Please enter a topic first.'); return; }

  const btn = document.getElementById('titleOptimizeBtn');
  btn.disabled = true;
  btn.textContent = 'Generating…';

  const resultsEl = document.getElementById('titleResults');
  resultsEl.innerHTML = '<div class="loading-spinner"></div>';
  resultsEl.classList.remove('hidden');

  try {
    const res  = await fetch('/api/titles/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });
    const data = await res.json();
    resultsEl.innerHTML = '';

    data.suggestions.forEach(({ title, score, tips }) => {
      const card = document.createElement('div');
      card.className = 'title-result-card';
      card.innerHTML = `
        <div class="result-title">${title}</div>
        <div class="score-bar-wrap">
          <div class="score-bar-track">
            <div class="score-bar-fill" style="width:${score}%"></div>
          </div>
          <span class="score-num">${score}/100</span>
        </div>
        <ul class="result-tips">
          ${tips.map(t => `<li>${t}</li>`).join('')}
        </ul>
        <button class="copy-btn" data-title="${title.replace(/"/g, '&quot;')}">Copy title</button>
      `;
      resultsEl.appendChild(card);
    });

    resultsEl.querySelectorAll('.copy-btn').forEach(b => {
      b.addEventListener('click', () => {
        navigator.clipboard.writeText(b.dataset.title).then(() => {
          b.textContent = 'Copied!';
          setTimeout(() => { b.textContent = 'Copy title'; }, 1500);
        });
      });
    });
  } catch {
    resultsEl.innerHTML = '<p style="color:var(--red);padding:12px">Error fetching suggestions.</p>';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Generate Titles';
  }
});

document.getElementById('titleTopic').addEventListener('keypress', e => {
  if (e.key === 'Enter') document.getElementById('titleOptimizeBtn').click();
});

// ── Thumbnail Studio ─────────────────────────────────────────
document.getElementById('thumbGenerateBtn').addEventListener('click', async () => {
  const topic = document.getElementById('thumbTopic').value.trim();
  const mood  = document.getElementById('thumbMood').value;
  if (!topic) { alert('Please enter a video topic.'); return; }

  const btn = document.getElementById('thumbGenerateBtn');
  btn.disabled = true; btn.textContent = 'Loading…';

  const resultsEl = document.getElementById('thumbResults');
  resultsEl.innerHTML = '<div class="loading-spinner"></div>';
  resultsEl.classList.remove('hidden');

  try {
    const res  = await fetch('/api/thumbnails/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, mood }),
    });
    const data = await res.json();

    const swatches = data.palette.map(c =>
      `<div class="swatch" style="background:${c}" title="${c}"></div>`
    ).join('');

    const overlayItems = data.overlays.map(o => `<li>${o}</li>`).join('');
    const tipItems     = data.tips.map(t => `<li>${t}</li>`).join('');

    resultsEl.innerHTML = `
      <div class="thumb-result">
        <div class="thumb-section">
          <h4>Color Palette</h4>
          <div class="palette-swatches">${swatches}</div>
          <p style="font-size:11px;color:var(--text-muted);margin-top:8px">Palette: <strong>${mood.replace('_', ' ')}</strong></p>

          <h4 style="margin-top:18px">Font Pairing</h4>
          <div class="font-pair">
            <div class="font-tag">
              <span class="ftype">Headline</span>
              ${data.font.headline}
            </div>
            <div class="font-tag">
              <span class="ftype">Body / Sub</span>
              ${data.font.sub}
            </div>
          </div>

          <h4 style="margin-top:18px">Suggested CTA Text</h4>
          <p style="font-size:14px;font-weight:700;color:var(--accent)">${data.ctaText}</p>
        </div>

        <div class="thumb-section">
          <h4>Overlay Ideas</h4>
          <ul class="overlay-list">${overlayItems}</ul>

          <h4 style="margin-top:18px">Best Practice Tips</h4>
          <ul class="tips-list">${tipItems}</ul>
        </div>
      </div>
    `;
  } catch {
    resultsEl.innerHTML = '<p style="color:var(--red);padding:12px">Error loading suggestions.</p>';
  } finally {
    btn.disabled = false; btn.textContent = 'Get Suggestions';
  }
});

// ── Analytics ────────────────────────────────────────────────
async function loadAnalytics() {
  const container = document.getElementById('analyticsContent');
  try {
    const [ovRes, tsRes] = await Promise.all([
      fetch('/api/analytics/overview'),
      fetch('/api/analytics/timeseries?days=14'),
    ]);
    const ov = await ovRes.json();
    const ts = await tsRes.json();

    const audience = ov.audienceSplit;
    const audienceBars = Object.entries(audience).map(([k, v]) => `
      <div class="audience-bar-row">
        <span class="audience-bar-label">${k}</span>
        <div class="audience-bar-track">
          <div class="audience-bar-fill" style="width:${v}%"></div>
        </div>
        <span class="audience-bar-pct">${v}%</span>
      </div>
    `).join('');

    const topRows = ov.topVideos.map((v, i) => `
      <div class="video-row">
        <span class="video-rank">#${i + 1}</span>
        <div class="video-info">
          <div class="video-title">${v.title}</div>
          <div class="video-meta">
            <span>👁 ${v.views.toLocaleString()}</span>
            <span>❤ ${v.likes.toLocaleString()}</span>
          </div>
        </div>
        <span class="video-ctr">${v.ctr}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="analytics-grid" style="margin-bottom:14px">
        <div class="analytics-card">
          <h4>Views Over Time (14 days)</h4>
          <canvas id="chartCanvas"></canvas>
        </div>
        <div class="analytics-card">
          <h4>Audience by Device</h4>
          <div class="audience-bar-list">${audienceBars}</div>
        </div>
      </div>
      <h3 class="section-title">Top Videos</h3>
      <div class="top-videos">${topRows}</div>
    `;

    drawChart(ts.series);
  } catch {
    container.innerHTML = '<p style="color:var(--red);padding:16px">Could not load analytics.</p>';
  }
}

function drawChart(series) {
  const canvas = document.getElementById('chartCanvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  const dpr    = window.devicePixelRatio || 1;
  const w      = canvas.offsetWidth;
  const h      = canvas.offsetHeight;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const values = series.map(d => d.views);
  const min    = Math.min(...values);
  const max    = Math.max(...values);
  const range  = max - min || 1;
  const pad    = { top: 10, right: 10, bottom: 20, left: 36 };
  const cw     = w - pad.left - pad.right;
  const ch     = h - pad.top  - pad.bottom;

  ctx.clearRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (ch / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cw, y); ctx.stroke();
  }

  // Y axis labels
  ctx.fillStyle = 'rgba(139,143,168,0.7)';
  ctx.font = `10px Inter`;
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const val = max - (range / 4) * i;
    const y   = pad.top + (ch / 4) * i + 3;
    ctx.fillText(Math.round(val).toLocaleString(), pad.left - 4, y);
  }

  // Gradient fill
  const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
  grad.addColorStop(0, 'rgba(192,132,252,0.3)');
  grad.addColorStop(1, 'rgba(192,132,252,0)');

  ctx.beginPath();
  series.forEach((d, i) => {
    const x = pad.left + (i / (series.length - 1)) * cw;
    const y = pad.top  + ch - ((d.views - min) / range) * ch;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(pad.left + cw, pad.top + ch);
  ctx.lineTo(pad.left, pad.top + ch);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 2;
  series.forEach((d, i) => {
    const x = pad.left + (i / (series.length - 1)) * cw;
    const y = pad.top  + ch - ((d.views - min) / range) * ch;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Dots
  ctx.fillStyle = '#c084fc';
  series.forEach((d, i) => {
    if (i % 3 !== 0) return;
    const x = pad.left + (i / (series.length - 1)) * cw;
    const y = pad.top  + ch - ((d.views - min) / range) * ch;
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
  });
}

// ── SEO Checker ──────────────────────────────────────────────
document.getElementById('seoCheckBtn').addEventListener('click', async () => {
  const title = document.getElementById('seoTitle').value.trim();
  const desc  = document.getElementById('seoDesc').value.trim();
  const tags  = document.getElementById('seoTags').value.trim();
  if (!title) { alert('Please enter a video title.'); return; }

  const btn = document.getElementById('seoCheckBtn');
  btn.disabled = true; btn.textContent = 'Checking…';

  const resultsEl = document.getElementById('seoResults');
  resultsEl.innerHTML = '<div class="loading-spinner"></div>';
  resultsEl.classList.remove('hidden');

  try {
    const params = new URLSearchParams({ title, description: desc, tags });
    const res    = await fetch(`/api/analytics/seo-score?${params}`);
    const data   = await res.json();

    const iconMap = { pass: '✓', fail: '✗', warn: '⚠' };
    const classMap = { pass: 'seo-icon-pass', fail: 'seo-icon-fail', warn: 'seo-icon-warn' };

    const items = data.breakdown.map(b => `
      <div class="seo-item">
        <span class="${classMap[b.status]}">${iconMap[b.status]}</span>
        <div>
          <div class="seo-item-text">${b.item}</div>
          ${b.hint ? `<div class="seo-item-hint">${b.hint}</div>` : ''}
        </div>
      </div>
    `).join('');

    resultsEl.innerHTML = `
      <div class="card">
        <div class="seo-score-ring">
          <div class="seo-score-num">${data.score}</div>
          <div class="seo-score-label">SEO Score / 100</div>
        </div>
        <div class="seo-breakdown">${items}</div>
      </div>
    `;
  } catch {
    resultsEl.innerHTML = '<p style="color:var(--red);padding:12px">Error checking SEO.</p>';
  } finally {
    btn.disabled = false; btn.textContent = 'Check SEO Score';
  }
});

// ── AI Chat ──────────────────────────────────────────────────
const chatPanel   = document.getElementById('chatPanel');
const chatOverlay = document.getElementById('chatOverlay');
const chatMessages= document.getElementById('chatMessages');
const chatInput   = document.getElementById('chatInput');

function openChat()  { chatPanel.classList.add('open'); chatOverlay.classList.add('visible'); }
function closeChat() { chatPanel.classList.remove('open'); chatOverlay.classList.remove('visible'); }

document.getElementById('chatToggle').addEventListener('click', openChat);
document.getElementById('chatClose').addEventListener('click', closeChat);
chatOverlay.addEventListener('click', closeChat);

function appendMsg(text, role) {
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendChat() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  chatInput.value = '';
  appendMsg(msg, 'user');

  const thinking = document.createElement('div');
  thinking.className = 'chat-msg bot';
  thinking.innerHTML = '<div class="msg-bubble" style="color:var(--text-muted)">Thinking…</div>';
  chatMessages.appendChild(thinking);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const res  = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg }),
    });
    const data = await res.json();
    thinking.querySelector('.msg-bubble').style.color = '';
    thinking.querySelector('.msg-bubble').textContent = data.reply;
  } catch {
    thinking.querySelector('.msg-bubble').textContent = 'Sorry, something went wrong. Try again.';
  }
}

document.getElementById('chatSendBtn').addEventListener('click', sendChat);
chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendChat(); });
