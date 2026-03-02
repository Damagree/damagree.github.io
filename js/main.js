// ═══════════════════════════════════════════════════════════════
// main.js — UI Interactions, Animations & Boot Sequence
// ═══════════════════════════════════════════════════════════════

// ── Cycling hero word ──────────────────────────────────────────
const cycleWords = ['Feature','Product','System','Pipeline','Platform','Engineer'];
let cwIdx = 0;
const cwEl = document.getElementById('hero-cycling-word');
if (cwEl) {
  cwEl.style.transition = 'opacity 0.3s, transform 0.3s';
  setInterval(() => {
    cwEl.style.opacity = '0';
    cwEl.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      cwIdx = (cwIdx + 1) % cycleWords.length;
      cwEl.textContent = cycleWords[cwIdx];
      cwEl.style.transition = 'opacity 0.5s, transform 0.5s';
      cwEl.style.opacity = '1';
      cwEl.style.transform = 'translateY(0)';
    }, 300);
  }, 2200);
}

// ── Live uptime counter ────────────────────────────────────────
const startTime = Date.now();
function updateUptime() {
  const s = Math.floor((Date.now() - startTime) / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sc = String(s % 60).padStart(2, '0');
  const el = document.getElementById('hud-uptime');
  if (el) el.textContent = `${h}:${m}:${sc}`;
}
setInterval(updateUptime, 1000);

// ── Boot sequence ──────────────────────────────────────────────
const bootLines = [
  { delay:   0, cls: 'ok',   text: 'kernel loaded // v4.2.0' },
  { delay: 280, cls: 'ok',   text: 'spatial renderer initialized' },
  { delay: 580, cls: 'load', text: 'loading XR subsystem...' },
  { delay: 900, cls: 'ok',   text: 'XR subsystem ONLINE' },
  { delay:1100, cls: 'load', text: 'mounting engine nodes...' },
  { delay:1400, cls: 'ok',   text: 'Unity · Unreal engine nodes bound' },
  { delay:1650, cls: 'ok',   text: 'physics simulation layer ready' },
  { delay:1900, cls: 'load', text: 'connecting backend mesh...' },
  { delay:2200, cls: 'ok',   text: 'cloud API · DB nodes connected' },
  { delay:2450, cls: 'warn', text: 'AI subsystem in experimental mode' },
  { delay:2700, cls: 'ok',   text: 'mentorship module loaded' },
  { delay:2950, cls: 'ok',   text: 'all 12 nodes ONLINE // system ready' },
];
const bootProgress = [0, 8, 16, 28, 38, 52, 62, 70, 82, 88, 93, 100];

const bootLog  = document.getElementById('boot-log');
const bootBar  = document.getElementById('boot-bar');
const bootPct  = document.getElementById('boot-pct');
const bootStat = document.getElementById('boot-status');
const bootEl   = document.getElementById('boot-overlay');
const legendEl = document.getElementById('legend-panel');

bootLines.forEach((line, i) => {
  setTimeout(() => {
    const prev = bootLog && bootLog.querySelector('.load');
    if (prev) prev.remove();
    if (bootLog) {
      const span = document.createElement('span');
      span.className = `log-line ${line.cls}`;
      span.textContent = line.text;
      bootLog.appendChild(span);
      bootLog.scrollTop = bootLog.scrollHeight;
    }
    const pct = bootProgress[i];
    if (bootBar)  bootBar.style.width  = pct + '%';
    if (bootPct)  bootPct.textContent  = pct + '%';
    if (bootStat) bootStat.textContent = pct < 100 ? 'LOADING MODULES...' : 'ALL SYSTEMS NOMINAL';
    if (i === bootLines.length - 1) {
      setTimeout(() => {
        if (bootEl)   bootEl.classList.add('done');
        if (legendEl) { legendEl.style.opacity = '1'; legendEl.style.pointerEvents = 'auto'; }
      }, 700);
    }
  }, line.delay + 400);
});

// ── Availability status badge ──────────────────────────────────
// Update this object whenever your status changes
const AVAILABILITY = {
  open: true,                        // true = available, false = unavailable
  label: 'Available for Projects',   // shown in nav badge
  detail: 'Open to new work',        // shown on hover
};
const badge = document.getElementById('avail-badge');
const badgeLabel = document.getElementById('avail-label');
if (badge && badgeLabel) {
  badgeLabel.textContent = AVAILABILITY.label;
  badge.title = AVAILABILITY.detail;
  if (!AVAILABILITY.open) {
    badge.classList.add('unavailable');
  }
}

// ── Scroll reveal ──────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Typing hero sub ────────────────────────────────────────────
const sub = document.querySelector('.hero-sub');
if (sub) {
  const text = sub.textContent;
  sub.textContent = '';
  let ti = 0;
  function typeHero() {
    if (ti < text.length) { sub.textContent += text[ti++]; setTimeout(typeHero, 16); }
  }
  setTimeout(typeHero, 700);
}

// ── Nav active highlight ───────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
  navLinks.forEach(a => { a.style.color = a.getAttribute('href') === '#' + current ? '#00f5ff' : ''; });
}, { passive: true });

// ── Service accordion ──────────────────────────────────────────
document.querySelectorAll('[data-service]').forEach(item => {
  const header = item.querySelector('.service-header');
  const body   = item.querySelector('.service-body');
  header.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('[data-service].open').forEach(s => {
      s.classList.remove('open');
      s.querySelector('.service-body').style.maxHeight = '0';
    });
    if (!isOpen) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

// ── Mode toggle (Structured / Rapid) ──────────────────────────
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.mode-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.mode).classList.add('active');
  });
});

// ── Quote card SVG draw on hover ───────────────────────────────
document.querySelectorAll('.quote-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.querySelectorAll('.draw-path').forEach(path => {
      const len = path.getTotalLength ? path.getTotalLength() : 300;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.style.transition = 'stroke-dashoffset 1.2s ease';
      requestAnimationFrame(() => { path.style.strokeDashoffset = '0'; });
    });
  });
  card.addEventListener('mouseleave', () => {
    card.querySelectorAll('.draw-path').forEach(path => {
      path.style.transition = 'stroke-dashoffset 0.3s ease';
      path.style.strokeDashoffset = path.style.strokeDasharray;
    });
  });
});
