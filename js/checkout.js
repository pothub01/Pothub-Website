// PotHub Checkout
(function() {
  'use strict';

  window.PotHub = window.PotHub || {};
  const Checkout = window.PotHub.Checkout = {};

  Checkout.init = function() {
    Checkout.renderSummary();
    Checkout.bindForm();
  };

  Checkout.renderSummary = function() {
    const container = document.getElementById('checkout-summary');
    if (!container || !PotHub.Cart) return;

    const items = PotHub.Cart.items;
    const subtotal = PotHub.Cart.getTotal();
    const shipping = subtotal > 100 ? 0 : 12;

    container.innerHTML = `
      <div style="background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:32px;">
        <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:24px;">Order Summary (${items.length} items)</h3>
        ${items.map(item => `
          <div style="display:flex;gap:16px;margin-bottom:16px;align-items:center;">
            <img src="${item.image}" style="width:60px;height:60px;object-fit:cover;border-radius:var(--radius-sm);background:var(--color-light-bg);">
            <div style="flex:1;">
              <div style="font-weight:600;font-size:0.9375rem;">${item.name}</div>
              <div style="font-size:0.875rem;color:var(--color-text-muted);">Qty: ${item.quantity}${item.color ? ' · ' + item.color : ''}</div>
            </div>
            <div style="font-weight:600;">$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        `).join('')}
        <div style="border-top:1px solid var(--border);padding-top:16px;margin-top:16px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.9375rem;"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.9375rem;"><span>Shipping</span><span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.9375rem;"><span>Tax</span><span>$${(subtotal * 0.08).toFixed(2)}</span></div>
          <div style="display:flex;justify-content:space-between;margin-top:16px;padding-top:16px;border-top:1px solid var(--border);font-size:1.25rem;font-weight:700;"><span>Total</span><span>$${(subtotal + shipping + subtotal * 0.08).toFixed(2)}</span></div>
        </div>
      </div>
    `;
  };

  Checkout.bindForm = function() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate required fields
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#e74c3c';
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) {
        if (PotHub.App) PotHub.App.toast('Please fill all required fields', 'error');
        return;
      }

      // Simulate order placement
      const orderId = 'PTH-' + Date.now().toString(36).toUpperCase();
      localStorage.setItem('pothub_last_order', JSON.stringify({
        id: orderId,
        items: PotHub.Cart.items,
        total: PotHub.Cart.getTotal(),
        date: new Date().toISOString()
      }));

      PotHub.Cart.clear();
      if (PotHub.App) PotHub.App.toast('Order placed successfully!', 'success');
      setTimeout(() => window.location.href = 'account.html?order=' + orderId, 1500);
    });
  };

  Checkout.init();
})();
