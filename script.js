/* ==========================================================================
   NIIMEKEN - Script de Interacciones y Funcionalidades
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
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

    // 2. Sticky Header Shadow on Scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.style.boxShadow = '0 6px 20px rgba(7, 30, 22, 0.08)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // 3. Highlight Active Navigation Section
    const sections = document.querySelectorAll('section[id]');
    function highlightNav() {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
            
            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
    window.addEventListener('scroll', highlightNav);

    // 4. Product Category Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.4s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 5. Product Modal Details
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
                <div style="margin-top: 1.2rem; padding: 1rem; background: #f4eee3; border-radius: 8px; font-size: 0.88rem; color: #16654a;">
                    <strong>✦ Producción 100% comunitaria:</strong> Cada pieza es realizada por artesanas de la comunidad nativa de Tres Islas y productores de cacao orgánico agroforestal.
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

    // Close modal on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });

    // 6. Interactive Contact Form Handler
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
                formFeedback.textContent = '¡Gracias por tu mensaje y por apoyar a la comunidad! Nos pondremos en contacto contigo a la brevedad.';
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
