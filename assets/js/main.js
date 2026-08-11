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

function initScrollTopButton() {
  const button = document.getElementById('scroll-top-btn');
  if (!button) return;
  const deptPage = document.getElementById('dept-detail-page');

  const isDeptOpen = () => deptPage && !deptPage.classList.contains('hidden');
  const getScrollY = () => (isDeptOpen() ? deptPage.scrollTop : window.scrollY);

  const show = () => {
    const visible = getScrollY() > 400;
    button.classList.toggle('opacity-0', !visible);
    button.classList.toggle('translate-y-4', !visible);
    button.classList.toggle('pointer-events-none', !visible);
  };

  window.addEventListener('scroll', show, { passive: true });
  if (deptPage) deptPage.addEventListener('scroll', show, { passive: true });
  document.querySelectorAll('.dd-close').forEach(btn => btn.addEventListener('click', show));
  show();

  button.addEventListener('click', () => {
    const target = isDeptOpen() ? deptPage : window;
    target.scrollTo({ top: 0, behavior: 'smooth' });
  });
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
  tagline: 'Expert specialists, modern technology and round-the-clock care — all under one roof.',
  image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80&fm=jpg&fit=crop',
  procedures: ['OPD Consultation', 'Advanced Diagnostics', 'In-Patient Care', 'Individualised Treatment Plan'],
  highlights: [
    { icon: 'fa-solid fa-user-check', title: 'Experienced Team', text: 'Senior specialists dedicated to accurate diagnosis and personalised treatment.' },
    { icon: 'fa-solid fa-microscope', title: 'Modern Technology', text: 'Advanced diagnostic and surgical equipment for safer, precise outcomes.' },
    { icon: 'fa-solid fa-clock', title: '24/7 Availability', text: 'Round-the-clock care, emergency support and easy appointment access.' },
    { icon: 'fa-solid fa-heart-pulse', title: 'Compassionate Care', text: 'A caring, patient-first approach throughout diagnosis, treatment and recovery.' }
  ],
  stats: [
    { value: 20, suffix: '+', label: 'Years of Experience' },
    { value: 5000, suffix: '+', label: 'Happy Patients' },
    { value: 24, suffix: '/7', label: 'Care Available' },
    { value: 4.9, suffix: '★', label: 'Patient Rating', decimals: 1 }
  ],
  faqs: [
    { q: 'Do you accept walk-in patients?', a: 'Yes. You can walk in any time — our OPD and emergency services run 24/7. Booking ahead simply helps you avoid queues.' },
    { q: 'How do I book an appointment?', a: 'Use the Booking form on this page, call reception at +91 98765 43210, or WhatsApp us your details and our team will confirm your slot.' },
    { q: 'What should I carry for my first visit?', a: 'Please bring any previous prescriptions, investigation reports and a government ID. Our team will guide you through the rest.' }
  ]
};

const DEPARTMENT_PAGE_DETAILS = {
  'Urology': {
    tagline: 'Minimally invasive care for kidney stones, prostate and urinary health — with faster recovery and lasting results.',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1920&q=80&fm=jpg&fit=crop',
    highlights: [
      { icon: 'fa-solid fa-microscope', title: 'Endourology Experts', text: 'Specialists trained in URS, PRUSTEL and PCNL — modern stone removal without open cuts.' },
      { icon: 'fa-solid fa-droplet', title: 'Kidney Stone Mastery', text: 'Complete stone care from prevention and detection to painless removal.' },
      { icon: 'fa-solid fa-shield-halved', title: 'Minimally Invasive', text: 'Smaller incisions, quicker discharge and minimal downtime after procedures.' },
      { icon: 'fa-solid fa-user-check', title: 'Personalised Plans', text: 'Treatment shaped around your history, lifestyle, and comfort.' }
    ],
    stats: [
      { value: 20, suffix: '+', label: 'Years of Expertise' },
      { value: 3000, suffix: '+', label: 'Stone Procedures' },
      { value: 99, suffix: '%', label: 'Minimally Invasive' },
      { value: 4.9, suffix: '★', label: 'Patient Rating', decimals: 1 }
    ],
    faqs: [
      { q: 'Do I always need surgery for kidney stones?', a: 'No. Small stones can pass on their own with medication and hydration. If a stone is large, blocked, or causing pain, advanced procedures like URS, PRUSTEL or PCNL may be recommended.' },
      { q: 'Is URS / PCNL painful?', a: 'Both are performed under anaesthesia, so you feel no pain during the procedure. Most patients go home within a day or two with very manageable discomfort.' },
      { q: 'When should I see a urologist?', a: 'See a urologist for burning urination, blood in urine, kidney stones, frequent infections, prostate issues, or difficulty passing urine — early care prevents complications.' }
    ]
  },
  'General Surgery': {
    tagline: 'Precision laparoscopic surgery for abdomen, hernia, gallbladder and more — minimising pain and speeding up recovery.',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1920&q=80&fm=jpg&fit=crop',
    highlights: [
      { icon: 'fa-solid fa-syringe', title: 'Laparoscopic Expertise', text: 'Keyhole surgery that reduces scars, pain and hospital stay significantly.' },
      { icon: 'fa-solid fa-cut', title: 'Broad Surgical Range', text: 'Appendicitis, hernia, gallbladder, kidney stones, hysterectomy and stomach tumours.' },
      { icon: 'fa-solid fa-bolt', title: 'Faster Recovery', text: 'Get back to daily life sooner with advanced, less-invasive techniques.' },
      { icon: 'fa-solid fa-user-shield', title: 'Rigorous Safety', text: 'Strict sterilisation and pre/post-operative care protocols throughout.' }
    ],
    stats: [
      { value: 20, suffix: '+', label: 'Years of Expertise' },
      { value: 4000, suffix: '+', label: 'Surgeries Done' },
      { value: 24, suffix: '/7', label: 'Emergency Surgery' },
      { value: 4.9, suffix: '★', label: 'Patient Rating', decimals: 1 }
    ],
    faqs: [
      { q: 'When is surgery really necessary?', a: 'When a condition like appendicitis, a strangulated hernia, gallstones, or a tumour risks your health or cannot be treated medically. Your surgeon will explain every option first.' },
      { q: 'How long does recovery take?', a: 'Most laparoscopic procedures allow discharge in 1–3 days, with return to routine work within one to two weeks. Recovery times vary by procedure.' },
      { q: 'Are the stitches and scars large?', a: 'No. Laparoscopic surgery uses a few tiny incisions (usually less than 1 cm), so scars are small, healing is faster, and pain is lower than open surgery.' }
    ]
  },
  'Orthopedics': {
    tagline: 'Complete bone and joint care — fractures, arthritis, trauma and joint replacement for lasting mobility.',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1920&q=80&fm=jpg&fit=crop',
    highlights: [
      { icon: 'fa-solid fa-bone', title: 'Fracture Experts', text: 'Accurate fracture management, from plastering to advanced fixation surgery.' },
      { icon: 'fa-solid fa-user-gear', title: 'Joint Replacement', text: 'Modern hip and knee replacement planning with long-term mobility in mind.' },
      { icon: 'fa-solid fa-truck-medical', title: 'Trauma Ready', text: 'Round-the-clock care for accident and orthopaedic emergencies.' },
      { icon: 'fa-solid fa-person-walking', title: 'Mobility Focused', text: 'Every plan targets restoring strength, function and confident movement.' }
    ],
    stats: [
      { value: 15, suffix: '+', label: 'Years of Expertise' },
      { value: 5000, suffix: '+', label: 'Fractures Treated' },
      { value: 24, suffix: '/7', label: 'Trauma Care' },
      { value: 4.8, suffix: '★', label: 'Patient Rating', decimals: 1 }
    ],
    faqs: [
      { q: 'How do I know if my fracture needs surgery?', a: 'Displaced or unstable fractures usually need surgery to align the bone properly. Simple, aligned fractures may heal with a cast. An X-ray decides what is right for you.' },
      { q: 'How long after joint replacement can I walk?', a: 'Most patients stand with support within a day and walk with a walker within 2–3 days of surgery. Full recovery usually takes 6–8 weeks.' },
      { q: 'Can joint pain be treated without surgery?', a: 'Yes. Many patients respond well to medication, physiotherapy, weight management and lifestyle changes. Surgery is considered only when these options no longer help.' }
    ]
  },
  'ENT': {
    tagline: 'Complete ear, nose and throat care — from sinus relief to minimally invasive surgery for all ages.',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1920&q=80&fm=jpg&fit=crop',
    highlights: [
      { icon: 'fa-solid fa-ear-listen', title: 'Minimally Invasive', text: 'Advanced ENT surgery with less pain, faster healing, and excellent results.' },
      { icon: 'fa-solid fa-baby', title: 'All Ages Covered', text: 'Gentle, specialised ENT care for children and adults alike.' },
      { icon: 'fa-solid fa-sink', title: 'Sinus & Breathing', text: 'Effective treatment for chronic sinusitis, tonsils, adenoids and congestion.' },
      { icon: 'fa-solid fa-volume-high', title: 'Hearing Care', text: 'Evaluation and management of hearing loss and ear disorders.' }
    ],
    stats: [
      { value: 13, suffix: '+', label: 'Years of Expertise' },
      { value: 8000, suffix: '+', label: 'ENT Procedures' },
      { value: 98, suffix: '%', label: 'Successful Outcomes' },
      { value: 4.9, suffix: '★', label: 'Patient Rating', decimals: 1 }
    ],
    faqs: [
      { q: 'When does a child need tonsil surgery?', a: 'When tonsils cause repeated infections, difficulty swallowing, or sleep-breathing problems despite medical treatment. Your ENT doctor will assess each child individually.' },
      { q: 'Can chronic sinusitis be cured?', a: 'Most cases are managed very effectively with medication, nasal sprays and lifestyle changes. Persistent cases may benefit from minimally invasive sinus surgery.' },
      { q: 'Do ENT surgeries hurt?', a: 'No. All procedures are done under anaesthesia. Post-operative discomfort is usually mild and controlled with simple medication.' }
    ]
  },
  'Gynecology & Obstetrics': {
    tagline: 'Safe motherhood, advanced gynaecology and women-first care — from pregnancy to lifelong wellness.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&q=80&fm=jpg&fit=crop',
    highlights: [
      { icon: 'fa-solid fa-person-pregnant', title: 'Safe Deliveries', text: 'Normal and high-risk pregnancy care with round-the-clock delivery support.' },
      { icon: 'fa-solid fa-shield-halved', title: 'Maternal Safety', text: 'C-sections and complication management with a dedicated, experienced team.' },
      { icon: 'fa-solid fa-prescription-bottle-medical', title: 'Hormone & PCOD Care', text: 'Targeted treatment for PCOD/PCOS, hormonal and fertility concerns.' },
      { icon: 'fa-solid fa-heart', title: 'Women\u2019s Wellness', text: 'Compassionate teens clinic and complete health support for women at every stage.' }
    ],
    stats: [
      { value: 15, suffix: '+', label: 'Years of Expertise' },
      { value: 2000, suffix: '+', label: 'Safe Deliveries' },
      { value: 24, suffix: '/7', label: 'Labour & Emergency' },
      { value: 4.9, suffix: '★', label: 'Patient Rating', decimals: 1 }
    ],
    faqs: [
      { q: 'Normal delivery or C-section — how is it decided?', a: 'A normal delivery is always preferred when safe. A C-section is planned only if there are risks to you or your baby, like breech position, cord issues, or prolonged labour.' },
      { q: 'Can I deliver here at night or on holidays?', a: 'Yes. Our labour and emergency services are available 24/7, including nights, weekends and public holidays.' },
      { q: 'How is PCOD / PCOS treated?', a: 'Treatment combines lifestyle guidance, dietary advice and medication to restore hormonal balance, regulate cycles and support fertility — always personalised to you.' }
    ]
  },
  'Dental': {
    tagline: 'Painless dentistry for the whole family — cleanings, root canals and complete oral care with modern equipment.',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1920&q=80&fm=jpg&fit=crop',
    highlights: [
      { icon: 'fa-solid fa-tooth', title: 'Painless Dentistry', text: 'Gentle techniques and anaesthesia make treatments comfortable and stress-free.' },
      { icon: 'fa-solid fa-star', title: 'Root Canal Care', text: 'Modern root canal treatment that saves teeth while keeping you comfortable.' },
      { icon: 'fa-solid fa-baby', title: 'Family Friendly', text: 'Complete oral care for children, adults and seniors — in one clinic.' },
      { icon: 'fa-solid fa-sparkles', title: 'Bright Smiles', text: 'Scaling, polishing and preventive care designed around long-term oral health.' }
    ],
    stats: [
      { value: 10, suffix: '+', label: 'Years of Expertise' },
      { value: 5000, suffix: '+', label: 'Treatments Done' },
      { value: 100, suffix: '%', label: 'Painless Approach' },
      { value: 4.9, suffix: '★', label: 'Patient Rating', decimals: 1 }
    ],
    faqs: [
      { q: 'Is root canal treatment painful?', a: 'No. Modern anaesthesia makes the procedure virtually painless. Most patients report only minor sensitivity for a day or two afterwards.' },
      { q: 'How often should I get a dental check-up?', a: 'Once every six months is ideal. Regular checks catch cavities and gum issues early, saving you pain, time and money.' },
      { q: 'When should my child first visit a dentist?', a: 'Ideally by the first birthday or within six months of the first tooth, to build healthy habits and catch early problems.' }
    ]
  },
  'General Medicine': {
    tagline: 'Trusted internal medicine for fevers, diabetes, blood pressure and everyday health — guided by experienced MD physicians.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80&fm=jpg&fit=crop',
    highlights: [
      { icon: 'fa-solid fa-stethoscope', title: 'MD Physicians', text: 'Experienced doctors for accurate diagnosis and complete medical management.' },
      { icon: 'fa-solid fa-droplet', title: 'Diabetes & BP Care', text: 'Structured, personalised plans to control sugar and blood pressure long-term.' },
      { icon: 'fa-solid fa-shield-halved', title: 'Preventive Health', text: 'Regular health check-ups that catch risks early and keep you healthy.' },
      { icon: 'fa-solid fa-heart-circle-check', title: 'Whole-Person Care', text: 'From acute fever to chronic illness — all under one continuous treatment plan.' }
    ],
    stats: [
      { value: 15, suffix: '+', label: 'Years of Expertise' },
      { value: 10000, suffix: '+', label: 'Patients Treated' },
      { value: 24, suffix: '/7', label: 'OPD & Emergencies' },
      { value: 4.8, suffix: '★', label: 'Patient Rating', decimals: 1 }
    ],
    faqs: [
      { q: 'When should I see a general physician?', a: 'For fever, infections, diabetes, high blood pressure, unexplained tiredness, or any new or persistent symptom. Early review prevents complications.' },
      { q: 'Can I manage diabetes without medicines?', a: 'In early stages, diet, exercise and weight control may be enough. Many patients need medication as the condition progresses — your physician will guide you safely.' },
      { q: 'Do you provide health check-up packages?', a: 'Yes. We offer preventive health check-ups covering essential tests and review with a physician. Call reception for the current packages.' }
    ]
  },
  'Pediatrics': {
    tagline: 'Warm, expert care for infants, children and adolescents — newborn to vaccination and beyond.',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1920&q=80&fm=jpg&fit=crop',
    highlights: [
      { icon: 'fa-solid fa-baby', title: 'Newborn Care', text: 'Gentle, specialised care from the very first days of life.' },
      { icon: 'fa-solid fa-syringe', title: 'Complete Vaccination', text: 'Full immunisation schedules keeping your child protected at every age.' },
      { icon: 'fa-solid fa-child-reaching', title: 'Growth Tracking', text: 'Height, weight and development monitoring to catch concerns early.' },
      { icon: 'fa-solid fa-heart', title: 'Child-Friendly', text: 'A warm, calm approach that helps children feel at ease during visits.' }
    ],
    stats: [
      { value: 12, suffix: '+', label: 'Years of Expertise' },
      { value: 8000, suffix: '+', label: 'Children Cared For' },
      { value: 100, suffix: '%', label: 'Vaccination Coverage' },
      { value: 4.9, suffix: '★', label: 'Parent Rating', decimals: 1 }
    ],
    faqs: [
      { q: 'What is the complete vaccination schedule?', a: 'Vaccines begin at birth and continue through adolescence — including BCG, Hep-B, DPT, MMR, polio and boosters. Our pediatrician will give you a full schedule for your child.' },
      { q: 'When should I take my baby to a pediatrician?', a: 'For any fever, feeding difficulty, excessive crying, breathing trouble, rashes, or growth concerns — and routinely for vaccination and check-ups.' },
      { q: 'How do I manage my child\u2019s fever at home?', a: 'Ensure hydration, light clothing, and paracetamol only as prescribed by the doctor. Monitor temperature and consult a pediatrician if fever persists or the child is very dull.' }
    ]
  },
  'Cardiology': {
    tagline: 'Advanced heart care — from prevention and diagnosis to high-risk cardiac surgery by a veteran cardiothoracic surgeon.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1920&q=80&fm=jpg&fit=crop',
    highlights: [
      { icon: 'fa-solid fa-heart-pulse', title: 'Elite Surgical Expertise', text: 'Two decades of premium cardiac surgery — CABG, valve repair and more.' },
      { icon: 'fa-solid fa-heart-circle-check', title: 'Complete Diagnosis', text: 'ECG, cardiac screening and full risk evaluation for accurate treatment.' },
      { icon: 'fa-solid fa-shield-heart', title: 'High-Risk Care', text: 'Intensive monitoring and management for complex heart conditions.' },
      { icon: 'fa-solid fa-person-running', title: 'Prevention First', text: 'Risk counselling on diet, lifestyle and BP control to protect your heart.' }
    ],
    stats: [
      { value: 20, suffix: '+', label: 'Years of Expertise' },
      { value: 1500, suffix: '+', label: 'Cardiac Surgeries' },
      { value: 24, suffix: '/7', label: 'High-Risk Care' },
      { value: 4.9, suffix: '★', label: 'Patient Rating', decimals: 1 }
    ],
    faqs: [
      { q: 'What are the warning signs of a heart problem?', a: 'Chest pressure, breathlessness, palpitations, dizziness and radiating arm/jaw pain. Any of these — especially sudden — needs urgent evaluation.' },
      { q: 'Is bypass surgery risky?', a: 'Modern CABG is very safe in experienced hands, with most patients recovering well. Your surgeon will discuss your individual risk and benefits.' },
      { q: 'Can heart disease improve without surgery?', a: 'In many cases, yes — medication, lifestyle change and risk control can significantly slow or reverse disease. Surgery is reserved for advanced or high-risk cases.' }
    ]
  },
  'Gastroenterology': {
    tagline: 'Specialised digestive care — endoscopy and targeted treatment for stomach, liver and intestinal health.',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920&q=80&fm=jpg&fit=crop',
    highlights: [
      { icon: 'fa-solid fa-microscope', title: 'Endoscopy', text: 'Advanced endoscopic diagnosis and treatment of the digestive tract.' },
      { icon: 'fa-solid fa-wheat-awn', title: 'Diet-First Approach', text: 'Practical diet and lifestyle plans targeting the root of your symptoms.' },
      { icon: 'fa-solid fa-brain', title: 'Gut & Liver Care', text: 'Management of reflux, ulcers, liver and intestinal conditions.' },
      { icon: 'fa-solid fa-clipboard-check', title: 'Root-Cause Focus', text: 'Accurate diagnosis so you treat the cause, not just the symptom.' }
    ],
    stats: [
      { value: 12, suffix: '+', label: 'Years of Expertise' },
      { value: 3000, suffix: '+', label: 'Endoscopies Done' },
      { value: 95, suffix: '%', label: 'Accurate Diagnosis' },
      { value: 4.8, suffix: '★', label: 'Patient Rating', decimals: 1 }
    ],
    faqs: [
      { q: 'When should I get an endoscopy?', a: 'For persistent acidity, difficulty swallowing, black stools, unexplained weight loss, or chronic abdominal pain — after initial consultation with the gastroenterologist.' },
      { q: 'Is endoscopy painful?', a: 'No. It is performed under sedation, so you remain relaxed and comfortable. Most patients remember very little and go home the same day.' },
      { q: 'Can acidity and reflux be cured?', a: 'Very often yes, with a combination of medication and lasting diet/lifestyle changes. We help you identify triggers and build a sustainable plan.' }
    ]
  },
  'Chest (Respiratory Medicine)': {
    tagline: 'Focused respiratory care for asthma, bronchitis and lung conditions — with therapies like Bi-PAP for breathing support.',
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1920&q=80&fm=jpg&fit=crop',
    highlights: [
      { icon: 'fa-solid fa-lungs', title: 'Asthma & Allergy Care', text: 'Structured management to control attacks and improve daily breathing.' },
      { icon: 'fa-solid fa-wind', title: 'Breathing Therapies', text: 'Advanced respiratory support including Bi-PAP therapy when needed.' },
      { icon: 'fa-solid fa-shield-halved', title: 'Infection & TB Care', text: 'Effective treatment of chest infections, bronchitis and tuberculosis.' },
      { icon: 'fa-solid fa-smoking-ban', title: 'Lung Health Focus', text: 'Quit-smoking support and lifestyle guidance for long-term lung health.' }
    ],
    stats: [
      { value: 15, suffix: '+', label: 'Years of Expertise' },
      { value: 5000, suffix: '+', label: 'Patients Treated' },
      { value: 24, suffix: '/7', label: 'Breathing Support' },
      { value: 4.9, suffix: '★', label: 'Patient Rating', decimals: 1 }
    ],
    faqs: [
      { q: 'How is asthma diagnosed?', a: 'Through clinical history, breathing tests (spirometry) and sometimes chest X-ray. This confirms the diagnosis and guides your personalised treatment plan.' },
      { q: 'What is Bi-PAP therapy?', a: 'Bi-PAP is a non-invasive breathing machine used when blood oxygen falls or breathing becomes weak. It supports your breathing and is commonly used for severe chest conditions.' },
      { q: 'Can lung conditions improve with lifestyle changes?', a: 'Definitely. Stopping smoking, avoiding allergens, breathing exercises and a balanced diet greatly improve outcomes alongside medical treatment.' }
    ]
  },
  'Physiotherapy': {
    tagline: 'Goal-based rehabilitation that restores strength, movement and confidence after injury, surgery or chronic pain.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1920&q=80&fm=jpg&fit=crop',
    highlights: [
      { icon: 'fa-solid fa-person-walking', title: 'Personalised Programs', text: 'Exercise plans built around your exact injury, goals and daily life.' },
      { icon: 'fa-solid fa-house-medical', title: 'Post-Surgery Rehab', text: 'Structured recovery programmes that speed healing and prevent re-injury.' },
      { icon: 'fa-solid fa-hand-holding-medical', title: 'Pain Management', text: 'Targeted techniques to reduce chronic pain and stiffness.' },
      { icon: 'fa-solid fa-trophy', title: 'Sports Rehab', text: 'Safe, progressive return-to-play programmes for athletes.' }
    ],
    stats: [
      { value: 10, suffix: '+', label: 'Years of Expertise' },
      { value: 6000, suffix: '+', label: 'Rehab Sessions' },
      { value: 96, suffix: '%', label: 'Recovery Success' },
      { value: 4.9, suffix: '★', label: 'Patient Rating', decimals: 1 }
    ],
    faqs: [
      { q: 'Do I need a doctor\u2019s referral for physiotherapy?', a: 'Not always. However, a referral helps your physiotherapist understand your diagnosis better and makes treatment more focused. Call us to check.' },
      { q: 'How long does physiotherapy take?', a: 'It varies by condition. Many patients see improvement in 2–4 weeks of regular sessions, with a full rehabilitation plan typically spanning 6–12 weeks.' },
      { q: 'Does physiotherapy hurt?', a: 'Good physiotherapy should not cause sharp pain. Some muscle soreness is normal after exercises, but your therapist will always work within your comfort.' }
    ]
  },
  'Neuro Surgery': {
    tagline: 'Advanced surgical care for brain, spine and nervous system conditions — precisely planned for the best outcomes.',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=1920&q=80&fm=jpg&fit=crop',
    highlights: [
      { icon: 'fa-solid fa-brain', title: 'Brain Surgery', text: 'Precise surgical treatment of brain tumours, pressure and pathology.' },
      { icon: 'fa-solid fa-align-center', title: 'Spine Care', text: 'Surgical and medical management of spine disorders and nerve compression.' },
      { icon: 'fa-solid fa-truck-medical', title: 'Neuro Trauma', text: 'Rapid response for head injury and neurological emergencies.' },
      { icon: 'fa-solid fa-route', title: 'Careful Planning', text: 'Detailed imaging and planning before every procedure for patient safety.' }
    ],
    stats: [
      { value: 15, suffix: '+', label: 'Years of Expertise' },
      { value: 1000, suffix: '+', label: 'Neuro Surgeries' },
      { value: 24, suffix: '/7', label: 'Trauma Response' },
      { value: 4.8, suffix: '★', label: 'Patient Rating', decimals: 1 }
    ],
    faqs: [
      { q: 'When is neurosurgery required?', a: 'For brain tumours, bleeding, hydrocephalus, spinal cord compression, or severe trauma where surgery protects the brain, spine or nerves. Every case is individually evaluated.' },
      { q: 'Is brain surgery dangerous?', a: 'All surgery carries some risk, but modern imaging, anaesthesia and microsurgical techniques have made neuro surgery remarkably safe with high success rates.' },
      { q: 'When should I see a neuro specialist?', a: 'For persistent severe headaches, weakness, numbness, seizures, balance problems, or after any head or spine injury — early evaluation greatly improves outcomes.' }
    ]
  },
  'Nephrology': {
    tagline: 'Complete kidney care — from prevention and medication to dialysis, hypertension control and specialist oversight.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80&fm=jpg&fit=crop',
    highlights: [
      { icon: 'fa-solid fa-droplet', title: 'Kidney Care', text: 'Management of kidney disease, stones and renal disorders with close monitoring.' },
      { icon: 'fa-solid fa-fill-drip', title: 'Dialysis Services', text: 'Safe, comfortable dialysis delivered by experienced staff.' },
      { icon: 'fa-solid fa-heart-pulse', title: 'Hypertension & Renal', text: 'Blood-pressure control that is central to protecting kidney function.' },
      { icon: 'fa-solid fa-file-medical', title: 'Prevention & Follow-Up', text: 'Regular testing and transplant follow-up to keep kidneys healthy longer.' }
    ],
    stats: [
      { value: 12, suffix: '+', label: 'Years of Expertise' },
      { value: 1500, suffix: '+', label: 'Dialysis Sessions' },
      { value: 24, suffix: '/7', label: 'Emergency Nephro Care' },
      { value: 4.8, suffix: '★', label: 'Patient Rating', decimals: 1 }
    ],
    faqs: [
      { q: 'What are early signs of kidney disease?', a: 'Swelling in feet or face, foamy urine, frequent urination at night, fatigue, and rising blood pressure. A simple blood and urine test can screen your kidney function.' },
      { q: 'Who needs dialysis?', a: 'Dialysis is needed when the kidneys can no longer filter waste safely — typically in advanced kidney failure. It is started only after detailed specialist evaluation.' },
      { q: 'How can I protect my kidneys?', a: 'Control diabetes and blood pressure, drink adequate water, avoid unnecessary painkillers, and get regular check-ups if you have risk factors.' }
    ]
  }
};

function initDepartmentDetail() {
  const page = document.getElementById('dept-detail-page');
  if (!page) return;

  const closeBtns = Array.from(page.querySelectorAll('.dd-close'));
  const bookBtns = Array.from(page.querySelectorAll('.dd-book'));
  const heroImg = document.getElementById('dd-hero-img');
  const heroIcon = document.getElementById('dd-hero-icon');
  const heroTrack = document.querySelector('.dd-hero-track');
  const ddNav = document.getElementById('dd-nav');
  const navLinks = Array.from(ddNav ? ddNav.querySelectorAll('.dd-nav-link') : []);
  const nameEl = document.getElementById('dd-name');
  const taglineEl = document.getElementById('dd-tagline');
  const descEl = document.getElementById('dd-description');
  const statsEl = document.getElementById('dd-stats');
  const highlightsEl = document.getElementById('dd-highlight-cards');
  const proceduresEl = document.getElementById('dd-procedures');
  const doctorsEl = document.getElementById('dd-doctors-list');
  const faqEl = document.getElementById('dd-faq-list');
  const relatedEl = document.getElementById('dd-related');
  const ctaIcon = document.getElementById('dd-cta-icon');
  if (!nameEl || !taglineEl || !descEl || !statsEl || !highlightsEl || !proceduresEl || !doctorsEl || !faqEl || !relatedEl) return;

  const doctorButtons = Array.from(document.querySelectorAll('.doctor-book-btn'));
  const departmentCards = Array.from(document.querySelectorAll('.department-card'));
  const allDepartments = departmentCards.map(card => card.dataset.dept).filter(Boolean);
  let counterObserver = null;

  function animateCounter(el, target, decimals = 0) {
    const duration = 1600;
    const startTime = performance.now();
    function frame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initCounters() {
    const counterEls = Array.from(page.querySelectorAll('.dd-counter-value'));
    if (!('IntersectionObserver' in window)) {
      counterEls.forEach(el => animateCounter(el, Number(el.dataset.counter) || 0, Number(el.dataset.decimals) || 0));
      return;
    }
    counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCounter(el, Number(el.dataset.counter) || 0, Number(el.dataset.decimals) || 0);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    counterEls.forEach(el => counterObserver.observe(el));
  }

  function renderStats(details) {
    statsEl.innerHTML = '';
    details.stats.forEach((stat, i) => {
      const card = document.createElement('div');
      card.className = 'dd-feature rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/50 shadow-soft text-center';
      card.innerHTML = `
        <div class="text-3xl font-extrabold bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
          <span class="dd-counter-value" data-counter="${stat.value}" data-decimals="${stat.decimals || 0}">0</span><span>${stat.suffix}</span>
        </div>
        <p class="mt-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${stat.label}</p>`;
      statsEl.appendChild(card);
    });
    initCounters();
  }

  function renderHighlights(details) {
    highlightsEl.innerHTML = '';
    details.highlights.forEach(h => {
      const card = document.createElement('div');
      card.className = 'dd-feature rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/50 shadow-soft group';
      card.innerHTML = `
        <div class="dd-proc-icon w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 flex items-center justify-center text-xl mb-4 transition-all duration-300 group-hover:scale-110">
          <i class="${h.icon}"></i>
        </div>
        <h3 class="font-bold text-slate-900 dark:text-white mb-1.5">${h.title}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">${h.text}</p>`;
      highlightsEl.appendChild(card);
    });
  }

  function renderProcedures(details) {
    proceduresEl.innerHTML = '';
    details.procedures.forEach(proc => {
      const chip = document.createElement('div');
      chip.className = 'dd-proc flex items-center gap-3 rounded-2xl px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 font-semibold text-sm';
      chip.innerHTML = `<span class="dd-proc-icon flex-shrink-0 w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 flex items-center justify-center text-xs transition-all duration-300"><i class="fa-solid fa-check"></i></span>${proc}`;
      proceduresEl.appendChild(chip);
    });
  }

  function renderDoctors(deptName) {
    const matchingDoctors = doctorButtons.filter(btn => btn.dataset.dept === deptName);
    doctorsEl.innerHTML = '';

    if (!matchingDoctors.length) {
      doctorsEl.innerHTML = '<p class="col-span-full text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-8 text-center">Please call reception for the latest consultant schedule in this department.</p>';
      return;
    }

    matchingDoctors.forEach(btn => {
      const full = btn.dataset.doctor || '';
      const doctorName = full.includes(' (') ? full.slice(0, full.indexOf(' (')) : full;
      const photo = getDoctorPhoto(btn);
      const avatar = photo
        ? `<div class="relative w-20 h-20 flex-shrink-0 mx-auto rounded-2xl overflow-hidden ring-2 ring-brand-300/50 dark:ring-brand-700/50 shadow-md shadow-brand-500/20 mb-4">
            <img src="${photo}" alt="${doctorName}" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="absolute inset-0 bg-gradient-to-br from-brand-400 to-brand-600 text-white items-center justify-center text-2xl font-extrabold hidden">${getInitials(doctorName)}</div>
          </div>`
        : `<div class="w-20 h-20 flex-shrink-0 mx-auto rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-md shadow-brand-500/20 mb-4">${getInitials(doctorName)}</div>`;
      const card = document.createElement('div');
      card.className = 'dd-feature rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/50 shadow-soft text-center flex flex-col';
      card.innerHTML = `
        ${avatar}
        <div class="flex-1">
          <h4 class="font-bold text-slate-900 dark:text-white leading-tight">${doctorName}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 uppercase tracking-wide">Department Specialist</p>
        </div>
        <button type="button" class="dd-doctor-book w-full py-2.5 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-100 dark:border-brand-800 hover:bg-gradient-to-r hover:from-brand-600 hover:to-accent-500 hover:text-white hover:border-transparent transition-all">
          <i class="fa-solid fa-calendar-check mr-1.5"></i>Book this doctor
        </button>`;
      card.querySelector('.dd-doctor-book').addEventListener('click', () => {
        openBookingForm(btn.dataset.doctor, btn.dataset.dept);
      });
      doctorsEl.appendChild(card);
    });
  }

  function renderFaq(details) {
    faqEl.innerHTML = '';
    details.faqs.forEach((item, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/50 overflow-hidden shadow-soft';
      wrap.innerHTML = `
        <button type="button" class="dd-faq-btn w-full flex items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded="${i === 0}">
          <span class="font-bold text-slate-900 dark:text-white text-sm sm:text-base">${item.q}</span>
          <span class="dd-faq-icon flex-shrink-0 w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 flex items-center justify-center text-xs transition-transform duration-300 ${i === 0 ? 'rotate-180' : ''}">
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>
        <div class="dd-faq-body ${i === 0 ? '' : ''}" style="${i === 0 ? 'max-height: 300px;' : ''}">
          <p class="px-6 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">${item.a}</p>
        </div>`;
      faqEl.appendChild(wrap);
    });

    faqEl.querySelectorAll('.dd-faq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const body = btn.nextElementSibling;
        const icon = btn.querySelector('.dd-faq-icon');
        const isOpen = body.style.maxHeight && body.style.maxHeight !== '0px';
        faqEl.querySelectorAll('.dd-faq-body').forEach(b => { b.style.maxHeight = '0px'; });
        faqEl.querySelectorAll('.dd-faq-icon').forEach(i => i.classList.remove('rotate-180'));
        if (!isOpen) {
          body.style.maxHeight = body.scrollHeight + 'px';
          icon.classList.add('rotate-180');
          btn.setAttribute('aria-expanded', 'true');
        } else {
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  function renderRelated(details, currentDept) {
    relatedEl.innerHTML = '';
    allDepartments
      .filter(dept => dept !== currentDept)
      .forEach(dept => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'dd-related-chip inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/50 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-brand-600 hover:to-accent-500 hover:border-transparent shadow-soft';
        chip.innerHTML = `<i class="${(DEPARTMENT_DETAILS[dept] || DEPARTMENT_FALLBACK_DETAILS).icon} text-brand-500"></i>${dept}`;
        chip.addEventListener('click', () => openDepartment(dept));
        relatedEl.appendChild(chip);
      });
  }

  function openDepartment(deptName) {
    const details = { ...DEPARTMENT_FALLBACK_DETAILS, ...DEPARTMENT_DETAILS[deptName], ...DEPARTMENT_PAGE_DETAILS[deptName] };

    heroImg.src = details.image;
    heroImg.alt = `${deptName} department at Om Multi Speciality Hospital`;
    heroIcon.className = details.icon;
    nameEl.textContent = deptName;
    taglineEl.textContent = details.tagline || DEPARTMENT_FALLBACK_DETAILS.tagline;
    descEl.textContent = details.description;
    ctaIcon.className = details.icon;

    renderStats(details);
    renderHighlights(details);
    renderProcedures(details);
    renderDoctors(deptName);
    renderFaq(details);
    renderRelated(details, deptName);

    document.title = `${deptName} | Om Multi Speciality Hospital`;

    page.classList.add('anim-in');
    page.classList.remove('hidden');
    page.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#dd-overview'));
  }

  function closeDepartment() {
    page.classList.add('hidden');
    page.classList.remove('anim-in');
    document.body.style.overflow = '';
    document.title = 'Om Multi Speciality Hospital (Formally Known as Om Multi Speciality Hospital & Ayush Centre) — Ghaziabad';
    const departmentsSection = document.getElementById('departments');
    if (departmentsSection) departmentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function openBookingForm(doctorLabel, dept) {
    closeDepartment();
    const booking = document.getElementById('booking');
    if (booking) setTimeout(() => booking.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);

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

  departmentCards.forEach(card => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', () => openDepartment(card.dataset.dept));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDepartment(card.dataset.dept);
      }
    });
  });

  closeBtns.forEach(btn => btn.addEventListener('click', closeDepartment));
  bookBtns.forEach(btn => btn.addEventListener('click', () => openBookingForm('', btn.closest('#dept-detail-page') ? nameEl.textContent : '')));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !page.classList.contains('hidden')) closeDepartment();
  });

  if (ddNav) {
    page.addEventListener('scroll', () => {
      const offset = 160;
      let currentId = 'dd-overview';
      navLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section && section.getBoundingClientRect().top <= offset) currentId = link.getAttribute('href').slice(1);
      });
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`));
      ddNav.classList.toggle('scrolled', page.scrollTop > 60);
    });
  }

  if (heroTrack) {
    page.addEventListener('scroll', () => {
      const y = Math.min(page.scrollTop, 600);
      heroTrack.style.transform = `translateY(${y * 0.25}px)`;
      heroTrack.style.opacity = Math.max(1 - y / 450, 0);
    }, { passive: true });
  }

  const scrollDownBtn = document.getElementById('dd-scroll-down');
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', () => {
      const overview = document.getElementById('dd-overview');
      if (overview) overview.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const navToggle = document.getElementById('dd-nav-toggle');
  const navDropdown = document.getElementById('dd-nav-dropdown');
  const navToggleIcon = document.getElementById('dd-nav-toggle-icon');
  if (navToggle && navDropdown) {
    const closeDropdown = () => {
      navDropdown.classList.add('hidden');
      navToggle.setAttribute('aria-expanded', 'false');
      if (navToggleIcon) navToggleIcon.className = 'fa-solid fa-bars';
    };
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = navDropdown.classList.contains('hidden');
      navDropdown.classList.toggle('hidden', !isHidden);
      navToggle.setAttribute('aria-expanded', String(isHidden));
      if (navToggleIcon) navToggleIcon.className = isHidden ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
    navLinks.forEach(link => link.addEventListener('click', closeDropdown));
    page.addEventListener('click', (e) => {
      if (!navDropdown.classList.contains('hidden') && !navToggle.contains(e.target)) closeDropdown();
    });
  }
}

function getInitials(name) {
  const names = name.replace(/^Dr\.?\s*/i, '').split(/\s+/).filter(Boolean);
  return ((names[0] || '')[0] || '') + ((names[1] || '')[0] || '');
}

const DOCTOR_DETAILS = {
  'Dr. Pinky Agarwal': {
    photo: 'assets/img/dr-pinky-agarwal.jpg',
    specialty: 'Obstetrician & Gynaecologist',
    qualificationLine: 'MBBS, DGO, DNB (Obstetrics & Gynaecology) · 16+ Years Experience',
    about: 'Dr. Pinky Agarwal is a senior Obstetrician and Gynaecologist in Ghaziabad with over 16 years of dedicated experience in managing complex pregnancy cases and women\u2019s health issues. She specialises in early pregnancy care and innovative approaches to ectopic pregnancies, delivering personalised treatment plans for every patient. Her patient-centric philosophy, warm approach and commitment to safe motherhood have made her a trusted name for families across the region.',
    qualifications: [
      { degree: 'MBBS', note: 'Bachelor of Medicine & Bachelor of Surgery' },
      { degree: 'DGO', note: 'Diploma in Gynaecology & Obstetrics' },
      { degree: 'DNB (Obs & Gynae)', note: 'Diplomate of National Board — Obstetrics & Gynaecology' },
      { degree: '16+ Years Experience', note: 'Complex pregnancy, high-risk delivery and women\u2019s health care' }
    ],
    specialties: ['Normal Delivery', 'C-Section (Caesarean)', 'High-Risk Pregnancy Care', 'Early Pregnancy Care', 'Ectopic Pregnancy Management', 'PCOD / PCOS Treatment', 'Infertility Consultation', 'Wellness & Teens Clinic']
  }
};

function initDoctorDetail() {
  const page = document.getElementById('doctor-detail-page');
  if (!page) return;

  const closeBtns = Array.from(page.querySelectorAll('.doc-close'));
  const bookBtns = Array.from(page.querySelectorAll('.doc-book-btn'));
  const heroImg = document.getElementById('doc-hero-img');
  const photo = document.getElementById('doc-photo');
  const photoFallback = document.getElementById('doc-photo-fallback');
  const nameEl = document.getElementById('doc-name');
  const specialtyBadge = document.getElementById('doc-specialty-badge');
  const qualLine = document.getElementById('doc-qual-line');
  const aboutText = document.getElementById('doc-about-text');
  const qualList = document.getElementById('doc-qual-list');
  const specialtyList = document.getElementById('doc-specialty-list');
  const ctaDoctor = document.getElementById('doc-cta-doctor');
  const doctorCards = Array.from(document.querySelectorAll('#doctors .grid > .group'));
  if (!nameEl || !aboutText || !qualList || !specialtyList) return;

  function parseDegreeLine(text) {
    const idx = text.indexOf('\u00B7');
    const degreePart = (idx > -1 ? text.slice(0, idx) : text).trim();
    return degreePart.split(',').map(s => s.trim()).filter(Boolean);
  }

  function openDoctor(card) {
    const bookBtn = card.querySelector('.doctor-book-btn');
    const doctorLabel = (bookBtn && bookBtn.dataset.doctor) || card.querySelector('h3').textContent.trim();
    const doctorName = doctorLabel.includes(' (') ? doctorLabel.slice(0, doctorLabel.indexOf(' (')) : doctorLabel;
    const dept = (bookBtn && bookBtn.dataset.dept) || '';
    const details = DOCTOR_DETAILS[doctorName] || {};

    const cardImg = card.querySelector('img');
    const cardPhoto = details.photo || (cardImg ? cardImg.getAttribute('src') : '') || '';
    const cardDesc = card.querySelector('p.text-xs.leading-relaxed');
    const descText = cardDesc ? cardDesc.textContent.trim() : '';
    const degrees = details.qualifications ? details.qualifications.map(q => q.degree) : parseDegreeLine(descText);

    heroImg.src = cardPhoto;
    heroImg.alt = `${doctorName} at Om Multi Speciality Hospital`;
    photo.src = cardPhoto;
    photo.alt = heroImg.alt;
    if (cardPhoto) {
      photo.style.display = 'block';
      photoFallback.style.display = 'none';
    } else {
      photo.style.display = 'none';
      photoFallback.style.display = 'flex';
      photoFallback.textContent = getInitials(doctorName);
    }

    nameEl.textContent = doctorName;
    specialtyBadge.textContent = details.specialty || dept || 'Consulting Specialist';
    qualLine.textContent = details.qualificationLine || degrees.join(', ') || 'Consulting Specialist';
    aboutText.textContent = details.about || descText || `${doctorName} is a consulting specialist at Om Multi Speciality Hospital, Ghaziabad.`;
    ctaDoctor.textContent = doctorName.replace(/^Dr\.?\s*/i, 'Dr. ');

    const qualData = details.qualifications || degrees.map(d => ({ degree: d, note: '' }));
    qualList.innerHTML = '';
    qualData.forEach(q => {
      const item = document.createElement('div');
      item.className = 'rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/50 shadow-soft flex items-start gap-4';
      item.innerHTML = `
        <div class="w-11 h-11 flex-shrink-0 rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 flex items-center justify-center text-lg">
          <i class="fa-solid fa-graduation-cap"></i>
        </div>
        <div>
          <h3 class="font-bold text-slate-900 dark:text-white text-sm sm:text-base">${q.degree}</h3>
          ${q.note ? `<p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">${q.note}</p>` : ''}
        </div>`;
      qualList.appendChild(item);
    });

    const specialtyData = details.specialties || [];
    specialtyList.innerHTML = '';
    if (specialtyData.length) {
      specialtyData.forEach(s => {
        const chip = document.createElement('div');
        chip.className = 'flex items-center gap-3 rounded-2xl px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 font-semibold text-sm';
        chip.innerHTML = `<span class="flex-shrink-0 w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 flex items-center justify-center text-xs"><i class="fa-solid fa-check"></i></span>${s}`;
        specialtyList.appendChild(chip);
      });
    } else {
      specialtyList.innerHTML = '<p class="col-span-full text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-8 text-center">Please call reception for the latest information about this specialist.</p>';
    }

    document.title = `${doctorName} | Om Multi Speciality Hospital`;
    page.classList.add('anim-in');
    page.classList.remove('hidden');
    page.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeDoctor() {
    page.classList.add('hidden');
    page.classList.remove('anim-in');
    document.body.style.overflow = '';
    document.title = 'Om Multi Speciality Hospital (Formally Known as Om Multi Speciality Hospital & Ayush Centre) — Ghaziabad';
    const doctorsSection = document.getElementById('doctors');
    if (doctorsSection) doctorsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function openBooking() {
    closeDoctor();
    const booking = document.getElementById('booking');
    if (booking) setTimeout(() => booking.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
  }

  doctorCards.forEach(card => {
    const hint = document.createElement('button');
    hint.type = 'button';
    hint.className = 'doc-view mt-3 text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline inline-flex items-center justify-center gap-1.5';
    hint.innerHTML = '<i class="fa-solid fa-id-badge"></i> View Full Profile';
    hint.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openDoctor(card);
    });
    card.appendChild(hint);

    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', (e) => {
      if (e.target.closest('.doctor-book-btn')) return;
      openDoctor(card);
    });
    card.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.doctor-book-btn')) {
        e.preventDefault();
        openDoctor(card);
      }
    });
  });

  closeBtns.forEach(btn => btn.addEventListener('click', closeDoctor));
  bookBtns.forEach(btn => btn.addEventListener('click', openBooking));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !page.classList.contains('hidden')) closeDoctor();
  });
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
    initDepartmentDetail();
    initDoctorDetail();
    initScrollReveal();
    initScrollTopButton();
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
