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

  const reveal = (el) => {
    el.classList.add('revealed');
    observer.unobserve(el);
  };

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) reveal(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

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

const DEPARTMENT_DETAILS = {
  'Urology': {
    icon: 'fa-solid fa-droplet',
    description: 'Advanced urological care backed by modern endourology equipment. Our urologists specialise in minimally invasive stone and prostate procedures with faster recovery and reduced hospital stay.',
    procedures: ['URS (Ureteroscopy)', 'PRUSTEL', 'PCNL (Percutaneous Nephrolithotomy)', 'Kidney Stone Management', 'Prostate Treatment', 'Endourology']
  },
  'General Surgery': {
    icon: 'fa-solid fa-syringe',
    description: 'Expert surgical care using advanced laparoscopic techniques that minimise pain and scarring while speeding up recovery. From emergency appendicitis to complex abdominal surgery.',
    procedures: ['Laparoscopic Surgery', 'Appendicitis', 'Hernia Repair', 'Gallbladder Surgery', 'Kidney Stone Surgery', 'Hysterectomy', 'Stomach Tumour Surgery']
  },
  'Orthopedics': {
    icon: 'fa-solid fa-bone',
    description: 'Comprehensive bone and joint care for fractures, arthritis and trauma. Our orthopedic surgeons combine precision planning with modern implant technology for long-term mobility.',
    procedures: ['Fracture Treatment & Surgery', 'Joint Replacement', 'Trauma Care', 'Fractured Jaw Management', 'Bone & Joint Disease Treatment']
  },
  'ENT': {
    icon: 'fa-solid fa-ear-listen',
    description: 'Complete ear, nose and throat care by experienced specialists, including both medical treatment and minimally invasive ENT surgery for adults and children.',
    procedures: ['ENT Examination & Treatment', 'Minimally Invasive ENT Surgery', 'Tonsil & Adenoid Surgery', 'Sinus Treatment', 'Hearing & Ear Care']
  },
  'Gynecology & Obstetrics': {
    icon: 'fa-solid fa-person-pregnant',
    description: 'Complete women\u2019s healthcare — normal and high-risk pregnancy care, safe deliveries and C-sections, plus treatment for gynaecological and hormonal conditions in a comfortable setting.',
    procedures: ['Normal Delivery', 'C-Section (Caesarean)', 'High-Risk Pregnancy Care', 'PCOD / PCOS Treatment', 'Infertility Consultation', 'Wellness & Teens Clinic']
  },
  'Dental': {
    icon: 'fa-solid fa-tooth',
    description: 'Full spectrum dental care for the whole family — from routine cleanings and fillings to painless root canals and extractions — delivered with modern equipment and gentle hands.',
    procedures: ['Root Canal Treatment', 'Teeth Extraction', 'Dental Fillings', 'Scaling & Polishing', 'Complete Oral Care']
  },
  'General Medicine': {
    icon: 'fa-solid fa-stethoscope',
    description: 'Trusted internal medicine for everyday illnesses and long-term conditions. Our MD physicians diagnose and manage fever, diabetes, hypertension and more with personalised treatment plans.',
    procedures: ['Fever & Infection Care', 'Diabetes Management', 'Hypertension (BP) Control', 'Preventive Health Checkups', 'Chronic Disease Management']
  },
  'Pediatrics': {
    icon: 'fa-solid fa-child',
    description: 'Nurturing healthcare for infants, children and adolescents — newborn care, growth monitoring and complete vaccination schedules under one roof, with child-friendly staff.',
    procedures: ['Newborn Care', 'Complete Vaccination Schedule', 'Child Growth & Development', 'Childhood Illnesses', 'Adolescent Health']
  },
  'Cardiology': {
    icon: 'fa-solid fa-heart-pulse',
    description: 'Advanced cardiac care including diagnosis, treatment and surgery of heart diseases. Our cardiothoracic & vascular surgeon brings two decades of premium cardiac surgery experience.',
    procedures: ['Cardiac Diagnosis & Treatment', 'CABG (Bypass Surgery)', 'Heart Valve Repair', 'ECG & Cardiac Screening', 'High-Risk Cardiac Care']
  },
  'Gastroenterology': {
    icon: 'fa-solid fa-utensils',
    description: 'Specialised care for digestive and gastrointestinal disorders — from reflux and ulcers to endoscopic evaluation and treatment of the stomach, liver and intestines.',
    procedures: ['Endoscopy', 'Gastric & Intestinal Disease Treatment', 'Acidity / Reflux Management', 'Liver & Digestive Care', 'Colon & Bowel Conditions']
  },
  'Chest (Respiratory Medicine)': {
    icon: 'fa-solid fa-lungs',
    description: 'Dedicated respiratory care for asthma, bronchitis and lung disorders. Our chest physician combines focused examination with therapies like Bi-PAP for breathing support.',
    procedures: ['Asthma & Allergy Care', 'Bronchitis Treatment', 'Lung Disease Management', 'Bi-PAP Therapy', 'Chest Infection & TB Care']
  },
  'Physiotherapy': {
    icon: 'fa-solid fa-person-walking',
    description: 'Goal-based rehabilitation to help you recover from injury and surgery and manage chronic pain. Our physiotherapists design personalised programmes to restore mobility and strength.',
    procedures: ['Post-Surgery Rehabilitation', 'Injury Recovery', 'Pain Management', 'Mobility Improvement', 'Sports Injury Rehab']
  },
  'Neuro Surgery': {
    icon: 'fa-solid fa-brain',
    description: 'Advanced surgical care for brain, spine and nervous system conditions, performed by specialists using precisely planned, modern techniques for the best possible outcomes.',
    procedures: ['Brain Surgery', 'Spine Surgery', 'Nervous System Disorder Treatment', 'Neuro Trauma Care', 'Head Injury Management']
  },
  'Nephrology': {
    icon: 'fa-solid fa-flask',
    description: 'Complete kidney care — from prevention and medical management to hypertension control and dialysis — delivered with advanced equipment and compassionate nursing.',
    procedures: ['Kidney Disease Treatment', 'Dialysis Services', 'Hypertension (Renal) Care', 'Kidney Stone Management', 'Renal Transplant Follow-Up']
  }
};

const DEPARTMENT_FALLBACK_DETAILS = {
  icon: 'fa-solid fa-hospital',
  description: 'Compassionate, expert care delivered with advanced medical facilities — speak to our reception to know more about this department.',
  procedures: ['OPD Consultation', 'Advanced Diagnostics', 'In-Patient Care', 'Individualised Treatment Plan']
};

function initDepartmentModal() {
  const modal = document.getElementById('dept-doctors-modal');
  if (!modal) return;

  const deptNameEl = document.getElementById('modal-dept-name');
  const deptIconEl = document.getElementById('modal-dept-icon');
  const deptDescEl = document.getElementById('modal-dept-description');
  const proceduresEl = document.getElementById('modal-dept-procedures');
  const doctorsEl = document.getElementById('modal-doctors-list');
  const closeBtn = document.getElementById('modal-close');
  const closeAndBook = document.getElementById('modal-close-and-book');

  const doctorButtons = Array.from(document.querySelectorAll('.doctor-book-btn'));
  const departmentCards = Array.from(document.querySelectorAll('.department-card'));

  function openModal(deptName) {
    const details = DEPARTMENT_DETAILS[deptName] || DEPARTMENT_FALLBACK_DETAILS;
    deptNameEl.textContent = deptName;
    deptIconEl.innerHTML = `<i class="${details.icon}"></i>`;

    const desc = document.createElement('p');
    desc.innerHTML = `<i class="fa-solid fa-circle-info text-brand-500/60 mr-1"></i>${details.description}`;
    deptDescEl.textContent = '';
    deptDescEl.appendChild(desc);

    proceduresEl.innerHTML = '';
    details.procedures.forEach(proc => {
      const chip = document.createElement('span');
      chip.className = 'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-100 dark:border-brand-800 text-xs font-medium text-brand-700 dark:text-brand-300';
      chip.innerHTML = `<i class="fa-solid fa-check text-brand-500 dark:text-brand-400"></i>${proc}`;
      proceduresEl.appendChild(chip);
    });

    const matchingDoctors = doctorButtons.filter(btn => btn.dataset.dept === deptName);
    doctorsEl.innerHTML = '';

    if (!matchingDoctors.length) {
      doctorsEl.innerHTML = '<p class="col-span-full text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 text-center">Please call reception for the latest consultant schedule in this department.</p>';
    } else {
      matchingDoctors.forEach(btn => {
        const full = btn.dataset.doctor || '';
        const doctorName = full.includes(' (') ? full.slice(0, full.indexOf(' (')) : full;
        const photo = getDoctorPhoto(btn);
        const avatar = photo
          ? `<div class="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-brand-300/50 dark:ring-brand-700/50 shadow-md shadow-brand-500/20">
              <img src="${photo}" alt="${doctorName}" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
              <div class="absolute inset-0 bg-gradient-to-br from-brand-400 to-brand-600 text-white items-center justify-center text-base font-extrabold hidden">${getInitials(doctorName)}</div>
            </div>`
          : `<div class="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center text-base font-extrabold shadow-md shadow-brand-500/20">${getInitials(doctorName)}</div>`;
        const card = document.createElement('div');
        card.className = 'flex items-center gap-4 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/50';
        card.innerHTML = `
          ${avatar}
          <div class="min-w-0 flex-1">
            <h4 class="font-bold text-slate-900 dark:text-white text-sm leading-tight truncate">${doctorName}</h4>
            <button type="button" class="modal-doctor-book mt-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition flex items-center gap-1">
              <i class="fa-solid fa-calendar-check"></i> Book this doctor
            </button>
          </div>`;
        card.querySelector('.modal-doctor-book').addEventListener('click', () => {
          openBookingForm(btn.dataset.doctor, btn.dataset.dept);
        });
        doctorsEl.appendChild(card);
      });
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function openBookingForm(doctorLabel, dept) {
    closeModal();
    const booking = document.getElementById('booking');
    if (booking) booking.scrollIntoView({ behavior: 'smooth', block: 'center' });

    document.getElementById('booking-doctor-input').value = doctorLabel || '';
    const chip = document.getElementById('booking-doctor-chip');
    const chipName = document.getElementById('booking-doctor-name');
    if (chip && chipName) {
      chipName.textContent = doctorLabel || dept || '';
      chip.classList.remove('hidden');
      chip.classList.add('flex');
    }
    const deptSelect = document.getElementById('booking-department');
    if (deptSelect && dept) {
      const match = Array.from(deptSelect.options).find(opt => opt.value === dept);
      if (match) deptSelect.value = dept;
    }
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  departmentCards.forEach(card => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', () => openModal(card.dataset.dept));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.dept);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeAndBook) closeAndBook.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });
}

function getInitials(name) {
  const names = name.replace(/^Dr\.?\s*/i, '').split(/\s+/).filter(Boolean);
  return ((names[0] || '')[0] || '') + ((names[1] || '')[0] || '');
}

function getDoctorPhoto(btn) {
  const card = btn.closest('.group');
  const img = card ? card.querySelector('img') : null;
  return img && img.getAttribute('src') ? img.getAttribute('src') : '';
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
    initDepartmentModal();
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
