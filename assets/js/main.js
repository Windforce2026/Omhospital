const app = document.getElementById('app');

async function loadSections() {
  if (!app) return;
  const sectionPaths = app.dataset.sections
    .split(',')
    .map(path => path.trim())
    .filter(Boolean);
  const sectionMarkup = await Promise.all(
    sectionPaths.map(async path => {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Unable to load ${path}`);
      return response.text();
    })
  );
  app.innerHTML = sectionMarkup.join('\n');
}

function initYear() {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}

function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
  }
  if (!themeToggle) return;
  themeToggle.addEventListener('click', () => {
    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      htmlElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
  });
}

function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!menuBtn || !mobileMenu) return;
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });
}

function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevButton = document.querySelector('.carousel-prev');
  const nextButton = document.querySelector('.carousel-next');
  if (!slides.length || !dots.length) return;
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    const normalizedIndex = (index + slides.length) % slides.length;
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    slides[normalizedIndex].classList.add('active');
    dots[normalizedIndex].classList.add('active');
    currentSlide = normalizedIndex;
  }

  function nextSlide() { showSlide(currentSlide + 1); }
  function previousSlide() { showSlide(currentSlide - 1); }
  function startAutoPlay() { slideInterval = setInterval(nextSlide, 5000); }
  function restartAutoPlay() { clearInterval(slideInterval); startAutoPlay(); }

  dots.forEach(dot => {
    dot.addEventListener('click', () => { showSlide(Number(dot.dataset.slide)); restartAutoPlay(); });
  });
  if (prevButton) prevButton.addEventListener('click', () => { previousSlide(); restartAutoPlay(); });
  if (nextButton) nextButton.addEventListener('click', () => { nextSlide(); restartAutoPlay(); });
  startAutoPlay();
}

function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(el => observer.observe(el));
}

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('shadow-lg', 'backdrop-blur-xl');
      navbar.classList.remove('backdrop-blur-lg');
    } else {
      navbar.classList.remove('shadow-lg', 'backdrop-blur-xl');
      navbar.classList.add('backdrop-blur-lg');
    }
  });
}

function initTilt3D() {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;

      const content = card.querySelector('.tilt-content') || card;
      content.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale3d(1.02, 1.02, 1.02)`;
      card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      const content = card.querySelector('.tilt-content') || card;
      content.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0) scale3d(1, 1, 1)';
    });
  });
}

function initMagnetic() {
  const els = document.querySelectorAll('[data-magnetic]');
  if (!els.length) return;

  els.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

function initParallax() {
  const els = document.querySelectorAll('[data-speed]');
  if (!els.length) return;

  function updateParallax() {
    const scrollY = window.scrollY;
    els.forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0.1;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 200 && rect.bottom > -200) {
        el.style.transform = `translateY(${scrollY * speed}px)`;
      }
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
}

function initNavbarActive() {
  const links = document.querySelectorAll('.nav-link');
  if (!links.length) return;

  const sections = Array.from(links).map(link => {
    const href = link.getAttribute('href');
    return href ? document.querySelector(href) : null;
  }).filter(Boolean);

  function updateActive() {
    let current = null;
    let currentIndex = -1;
    sections.forEach((section, i) => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top <= 200) {
        current = links[i];
        currentIndex = i;
      }
    });
    links.forEach(link => link.classList.remove('active'));
    if (current) current.classList.add('active');
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}

async function initPage() {
  try {
    await loadSections();
    initYear();
    initThemeToggle();
    initMobileMenu();
    initCarousel();
    initScrollReveal();
    initNavbarScroll();
    initNavbarActive();
    initTilt3D();
    initMagnetic();
    initParallax();
  } catch (error) {
    console.error(error);
    if (app) {
      app.innerHTML = '<main class="min-h-screen flex items-center justify-center p-6 text-center"><p class="text-slate-600">Unable to load page sections. Please run this site through a local server.</p></main>';
    }
  }
}

initPage();
