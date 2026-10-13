/**
 * JOYJOS - Main Script
 * Handles interactivity, cookie consent, and analytics.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Year in Footer
    const yearEls = document.querySelectorAll('#footer-year, .footer-year');
    const currentYear = new Date().getFullYear();
    yearEls.forEach(el => el.textContent = currentYear);
    
    // Support for old document.write replacement if any element has class 'year-text'
    document.querySelectorAll('.year-text').forEach(el => el.textContent = currentYear);

    // 2. Email Link Obfuscation
    const initEmailLinks = () => {
        const u = 'hola', d = 'joyjos.eu';
        const email = `${u}@${d}`;
        const subject = encodeURIComponent('Quiero saber más — JOYJOS');
        const body = encodeURIComponent(
            `Hola Jose,\n\nMe interesa saber cómo puedes ayudar a mi negocio.\n\nMi negocio es: \nLo que más me quita tiempo o me preocupa: \n\nGracias.`
        );
        const href = `mailto:${email}?subject=${subject}&body=${body}`;

        document.querySelectorAll('[data-email-link]').forEach(el => {
            el.href = href;
            if (el.dataset.showEmail) el.textContent = email;
        });

        // Specific element for legal pages
        const privacyEl = document.getElementById('privacy-email');
        if (privacyEl) {
            privacyEl.innerHTML = `<a href="mailto:${email}" class="text-brand-light hover:underline">${email}</a>`;
        }
    };
    initEmailLinks();

    // 3. Google Analytics Logic
    const loadGA = () => {
        if (document.getElementById('ga-script')) return;
        const s = document.createElement('script');
        s.id = 'ga-script';
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=G-S5NCQJME5D';
        document.head.appendChild(s);
        s.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-S5NCQJME5D', { 'anonymize_ip': true });
        };
    };

    const removeGA = () => {
        document.cookie.split(';').forEach(c => {
            const name = c.trim().split('=')[0];
            if (name.startsWith('_ga') || name.startsWith('_gid')) {
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + location.hostname;
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            }
        });
    };

    // 4. Cookie Consent Management
    const cookieBanner = document.getElementById('cookie-banner');
    const getCookie = (name) => document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
    
    const setCookie = (name, value, days) => {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax; Secure`;
    };

    const getConsent = () => getCookie('joyjos_cookies') || localStorage.getItem('joyjos_cookies');
    const saveConsent = (value) => { 
        setCookie('joyjos_cookies', value, 365); 
        localStorage.setItem('joyjos_cookies', value); 
    };

    const consent = getConsent();
    if (cookieBanner) {
        if (!consent) {
            cookieBanner.classList.add('is-visible');
            document.body.classList.add('cookie-banner-active');
        } else if (consent === 'accepted') {
            loadGA();
        }

        document.getElementById('btn-accept-cookies')?.addEventListener('click', () => {
            saveConsent('accepted');
            cookieBanner.classList.add('is-hidden');
            document.body.classList.remove('cookie-banner-active');
            loadGA();
        });

        document.getElementById('btn-reject-cookies')?.addEventListener('click', () => {
            saveConsent('rejected');
            cookieBanner.classList.add('is-hidden');
            document.body.classList.remove('cookie-banner-active');
            removeGA();
        });
    } else {
        if (consent === 'accepted') loadGA();
        else if (consent === 'rejected') removeGA();
    }

    // 5. Scroll Animations
    const initScrollAnimations = () => {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { 
                    entry.target.classList.add('is-visible'); 
                    obs.unobserve(entry.target); 
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.15 });

        document.querySelectorAll('.animate-on-scroll:not(.is-visible)').forEach(el => observer.observe(el));
    };
    initScrollAnimations();

    // 6. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('nav-scrolled', window.scrollY > 50);
        });
    }

    // 7. Mobile Menu
    const menu = document.getElementById('mobile-menu');
    const toggleMobileMenu = () => {
        if (menu) menu.classList.toggle('is-open');
    };

    document.getElementById('btn-mobile-menu')?.addEventListener('click', toggleMobileMenu);
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
    });

    // 8. FAQ Toggles
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('is-open');
        });
    });

    // 9. 404 Page Specific Logic
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const left = Math.random() * 100;
            const duration = 8 + Math.random() * 12;
            const delay = Math.random() * 10;
            const drift = (Math.random() - 0.5) * 100;
            const size = 2 + Math.random() * 4;
            p.style.cssText = `
                left: ${left}%;
                bottom: -10px;
                width: ${size}px;
                height: ${size}px;
                --drift: ${drift}px;
                animation: float-particle ${duration}s ${delay}s linear infinite;
            `;
            particlesContainer.appendChild(p);
        }

        // Easter Egg: Konami Code
        const konamiCode = [38,38,40,40,37,39,37,39,66,65];
        let konamiIndex = 0;
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    const glitch = document.querySelector('.glitch-text');
                    if (glitch) {
                        glitch.style.color = '#25D366';
                        glitch.textContent = '🎮';
                    }
                    setTimeout(() => window.location.href = '/', 1000);
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });

        // 404 click interaction
        const glitch = document.querySelector('.glitch-text');
        if (glitch) {
            let clickCount = 0;
            const messages = ['🤖', '💀', '🔧', '🚀', '✨'];
            glitch.style.cursor = 'pointer';
            glitch.addEventListener('click', () => {
                clickCount++;
                if (clickCount <= messages.length) {
                    glitch.textContent = messages[clickCount - 1];
                    glitch.style.transition = 'transform 0.2s';
                    glitch.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        glitch.style.transform = 'scale(1)';
                    }, 200);
                    if (clickCount >= messages.length) {
                        setTimeout(() => {
                            glitch.textContent = '404';
                            clickCount = 0;
                        }, 1500);
                    }
                }
                setTimeout(() => {
                    if (clickCount < messages.length && clickCount > 0) {
                        glitch.textContent = '404';
                        clickCount = 0;
                    }
                }, 3000);
            });
        }
    }

    // 10. Event Tracking
    document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
        a.addEventListener('click', () => {
            if (window.gtag) {
                gtag('event', 'whatsapp_click', { 'source': a.closest('section')?.id || 'global' });
            }
        });
    });

    document.querySelectorAll('[data-email-link]').forEach(a => {
        a.addEventListener('click', () => {
            if (window.gtag) {
                gtag('event', 'email_click');
            }
        });
    });

    // 11. WebMCP Agent Discovery & Browser Tools (W3C / Chrome WebMCP)
    const initWebMCP = () => {
        if (!('modelContext' in navigator)) return;

        const tools = [
            {
                name: 'get_services',
                description: 'Obtiene el catálogo estructurado de servicios de JOYJOS: software de gestión a medida, webs para captación de leads y automatización de procesos.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        category: {
                            type: 'string',
                            enum: ['all', 'software', 'web', 'automation'],
                            description: 'Categoría de servicios a filtrar'
                        }
                    }
                },
                execute: async (args) => {
                    const services = [
                        {
                            id: 'software',
                            title: 'Software de gestión a medida',
                            description: 'Sistemas web y herramientas internas adaptadas a cómo funciona la empresa: paneles de control, seguimiento de pedidos, gestión de clientes o inventario para sustituir hojas de cálculo caóticas y programas genéricos.',
                            ideal_for: 'Empresas locales, pymes y autónomos cuyos procesos ya no caben en un Excel.'
                        },
                        {
                            id: 'web',
                            title: 'Webs para captación de leads',
                            description: 'Páginas web y landings ultrarrápidas, estructuradas para convertir visitas en clientes reales, con formularios directos y asistentes inteligentes que atienden dudas y cualifican contactos.',
                            ideal_for: 'Negocios sin web, con una web obsoleta o que no genera contactos comerciales.'
                        },
                        {
                            id: 'automation',
                            title: 'Automatización de procesos',
                            description: 'Conexión de las herramientas que ya se utilizan para eliminar el trabajo manual repetitivo: facturación, traspaso de datos entre aplicaciones, alertas internas y emails de confirmación.',
                            ideal_for: 'Cualquier negocio con tareas que se repiten a diario o cada semana.'
                        }
                    ];
                    if (args && args.category && args.category !== 'all') {
                        return services.filter(s => s.id === args.category);
                    }
                    return services;
                }
            },
            {
                name: 'get_pricing',
                description: 'Consulta cómo presupuesta JOYJOS sus proyectos, el diagnóstico inicial gratuito y las condiciones de garantía.',
                inputSchema: {
                    type: 'object',
                    properties: {}
                },
                execute: async () => {
                    return {
                        pricing: {
                            model: 'Sin tarifas fijas: cada proyecto se presupuesta según el beneficio real que aporta al negocio, con un presupuesto cerrado y claro, sin sorpresas.',
                            initial_diagnosis: 'Gratuito y sin compromiso'
                        },
                        guarantee: '30 días de soporte post-entrega con ajustes incluidos.'
                    };
                }
            },
            {
                name: 'request_diagnosis',
                description: 'Consulta los canales oficiales para solicitar el diagnóstico inicial gratuito o una propuesta de proyecto (software de gestión, web o automatización).',
                inputSchema: {
                    type: 'object',
                    properties: {
                        business_name: { type: 'string', description: 'Nombre o sector del negocio' },
                        needs: { type: 'string', description: 'Qué se quiere resolver: gestión interna, captación de clientes o tareas repetitivas' }
                    }
                },
                execute: async (args) => {
                    return {
                        whatsapp: 'https://wa.me/34620193975',
                        email: 'hola@joyjos.eu',
                        founder: 'José G. Palacio',
                        process: 'Diagnóstico en ~15 min, propuesta en 24-48 h, entrega en 1-4 semanas con 30 días de soporte post-entrega.',
                        submitted_data: args || {}
                    };
                }
            }
        ];

        try {
            if (typeof navigator.modelContext.provideContext === 'function') {
                navigator.modelContext.provideContext({ tools });
            }
            if (typeof navigator.modelContext.registerTool === 'function') {
                const controller = new AbortController();
                tools.forEach(tool => {
                    try {
                        navigator.modelContext.registerTool(tool, { signal: controller.signal });
                    } catch (_) {}
                });
            }
        } catch (e) {
            console.debug('WebMCP registration:', e);
        }
    };
    initWebMCP();
});

