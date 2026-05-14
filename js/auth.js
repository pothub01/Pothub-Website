// PotHub Auth System
(function() {
  'use strict';

  window.PotHub = window.PotHub || {};
  const Auth = window.PotHub.Auth = {};
  const STORAGE_KEY = 'pothub_user';

  Auth.init = function() {
    Auth.bindForms();
  };

  Auth.getUser = function() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) { return null; }
  };

  Auth.setUser = function(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  };

  Auth.logout = function() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = 'index.html';
  };

  Auth.isLoggedIn = function() {
    return !!Auth.getUser();
  };

  Auth.bindForms = function() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('[name="email"]').value;
        const password = loginForm.querySelector('[name="password"]').value;

        // Demo auth - in production this would be an API call
        if (email && password.length >= 6) {
          Auth.setUser({ email, name: email.split('@')[0], id: 'user_' + Date.now() });
          if (PotHub.App) PotHub.App.toast('Welcome back!', 'success');
          setTimeout(() => window.location.href = 'index.html', 800);
        } else {
          if (PotHub.App) PotHub.App.toast('Invalid credentials', 'error');
        }
      });
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = registerForm.querySelector('[name="email"]').value;
        const name = registerForm.querySelector('[name="name"]').value;
        const password = registerForm.querySelector('[name="password"]').value;

        if (email && name && password.length >= 6) {
          Auth.setUser({ email, name, id: 'user_' + Date.now() });
          if (PotHub.App) PotHub.App.toast('Account created!', 'success');
          setTimeout(() => window.location.href = 'index.html', 800);
        } else {
          if (PotHub.App) PotHub.App.toast('Please fill all fields', 'error');
        }
      });
    }

    // Logout buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-logout]');
      if (btn) Auth.logout();
    });

    // Update account page
    const accountName = document.getElementById('account-name');
    const accountEmail = document.getElementById('account-email');
    if (accountName || accountEmail) {
      const user = Auth.getUser();
      if (!user) { window.location.href = 'login.html'; return; }
      if (accountName) accountName.textContent = user.name;
      if (accountEmail) accountEmail.textContent = user.email;
    }
  };

  Auth.init();
})();
