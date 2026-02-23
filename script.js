/* ═══════════════════════════════════
   SAGAR SS · PORTFOLIO 3.0 · script.js
═══════════════════════════════════ */

// ══════════════════════════════════════
//  LAMP INTRO
// ══════════════════════════════════════
(function initLamp() {
  // Stars
  const starsEl = document.getElementById('stars');
  for (let i = 0; i < 120; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${(Math.random()*3+2).toFixed(1)}s;--delay:-${(Math.random()*5).toFixed(1)}s;`;
    starsEl.appendChild(s);
  }

  // Glowing cursor on intro screen
  const lampCursor = document.getElementById('lampCursor');
  document.addEventListener('mousemove', e => {
    lampCursor.style.left = e.clientX + 'px';
    lampCursor.style.top  = e.clientY + 'px';
  });

  const pullWrap   = document.getElementById('pullWrap');
  const stringBall = document.getElementById('stringBall');
  const canvas     = document.getElementById('stringCanvas');
  const ctx        = canvas.getContext('2d');
  const bulb       = document.getElementById('bulb');
  const shade      = document.querySelector('.lamp-shade');
  const lightCone  = document.getElementById('lightCone');
  const lightGlow  = document.getElementById('lightGlow');
  const floorGlow  = document.getElementById('floorGlow');
  const flashOvl   = document.getElementById('flashOverlay');
  const pullHint   = document.getElementById('pullHint');
  const lampScreen = document.getElementById('lampScreen');
  const portfolio  = document.getElementById('portfolio');

  let isDragging = false;
  let startX = 0, startY = 0;
  let pullX = 0,  pullY = 0;
  let lastX = 0,  lastY = 0;
  let triggered = false;
  const PULL_THRESHOLD = 80;
  const CX = 40;
  const BASE_Y = 10;

  function drawString(offX, offY) {
    ctx.clearRect(0, 0, 80, 140);
    const endX = CX + offX;
    const endY = BASE_Y + 100 + offY;
    const midX = CX + offX * 0.4;
    const midY = BASE_Y + 50 + offY * 0.5;
    ctx.beginPath();
    ctx.moveTo(CX, BASE_Y);
    ctx.quadraticCurveTo(midX, midY, endX, endY);
    ctx.strokeStyle = '#c8b89a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    stringBall.style.transform = `translate(${offX}px, ${offY}px)`;
  }

  drawString(0, 0);

  function getPullDist() {
    return Math.sqrt(pullX * pullX + pullY * pullY);
  }

  function onDown(e) {
    if (triggered) return;
    isDragging = true;
    const pt = e.touches ? e.touches[0] : e;
    startX = pt.clientX;
    startY = pt.clientY;
    lastX = pullX;
    lastY = pullY;
    pullHint.style.opacity = '0';
    e.preventDefault();
  }

  function onMove(e) {
    if (!isDragging || triggered) return;
    const pt = e.touches ? e.touches[0] : e;
    const dx = pt.clientX - startX;
    const dy = pt.clientY - startY;
    const maxPull = 130;
    pullX = Math.max(-maxPull, Math.min(maxPull, lastX + dx));
    pullY = Math.max(-60,      Math.min(maxPull, lastY + dy));
    drawString(pullX, pullY);

    const pct = Math.min(1, getPullDist() / PULL_THRESHOLD);
    if (pct > 0.2) {
      bulb.style.opacity = Math.min(0.6, pct * 0.6);
      lightGlow.style.background = `radial-gradient(circle, rgba(255,200,80,${pct * 0.2}) 0%, transparent 70%)`;
      lampCursor.style.boxShadow = `0 0 ${12 + pct*20}px ${4 + pct*10}px rgba(255,200,80,${0.6 + pct*0.4})`;
    }
    e.preventDefault();
  }

  function onUp() {
    if (!isDragging || triggered) return;
    isDragging = false;
    if (getPullDist() >= PULL_THRESHOLD) {
      triggerLampOn();
    } else {
      springBack();
    }
  }

  pullWrap.addEventListener('mousedown',  onDown);
  pullWrap.addEventListener('touchstart', onDown, { passive: false });
  document.addEventListener('mousemove',  onMove);
  document.addEventListener('touchmove',  onMove, { passive: false });
  document.addEventListener('mouseup',    onUp);
  document.addEventListener('touchend',   onUp);

  function springBack() {
    let vx = -pullX * 0.3;
    let vy = -pullY * 0.3;
    function animate() {
      vx += (0 - pullX) * 0.2; vx *= 0.65;
      vy += (0 - pullY) * 0.2; vy *= 0.65;
      pullX += vx; pullY += vy;
      drawString(pullX, pullY);
      bulb.style.opacity = 0.2;
      lightGlow.style.background = '';
      lampCursor.style.boxShadow = '0 0 12px 4px rgba(255,200,80,0.6)';
      if (Math.abs(pullX) > 0.5 || Math.abs(pullY) > 0.5) {
        requestAnimationFrame(animate);
      } else {
        pullX = 0; pullY = 0; drawString(0, 0);
      }
    }
    animate();
  }

  function triggerLampOn() {
    triggered = true;
    bulb.classList.add('lit');
    shade.classList.add('lit');
    lightCone.classList.add('lit');
    lightGlow.classList.add('lit');
    floorGlow.classList.add('lit');
    lampCursor.style.boxShadow = '0 0 40px 15px rgba(255,220,100,1)';

    function snapBack() {
      pullX *= 0.55; pullY *= 0.55;
      drawString(pullX, pullY);
      if (Math.abs(pullX) > 0.5 || Math.abs(pullY) > 0.5) {
        requestAnimationFrame(snapBack);
      } else {
        drawString(0, 0);
      }
    }
    snapBack();

    setTimeout(() => {
      flashOvl.style.opacity = '1';
      flashOvl.style.transition = 'opacity 0.15s';
      setTimeout(() => {
        lampScreen.style.display = 'none';
        portfolio.classList.remove('hidden');
        portfolio.style.display = 'block';
        requestAnimationFrame(() => portfolio.classList.add('visible'));
        flashOvl.style.opacity = '0';
        flashOvl.style.transition = 'opacity 0.6s';
        initPortfolio();
      }, 180);
    }, 900);
  }
})();


// ══════════════════════════════════════
//  PORTFOLIO INIT (runs after lamp)
// ══════════════════════════════════════
function initPortfolio() {

  // ── Dark/Light Theme Toggle ──────────
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  let isDark = true;

  themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  });

  // ── Custom Cursor ────────────────────
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a,button,.pc,.sb,.ci,.gh-repo-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(3)';
      cursor.style.background = 'rgba(124,107,255,.6)';
      cursorRing.style.borderColor = 'rgba(255,107,157,.7)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1.4)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.background = '';
      cursorRing.style.borderColor = '';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });

  // ── Navbar scroll ────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    document.querySelectorAll('section[id]').forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) {
        document.querySelectorAll('.nav-links a').forEach(a => {
          a.style.color = a.getAttribute('href') === `#${sec.id}` ? 'var(--a1)' : '';
        });
      }
    });
  });

  // ── Mobile menu ──────────────────────
  const ham = document.getElementById('hamburger');
  const mob = document.createElement('div');
  mob.className = 'mobile-menu';
  mob.innerHTML = `
    <button class="mob-close" id="mobClose">✕</button>
    <a href="#hero"     onclick="closeMob()">Home</a>
    <a href="#about"    onclick="closeMob()">About</a>
    <a href="#skills"   onclick="closeMob()">Skills</a>
    <a href="#projects" onclick="closeMob()">Projects</a>
    <a href="#github"   onclick="closeMob()">GitHub</a>
    <a href="#contact"  onclick="closeMob()">Contact</a>
  `;
  document.body.appendChild(mob);
  ham.addEventListener('click', () => mob.classList.add('open'));
  document.getElementById('mobClose').addEventListener('click', () => mob.classList.remove('open'));
  window.closeMob = () => mob.classList.remove('open');

  // ── Scroll reveal ────────────────────
  const reveals = document.querySelectorAll('.reveal, .pc, .sb, .ci, .gh-repo-card');
  reveals.forEach(el => el.classList.add('reveal'));
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 70);
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => revObs.observe(el));

  // ── Skill bars ────────────────────────
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.style.width = e.target.dataset.w + '%';
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.bar-fill').forEach(b => barObs.observe(b));

  // ── Counter animation ─────────────────
  const counters = document.querySelectorAll('.hs-n[data-target]');
  const cObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = +e.target.dataset.target;
        let count = 0;
        const step = target / 60;
        const tick = setInterval(() => {
          count += step;
          if (count >= target) { e.target.textContent = target; clearInterval(tick); }
          else e.target.textContent = Math.floor(count);
        }, 20);
        cObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cObs.observe(c));

  // ── Photo 3D tilt ─────────────────────
  const pw = document.getElementById('photoWrap');
  if (pw) {
    pw.addEventListener('mousemove', e => {
      const r = pw.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      pw.style.transform = `perspective(900px) rotateX(${-(e.clientY-cy)/22}deg) rotateY(${(e.clientX-cx)/22}deg)`;
      pw.style.transition = 'none';
    });
    pw.addEventListener('mouseleave', () => {
      pw.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
      pw.style.transition = 'transform .6s ease';
    });
  }

  // ── Typing effect ─────────────────────
  const heroDesc = document.getElementById('heroDesc');
  if (heroDesc) {
    const lines = [
      'Full-Stack Developer · ISE Undergrad · Bangalore',
      'Building ideas into real-world applications 🚀',
      'React · Node.js · Python · Firebase · Always learning',
    ];
    let li = 0, ci = 0, del = false;
    function type() {
      const cur = lines[li];
      heroDesc.textContent = del ? cur.slice(0, ci--) : cur.slice(0, ci++);
      if (!del && ci > cur.length) { del = true; return setTimeout(type, 2000); }
      if (del && ci < 0) { del = false; li = (li + 1) % lines.length; ci = 0; return setTimeout(type, 500); }
      setTimeout(type, del ? 35 : 65);
    }
    setTimeout(type, 800);
  }

  // ── Smooth scroll ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ── Contact form ──────────────────────
  document.getElementById('contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('.cfbtn');
    btn.textContent = '✓ Sent!';
    btn.style.background = 'linear-gradient(135deg,#4ade80,#22c55e)';
    setTimeout(() => {
      btn.innerHTML = 'Send Message <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      btn.style.background = '';
      e.target.reset();
    }, 3000);
  });

  // ── Parallax blobs ────────────────────
  document.addEventListener('mousemove', e => {
    const mx2 = (e.clientX / window.innerWidth  - 0.5) * 20;
    const my2 = (e.clientY / window.innerHeight - 0.5) * 20;
    document.querySelectorAll('.mesh-blob').forEach((b, i) => {
      b.style.transform = `translate(${mx2*(i+1)*0.4}px, ${my2*(i+1)*0.4}px)`;
    });
  });

  // ── GitHub Live Data ──────────────────
  loadGitHub();
}


// ══════════════════════════════════════
//  GITHUB API
// ══════════════════════════════════════
async function loadGitHub() {
  const username = 'sagr12004';

  try {
    const res  = await fetch(`https://api.github.com/users/${username}`);
    const data = await res.json();

    const avatar = document.getElementById('ghAvatar');
    if (avatar) avatar.src = data.avatar_url;

    const nameEl = document.getElementById('ghName');
    if (nameEl) nameEl.textContent = data.name || data.login;

    const bioEl = document.getElementById('ghBio');
    if (bioEl) bioEl.textContent = data.bio || 'Full-Stack Developer | ISE @ DSATM Bangalore';

    const reposEl = document.getElementById('ghRepos');
    if (reposEl) reposEl.textContent = data.public_repos;

    const followersEl = document.getElementById('ghFollowers');
    if (followersEl) followersEl.textContent = data.followers;

    const followingEl = document.getElementById('ghFollowing');
    if (followingEl) followingEl.textContent = data.following;

    // Load repos
    const reposRes  = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    const reposData = await reposRes.json();

    const grid = document.getElementById('ghReposGrid');
    if (grid && Array.isArray(reposData)) {
      grid.innerHTML = '';
      reposData.slice(0, 6).forEach(repo => {
        const card = document.createElement('a');
        card.href = repo.html_url;
        card.target = '_blank';
        card.className = 'gh-repo-card reveal';
        const langColors = {
          JavaScript: '#f1e05a', Python: '#3572A5', HTML: '#e34c26',
          CSS: '#563d7c', TypeScript: '#2b7489', C: '#555555'
        };
        const color = langColors[repo.language] || '#7c6bff';
        card.innerHTML = `
          <div class="gh-repo-name">📁 ${repo.name}</div>
          <div class="gh-repo-desc">${repo.description || 'No description available.'}</div>
          <div class="gh-repo-meta">
            ${repo.language ? `<span><span class="lang-dot" style="background:${color}"></span>${repo.language}</span>` : ''}
            <span>⭐ ${repo.stargazers_count}</span>
            <span>🍴 ${repo.forks_count}</span>
          </div>
        `;
        grid.appendChild(card);
      });

      // Observe new cards for reveal animation
      const newObs = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80);
        });
      }, { threshold: 0.1 });
      grid.querySelectorAll('.gh-repo-card').forEach(c => newObs.observe(c));
    }

  } catch (err) {
    const grid = document.getElementById('ghReposGrid');
    if (grid) {
      grid.innerHTML = `<div style="color:var(--muted2);font-family:var(--font-m);font-size:.8rem;grid-column:span 3;text-align:center;padding:2rem;">
        Could not load GitHub data. <a href="https://github.com/sagr12004" style="color:var(--a1)">Visit profile ↗</a>
      </div>`;
    }
  }
}