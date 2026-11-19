/**
 * Zahid Bin Ali — Interactive Portfolio Engine
 * High-performance animations, particle constellation, 3D tilt, audio synthesizer,
 * command palette, ROI calculator, and dynamic UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initAudioFeedback();
  initCustomCursor();
  initParticleConstellation();
  initTypingAnimation();
  initScrollEffects();
  init3DTilt();
  initTabs();
  initSkillsFilter();
  initCalculator();
  initCommandPalette();
  initResumeModal();
  initContactForm();
});

/* ==========================================================================
   1. Theme Engine (Dark / Light Mode)
   ========================================================================== */
function initThemeEngine() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Retrieve saved preference or check OS preference
  const savedTheme = localStorage.getItem('zahid_portfolio_theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', nextTheme);
      localStorage.setItem('zahid_portfolio_theme', nextTheme);
      updateThemeIcon(nextTheme);
      playSynthSound(440, 'triangle', 0.1);
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
  }
}

/* ==========================================================================
   2. Web Audio API Micro-Sound Feedback (Pure Synthesizer)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioFeedback() {
  const soundToggle = document.getElementById('sound-toggle');
  const savedSound = localStorage.getItem('zahid_portfolio_sound');
  soundEnabled = savedSound === 'true';
  updateSoundIcon();

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('zahid_portfolio_sound', soundEnabled);
      updateSoundIcon();

      if (soundEnabled) {
        initAudioContext();
        playSynthSound(587.33, 'sine', 0.12); // D5 chime
        showToast('UI Sound Effects Enabled', 'info');
      } else {
        showToast('UI Sound Effects Muted', 'info');
      }
    });
  }

  function updateSoundIcon() {
    if (!soundToggle) return;
    const icon = soundToggle.querySelector('i');
    if (icon) {
      icon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    }
  }

  // Attach subtle audio clicks to buttons and links
  document.querySelectorAll('a, button, .chip, .palette-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (soundEnabled) playSynthSound(880, 'sine', 0.03, 0.02);
    });
    el.addEventListener('click', () => {
      if (soundEnabled) playSynthSound(440, 'triangle', 0.08, 0.05);
    });
  });
}

function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
}

function playSynthSound(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.04) {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context silently handled
  }
}

/* ==========================================================================
   3. Custom Magnetic Follower Cursor
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hover states on interactive elements
  const hoverTargets = 'a, button, input, select, textarea, .glass-card, .metric-card, .tech-card, .chip, [data-tilt]';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    });
  });
}

/* ==========================================================================
   4. Canvas Particle Constellation Network
   ========================================================================== */
function initParticleConstellation() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: -1000, y: -1000, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.baseColor = Math.random() > 0.4 ? '0, 240, 255' : '99, 102, 241';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interactive push
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 2.5;
        this.y -= (dy / dist) * force * 2.5;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.baseColor}, 0.7)`;
      ctx.fill();
    }
  }

  let particles = [];
  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 12000), 100);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  createParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 115) {
          const alpha = (1 - dist / 115) * 0.28;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   5. Dynamic Hero Typing Text Animation
   ========================================================================== */
function initTypingAnimation() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const roles = [
    'Technical Recruiter (U.S. & Local Tech Roles)',
    'HR Operations & HRBP Specialist',
    'AI & Machine Learning Talent Sourcing',
    'Global Mobility & Visa Management (H1B/EB2/EB3)',
    'Labour Compliance & ISO 9001 Governance',
    'Full-Lifecycle Recruitment Scaling'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const current = roles[roleIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIdx === current.length) {
      typingSpeed = 2200; // Pause at completion
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }
  type();
}

/* ==========================================================================
   6. Scroll Effects, Sticky Navbar, Metric Counter & Skill Bar Observers
   ========================================================================== */
function initScrollEffects() {
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Navbar scroll class
    if (navbar) {
      if (scrollPos > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }

    // Floating scroll-top button
    if (scrollTopBtn) {
      if (scrollPos > 450) scrollTopBtn.classList.add('visible');
      else scrollTopBtn.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile drawer controls
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });
  }
  if (drawerClose && mobileDrawer) {
    drawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }
  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    });
  });

  // Metric Animated Counters
  const counterElements = document.querySelectorAll('.counter');
  let animatedCounters = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedCounters) {
        animatedCounters = true;
        counterElements.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const duration = 1800;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeProgress * target);
            counter.textContent = currentVal;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          }
          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.metrics-section');
  if (metricsSection) counterObserver.observe(metricsSection);

  // Skill progress bars observer
  const skillBars = document.querySelectorAll('.skill-bar');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-progress');
          bar.style.width = targetWidth;
        });
        skillObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) skillObserver.observe(skillsSection);
}

/* ==========================================================================
   7. 3D Tilt Effect on Cards
   ========================================================================== */
function init3DTilt() {
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ==========================================================================
   8. About Section Interactive Tabs
   ========================================================================== */
function initTabs() {
  const tabButtons = document.querySelectorAll('.about-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
      playSynthSound(600, 'sine', 0.05);
    });
  });
}

/* ==========================================================================
   9. Core Skills Filter Nav
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
      playSynthSound(700, 'sine', 0.05);
    });
  });
}

/* ==========================================================================
   10. Interactive Hiring ROI & Efficiency Calculator
   ========================================================================== */
function initCalculator() {
  const rolesSlider = document.getElementById('calc-roles');
  const daysSlider = document.getElementById('calc-days');
  const salarySlider = document.getElementById('calc-salary');
  const turnoverSlider = document.getElementById('calc-turnover');

  const rolesVal = document.getElementById('calc-roles-val');
  const daysVal = document.getElementById('calc-days-val');
  const salaryVal = document.getElementById('calc-salary-val');
  const turnoverVal = document.getElementById('calc-turnover-val');

  const resultSavings = document.getElementById('calc-result-savings');
  const resultDaysSaved = document.getElementById('calc-result-days-saved');
  const resultNewDays = document.getElementById('calc-result-new-days');
  const resultAttrition = document.getElementById('calc-result-attrition');

  function calculateROI() {
    if (!rolesSlider) return;
    const roles = parseInt(rolesSlider.value, 10);
    const days = parseInt(daysSlider.value, 10);
    const salary = parseInt(salarySlider.value, 10);
    const turnover = parseInt(turnoverSlider.value, 10);

    // Displays
    rolesVal.textContent = `${roles} roles`;
    daysVal.textContent = `${days} days`;
    salaryVal.textContent = `$${salary.toLocaleString()}`;
    turnoverVal.textContent = `${turnover}%`;

    // Calculations:
    // With dedicated technical recruiting & rigorous pipeline:
    // ~35% reduction in days-to-hire
    const daysSaved = Math.round(days * 0.35);
    const newDaysToFill = days - daysSaved;

    // Cost of vacancy per day ~ (salary / 240 work days) * 0.6 productivity loss
    const dailyVacancyCost = (salary / 240) * 0.6;
    const vacancySavings = daysSaved * dailyVacancyCost * roles;

    // Direct sourcing savings vs external agency fee (agency fee is typically 15-20% of annual salary)
    // Assuming Zahid does direct in-house sourcing for 60% of technical roles
    const agencyReplacementSavings = roles * 0.5 * (salary * 0.12);

    // Turnover reduction savings (~30% reduction in first-year churn)
    const turnoverReductionCost = (salary * 0.3) * (turnover * 0.01 * 0.35) * roles;

    const totalAnnualSavings = Math.round(vacancySavings + agencyReplacementSavings + turnoverReductionCost);

    resultSavings.textContent = `$${totalAnnualSavings.toLocaleString()}`;
    resultDaysSaved.textContent = `${daysSaved} days`;
    resultNewDays.textContent = `${newDaysToFill} days`;
    resultAttrition.textContent = `-${Math.round(turnover * 0.35)}%`;
  }

  [rolesSlider, daysSlider, salarySlider, turnoverSlider].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', () => {
        calculateROI();
        playSynthSound(500 + slider.value * 5, 'sine', 0.02, 0.015);
      });
    }
  });

  calculateROI();
}

/* ==========================================================================
   11. Spotlight Command Palette (Ctrl+K / Cmd+K)
   ========================================================================== */
function initCommandPalette() {
  const trigger = document.getElementById('cmd-trigger');
  const palette = document.getElementById('command-palette');
  const input = document.getElementById('palette-input');
  const list = document.getElementById('palette-list');

  if (!palette || !input || !list) return;

  const commands = [
    { title: 'Download Official Resume PDF', icon: 'fa-solid fa-file-arrow-down', shortcut: 'PDF', action: () => { window.location.href = 'assets/Zahid_Bin_Ali_Resume.pdf'; } },
    { title: 'Preview Resume Online', icon: 'fa-solid fa-eye', shortcut: 'View', action: () => { openResumeModal(); } },
    { title: 'Chat Directly on WhatsApp', icon: 'fa-brands fa-whatsapp', shortcut: 'Chat', action: () => { window.open('https://wa.me/8801712245856', '_blank'); } },
    { title: 'Copy Email Address', icon: 'fa-solid fa-copy', shortcut: 'Email', action: () => { copyToClipboard('zahidbinali087@gmail.com', 'Email copied to clipboard!'); } },
    { title: 'View LinkedIn Profile', icon: 'fa-brands fa-linkedin', shortcut: 'LinkedIn', action: () => { window.open('https://linkedin.com/in/zahid-bin-ali-zu', '_blank'); } },
    { title: 'Jump to Professional Experience', icon: 'fa-solid fa-briefcase', shortcut: '#exp', action: () => { scrollToSection('experience'); } },
    { title: 'Jump to Technical Sourcing Matrix', icon: 'fa-solid fa-code', shortcut: '#source', action: () => { scrollToSection('sourcing'); } },
    { title: 'Jump to Core Skills & Competencies', icon: 'fa-solid fa-cubes', shortcut: '#skills', action: () => { scrollToSection('skills'); } },
    { title: 'Jump to Education & Certifications', icon: 'fa-solid fa-graduation-cap', shortcut: '#edu', action: () => { scrollToSection('education'); } },
    { title: 'Jump to Hiring ROI Calculator', icon: 'fa-solid fa-calculator', shortcut: '#calc', action: () => { scrollToSection('calculator'); } },
    { title: 'Jump to Contact & Inquiries', icon: 'fa-regular fa-envelope', shortcut: '#contact', action: () => { scrollToSection('contact'); } }
  ];

  function renderList(filter = '') {
    list.innerHTML = '';
    const filtered = commands.filter(c => c.title.toLowerCase().includes(filter.toLowerCase()));

    if (filtered.length === 0) {
      list.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">No matching commands found.</div>`;
      return;
    }

    filtered.forEach((cmd, idx) => {
      const item = document.createElement('div');
      item.className = `palette-item ${idx === 0 ? 'active' : ''}`;
      item.innerHTML = `
        <div class="palette-item-left">
          <i class="${cmd.icon}"></i>
          <span>${cmd.title}</span>
        </div>
        <span class="palette-item-shortcut">${cmd.shortcut}</span>
      `;
      item.addEventListener('click', () => {
        closePalette();
        cmd.action();
      });
      list.appendChild(item);
    });
  }

  function openPalette() {
    palette.classList.add('active');
    input.value = '';
    renderList('');
    input.focus();
    playSynthSound(650, 'triangle', 0.1);
  }

  function closePalette() {
    palette.classList.remove('active');
  }

  if (trigger) trigger.addEventListener('click', openPalette);

  palette.addEventListener('click', (e) => {
    if (e.target === palette) closePalette();
  });

  input.addEventListener('input', (e) => {
    renderList(e.target.value);
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (palette.classList.contains('active')) closePalette();
      else openPalette();
    }
    // Escape
    if (e.key === 'Escape') {
      if (palette.classList.contains('active')) closePalette();
      closeResumeModal();
    }
    // Navigation inside palette
    if (palette.classList.contains('active')) {
      const items = list.querySelectorAll('.palette-item');
      let activeIdx = Array.from(items).findIndex(it => it.classList.contains('active'));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (items.length > 0) {
          if (activeIdx >= 0) items[activeIdx].classList.remove('active');
          activeIdx = (activeIdx + 1) % items.length;
          items[activeIdx].classList.add('active');
          items[activeIdx].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (items.length > 0) {
          if (activeIdx >= 0) items[activeIdx].classList.remove('active');
          activeIdx = (activeIdx - 1 + items.length) % items.length;
          items[activeIdx].classList.add('active');
          items[activeIdx].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIdx >= 0 && items[activeIdx]) {
          items[activeIdx].click();
        }
      }
    }
  });

  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/* ==========================================================================
   12. Resume PDF Modal Preview
   ========================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtn = document.getElementById('preview-resume-btn');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modal) return;

  if (openBtn) openBtn.addEventListener('click', openResumeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeResumeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeResumeModal();
  });
}

function openResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.add('active');
    playSynthSound(520, 'sine', 0.1);
  }
}

function closeResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) modal.classList.remove('active');
}

/* ==========================================================================
   13. Contact Form & WhatsApp Direct Dispatcher
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const whatsappBtn = document.getElementById('whatsapp-form-btn');
  const copyBtns = document.querySelectorAll('.copy-btn');

  // Copy to clipboard handlers
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      copyToClipboard(text, `Copied to clipboard: ${text}`);
    });
  });

  // Load draft from localStorage if present
  const savedDraft = localStorage.getItem('zahid_contact_draft');
  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft);
      if (draft.name) document.getElementById('form-name').value = draft.name;
      if (draft.email) document.getElementById('form-email').value = draft.email;
      if (draft.company) document.getElementById('form-company').value = draft.company;
      if (draft.subject) document.getElementById('form-subject').value = draft.subject;
      if (draft.message) document.getElementById('form-message').value = draft.message;
    } catch (e) {}
  }

  // Auto-save drafts
  const inputs = form ? form.querySelectorAll('input, select, textarea') : [];
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const draftData = {
        name: document.getElementById('form-name')?.value || '',
        email: document.getElementById('form-email')?.value || '',
        company: document.getElementById('form-company')?.value || '',
        subject: document.getElementById('form-subject')?.value || '',
        message: document.getElementById('form-message')?.value || ''
      };
      localStorage.setItem('zahid_contact_draft', JSON.stringify(draftData));
    });
  });

  // Handle Form Submit (Email mailto)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const company = document.getElementById('form-company').value.trim();
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.', 'warning');
        return;
      }

      const emailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name} (${company || 'Individual'})`);
      const emailBody = encodeURIComponent(
        `Hi Zahid,\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Company: ${company || 'N/A'}\n` +
        `Topic: ${subject}\n\n` +
        `Message:\n${message}\n\n` +
        `Sent via zahidbinali.portfolio`
      );

      window.location.href = `mailto:zahidbinali087@gmail.com?subject=${emailSubject}&body=${emailBody}`;
      showToast('Opening default email client...', 'success');
      playSynthSound(600, 'triangle', 0.15);
    });
  }

  // Handle WhatsApp Direct Send
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const name = document.getElementById('form-name')?.value.trim() || 'Recruiter/Manager';
      const company = document.getElementById('form-company')?.value.trim() || 'Company';
      const subject = document.getElementById('form-subject')?.value || 'Inquiry';
      const message = document.getElementById('form-message')?.value.trim() || 'Hello Zahid, I would like to connect with you regarding an opportunity.';

      const waText = encodeURIComponent(
        `*Hi Zahid Bin Ali,*\n\n` +
        `*From:* ${name} (${company})\n` +
        `*Subject:* ${subject}\n\n` +
        `*Message:* ${message}`
      );

      window.open(`https://wa.me/8801712245856?text=${waText}`, '_blank');
      showToast('Opening WhatsApp direct chat...', 'success');
      playSynthSound(660, 'sine', 0.12);
    });
  }
}

/* ==========================================================================
   14. Helper Utilities: Toast & Clipboard
   ========================================================================= */
function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg, 'success');
      playSynthSound(800, 'sine', 0.08);
    }).catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast(successMsg, 'success');
  playSynthSound(800, 'sine', 0.08);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  let icon = 'fa-solid fa-circle-info';
  if (type === 'success') icon = 'fa-solid fa-circle-check';
  if (type === 'warning') icon = 'fa-solid fa-triangle-exclamation';

  toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3200);
}
