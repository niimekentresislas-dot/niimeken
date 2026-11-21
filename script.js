/* ==========================================================================
   NII MEKEN - Script de Interacciones, Transiciones y Animaciones al Deslizar
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Reading Progress Bar & Back to Top Toggle
    const progressBar = document.getElementById('readingProgress');
    const backToTopBtn = document.getElementById('backToTop');
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        // Update progress bar
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }

        // Header shadow
        if (header) {
            if (winScroll > 40) {
                header.style.boxShadow = '0 6px 20px rgba(7, 30, 22, 0.08)';
            } else {
                header.style.boxShadow = 'none';
            }
        }

        // Back to top button visibility
        if (backToTopBtn) {
            if (winScroll > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    // Back to top click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 2. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('active');
        });

        // Close menu when clicking a navigation link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('active');
            });
        });
    }

    // 3. Smooth Anchor Scrolling & Highlight Active Navigation Section on Scroll
    const sections = document.querySelectorAll('section[id]');
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active link manually on click
                navLinks.forEach(link => link.classList.remove('active'));
                const matchedNav = document.querySelector(`.nav-link[href="${targetId}"]`);
                if (matchedNav) matchedNav.classList.add('active');
            }
        });
    });

    function highlightNav() {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
            
            if (correspondingLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
    window.addEventListener('scroll', highlightNav);

    // 4. Scroll Reveal Transitions (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('is-revealed'));
    }

    // 5. Dynamic Counter Animation for Impact Metrics
    const metricSection = document.getElementById('impacto');
    let countersStarted = false;

    function animateCounters() {
        const counterValues = document.querySelectorAll('.metric-value');
        counterValues.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
            const prefix = counter.getAttribute('data-prefix') || '';
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 1800; // milliseconds
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic formula
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentNumber = Math.floor(easeOut * target);

                counter.textContent = `${prefix}${currentNumber}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = `${prefix}${target}${suffix}`;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    if (metricSection && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.25 });

        counterObserver.observe(metricSection);
    }

    // 6. Product Category Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 7. Product Modal Details
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');
    const detailTriggers = document.querySelectorAll('.detail-trigger');
    const modalActionBtn = document.querySelector('.modal-action-btn');

    detailTriggers.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const title = button.getAttribute('data-title');
            const info = button.getAttribute('data-info');

            modalTitle.textContent = title;
            modalBody.innerHTML = `
                <p>${info}</p>
                <div style="margin-top: 1.2rem; padding: 1rem; background: #f4eee3; border-radius: 8px; font-size: 0.88rem; color: #16654a; border-left: 3px solid #22c55e;">
                    <strong>✦ Producción 100% comunitaria:</strong> Cada creación es elaborada por artesanas y productores de la Comunidad Nativa Tres Islas con castaña amazónica, cacao silvestre, resina de sangre de grado y bálsamo de copaiba en Madre de Dios.
                </div>
            `;
            modal.classList.add('open');
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('open');
        });
    }

    if (modalActionBtn) {
        modalActionBtn.addEventListener('click', () => {
            modal.classList.remove('open');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });

    // 8. Interactive 3D Card Hover Tilt on Desktop
    if (window.matchMedia('(hover: hover) and (min-width: 992px)').matches) {
        const tiltCards = document.querySelectorAll('.interactive-card, .social-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });
    }

    // 9. Interactive Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando mensaje...';

            setTimeout(() => {
                formFeedback.className = 'form-feedback success';
                formFeedback.textContent = '¡Gracias por comunicarte con Nii Meken! Tu mensaje ha sido recibido por la comunidad y te responderemos pronto.';
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;

                setTimeout(() => {
                    formFeedback.style.display = 'none';
                    formFeedback.className = 'form-feedback';
                }, 7000);
            }, 800);
        });
    }
});
