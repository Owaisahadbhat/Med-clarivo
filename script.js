/* ============================================
   MED CLARIVO+ - MAIN JAVASCRIPT
   ============================================ */

// ============ NAVBAR ============
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
});

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    if (mobileMenu) mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
  });
}

// Close mobile menu on link click
document.querySelectorAll('#mobileMenu a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ============ SCROLL ANIMATIONS ============
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ============ COUNTER ANIMATION ============
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const start = performance.now();
  const startVal = 0;

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => statsObserver.observe(el));

// ============ FAQ ACCORDION ============
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const isOpen = btn.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-q.open').forEach(q => {
      q.classList.remove('open');
      q.closest('.faq-item').querySelector('.faq-a').classList.remove('open');
    });

    // Open clicked if it wasn't open
    if (!isOpen) {
      btn.classList.add('open');
      answer.classList.add('open');
    }
  });
});

// ============ NEET COUNTDOWN ============
function updateCountdown() {
  const neetDate = new Date('2026-05-03T00:00:00');
  const now = new Date();
  const diff = neetDate - now;

  if (diff <= 0) {
    document.querySelectorAll('.timer-num').forEach(el => el.textContent = '0');
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  const d = document.getElementById('cd-days');
  const h = document.getElementById('cd-hours');
  const m = document.getElementById('cd-mins');
  const s = document.getElementById('cd-secs');

  if (d) d.textContent = String(days).padStart(2, '0');
  if (h) h.textContent = String(hours).padStart(2, '0');
  if (m) m.textContent = String(mins).padStart(2, '0');
  if (s) s.textContent = String(secs).padStart(2, '0');
}

if (document.getElementById('cd-days')) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ============ SCORE PREDICTOR QUIZ ============
const quizData = [
  {
    question: "Which year are you targeting for NEET?",
    options: ["NEET 2025", "NEET 2026", "NEET 2027", "Not decided yet"]
  },
  {
    question: "How many hours do you study daily?",
    options: ["Less than 3 hours", "3–5 hours", "6–8 hours", "More than 8 hours"]
  },
  {
    question: "What is your current mock test score range?",
    options: ["Below 300", "300–450", "450–550", "550–650"]
  },
  {
    question: "Which subject is your weakest?",
    options: ["Physics", "Chemistry", "Biology", "All are equal"]
  },
  {
    question: "Are you a dropper or fresher?",
    options: ["First attempt (Fresher)", "1st Drop year", "2nd Drop year", "3rd+ Drop year"]
  }
];

let currentQ = 0;
const answers = [];

function renderQuiz() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  const q = quizData[currentQ];
  const progress = ((currentQ) / quizData.length) * 100;

  container.innerHTML = `
    <div class="quiz-q-step">
      <div class="quiz-progress">
        <div class="quiz-progress-bar" style="width: ${progress}%"></div>
      </div>
      <div class="quiz-q-num">Question ${currentQ + 1} of ${quizData.length}</div>
      <div class="quiz-question">${q.question}</div>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `
          <button class="quiz-option" data-idx="${i}" onclick="selectOption(this)">${opt}</button>
        `).join('')}
      </div>
      <div class="quiz-nav">
        <button class="btn btn-outline btn-sm" onclick="prevQ()" ${currentQ === 0 ? 'style="visibility:hidden"' : ''}>← Back</button>
        <button class="btn btn-primary btn-sm" id="nextBtn" onclick="nextQ()" disabled>Next →</button>
      </div>
    </div>
  `;
}

function selectOption(btn) {
  document.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  answers[currentQ] = parseInt(btn.dataset.idx);
  document.getElementById('nextBtn').disabled = false;
}

function nextQ() {
  if (answers[currentQ] === undefined) return;
  if (currentQ < quizData.length - 1) {
    currentQ++;
    renderQuiz();
    if (answers[currentQ] !== undefined) {
      setTimeout(() => {
        const btns = document.querySelectorAll('.quiz-option');
        if (btns[answers[currentQ]]) {
          btns[answers[currentQ]].classList.add('selected');
          document.getElementById('nextBtn').disabled = false;
        }
      }, 50);
    }
  } else {
    showResult();
  }
}

function prevQ() {
  if (currentQ > 0) { currentQ--; renderQuiz(); }
}

function showResult() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  // Score calculation logic
  const studyScore = [0, 10, 20, 30][answers[1]] || 0;
  const mockScore = [250, 380, 500, 600][answers[2]] || 300;
  const weakSubject = answers[3];
  const dropperBonus = [0, 20, 30, 40][answers[4]] || 0;

  let predicted = mockScore + studyScore + dropperBonus;
  if (weakSubject === 3) predicted += 10;
  predicted = Math.min(720, Math.max(200, Math.round(predicted / 10) * 10));

  const percentile = predicted > 650 ? '99.5' : predicted > 600 ? '99' : predicted > 540 ? '98' : predicted > 480 ? '95' : '90';

  container.innerHTML = `
    <div class="quiz-result show">
      <div style="font-size:3rem;margin-bottom:12px">🎯</div>
      <h4>Your Predicted NEET Score</h4>
      <div class="quiz-score-display">${predicted}</div>
      <p style="color:var(--gray);margin-bottom:8px">Approx. Percentile: <strong style="color:var(--primary)">${percentile}th</strong></p>
      <p>With the right mentorship, students like you have improved their scores by <strong>150–200 marks</strong> within 3–6 months.</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:24px">
        <a href="https://wa.me/919876543210?text=Hi! I just took the score predictor quiz on Med Clarivo+. My predicted score is ${predicted}. I'd like to book a free mentorship call." class="btn btn-whatsapp" target="_blank">📱 Book Free Call Now</a>
        <a href="pages/pricing.html" class="btn btn-primary">View Plans</a>
      </div>
      <button onclick="resetQuiz()" style="margin-top:16px;background:none;border:none;color:var(--gray);font-size:0.85rem;cursor:pointer;text-decoration:underline">Retake Quiz</button>
    </div>
  `;
}

function resetQuiz() {
  currentQ = 0;
  answers.length = 0;
  renderQuiz();
}

// Initialize quiz
if (document.getElementById('quizContainer')) {
  renderQuiz();
}

// ============ MENTOR FILTERS (mentors page) ============
function initMentorFilters() {
  const pills = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-mentor]');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const group = pill.dataset.filterGroup;
      document.querySelectorAll(`[data-filter-group="${group}"]`).forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterMentors();
    });
  });

  function filterMentors() {
    const activeSubject = document.querySelector('[data-filter-group="subject"].active')?.dataset.filter || 'all';
    const activeYear = document.querySelector('[data-filter-group="year"].active')?.dataset.filter || 'all';

    cards.forEach(card => {
      const subjectMatch = activeSubject === 'all' || card.dataset.subject === activeSubject;
      const yearMatch = activeYear === 'all' || card.dataset.year === activeYear;
      card.style.display = subjectMatch && yearMatch ? 'block' : 'none';
    });
  }

  const searchInput = document.getElementById('mentorSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      cards.forEach(card => {
        const name = card.dataset.name?.toLowerCase() || '';
        const matches = name.includes(q);
        card.style.display = matches ? 'block' : 'none';
      });
    });
  }
}

if (document.querySelector('[data-filter]')) initMentorFilters();

// ============ STUDENT DASHBOARD (localStorage) ============
function initDashboard() {
  const userData = JSON.parse(localStorage.getItem('mc_user') || '{}');

  const nameEl = document.getElementById('dash-name');
  const progressEl = document.getElementById('dash-progress');

  if (nameEl && userData.name) nameEl.textContent = userData.name;
  if (progressEl) {
    const progress = userData.progress || 45;
    progressEl.style.width = progress + '%';
    progressEl.dataset.progress = progress;
  }

  // Task checkboxes
  document.querySelectorAll('.task-checkbox').forEach(cb => {
    const taskId = cb.dataset.task;
    const saved = localStorage.getItem(`task_${taskId}`);
    if (saved === 'done') cb.checked = true;

    cb.addEventListener('change', () => {
      localStorage.setItem(`task_${taskId}`, cb.checked ? 'done' : '');
    });
  });

  // Doubt submission
  const doubtForm = document.getElementById('doubtForm');
  if (doubtForm) {
    doubtForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('doubtText')?.value;
      if (msg) {
        const doubts = JSON.parse(localStorage.getItem('mc_doubts') || '[]');
        doubts.push({ text: msg, date: new Date().toISOString() });
        localStorage.setItem('mc_doubts', JSON.stringify(doubts));
        alert('✅ Doubt submitted! Your mentor will respond within 24 hours.');
        document.getElementById('doubtText').value = '';
      }
    });
  }
}

if (document.getElementById('dash-name')) initDashboard();

// ============ LOGIN ============
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value;
    const name = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
    localStorage.setItem('mc_user', JSON.stringify({ email, name: name.charAt(0).toUpperCase() + name.slice(1), progress: 45 }));
    window.location.href = 'student-dashboard.html';
  });
}

// ============ SMOOTH ACTIVE NAV ============
const currentPath = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-links a, #mobileMenu a').forEach(a => {
  const href = a.getAttribute('href')?.split('/').pop();
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ============ PRICING TOGGLE (monthly/annual) ============
const pricingToggle = document.getElementById('pricingToggle');
if (pricingToggle) {
  pricingToggle.addEventListener('change', () => {
    const isAnnual = pricingToggle.checked;
    document.querySelectorAll('.price-num[data-monthly]').forEach(el => {
      el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
    });
    document.querySelectorAll('.price-period').forEach(el => {
      el.textContent = isAnnual ? '/year' : '/month';
    });
    const savings = document.getElementById('annualSavings');
    if (savings) savings.style.display = isAnnual ? 'block' : 'none';
  });
}

// ============ WEBINAR REGISTRATION ============
const webinarForm = document.getElementById('webinarForm');
if (webinarForm) {
  webinarForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('webName')?.value;
    document.getElementById('webinarForm').style.display = 'none';
    document.getElementById('webinarSuccess').style.display = 'block';
    document.getElementById('webinarSuccessName').textContent = name;
  });
}

// ============ CONTACT FORM ============
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type=submit]');
    btn.textContent = '✅ Message Sent!';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = 'Send Message'; btn.disabled = false; contactForm.reset(); }, 3000);
  });
}

// ============ BLOG SEARCH ============
const blogSearch = document.getElementById('blogSearch');
if (blogSearch) {
  blogSearch.addEventListener('input', () => {
    const q = blogSearch.value.toLowerCase();
    document.querySelectorAll('.blog-card').forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      card.style.display = title.includes(q) ? 'block' : 'none';
    });
  });
}

// ============ BECOME MENTOR FORM ============
const mentorAppForm = document.getElementById('mentorAppForm');
if (mentorAppForm) {
  mentorAppForm.addEventListener('submit', (e) => {
    e.preventDefault();
    mentorAppForm.innerHTML = `
      <div style="text-align:center;padding:40px 20px">
        <div style="font-size:3rem;margin-bottom:16px">🎉</div>
        <h3>Application Received!</h3>
        <p style="color:var(--gray);margin-top:12px">Thank you for applying to become a Med Clarivo+ mentor. Our team will review your application and get back to you within 3–5 business days.</p>
        <a href="../index.html" class="btn btn-primary" style="margin-top:24px">Back to Home</a>
      </div>
    `;
  });
}

console.log('✅ Med Clarivo+ scripts loaded');
