/**
 * ============================================================
 * JEET NAKUM PORTFOLIO — script.js
 * Features:
 *  - Loading Screen
 *  - Custom Cursor
 *  - Particle Background (Canvas)
 *  - Scroll Progress Bar
 *  - Sticky Navbar + Active Link Spy
 *  - Mobile Menu (Hamburger)
 *  - Typing Animation
 *  - Reveal on Scroll (IntersectionObserver)
 *  - Counter Animation
 *  - Skill Bar Animation
 *  - Theme Switcher (Dark/Light)
 *  - Skills Tab Switcher
 *  - Project Filter
 *  - Testimonial Carousel
 *  - Contact Form Validation
 *  - Ripple Button Effect
 *  - Scroll To Top Button
 *  - Mouse Parallax
 *  - Footer Year
 * ============================================================
 */

'use strict';

/* ============================================================
   UTILS
   ============================================================ */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

/* ============================================================
   1. LOADING SCREEN
   ============================================================ */
(function initLoader() {
  document.body.classList.add('loading');
  const loader = $('#loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      // Start animations after load
      initReveal();
      animateSkillBars();
    }, 2200);
  });
})();

/* ============================================================
   2. CURSOR — Simple default arrow (browser native)
   ============================================================ */
// Using browser's default arrow cursor — no custom cursor elements needed.

/* ============================================================
   3. PARTICLE BACKGROUND (Canvas)
   ============================================================ */
(function initParticles() {
  const canvas = $('#particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: null, y: null };
  const PARTICLE_COUNT = 70;
  const CONNECT_DIST  = 130;
  const MOUSE_DIST    = 120;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.r  = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Bounce
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_DIST) {
          const force = (MOUSE_DIST - dist) / MOUSE_DIST;
          this.x += dx / dist * force * 2;
          this.y += dy / dist * force * 2;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37,99,235,${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticleArray() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(37,99,235,${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  window.addEventListener('resize', () => { resize(); initParticleArray(); });

  resize();
  initParticleArray();
  animate();
})();

/* ============================================================
   4. SCROLL PROGRESS BAR
   ============================================================ */
(function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop  = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
})();

/* ============================================================
   5. STICKY NAVBAR + SCROLL SPY
   ============================================================ */
(function initNavbar() {
  const navbar  = $('#navbar');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  window.addEventListener('scroll', () => {
    // Sticky
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Scroll Spy
    let currentSection = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        currentSection = sec.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentSection);
    });

    // Scroll-to-top button
    const scrollTopBtn = $('#scroll-top');
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }
  }, { passive: true });
})();

/* ============================================================
   6. SMOOTH SCROLLING — helper
   ============================================================ */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      // Close mobile menu if open
      const navLinks = $('#nav-links');
      if (navLinks) navLinks.classList.remove('open');
    }
  });
});

// Scroll-to-top button
$('#scroll-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   7. MOBILE HAMBURGER MENU
   ============================================================ */
(function initMobileMenu() {
  const hamburger = $('#hamburger');
  const navLinks  = $('#nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);

    // Animate hamburger to X
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    }
  });
})();

/* ============================================================
   8. TYPING ANIMATION
   ============================================================ */
(function initTyping() {
  const typed = $('#typed-text');
  if (!typed) return;

  const roles = [
    'Web Developer',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const current = roles[roleIndex];

    if (isDeleting) {
      typed.textContent = current.slice(0, charIndex--);
    } else {
      typed.textContent = current.slice(0, charIndex++);
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex > current.length) {
      isDeleting = true;
      isPaused = true;
      delay = 1800;
    } else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      charIndex = 0;
      delay = 400;
    }

    if (isPaused) { isPaused = false; }

    setTimeout(type, delay);
  }

  type();
})();

/* ============================================================
   9. REVEAL ON SCROLL (IntersectionObserver)
   ============================================================ */
function initReveal() {
  const revealEls = $$('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ============================================================
   10. COUNTER ANIMATION
   ============================================================ */
(function initCounters() {
  const counters = $$('.stat-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = true;
        const target = parseInt(entry.target.dataset.target);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            entry.target.textContent = target;
            clearInterval(timer);
          } else {
            entry.target.textContent = Math.floor(current);
          }
        }, 16);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ============================================================
   11. SKILL BAR ANIMATION
   ============================================================ */
function animateSkillBars() {
  const fills = $$('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.dataset.width;
        setTimeout(() => {
          entry.target.style.width = width + '%';
        }, 200);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
}

/* ============================================================
   12. THEME SWITCHER (Dark / Light)
   ============================================================ */
(function initTheme() {
  const btn  = $('#theme-toggle');
  const icon = $('#theme-icon');
  if (!btn) return;

  const savedTheme = localStorage.getItem('jeet-theme') || 'dark';
  applyTheme(savedTheme);

  btn.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme;
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('jeet-theme', next);
  });

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    if (icon) {
      icon.className = theme === 'dark' ? 'bx bx-moon' : 'bx bx-sun';
    }
  }
})();

/* ============================================================
   13. SKILLS TAB SWITCHER
   ============================================================ */
(function initSkillTabs() {
  const tabs   = $$('.skill-tab');
  const panels = $$('.skill-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update tabs
      tabs.forEach(t   => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = $(`#tab-${target}`);
      if (panel) {
        panel.classList.add('active');
        // Re-animate skill bars in new panel
        const fills = $$('.skill-fill', panel);
        fills.forEach(f => {
          f.style.width = '0%';
          setTimeout(() => { f.style.width = f.dataset.width + '%'; }, 100);
        });
      }
    });
  });
})();

/* ============================================================
   14. PROJECT FILTER
   ============================================================ */
(function initProjectFilter() {
  const filterBtns = $$('.filter-btn');
  const cards      = $$('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          setTimeout(() => card.classList.remove('hidden'), 10);
        } else {
          card.classList.add('hidden');
          setTimeout(() => { if (card.classList.contains('hidden')) card.style.display = 'none'; }, 300);
        }
      });
    });
  });
})();

/* ============================================================
   15. TESTIMONIAL CAROUSEL
   ============================================================ */
(function initTestimonials() {
  const track    = $('#testimonial-track');
  const dots     = $$('.dot');
  const prevBtn  = $('#prev-btn');
  const nextBtn  = $('#next-btn');
  if (!track || !dots.length) return;

  let current = 0;
  const total = dots.length;
  let autoTimer;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAuto() { clearInterval(autoTimer); }

  nextBtn?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
  prevBtn?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
  });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { stopAuto(); goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
  }, { passive: true });

  startAuto();
})();

/* ============================================================
   16. CONTACT FORM VALIDATION
   ============================================================ */
(function initContactForm() {
  const form    = $('#contact-form');
  if (!form) return;

  const fields = {
    name:    { el: $('#contact-name'),    errEl: $('#name-error'),    minLen: 2 },
    email:   { el: $('#contact-email'),   errEl: $('#email-error')              },
    subject: { el: $('#contact-subject'), errEl: $('#subject-error'), minLen: 3 },
    message: { el: $('#contact-message'), errEl: $('#message-error'), minLen: 20 }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(field, key) {
    const val = field.el.value.trim();
    let err = '';

    if (!val) {
      err = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
    } else if (key === 'email' && !emailRegex.test(val)) {
      err = 'Please enter a valid email address.';
    } else if (field.minLen && val.length < field.minLen) {
      err = `Minimum ${field.minLen} characters required.`;
    }

    field.errEl.textContent = err;
    field.el.style.borderColor = err ? 'var(--danger)' : '';
    return !err;
  }

  // Real-time validation
  Object.entries(fields).forEach(([key, field]) => {
    field.el?.addEventListener('input', () => validate(field, key));
    field.el?.addEventListener('blur',  () => validate(field, key));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    Object.entries(fields).forEach(([key, field]) => {
      if (!validate(field, key)) isValid = false;
    });

    if (!isValid) return;

    // Real form submission via FormSubmit AJAX
    const btn     = $('#submit-btn');
    const btnText = $('#btn-text');

    btn.disabled = true;
    btnText.textContent = 'Sending...';
    btn.style.opacity = '0.7';

    const formData = new FormData(form);

    fetch('https://formsubmit.co/ajax/jeetnakum85@gmail.com', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      btn.disabled = false;
      btn.style.opacity = '1';
      btnText.textContent = 'Send Message';
      form.reset();

      const successEl = $('#form-success');
      if (successEl) {
        successEl.innerHTML = "<i class='bx bx-check-circle'></i> Message sent successfully! I'll get back to you soon.";
        successEl.style.color = "var(--success)";
        successEl.style.display = 'flex';
        setTimeout(() => { successEl.style.display = 'none'; }, 5000);
      }
    })
    .catch(error => {
      btn.disabled = false;
      btn.style.opacity = '1';
      btnText.textContent = 'Send Message';
      
      const successEl = $('#form-success');
      if (successEl) {
        successEl.innerHTML = "<i class='bx bx-error-circle'></i> Error sending message. Please try again.";
        successEl.style.color = "var(--danger)";
        successEl.style.display = 'flex';
        setTimeout(() => { successEl.style.display = 'none'; }, 5000);
      }
    });
  });
})();

/* ============================================================
   17. RIPPLE EFFECT ON BUTTONS
   ============================================================ */
(function initRipple() {
  $$('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect   = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size   = Math.max(rect.width, rect.height);

      ripple.className = 'ripple';
      ripple.style.width  = ripple.style.height = size + 'px';
      ripple.style.left   = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top    = (e.clientY - rect.top  - size / 2) + 'px';

      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
})();

/* ============================================================
   18. MOUSE PARALLAX (Hero section)
   ============================================================ */
(function initParallax() {
  const hero = $('.hero');
  const profileWrapper = $('.profile-wrapper');
  if (!hero || !profileWrapper) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const dx = (e.clientX - rect.left - cx) / cx;
    const dy = (e.clientY - rect.top  - cy) / cy;

    profileWrapper.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateZ(20px)`;
  });

  hero.addEventListener('mouseleave', () => {
    profileWrapper.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
    profileWrapper.style.transition = 'transform 0.6s ease';
  });

  hero.addEventListener('mouseenter', () => {
    profileWrapper.style.transition = 'transform 0.1s ease';
  });
})();

/* ============================================================
   19. FOOTER YEAR
   ============================================================ */
(function initFooterYear() {
  const el = $('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ============================================================
   20. NEWSLETTER FORM
   ============================================================ */
(function initNewsletter() {
  const btn   = $('#newsletter-btn');
  const input = $('#newsletter-email');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
      input.style.borderColor = 'var(--danger)';
      setTimeout(() => { input.style.borderColor = ''; }, 2000);
      return;
    }
    input.value = '';
    btn.innerHTML = '<i class="bx bx-check"></i>';
    btn.style.background = 'var(--success)';
    setTimeout(() => {
      btn.innerHTML = '<i class="bx bx-send"></i>';
      btn.style.background = '';
    }, 3000);
  });
})();

/* ============================================================
   21. LAZY IMAGE LOADING
   ============================================================ */
(function initLazyLoad() {
  const images = $$('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imgObserver.unobserve(img);
        }
      });
    });
    images.forEach(img => imgObserver.observe(img));
  }
})();

/* ============================================================
   22. FLOATING BADGES — Tilt Effect
   ============================================================ */
(function initBadgeTilt() {
  const badges = $$('.floating-badge');
  badges.forEach(badge => {
    badge.addEventListener('mouseenter', () => {
      badge.style.transform = 'scale(1.1) translateY(-4px)';
    });
    badge.addEventListener('mouseleave', () => {
      badge.style.transform = '';
    });
  });
})();
