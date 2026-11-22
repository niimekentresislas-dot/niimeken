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

    // =========================================================================
    // 7. Interactive Product Options (Weight, Quantity, Cart & WhatsApp)
    // =========================================================================
    const WHATSAPP_PHONE = '51972471475';
    let cart = [];

    // Weight selection buttons
    const weightButtons = document.querySelectorAll('.weight-btn');
    weightButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('.weight-selector');
            if (container) {
                container.querySelectorAll('.weight-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });

    // Quantity selectors (+ and -)
    const qtySelectors = document.querySelectorAll('.qty-selector');
    qtySelectors.forEach(selector => {
        const minusBtn = selector.querySelector('.qty-minus');
        const plusBtn = selector.querySelector('.qty-plus');
        const input = selector.querySelector('.qty-input');
        const card = selector.closest('.product-card');
        const isSoap = card ? card.getAttribute('data-is-soap') === 'true' : false;
        const maxStock = isSoap ? 20 : 10;

        minusBtn.addEventListener('click', () => {
            let val = parseInt(input.value, 10) || 1;
            if (val > 1) {
                input.value = val - 1;
            }
        });

        plusBtn.addEventListener('click', () => {
            let val = parseInt(input.value, 10) || 1;
            if (val < maxStock) {
                input.value = val + 1;
            } else {
                showToast(`Máximo ${maxStock} unidades por pedido web.`);
            }
        });
    });

    // Direct WhatsApp Button on each card
    const whatsappDirectButtons = document.querySelectorAll('.btn-whatsapp-direct');
    whatsappDirectButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card');
            if (!card) return;

            const name = card.getAttribute('data-product-name');
            const isSoap = card.getAttribute('data-is-soap') === 'true';
            const qtyInput = card.querySelector('.qty-input');
            const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
            
            let weightInfo = '';
            if (isSoap) {
                const activeWeightBtn = card.querySelector('.weight-btn.active');
                const weight = activeWeightBtn ? activeWeightBtn.getAttribute('data-weight') : '80gr';
                weightInfo = `\n• Presentación: *${weight}*`;
            }

            const message = `Hola Nii Meken! Deseo adquirir el siguiente producto:
🌿 *${name}*${weightInfo}
• Cantidad: *${qty} unidad(es)*

⏳ Entiendo que la producción es artesanal y los envíos se preparan con 1 semana de anticipación (stock máx. 20 unidades).

¿Podrían confirmarme la disponibilidad para coordinar el envío? ¡Muchas gracias!`;

            const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    });

    // Add to Cart on each card
    const addCartButtons = document.querySelectorAll('.btn-add-cart');
    addCartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card');
            if (!card) return;

            const id = card.getAttribute('data-product-id');
            const name = card.getAttribute('data-product-name');
            const isSoap = card.getAttribute('data-is-soap') === 'true';
            const qtyInput = card.querySelector('.qty-input');
            const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
            
            let weight = 'Unidad';
            if (isSoap) {
                const activeWeightBtn = card.querySelector('.weight-btn.active');
                weight = activeWeightBtn ? activeWeightBtn.getAttribute('data-weight') : '80gr';
            }

            addToCart({
                id: `${id}-${weight}`,
                productId: id,
                name: name,
                weight: weight,
                qty: qty,
                isSoap: isSoap
            });

            // Button visual feedback
            const originalText = btn.innerHTML;
            btn.innerHTML = `✓ <span>¡Añadido!</span>`;
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 1200);

            showToast(`✓ Añadido: ${qty}x ${name} (${weight})`);
            openCartDrawer();
        });
    });

    // =========================================================================
    // Cart Drawer & Cart State Management
    // =========================================================================
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const navCartBtn = document.getElementById('navCartBtn');
    const floatingCartBtn = document.getElementById('floatingCartBtn');
    const navCartCount = document.getElementById('navCartCount');
    const floatCartBadge = document.getElementById('floatCartBadge');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotalCount = document.getElementById('cartTotalCount');
    const whatsappCheckoutBtn = document.getElementById('whatsappCheckoutBtn');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const cartBulkHint = document.getElementById('cartBulkHint');
    const cartSoapLimitAlert = document.getElementById('cartSoapLimitAlert');

    function openCartDrawer() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.add('open');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeCartDrawer() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.remove('open');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (navCartBtn) navCartBtn.addEventListener('click', openCartDrawer);
    if (floatingCartBtn) floatingCartBtn.addEventListener('click', openCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

    function addToCart(item) {
        const existing = cart.find(i => i.id === item.id);
        if (existing) {
            const max = item.isSoap ? 20 : 10;
            existing.qty = Math.min(existing.qty + item.qty, max);
        } else {
            cart.push(item);
        }
        updateCartUI();
    }

    function removeFromCart(id) {
        cart = cart.filter(i => i.id !== id);
        updateCartUI();
    }

    function changeCartItemQty(id, delta) {
        const item = cart.find(i => i.id === id);
        if (item) {
            const max = item.isSoap ? 20 : 10;
            item.qty += delta;
            if (item.qty <= 0) {
                removeFromCart(id);
                return;
            }
            if (item.qty > max) {
                item.qty = max;
                showToast(`Stock máximo de ${max} unidades alcanzado.`);
            }
            updateCartUI();
        }
    }

    function updateCartUI() {
        const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
        const totalSoaps = cart.filter(i => i.isSoap).reduce((acc, item) => acc + item.qty, 0);

        if (navCartCount) navCartCount.textContent = totalItems;
        if (floatCartBadge) floatCartBadge.textContent = totalItems;
        if (cartTotalCount) cartTotalCount.textContent = `${totalItems} ${totalItems === 1 ? 'artículo' : 'artículos'}`;

        // Soap limit check (max 20 soaps)
        if (totalSoaps > 20) {
            if (cartBulkHint) cartBulkHint.style.display = 'block';
            if (cartSoapLimitAlert) cartSoapLimitAlert.style.color = '#dc2626';
        } else {
            if (cartBulkHint) cartBulkHint.style.display = 'none';
            if (cartSoapLimitAlert) cartSoapLimitAlert.style.color = 'var(--color-forest-leaf)';
        }

        // Render Cart Items
        if (cartItemsList) {
            if (cart.length === 0) {
                cartItemsList.innerHTML = `
                    <div class="cart-empty-state">
                        <div class="cart-empty-icon">🌿</div>
                        <h4>Tu carrito está vacío</h4>
                        <p>Selecciona tus jabones de cacao y castaña o joyería Shipibo en el catálogo.</p>
                    </div>
                `;
                if (whatsappCheckoutBtn) {
                    whatsappCheckoutBtn.style.opacity = '0.5';
                    whatsappCheckoutBtn.style.pointerEvents = 'none';
                }
            } else {
                if (whatsappCheckoutBtn) {
                    whatsappCheckoutBtn.style.opacity = '1';
                    whatsappCheckoutBtn.style.pointerEvents = 'auto';
                }

                cartItemsList.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-meta">${item.weight !== 'Unidad' ? `Presentación: ${item.weight}` : 'Pieza artesanal'}</div>
                        </div>
                        <div class="cart-item-qty-wrap">
                            <button type="button" class="cart-item-qty-btn" onclick="window.changeCartQty('${item.id}', -1)" aria-label="Disminuir">-</button>
                            <span class="cart-item-qty-val">${item.qty}</span>
                            <button type="button" class="cart-item-qty-btn" onclick="window.changeCartQty('${item.id}', 1)" aria-label="Aumentar">+</button>
                            <button type="button" class="cart-item-remove" onclick="window.removeCartItem('${item.id}')" aria-label="Eliminar">&times;</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Build WhatsApp Checkout Link
        if (whatsappCheckoutBtn && cart.length > 0) {
            let itemsText = cart.map(i => `* ${i.qty}x ${i.name} (${i.weight})`).join('\n');
            const totalText = `${totalItems} ${totalItems === 1 ? 'artículo' : 'artículos'}`;
            
            const message = `Hola Nii Meken! Deseo realizar el siguiente pedido:

${itemsText}

Total: *${totalText}*
⏳ Entiendo que la elaboración es artesanal y los envíos se preparan con 1 semana de anticipación (stock máx. 20 unidades).

¿Podrían confirmarme la disponibilidad para coordinar la entrega y el pago? ¡Muchas gracias!`;

            whatsappCheckoutBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
        }
    }

    window.changeCartQty = changeCartItemQty;
    window.removeCartItem = removeFromCart;

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart = [];
            updateCartUI();
            showToast('Carrito vaciado');
        });
    }

    // Toast function
    const toast = document.getElementById('cartToast');
    let toastTimeout;
    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }

    // =========================================================================
    // 8. Product Modal Details (Resumen Conciso y Eficaz)
    // =========================================================================
    const productDescriptions = {
        'beneficios-cacao': {
            title: 'Jabón de Cacao Puro con Sangre de Grado y Copaiba',
            presentaciones: '80gr, 40gr y 15gr',
            beneficios: [
                'Regeneración celular profunda y cicatrización dérmica natural.',
                'Alivio eficaz de irritaciones, dermatitis, sequedad y rojeces.',
                'Alta concentración de flavonoides antioxidantes del cacao silvestre.',
                'Fórmula 100% botánica, biodegradable y libre de químicos sintéticos.'
            ],
            ingredientes: 'Manteca de cacao silvestre (Theobroma cacao), látex de Sangre de Grado (Croton lechleri), resina medicinal de Copaiba (Copaifera officinalis).',
            recomendado: 'Piel seca, sensible, madura o expuesta al clima tropical y sol.',
            aviso: 'Stock limitado a máx. 20 unidades por pedido web. Envíos preparados con 1 semana de anticipación.'
        },
        'beneficios-castana': {
            title: 'Jabón de Castaña Amazónica con Sangre de Grado y Copaiba',
            presentaciones: '80gr, 40gr y 15gr',
            beneficios: [
                'Nutrición intensiva rica en Selenio orgánico y Vitamina E pura de Madre de Dios.',
                'Restaura y refuerza la barrera lipídica, combatiendo la deshidratación dérmica.',
                'Efecto balsámico protector y antiséptico proporcionado por la Copaiba.',
                'Espuma cremosa y suave que deja la piel tersa, elástica y protegida.'
            ],
            ingredientes: 'Aceite puro de castaña amazónica prensado en frío (Bertholletia excelsa), resina de Sangre de Grado, aceite de Copaiba.',
            recomendado: 'Todo tipo de piel, cuidado diario facial y corporal, prevención de resequedad.',
            aviso: 'Stock limitado a máx. 20 unidades por pedido web. Envíos preparados con 1 semana de anticipación.'
        },
        'beneficios-collar': {
            title: 'Collar Artesanal Shipibo en Mostacilla y Semillas',
            presentaciones: 'Pieza única hecha a mano',
            beneficios: [
                'Confección 100% manual por maestras artesanas de la Comunidad Tres Islas.',
                'Semillas nativas recolectadas sin talar ni dañar el bosque vivo.',
                'Alta durabilidad con hilo reforzado y mostacillas seleccionadas.',
                'Comercio justo que retribuye dignamente el talento de las artesanas locales.'
            ],
            ingredientes: 'Mostacillas finas seleccionadas, semillas nativas amazónicas, hilo de alta resistencia.',
            recomendado: 'Uso cotidiano, ocasiones especiales y regalo de moda consciente con propósito.',
            aviso: 'Piezas exclusivas. Envíos coordinados con 1 semana de anticipación.'
        },
        'beneficios-aretes': {
            title: 'Set de Aretes y Pulsera de Artesanía Shipibo',
            presentaciones: 'Conjunto de aretes + pulsera',
            beneficios: [
                'Tejido manual flexible, sumamente liviano y cómodo para todo el día.',
                'Acabados hipoalergénicos suaves con la piel.',
                'Expresión de la herencia cultural y estética ancestral Shipibo.',
                'Genera autonomía económica directa para mujeres artesanas de la comunidad.'
            ],
            ingredientes: 'Mostacillas finas, semillas nativas y acabados hipoalergénicos.',
            recomendado: 'Accesorio versátil y contemporáneo de identidad amazónica.',
            aviso: 'Piezas exclusivas. Envíos coordinados con 1 semana de anticipación.'
        },
        'beneficios-cofre': {
            title: 'Cofre de Bienestar Amazónico Nii Meken',
            presentaciones: 'Cofre completo con 3 creaciones',
            beneficios: [
                '1 Jabón de Cacao con Sangre de Grado y Copaiba (80gr).',
                '1 Jabón de Castaña con Sangre de Grado y Copaiba (80gr).',
                '1 Joya artesanal Shipibo tejida a mano con semillas nativas.',
                'Caja ecológica biodegradable de fibra vegetal de la comunidad.'
            ],
            ingredientes: 'Insumos 100% botánicos amazónicos y artesanía comunitaria de Tres Islas.',
            recomendado: 'La experiencia completa de autocuidado y el regalo consciente ideal.',
            aviso: 'Edición artesanal. Envíos preparados con 1 semana de anticipación.'
        }
    };

    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');
    const detailTriggers = document.querySelectorAll('.detail-trigger');
    const modalActionBtn = document.querySelector('.modal-action-btn');

    detailTriggers.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const key = button.getAttribute('data-info');
            const data = productDescriptions[key];

            if (data) {
                modalTitle.textContent = data.title;
                modalBody.innerHTML = `
                    <div style="margin-bottom: 0.8rem; font-size: 0.82rem; color: #b84c30; font-weight: 700; text-transform: uppercase;">
                        📦 Presentación: ${data.presentaciones}
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <strong style="color: #0c2d22; font-size: 0.9rem; display: block; margin-bottom: 0.4rem;">✦ Beneficios Clave:</strong>
                        <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.88rem; color: #1e293b;">
                            ${data.beneficios.map(b => `<li style="position: relative; padding-left: 1.2rem;"><span style="position: absolute; left: 0; color: #22c55e; font-weight: 700;">✓</span> ${b}</li>`).join('')}
                        </ul>
                    </div>
                    <div style="font-size: 0.84rem; color: #576574; margin-bottom: 0.8rem; line-height: 1.5;">
                        <strong style="color: #0c2d22;">Ingredientes:</strong> ${data.ingredientes}
                    </div>
                    <div style="font-size: 0.84rem; color: #576574; margin-bottom: 1rem; line-height: 1.5;">
                        <strong style="color: #0c2d22;">Recomendado:</strong> ${data.recomendado}
                    </div>
                    <div style="background: #fefce8; border: 1px solid #fef08a; padding: 0.75rem 0.9rem; border-radius: 8px; font-size: 0.82rem; color: #854d0e; line-height: 1.45; margin-bottom: 1rem;">
                        <strong>⏳ Aviso de Producción:</strong> ${data.aviso}
                    </div>
                    <div>
                        <a href="https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`Hola Nii Meken! Deseo consultar o realizar un pedido de: ${data.title} (stock máx. 20 unidades, preparado con 1 semana de anticipación).`)}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: #25D366; color: white; padding: 0.75rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.9rem; text-decoration: none;">
                            Pedir por WhatsApp (972471475) ↗
                        </a>
                    </div>
                `;
            }
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
