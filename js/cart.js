// PotHub Cart System
(function() {
  'use strict';

  window.PotHub = window.PotHub || {};
  const Cart = window.PotHub.Cart = {};
  const STORAGE_KEY = 'pothub_cart';

  Cart.items = [];

  Cart.init = function() {
    Cart.load();
    Cart.bindEvents();
  };

  Cart.load = function() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      Cart.items = data ? JSON.parse(data) : [];
    } catch (e) {
      Cart.items = [];
    }
    Cart.updateBadge();
  };

  Cart.save = function() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Cart.items));
    Cart.updateBadge();
    Cart.dispatchUpdate();
  };

  Cart.dispatchUpdate = function() {
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: Cart.items }));
  };

  Cart.add = function(product, options = {}) {
    const { quantity = 1, color = null, size = null } = options;
    const existing = Cart.items.find(i => 
      i.id === product.id && i.color === color && i.size === size
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      Cart.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category,
        quantity,
        color,
        size,
        sku: product.sku
      });
    }

    Cart.save();
    Cart.renderDrawer();
    if (PotHub.App) PotHub.App.toast(`${product.name} added to cart`, 'success');
  };

  Cart.remove = function(id, color, size) {
    Cart.items = Cart.items.filter(i => !(i.id === id && i.color === color && i.size === size));
    Cart.save();
    Cart.renderDrawer();
    if (document.querySelector('.cart-page')) Cart.renderPage();
  };

  Cart.updateQuantity = function(id, color, size, delta) {
    const item = Cart.items.find(i => i.id === id && i.color === color && i.size === size);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      Cart.remove(id, color, size);
      return;
    }
    Cart.save();
    Cart.renderDrawer();
    if (document.querySelector('.cart-page')) Cart.renderPage();
  };

  Cart.setQuantity = function(id, color, size, qty) {
    const item = Cart.items.find(i => i.id === id && i.color === color && i.size === size);
    if (!item) return;
    item.quantity = Math.max(1, parseInt(qty) || 1);
    Cart.save();
    Cart.renderDrawer();
    if (document.querySelector('.cart-page')) Cart.renderPage();
  };

  Cart.clear = function() {
    Cart.items = [];
    Cart.save();
    Cart.renderDrawer();
    if (document.querySelector('.cart-page')) Cart.renderPage();
  };

  Cart.getTotal = function() {
    return Cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  };

  Cart.getCount = function() {
    return Cart.items.reduce((sum, i) => sum + i.quantity, 0);
  };

  Cart.updateBadge = function() {
    const badges = document.querySelectorAll('[data-cart-count]');
    const count = Cart.getCount();
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  };

  Cart.renderDrawer = function() {
    const body = document.getElementById('cart-body');
    const footer = document.getElementById('cart-footer');
    if (!body) return;

    if (Cart.items.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <h3 style="font-size:1.25rem;font-weight:600;">Your cart is empty</h3>
          <p style="color:var(--color-text-muted);">Discover our collection and add something beautiful.</p>
          <a href="shop.html" class="btn btn-secondary" onclick="document.getElementById('cart-overlay').classList.remove('active');document.getElementById('cart-drawer').classList.remove('active');document.body.style.overflow='';">Continue Shopping</a>
        </div>
      `;
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = 'block';

    const subtotal = Cart.getTotal();
    const shipping = subtotal > 100 ? 0 : 12;

    body.innerHTML = Cart.items.map(item => `
      <div class="cart-item" data-cart-id="${item.id}" data-color="${item.color || ''}" data-size="${item.size || ''}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">${item.color ? item.color + ' · ' : ''}${item.size ? item.size : ''}</div>
          <div class="cart-item-actions">
            <div class="qty-control">
              <button data-action="dec">−</button>
              <span>${item.quantity}</span>
              <button data-action="inc">+</button>
            </div>
            <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
          <button class="remove-item" data-action="remove">Remove</button>
        </div>
      </div>
    `).join('');

    if (footer) {
      footer.innerHTML = `
        <div class="cart-subtotal-row">
          <span>Subtotal</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="cart-subtotal-row">
          <span>Shipping ${shipping === 0 ? '(Free over $100)' : ''}</span>
          <span>$${shipping.toFixed(2)}</span>
        </div>
        <div class="cart-subtotal-row total">
          <span>Total</span>
          <span>$${(subtotal + shipping).toFixed(2)}</span>
        </div>
        <a href="checkout.html" class="btn btn-primary" onclick="document.getElementById('cart-overlay').classList.remove('active');document.getElementById('cart-drawer').classList.remove('active');document.body.style.overflow='';">Checkout</a>
        <a href="cart.html" class="btn btn-secondary" style="margin-top:12px;width:100%;" onclick="document.getElementById('cart-overlay').classList.remove('active');document.getElementById('cart-drawer').classList.remove('active');document.body.style.overflow='';">View Full Cart</a>
      `;
    }
  };

  Cart.renderPage = function() {
    const container = document.getElementById('cart-items-container');
    const summary = document.getElementById('cart-summary');
    if (!container) return;

    if (Cart.items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty" style="padding:80px 0;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:80px;height:80px;color:var(--color-text-muted);"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <h2 style="font-size:1.5rem;font-weight:700;margin:16px 0 8px;">Your cart is empty</h2>
          <p style="color:var(--color-text-muted);margin-bottom:24px;">Looks like you haven't added anything yet.</p>
          <a href="shop.html" class="btn btn-primary">Start Shopping</a>
        </div>
      `;
      if (summary) summary.style.display = 'none';
      return;
    }

    container.innerHTML = Cart.items.map(item => `
      <div class="cart-page-item" style="display:flex;gap:24px;padding:24px 0;border-bottom:1px solid var(--border);align-items:center;" data-cart-id="${item.id}" data-color="${item.color || ''}" data-size="${item.size || ''}">
        <img src="${item.image}" style="width:120px;height:120px;object-fit:cover;border-radius:var(--radius-md);background:var(--color-light-bg);">
        <div style="flex:1;">
          <div style="display:flex;justify-content:space-between;align-items:start;">
            <div>
              <h3 style="font-weight:600;margin-bottom:4px;"><a href="product.html?id=${item.id}">${item.name}</a></h3>
              <p style="font-size:0.875rem;color:var(--color-text-muted);">${item.category}${item.color ? ' · ' + item.color : ''}${item.size ? ' · ' + item.size : ''}</p>
            </div>
            <span style="font-weight:700;font-size:1.125rem;">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;">
            <div class="qty-control">
              <button data-action="dec">−</button>
              <span>${item.quantity}</span>
              <button data-action="inc">+</button>
            </div>
            <button class="remove-item" data-action="remove" style="font-size:0.875rem;color:var(--color-text-muted);text-decoration:underline;">Remove</button>
          </div>
        </div>
      </div>
    `).join('');

    const subtotal = Cart.getTotal();
    const shipping = subtotal > 100 ? 0 : 12;

    if (summary) {
      summary.style.display = 'block';
      summary.innerHTML = `
        <div style="background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:32px;position:sticky;top:100px;">
          <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:24px;">Order Summary</h3>
          <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9375rem;"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9375rem;"><span>Shipping</span><span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9375rem;"><span>Tax</span><span>Calculated at checkout</span></div>
          <div style="border-top:1px solid var(--border);padding-top:16px;margin-top:16px;display:flex;justify-content:space-between;font-size:1.25rem;font-weight:700;"><span>Estimated Total</span><span>$${(subtotal + shipping).toFixed(2)}</span></div>
          <div style="margin-top:24px;">
            <label style="display:block;font-size:0.875rem;font-weight:500;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.04em;">Discount Code</label>
            <div style="display:flex;gap:8px;">
              <input type="text" placeholder="Enter code" class="form-input" style="flex:1;">
              <button class="btn btn-secondary" style="padding:14px 20px;">Apply</button>
            </div>
          </div>
          <a href="checkout.html" class="btn btn-primary" style="width:100%;margin-top:24px;">Proceed to Checkout</a>
          <a href="shop.html" class="btn btn-secondary" style="width:100%;margin-top:12px;">Continue Shopping</a>
        </div>
      `;
    }
  };

  Cart.bindEvents = function() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const item = btn.closest('[data-cart-id]');
      if (!item) return;

      const id = parseInt(item.dataset.cartId);
      const color = item.dataset.color || null;
      const size = item.dataset.size || null;
      const action = btn.dataset.action;

      if (action === 'inc') Cart.updateQuantity(id, color, size, 1);
      if (action === 'dec') Cart.updateQuantity(id, color, size, -1);
      if (action === 'remove') Cart.remove(id, color, size);
    });
  };

  // Auto-init
  Cart.init();
})();
