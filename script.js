document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const progressBar = document.querySelector('.progress-bar');
  const counter = document.querySelector('.slide-counter');
  const indexContainer = document.querySelector('.slide-index');
  const keyHint = document.querySelector('.key-hint');

  let current = 0;
  const total = slides.length;

  // Section markers for dot grouping
  const sections = [];
  slides.forEach((s, i) => {
    const sec = s.dataset.section;
    if (sec && (sections.length === 0 || sections[sections.length - 1].name !== sec)) {
      sections.push({ name: sec, start: i });
    }
  });

  // Build index dots
  function buildDots() {
    indexContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'index-dot';
      if (i === current) dot.classList.add('active');
      // Check if section start
      const isStart = sections.some(s => s.start === i && i !== 0);
      if (isStart) dot.classList.add('section-start');
      dot.addEventListener('click', () => goTo(i));
      indexContainer.appendChild(dot);
    });
  }

  function updateUI() {
    slides.forEach((s, i) => {
      s.classList.remove('active', 'prev');
      if (i === current) s.classList.add('active');
      else if (i < current) s.classList.add('prev');
    });

    const progress = ((current + 1) / total) * 100;
    progressBar.style.width = progress + '%';
    counter.textContent = `${current + 1} / ${total}`;

    // Update dots
    const dots = indexContainer.querySelectorAll('.index-dot');
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });

    // Hide key hint after first nav
    if (current > 0 && keyHint) {
      keyHint.style.opacity = '0';
      setTimeout(() => keyHint.style.display = 'none', 400);
    }
  }

  function goTo(index) {
    if (index < 0 || index >= total || index === current) return;
    current = index;
    updateUI();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      next();
    }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prev();
    }
    if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    if (e.key === 'End') { e.preventDefault(); goTo(total - 1); }
  });

  // Touch / swipe
  let touchStartX = 0;
  let touchStartY = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
      if (dx < 0) next();
      else prev();
    }
  }, { passive: true });


  // Init
  buildDots();
  slides[0].classList.add('active');
  updateUI();
});
