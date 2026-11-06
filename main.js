/**
 * Aggarwal Toy Store - Interactive GSAP Animations & Core Logic
 * High performance, smooth animations, dynamic wholesale calculator & modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 0. Dark / Light Theme Manager
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);
  updateThemeIcon(initialTheme);

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'dark') {
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun" style="color: #fbbf24;"></i>';
      themeToggleBtn.setAttribute('title', 'Switch to Light Theme');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Light Theme');
    } else {
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      themeToggleBtn.setAttribute('title', 'Switch to Dark Theme');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Theme');
    }
  }

  themeToggleBtn?.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', activeTheme);
    localStorage.setItem('theme', activeTheme);
    updateThemeIcon(activeTheme);
  });

  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('mobile-open');
      mobileToggle.classList.toggle('active', isOpen);
    });

    // Close when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        mobileToggle.classList.remove('active');
      });
    });

    // Close when clicking outside navbar on mobile
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
        mobileToggle.classList.remove('active');
      }
    });
  }

  // 2. Navbar Shadow on Scroll
  const navbar = document.querySelector('.navbar');
  const fabScrollTop = document.getElementById('fabScrollTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
      fabScrollTop?.classList.add('visible');
    } else {
      navbar?.classList.remove('scrolled');
      fabScrollTop?.classList.remove('visible');
    }
  });

  if (fabScrollTop) {
    fabScrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. GSAP Animations & Micro-Interactions
  if (typeof gsap !== 'undefined') {
    // Register ScrollTrigger if loaded
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Section Staggered Entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl.from('.hero-badge-pill', {
      opacity: 0,
      y: -20,
      duration: 0.7,
      delay: 0.2
    })
    .from('.hero-title', {
      opacity: 0,
      y: 35,
      duration: 0.9
    }, '-=0.4')
    .from('.hero-subtitle', {
      opacity: 0,
      y: 25,
      duration: 0.8
    }, '-=0.5')
    .from('.hero-cta-group .btn', {
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.6
    }, '-=0.4')
    .from('.hero-trust-item', {
      opacity: 0,
      x: -15,
      stagger: 0.1,
      duration: 0.5
    }, '-=0.3')
    .from('.hero-main-card', {
      opacity: 0,
      scale: 0.92,
      duration: 1
    }, '-=0.9')
    .from('.floating-badge', {
      opacity: 0,
      scale: 0.7,
      stagger: 0.2,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.5');

    // Continuous Gentle Floating Animation for Glass Badges (Desktop Only)
    if (window.innerWidth > 1080) {
      gsap.to('.floating-badge.badge-1', {
        y: 12,
        rotation: 1.5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.floating-badge.badge-2', {
        y: -14,
        rotation: -1.5,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5
      });

      gsap.to('.floating-badge.badge-3', {
        y: 10,
        rotation: 1,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1
      });
    }

    // ScrollTrigger Animated Counters
    if (typeof ScrollTrigger !== 'undefined') {
      // Counter animation
      const statElements = document.querySelectorAll('.stat-number');
      if (statElements.length > 0) {
        ScrollTrigger.create({
          trigger: '.stats-section',
          start: 'top 85%',
          once: true,
          onEnter: () => {
            statElements.forEach(el => {
              const targetAttr = el.getAttribute('data-target');
              if (!targetAttr) return; // Skip placeholders like XXXXXX

              const target = parseInt(targetAttr, 10);
              if (isNaN(target)) return;

              const suffix = el.getAttribute('data-suffix') || '';
              const prefix = el.getAttribute('data-prefix') || '';
              let obj = { val: 0 };

              gsap.to(obj, {
                val: target,
                duration: 2,
                ease: 'power2.out',
                onUpdate: () => {
                  el.innerText = `${prefix}${Math.floor(obj.val).toLocaleString('en-IN')}${suffix}`;
                }
              });
            });
          }
        });
      }

      // Safely refresh ScrollTrigger
      ScrollTrigger.refresh();
    }
  }

  // 4. Category Filtering System (Immediate Visibility Guarantee)
  const filterButtons = document.querySelectorAll('.category-tab-btn');
  const categoryCards = document.querySelectorAll('.category-card');

  // Ensure all cards are 100% visible immediately on initial load
  categoryCards.forEach(card => {
    card.style.display = 'flex';
    card.style.opacity = '1';
    card.style.visibility = 'visible';
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      categoryCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.visibility = 'visible';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(card, { opacity: 0.4, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
          } else {
            card.style.opacity = '1';
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Interactive Wholesale Order & Margin Estimator
  const toyTypeSelect = document.getElementById('calcToyType');
  const orderQtyRange = document.getElementById('calcOrderQty');
  const qtyDisplay = document.getElementById('calcQtyDisplay');
  const tierDisplay = document.getElementById('calcTierDisplay');
  const discountDisplay = document.getElementById('calcDiscountDisplay');
  const marginDisplay = document.getElementById('calcMarginDisplay');
  const dispatchDisplay = document.getElementById('calcDispatchDisplay');
  const calcWhatsAppBtn = document.getElementById('calcWhatsAppBtn');

  function calculateWholesaleEstimate() {
    if (!orderQtyRange) return;
    const qty = parseInt(orderQtyRange.value, 10);
    const selectedToy = toyTypeSelect ? toyTypeSelect.value : 'General Wholesale Mix';

    if (qtyDisplay) {
      qtyDisplay.textContent = `${qty} Units`;
    }

    let tierName = 'Silver Partner';
    let discount = '15%';
    let estimatedMargin = '35% - 40%';
    let dispatchDays = '24-48 Hours';

    if (qty >= 1000) {
      tierName = 'Diamond Super-Stockist';
      discount = '35% Extra Off Factory Price';
      estimatedMargin = '50% - 60%';
      dispatchDays = 'Priority 24 Hours Express Freight';
    } else if (qty >= 500) {
      tierName = 'Platinum Wholesaler';
      discount = '28% Extra Off Factory Price';
      estimatedMargin = '45% - 52%';
      dispatchDays = '24-36 Hours';
    } else if (qty >= 200) {
      tierName = 'Gold Bulk Retailer';
      discount = '22% Extra Off Factory Price';
      estimatedMargin = '40% - 45%';
      dispatchDays = '24-48 Hours';
    } else {
      tierName = 'Silver Starter Lot';
      discount = '15% Off Wholesale Price';
      estimatedMargin = '35% - 40%';
      dispatchDays = '48 Hours';
    }

    if (tierDisplay) tierDisplay.textContent = tierName;
    if (discountDisplay) discountDisplay.textContent = discount;
    if (marginDisplay) marginDisplay.textContent = estimatedMargin;
    if (dispatchDisplay) dispatchDisplay.textContent = dispatchDays;

    if (calcWhatsAppBtn) {
      const waMsg = encodeURIComponent(
        `Hello Aggarwal Agencies! I am interested in bulk ordering:\n` +
        `• Category: ${selectedToy}\n` +
        `• Quantity: ${qty} units\n` +
        `• Tier: ${tierName}\n` +
        `Please share the wholesale price list and catalog for my store.`
      );
      calcWhatsAppBtn.href = `https://wa.me/919813387465?text=${waMsg}`;
    }
  }

  if (orderQtyRange) {
    orderQtyRange.addEventListener('input', calculateWholesaleEstimate);
  }
  if (toyTypeSelect) {
    toyTypeSelect.addEventListener('change', calculateWholesaleEstimate);
  }
  // Initial run
  calculateWholesaleEstimate();

  // 6. FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Optional: close other open items
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });

        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
  });

  // 7. Wholesale Quote Modal
  const modalBackdrop = document.getElementById('quoteModal');
  const openModalButtons = document.querySelectorAll('[data-open-modal]');
  const closeModalButtons = document.querySelectorAll('[data-close-modal]');
  const modalCategoryInput = document.getElementById('modalToyCategory');

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prefillCategory = btn.getAttribute('data-prefill');
      if (modalCategoryInput && prefillCategory) {
        modalCategoryInput.value = prefillCategory;
      }
      modalBackdrop?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  closeModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modalBackdrop?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // 8. Form Submission Handlers (Contact & Modal)
  const contactForm = document.getElementById('wholesaleContactForm');
  const modalForm = document.getElementById('modalQuoteForm');

  function showToast(message) {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="toast-icon">✓</span> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const shopName = document.getElementById('cfShopName')?.value || 'Retailer';
      const city = document.getElementById('cfCity')?.value || 'India';
      const phone = document.getElementById('cfPhone')?.value || '';
      const category = document.getElementById('cfCategory')?.value || 'Bulk Toys';
      const qty = document.getElementById('cfQty')?.value || 'Bulk';
      const note = document.getElementById('cfMessage')?.value || '';

      const waText = encodeURIComponent(
        `*New Wholesale Inquiry for Aggarwal Agencies*\n` +
        `• Business: ${shopName}\n` +
        `• Location: ${city}\n` +
        `• Phone: ${phone}\n` +
        `• Category: ${category}\n` +
        `• Quantity: ${qty}\n` +
        `• Details: ${note}`
      );

      showToast(`Thank you ${shopName}! Opening WhatsApp to connect with our wholesale desk...`);
      contactForm.reset();

      setTimeout(() => {
        window.open(`https://wa.me/919813387465?text=${waText}`, '_blank');
      }, 1200);
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('mqName')?.value || 'Customer';
      const phone = document.getElementById('mqPhone')?.value || '';
      const cat = document.getElementById('modalToyCategory')?.value || 'Bulk Toys';

      modalBackdrop?.classList.remove('open');
      document.body.style.overflow = '';

      showToast(`Thank you ${name}! Wholesale catalog & price list sent to your WhatsApp (${phone}).`);
      modalForm.reset();
    });
  }
});
