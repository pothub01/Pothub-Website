// PotHub Wishlist System
(function() {
  'use strict';

  window.PotHub = window.PotHub || {};
  const Wishlist = window.PotHub.Wishlist = {};
  const STORAGE_KEY = 'pothub_wishlist';

  Wishlist.items = [];

  Wishlist.init = function() {
    Wishlist.load();
    Wishlist.bindEvents();
  };

  Wishlist.load = function() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      Wishlist.items = data ? JSON.parse(data) : [];
    } catch (e) {
      Wishlist.items = [];
    }
    Wishlist.updateBadge();
  };

  Wishlist.save = function() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Wishlist.items));
    Wishlist.updateBadge();
    window.dispatchEvent(new CustomEvent('wishlist-updated'));
  };

  Wishlist.add = function(productId) {
    if (!Wishlist.items.includes(productId)) {
      Wishlist.items.push(productId);
      Wishlist.save();
      if (PotHub.App) PotHub.App.toast('Added to wishlist', 'success');
    }
  };

  Wishlist.remove = function(productId) {
    Wishlist.items = Wishlist.items.filter(id => id !== productId);
    Wishlist.save();
    if (PotHub.App) PotHub.App.toast('Removed from wishlist', 'success');

    // Re-render wishlist page if on it
    const grid = document.getElementById('wishlist-grid');
    if (grid) Wishlist.renderPage();
  };

  Wishlist.toggle = function(productId) {
    if (Wishlist.has(productId)) {
      Wishlist.remove(productId);
    } else {
      Wishlist.add(productId);
    }
  };

  Wishlist.has = function(productId) {
    return Wishlist.items.includes(productId);
  };

  Wishlist.updateBadge = function() {
    const badges = document.querySelectorAll('[data-wishlist-count]');
    const count = Wishlist.items.length;
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  };

  Wishlist.renderPage = async function() {
    const grid = document.getElementById('wishlist-grid');
    if (!grid) return;

    if (Wishlist.items.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:80px 0;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:64px;height:64px;color:var(--color-text-muted);margin:0 auto 16px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:8px;">Your wishlist is empty</h2>
          <p style="color:var(--color-text-muted);margin-bottom:24px;">Save items you love for later.</p>
          <a href="shop.html" class="btn btn-primary">Explore Products</a>
        </div>
      `;
      return;
    }

    const products = await PotHub.Products.getAll();
    const wishlisted = products.filter(p => Wishlist.items.includes(p.id));

    grid.innerHTML = wishlisted.map(p => PotHub.Products.renderCard(p, { showWishlist: true })).join('');

    // Mark wishlist buttons as active
    grid.querySelectorAll('[data-wishlist]').forEach(btn => {
      btn.classList.add('active');
      const svg = btn.querySelector('svg');
      if (svg) svg.setAttribute('fill', 'currentColor');
    });
  };

  Wishlist.bindEvents = function() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-wishlist]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      const id = parseInt(btn.dataset.wishlist);
      Wishlist.toggle(id);

      btn.classList.toggle('active');
      const svg = btn.querySelector('svg');
      if (svg) svg.setAttribute('fill', btn.classList.contains('active') ? 'currentColor' : 'none');
    });
  };

  Wishlist.init();
})();
