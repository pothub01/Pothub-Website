// PotHub App Core
(function() {
  'use strict';

  window.PotHub = window.PotHub || {};
  const App = window.PotHub.App = {};

  // Initialize
  App.init = function() {
    App.loadComponents();
    App.initNavbar();
    App.initMobileNav();
    App.initSearch();
    App.initTheme();
    App.initCartDrawer();
    App.initBackToTop();
    App.initSmoothScroll();
    App.hideLoader();
  };

  // Load Navbar & Footer
  App.loadComponents = function() {
    const navContainer = document.getElementById('navbar-container');
    const footerContainer = document.getElementById('footer-container');

    if (navContainer) {
      fetch('components/navbar.html')
        .then(r => r.text())
        .then(html => {
          navContainer.innerHTML = html;
          App.initNavbar(); // re-init after load
          App.updateAuthUI();
          if (window.PotHub.Cart) PotHub.Cart.updateBadge();
          if (window.PotHub.Wishlist) PotHub.Wishlist.updateBadge();
        })
        .catch(() => {
          // Fallback minimal navbar
          navContainer.innerHTML = `<nav class="navbar scrolled"><div class="container navbar-inner"><a href="index.html" class="logo">PotHub</a></div></nav>`;
        });
    }

    if (footerContainer) {
      fetch('components/footer.html')
        .then(r => r.text())
        .then(html => footerContainer.innerHTML = html)
        .catch(() => {});
    }
  };

  // Navbar scroll effect
  App.initNavbar = function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const current = window.pageYOffset;
      if (current > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = current;
    }, { passive: true });
  };

  // Mobile Navigation
  App.initMobileNav = function() {
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('.mobile-toggle');
      const close = e.target.closest('.mobile-close');
      const mobileNav = document.querySelector('.mobile-nav');

      if (toggle && mobileNav) {
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
      }
      if (close && mobileNav) {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  };

  // Search Overlay
  App.initSearch = function() {
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-search-toggle]');
      const close = e.target.closest('[data-search-close]');

      if (trigger && overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => input && input.focus(), 100);
      }
      if (close && overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        if (input) input.value = '';
        if (results) results.innerHTML = '';
      }
    });

    if (input) {
      input.addEventListener('input', async (e) => {
        const q = e.target.value.trim().toLowerCase();
        if (!q || q.length < 2) { if (results) results.innerHTML = ''; return; }

        const products = await PotHub.Products.getAll();
        const filtered = products.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
        ).slice(0, 6);

        if (results) {
          results.innerHTML = filtered.length ? filtered.map(p => `
            <a href="product.html?id=${p.id}" class="search-result-item" onclick="document.getElementById('search-overlay').classList.remove('active'); document.body.style.overflow='';">
              <img src="${p.images[0]}" alt="${p.name}">
              <div>
                <div style="font-weight:600;">${p.name}</div>
                <div style="font-size:0.875rem;color:var(--color-text-muted);">$${p.price} · ${p.category}</div>
              </div>
            </a>
          `).join('') : '<div style="padding:12px;color:var(--color-text-muted);">No products found</div>';
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          window.location.href = 'shop.html?q=' + encodeURIComponent(input.value);
        }
      });
    }
  };

  // Theme Toggle
  App.initTheme = function() {
    const saved = localStorage.getItem('pothub-theme');
    if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-theme-toggle]');
      if (!btn) return;

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('pothub-theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('pothub-theme', 'dark');
      }
    });
  };

  // Cart Drawer
  App.initCartDrawer = function() {
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('[data-cart-toggle]');
      const close = e.target.closest('[data-cart-close]');
      const overlay = document.getElementById('cart-overlay');
      const drawer = document.getElementById('cart-drawer');

      if (toggle) {
        if (overlay) overlay.classList.add('active');
        if (drawer) drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (PotHub.Cart) PotHub.Cart.renderDrawer();
      }
      if (close || e.target === overlay) {
        if (overlay) overlay.classList.remove('active');
        if (drawer) drawer.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  };

  // Back to Top
  App.initBackToTop = function() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.pageYOffset > 600);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  // Smooth Scroll for anchors
  App.initSmoothScroll = function() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  // Toast System
  App.toast = function(message, type = 'success') {
    const container = document.getElementById('toast-container') || (() => {
      const c = document.createElement('div');
      c.id = 'toast-container';
      c.className = 'toast-container';
      document.body.appendChild(c);
      return c;
    })();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  };

  // Auth UI Update
  App.updateAuthUI = function() {
    const user = PotHub.Auth ? PotHub.Auth.getUser() : null;
    const accountLink = document.querySelector('[data-account-link]');
    if (accountLink) {
      accountLink.href = user ? 'account.html' : 'login.html';
    }
  };

  // Page Loader
  App.hideLoader = function() {
    const loader = document.getElementById('page-loader');
    if (loader) {
      setTimeout(() => loader.classList.add('hidden'), 300);
    }
  };

  // DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
  } else {
    App.init();
  }
})();
