document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. HERO SLIDER
    // ==========================================
    const slideData = [
        {
            img: 'assets/hero.png',
            heading: 'СТАБИЛЬНОСТЬ<span class="comma">,</span><br>СОЗДАЮЩАЯ<br>КОМФОРТ',
            desc: 'Системная целостность инженерных систем сохраняет среду в заданных параметрах, делая комфорт естественным состоянием пространства.'
        },
        {
            img: 'assets/approach.png',
            heading: 'ПЕРЕДОВЫЕ<br>ТЕХНОЛОГИИ<br>И СИСТЕМЫ',
            desc: 'Мы создаем современные решения для вентиляции, кондиционирования и отопления зданий любого масштаба.'
        },
        {
            img: 'assets/cont.png',
            heading: 'КОНТРОЛЬ И<br>НАДЕЖНОСТЬ<br>РЕШЕНИЙ',
            desc: 'Профессиональное сопровождение на каждом этапе — от проектирования до долгосрочного сервисного обслуживания.'
        }
    ];

    let currentSlide = 0;
    let autoplayInterval;

    const slides = document.querySelectorAll('.hero-slide');
    const heroLeft = document.querySelector('.hero-left');

    if (slides.length > 0 && heroLeft) {
        function goToSlide(n) {
            const currentSlides = document.querySelectorAll('.hero-slide');
            const heading = document.querySelector('.hero-heading');
            const desc = document.querySelector('.hero-desc');

            if (currentSlides.length === 0) return;

            currentSlides[currentSlide].classList.remove('active');

            currentSlide = (n + currentSlides.length) % currentSlides.length;

            currentSlides[currentSlide].classList.add('active');

            // Transition text content smoothly
            if (heading && desc && slideData[currentSlide]) {
                heading.style.opacity = 0;
                desc.style.opacity = 0;
                setTimeout(() => {
                    heading.innerHTML = slideData[currentSlide].heading;
                    desc.textContent = slideData[currentSlide].desc;
                    heading.style.opacity = 1;
                    desc.style.opacity = 1;
                }, 200);
            }
        }

        const arrowLeft = document.querySelector('.arrow-left');
        const arrowRight = document.querySelector('.arrow-right');

        arrowLeft?.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            resetAutoPlay();
        });

        arrowRight?.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            resetAutoPlay();
        });

        function startAutoPlay() {
            autoplayInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 6000);
        }

        function resetAutoPlay() {
            clearInterval(autoplayInterval);
            startAutoPlay();
        }

        const heroSection = document.querySelector('.hero');
        heroSection?.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        heroSection?.addEventListener('mouseleave', () => {
            startAutoPlay();
        });

        // Drag and Swipe support (Touch & Mouse)
        const heroImageContainer = document.querySelector('.hero__image');
        let touchStartX = 0;
        let isDragging = false;

        // Prevent browser image drag-and-drop ghosting
        const sliderImages = heroImageContainer?.querySelectorAll('img');
        sliderImages?.forEach(img => {
            img.addEventListener('dragstart', e => e.preventDefault());
        });

        // Touch swipe support
        heroImageContainer?.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        heroImageContainer?.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
                resetAutoPlay();
            }
        }, { passive: true });

        // Mouse drag support
        heroImageContainer?.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // only left click
            touchStartX = e.clientX;
            isDragging = true;
            if (heroImageContainer) heroImageContainer.style.cursor = 'grabbing';
        });

        heroImageContainer?.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            if (heroImageContainer) heroImageContainer.style.cursor = 'grab';
            const diff = touchStartX - e.clientX;
            if (Math.abs(diff) > 50) {
                goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
                resetAutoPlay();
            }
        });

        heroImageContainer?.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                if (heroImageContainer) heroImageContainer.style.cursor = 'grab';
            }
        });

        startAutoPlay();
    }

    // ==========================================
    // 2. TABS "РЕШЕНИЯ"
    // ==========================================
    const tabs = document.querySelectorAll('.tabs-row .tab');
    const productCards = document.querySelectorAll('.products-grid .product-card');

    const categoryMap = {
        'ВСЕ РЕШЕНИЯ': 'all',
        'КОММЕРЧЕСКИЕ ОБЪЕКТЫ': 'commercial',
        'ПРОМЫШЛЕННОСТЬ': 'industrial',
        'ИНФРАСТРУКТУРА': 'infrastructure'
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const categoryText = tab.textContent.trim().toUpperCase();
            const selectedCat = categoryMap[categoryText] || 'all';

            productCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (selectedCat === 'all' || cardCat === selectedCat) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // 3. NEWS (GRID/LIST VIEW, SORTING, FILTERING)
    // ==========================================
    const viewButtons = document.querySelectorAll('.view-group .view-opt');
    const newsCardsContainer = document.querySelector('.news-cards, .news-grid');

    // Grid / List View Toggle
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (btn.textContent.trim() === 'Список') {
                newsCardsContainer?.classList.add('list-view');
            } else {
                newsCardsContainer?.classList.remove('list-view');
            }
        });
    });

    // Date / Popularity Sorting
    const sortButtons = document.querySelectorAll('.sort-group .sort-opt');
    sortButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sortButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const isByViews = btn.textContent.trim().includes('популярности');
            sortNews(isByViews);
        });
    });

    function sortNews(byViews) {
        const container = document.querySelector('.news-cards, .news-grid');
        if (!container) return;
        const cards = Array.from(container.querySelectorAll('.news-card'));

        cards.sort((a, b) => {
            if (byViews) {
                const viewsA = parseInt(a.getAttribute('data-views') || 0, 10);
                const viewsB = parseInt(b.getAttribute('data-views') || 0, 10);
                return viewsB - viewsA;
            } else {
                const dateA = new Date(a.getAttribute('data-date') || '');
                const dateB = new Date(b.getAttribute('data-date') || '');
                return dateB - dateA;
            }
        });

        cards.forEach(card => container.appendChild(card));
    }

    // Sidebar Category Filter
    const newsCategories = document.querySelectorAll('.news-sidebar .news-cat');
    const newsCards = document.querySelectorAll('.news-grid .news-card');

    newsCategories.forEach(cat => {
        cat.addEventListener('click', (e) => {
            e.preventDefault();
            newsCategories.forEach(c => c.classList.remove('active'));
            cat.classList.add('active');

            const selectedCategory = cat.getAttribute('data-category') || 'all';
            newsCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (selectedCategory === 'all' || cardCat === selectedCategory) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // 4. HAMBURGER MOBILE MENU
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav');

    hamburger?.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        navMenu?.classList.toggle('mobile-open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('open');
            navMenu?.classList.remove('mobile-open');
            hamburger?.setAttribute('aria-expanded', 'false');
        });
    });

    // ==========================================
    // 5. SEARCH OVERLAY
    // ==========================================
    const searchButtons = document.querySelectorAll('.search-btn, .footer-search-btn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('.search-input');

    searchButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            searchOverlay?.classList.add('open');
            setTimeout(() => searchInput?.focus(), 100);
        });
    });

    searchClose?.addEventListener('click', () => {
        searchOverlay?.classList.remove('open');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchOverlay?.classList.remove('open');
        }
    });

});
