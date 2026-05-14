// PotHub Products Module
(function() {
  'use strict';

  window.PotHub = window.PotHub || {};
  const Products = window.PotHub.Products = {};
  let cache = null;

  Products.getAll = async function() {
    if (cache) return cache;
    try {
      const res = await fetch('data/products.json');
      cache = await res.json();
      return cache;
    } catch (e) {
      console.error('Failed to load products', e);
      return [];
    }
  };

  Products.getById = async function(id) {
    const all = await Products.getAll();
    return all.find(p => p.id === parseInt(id));
  };

  Products.getByCategory = async function(category) {
    const all = await Products.getAll();
    if (!category || category === 'All') return all;
    return all.filter(p => p.category === category || p.collection === category);
  };

  Products.getFeatured = async function() {
    const all = await Products.getAll();
    return all.filter(p => p.featured);
  };

  Products.getBestsellers = async function() {
    const all = await Products.getAll();
    return all.filter(p => p.tags.includes('bestseller'));
  };

  Products.getNewArrivals = async function() {
    const all = await Products.getAll();
    return all.slice(-6).reverse();
  };

  Products.search = async function(query) {
    const all = await Products.getAll();
    const q = query.toLowerCase();
    return all.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.collection.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  };

  Products.getCategories = async function() {
    const all = await Products.getAll();
    return [...new Set(all.map(p => p.category))];
  };

  Products.getCollections = async function() {
    const all = await Products.getAll();
    return [...new Set(all.map(p => p.collection))];
  };

  Products.renderCard = function(product, options = {}) {
    const { showWishlist = true, showQuickView = true, className = '' } = options;
    const isWishlisted = PotHub.Wishlist && PotHub.Wishlist.has(product.id);

    return `
      <div class="product-card ${className}" data-id="${product.id}">
        <div class="product-image-wrap shine">
          <a href="product.html?id=${product.id}">
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
          </a>
          ${product.featured ? '<span class="product-badge">Featured</span>' : ''}
          ${product.stock < 6 ? '<span class="product-badge sale">Low Stock</span>' : ''}
          <div class="product-actions">
            ${showWishlist ? `
              <button class="product-action-btn ${isWishlisted ? 'active' : ''}" data-wishlist="${product.id}" aria-label="Add to wishlist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
            ` : ''}
            ${showQuickView ? `
              <button class="product-action-btn" data-quick-view="${product.id}" aria-label="Quick view">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path></svg>
              </button>
            ` : ''}
          </div>
        </div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3 class="product-name"><a href="product.html?id=${product.id}">${product.name}</a></h3>
          <div class="product-meta">
            <span class="product-price">$${product.price}</span>
            <div class="product-rating">
              <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span>${product.rating}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  Products.renderSkeleton = function(count = 4) {
    return Array(count).fill(0).map(() => `
      <div class="product-card">
        <div class="product-image-wrap"><div class="skeleton" style="width:100%;height:100%;"></div></div>
        <div class="product-info">
          <div class="skeleton" style="width:60px;height:14px;margin-bottom:8px;"></div>
          <div class="skeleton" style="width:80%;height:20px;margin-bottom:12px;"></div>
          <div class="skeleton" style="width:40%;height:18px;"></div>
        </div>
      </div>
    `).join('');
  };
})();
