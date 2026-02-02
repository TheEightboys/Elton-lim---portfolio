/* ============================================
   ELTON LIM PORTFOLIO - MAIN JAVASCRIPT
   Scroll animations, navigation, and interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // LOADER - Removed per user request
    // ========================================


    // ========================================
    // NAVIGATION
    // ========================================
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Scroll effect on navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');

    function highlightNav() {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);

    // ========================================
    // SMOOTH SCROLL
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    const revealElements = document.querySelectorAll('[data-aos]');

    const revealOnScroll = () => {
        revealElements.forEach((el, index) => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            const delay = el.dataset.aosDelay || 0;

            if (elementTop < window.innerHeight - elementVisible) {
                setTimeout(() => {
                    el.classList.add('aos-animate');
                }, delay);
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Section visibility
    const sectionElements = document.querySelectorAll('.section');

    const revealSections = () => {
        sectionElements.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight - 100) {
                section.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealSections);
    revealSections();

    // Timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');

    const revealTimeline = () => {
        timelineItems.forEach((item, index) => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < window.innerHeight - 100) {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 200);
            }
        });
    };

    window.addEventListener('scroll', revealTimeline);
    revealTimeline();

    // ========================================
    // GSAP SCROLL ANIMATIONS
    // ========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero parallax
        gsap.to('.hero-image-wrapper', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Section headers
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    end: 'top 60%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Glass cards stagger (Excluding Contact section)
        gsap.utils.toArray('.glass-card:not(.contact-content .glass-card)').forEach((card, i) => {
            gsap.from(card, {
                y: 60,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Contact Section - IMMEDIATE VISIBILITY (No Delay)
        gsap.utils.toArray('.contact-content .glass-card').forEach((card) => {
            // Set initial state immediately to ensure visibility if JS lags
            gsap.set(card, { opacity: 0, y: 30 });

            gsap.to(card, {
                y: 0,
                opacity: 1,
                duration: 0.4, // Fast reveal
                delay: 0,     // strict zero delay
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 95%", // Activate almost immediately
                    toggleActions: "play none none none"
                }
            });
        });

        // Skill cards entrance
        gsap.utils.toArray('.skill-card').forEach((card, i) => {
            gsap.from(card, {
                scale: 0.8,
                opacity: 0,
                duration: 0.5,
                delay: i * 0.05,
                scrollTrigger: {
                    trigger: '.skills-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Timeline line animation
        gsap.from('.timeline::before', {
            scaleY: 0,
            transformOrigin: 'top',
            duration: 2,
            scrollTrigger: {
                trigger: '.timeline',
                start: 'top 60%',
                toggleActions: 'play none none none'
            }
        });
    }

    // ========================================
    // MOUSE PARALLAX EFFECT
    // ========================================
    const parallaxElements = document.querySelectorAll('.hero-image-wrapper, .section-header');

    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

        parallaxElements.forEach(el => {
            const speed = el.dataset.parallaxSpeed || 10;
            const x = mouseX * speed;
            const y = mouseY * speed;

            el.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // ========================================
    // CURSOR GLOW EFFECT
    // ========================================
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // ========================================
    // SCROLL PROGRESS INDICATOR
    // ========================================
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        scrollProgress.style.transform = `scaleX(${scrollPercent})`;
    });

    // ========================================
    // IMAGE LAZY LOADING
    // ========================================
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ========================================
    // CARD TILT EFFECT
    // ========================================
    const tiltCards = document.querySelectorAll('.glass-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // ========================================
    // COUNTER ANIMATION
    // ========================================
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // ========================================
    // TYPING EFFECT (Optional)
    // ========================================
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // ========================================
    // FOOTER YEAR
    // ========================================
    const yearElement = document.querySelector('.footer-copy');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
    }

    // ========================================
    // PRELOAD CRITICAL IMAGES
    // ========================================
    const criticalImages = [
        'assets/images/profile/profile.png'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    console.log('🎨 Elton Lim Portfolio loaded successfully!');

    // ========================================
    // GALLERY FILTER
    // ========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeInScale 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ========================================
    // GALLERY LIGHTBOX
    // ========================================
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img src="" alt="">
            <p class="lightbox-caption"></p>
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    // Open lightbox on image click
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-overlay span');

            lightboxImg.src = img.src;
            lightboxCaption.textContent = caption ? caption.textContent : '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'visible';
    }

    // ========================================
    // GALLERY GSAP ANIMATIONS
    // ========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Gallery items entrance
        gsap.utils.toArray('.gallery-item').forEach((item, i) => {
            gsap.from(item, {
                scale: 0.8,
                opacity: 0,
                duration: 0.5,
                delay: (i % 6) * 0.1,
                scrollTrigger: {
                    trigger: '.gallery-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }
});

// Add fadeInScale animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);
