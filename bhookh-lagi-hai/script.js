'use strict';

// Utils
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Scroll progress
(() => {
  const bar = document.querySelector('.scroll-progress');
  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrollTop / docHeight));
    bar.style.width = `${progress * 100}%`;
  };
  window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  update();
})();

// Header color change on scroll
(() => {
  const onScroll = () => {
    document.body.dataset.scrolled = window.scrollY > 4;
  };
  window.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
  onScroll();
})();

// Parallax background & slight blur on scroll
(() => {
  const bg = document.querySelector('[data-parallax]');
  const hero = document.querySelector('.hero');
  const onScroll = () => {
    const y = window.scrollY * 0.3;
    if (bg) bg.style.transform = `translate3d(0, ${y}px, 0) scale(1.1)`;
    const blur = Math.min(2, window.scrollY / 200);
    if (hero) hero.style.filter = `blur(${blur}px)`;
  };
  window.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
})();

// Intersection Observer: slide-in services & reviews
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  $$('.service-card, .review-card').forEach((el) => io.observe(el));
})();

// Counter animations
(() => {
  const counters = $$('.stat-number');
  const animate = (el) => {
    const target = parseInt(el.dataset.target || '0', 10);
    const start = performance.now();
    const dur = 1400;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const val = Math.floor(p * target);
      el.textContent = val.toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.isIntersecting && (animate(e.target), io.unobserve(e.target)));
  }, { threshold: 0.6 });
  counters.forEach((el) => io.observe(el));
})();

// Menu filter
(() => {
  const btns = $$('.filter-btn');
  const cards = $$('.menu-card');
  btns.forEach((b) => b.addEventListener('click', () => {
    btns.forEach((x) => x.classList.remove('active'));
    b.classList.add('active');
    const f = b.dataset.filter;
    cards.forEach((c) => {
      const show = f === 'all' || c.dataset.cat === f;
      c.style.display = show ? '' : 'none';
    });
  }));
})();

// Reviews carousel (auto-scroll)
(() => {
  const track = $('.carousel-track');
  if (!track) return;
  let dir = 1;
  let rafId = 0;
  const speed = 0.4; // px per frame
  const loop = () => {
    track.scrollLeft += speed * dir;
    const max = track.scrollWidth - track.clientWidth - 2;
    if (track.scrollLeft <= 0) dir = 1;
    if (track.scrollLeft >= max) dir = -1;
    rafId = requestAnimationFrame(loop);
  };
  const start = () => { if (!rafId) rafId = requestAnimationFrame(loop); };
  const stop = () => { cancelAnimationFrame(rafId); rafId = 0; };
  start();
  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', start);
})();

// Dynamic open/closed status
(() => {
  const openEl = document.querySelector('.open-state');
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = 10 * 60 + 30; // 10:30
  const close = 22 * 60 + 30; // 22:30
  const isOpen = mins >= open && mins <= close;
  if (openEl) openEl.textContent = isOpen ? 'Open now' : 'Closed';
})();

// (removed: confetti on rating, hunger meter, and emoji cursor trail)

// Theme toggle and auto day/night
(() => {
  const btn = document.querySelector('.theme-toggle');
  const apply = (mode) => document.body.setAttribute('data-theme', mode);
  const hour = new Date().getHours();
  apply(hour >= 19 || hour < 7 ? 'dark' : 'auto');
  btn && btn.addEventListener('click', () => {
    const cur = document.body.getAttribute('data-theme');
    apply(cur === 'dark' ? 'auto' : 'dark');
  });
})();

// Mobile nav
(() => {
  const burger = document.querySelector('.hamburger');
  const nav = document.getElementById('primary-navigation');
  if (!burger || !nav) return;
  const toggle = () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open');
  };
  burger.addEventListener('click', toggle);
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) toggle(); });
})();

// Back to top
(() => {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  const onScroll = () => { btn.classList.toggle('visible', window.scrollY > 400); };
  window.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// Ripple effect on buttons with .ripple
(() => {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.ripple');
    if (!btn) return;
    const circle = document.createElement('span');
    circle.style.position = 'absolute';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = e.clientX - rect.left - size/2 + 'px';
    circle.style.top = e.clientY - rect.top - size/2 + 'px';
    circle.style.borderRadius = '50%';
    circle.style.background = 'rgba(255,255,255,0.5)';
    circle.style.transform = 'scale(0)';
    circle.style.animation = 'ripple 600ms ease-out forwards';
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 650);
  });
})();

// Newsletter validation
(() => {
  const form = document.querySelector('.newsletter');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const msg = form.querySelector('.form-msg');
    const ok = /.+@.+\..+/.test(email);
    msg.textContent = ok ? 'Thanks for subscribing! 🎉' : 'Please enter a valid email.';
    msg.style.color = ok ? 'lightgreen' : 'salmon';
    if (ok) form.reset();
  });
})();

// Particles in hero
(() => {
  const canvas = document.querySelector('.particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, raf;
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const resize = () => { w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr); };
  const particles = Array.from({ length: 60 }, () => ({ x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight, r: Math.random()*2+0.5, vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3 }));
  const step = () => {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    });
    raf = requestAnimationFrame(step);
  };
  window.addEventListener('resize', resize);
  resize();
  step();
})();

// Keyframes injected for JS-driven effects (only ripple kept)
(() => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple { to { transform: scale(2.4); opacity: 0 } }
  `;
  document.head.appendChild(style);
})();

// Year in footer
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
});

