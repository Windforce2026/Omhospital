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
            if (!response.ok) {
                throw new Error(`Unable to load ${path}`);
            }
            return response.text();
        })
    );

    app.innerHTML = sectionMarkup.join('\n');
}

function initYear() {
    const year = document.getElementById('year');
    if (year) {
        year.textContent = new Date().getFullYear();
    }
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

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function previousSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function restartAutoPlay() {
        clearInterval(slideInterval);
        startAutoPlay();
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            showSlide(Number(dot.dataset.slide));
            restartAutoPlay();
        });
    });

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            previousSlide();
            restartAutoPlay();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            nextSlide();
            restartAutoPlay();
        });
    }

    startAutoPlay();
}

async function initPage() {
    try {
        await loadSections();
        initYear();
        initThemeToggle();
        initMobileMenu();
        initCarousel();
    } catch (error) {
        console.error(error);
        if (app) {
            app.innerHTML = '<main class="min-h-screen flex items-center justify-center p-6 text-center"><p class="text-slate-600">Unable to load page sections. Please run this site through a local server.</p></main>';
        }
    }
}

initPage();
