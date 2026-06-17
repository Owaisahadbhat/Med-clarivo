/* ============================================================
   MED CLARIVO+ — Shared Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Animated stat counters ---------- */
  const statEls = document.querySelectorAll('.stat-num[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && statEls.length) {
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statEls.forEach(el => statIo.observe(el));
  } else {
    statEls.forEach(animateCount);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.faq-list')?.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        a.style.maxHeight = null;
      } else {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- AI Score Predictor ---------- */
  const scoreRange = document.getElementById('scoreRange');
  const scoreVal = document.getElementById('scoreVal');
  if (scoreRange && scoreVal) {
    scoreRange.addEventListener('input', () => { scoreVal.textContent = scoreRange.value; });
  }
  const predictBtn = document.getElementById('predictBtn');
  if (predictBtn) {
    predictBtn.addEventListener('click', () => {
      const current = parseInt(document.getElementById('scoreRange').value, 10);
      const months = parseInt(document.getElementById('monthsLeft').value, 10);
      const hours = parseInt(document.getElementById('studyHours').value, 10);
      // Simple, transparent heuristic — clearly a placeholder estimate, not a real predictive model.
      const monthFactor = months * 9;
      const hourFactor = (hours - 4) * 12;
      let predicted = current + monthFactor + hourFactor;
      predicted = Math.min(predicted, 720);
      predicted = Math.max(predicted, current + 20);
      const resultBox = document.getElementById('predictorResult');
      const predictedEl = document.getElementById('predictedScore');
      resultBox.classList.add('show');
      let displayed = current;
      const duration = 1000;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        displayed = Math.round(current + (predicted - current) * progress);
        predictedEl.textContent = displayed;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- NEET Countdown Timer ---------- */
  const countdownEl = document.getElementById('neetCountdown');
  if (countdownEl) {
    // Placeholder target date — update to the real official NEET exam date when announced.
    const targetDate = new Date('2027-05-03T14:00:00+05:30').getTime();
    const dEl = document.getElementById('cdDays');
    const hEl = document.getElementById('cdHours');
    const mEl = document.getElementById('cdMins');
    const sEl = document.getElementById('cdSecs');
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(targetDate - now, 0);
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      if (dEl) dEl.textContent = days;
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(mins).padStart(2, '0');
      if (sEl) sEl.textContent = String(secs).padStart(2, '0');
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Generic accordion (used in pricing FAQ etc.) handled above ---------- */

});
