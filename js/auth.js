/* =========================================================
   ABOGLOBE — Auth Logic
   Shared between login.html and signup.html.
   Each block self-detects which form is present on the page
   and wires up only what's relevant. No errors if the other
   form isn't present.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Shared: password visibility toggle ---------- */
  // Works for both #toggle-password (login) and #toggle-signup-password (signup)
  const bindPasswordToggle = (buttonId, inputId) => {
    const btn = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      btn.innerHTML = showing
        ? '<i class="lni lni-eye" aria-hidden="true"></i>'
        : '<i class="lni lni-eye-slash" aria-hidden="true"></i>';
      btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });
  };

  /* =========================================================
     LOGIN PAGE
     ========================================================= */
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    bindPasswordToggle('toggle-password', 'password');

    const errorEl = document.getElementById('login-error');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const showError = (msg) => {
      if (!errorEl) return;
      errorEl.textContent = msg;
      errorEl.classList.remove('hidden');
    };
    const clearError = () => {
      if (errorEl) errorEl.classList.add('hidden');
    };

    // Clear error as user types
    [emailInput, passwordInput].forEach((input) => {
      if (input) input.addEventListener('input', clearError);
    });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();

      const email = (emailInput?.value || '').trim();
      const password = (passwordInput?.value || '').trim();

      if (!email || !password) {
        showError('Please fill in both email and password.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('Please enter a valid email address.');
        return;
      }

      const btn = loginForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.innerHTML = '<i class="lni lni-checkmark-circle" aria-hidden="true"></i> Signing in...';
        btn.disabled = true;
      }

      // Demo: redirect to vendor portal
      setTimeout(() => {
        window.location.href = 'vendor-portal.html';
      }, 800);
    });
  }

  /* =========================================================
     SIGNUP PAGE
     ========================================================= */
  const signupForm = document.getElementById('signup-form');

  if (signupForm) {
    bindPasswordToggle('toggle-signup-password', 'signup-password');

    const errorEl = document.getElementById('signup-error');
    const pwInput = document.getElementById('signup-password');
    const strengthEl = document.getElementById('pw-strength');
    const hintEl = document.getElementById('pw-hint');

    const showError = (msg) => {
      if (!errorEl) return;
      errorEl.textContent = msg;
      errorEl.classList.remove('hidden');
    };
    const clearError = () => {
      if (errorEl) errorEl.classList.add('hidden');
    };

    /* ---------- Password strength meter ---------- */
    if (pwInput && strengthEl && hintEl) {
      const HINTS = [
        'Use 8+ characters with a mix of letters, numbers & symbols.',
        'Weak — add more characters.',
        'Fair — add an uppercase letter or number.',
        'Good — add a symbol to strengthen.',
        'Strong password ✓'
      ];

      const updateStrength = () => {
        const v = pwInput.value;
        let score = 0;
        if (v.length >= 8) score++;
        if (/[A-Z]/.test(v)) score++;
        if (/[0-9]/.test(v)) score++;
        if (/[^A-Za-z0-9]/.test(v)) score++;

        strengthEl.dataset.score = String(score);
        hintEl.textContent = HINTS[score];
        if (score === 4) {
          hintEl.dataset.strong = 'true';
        } else {
          delete hintEl.dataset.strong;
        }
      };

      pwInput.addEventListener('input', updateStrength);
      updateStrength();
    }

    /* ---------- Submit ---------- */
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();

      const first = (document.getElementById('first-name')?.value || '').trim();
      const last = (document.getElementById('last-name')?.value || '').trim();
      const email = (document.getElementById('signup-email')?.value || '').trim();
      const company = (document.getElementById('company')?.value || '').trim();
      const role = document.getElementById('role')?.value || '';
      const password = pwInput?.value || '';
      const terms = document.getElementById('terms')?.checked || false;

      if (!first || !last || !email || !company || !role || !password) {
        showError('Please fill in all fields.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('Please enter a valid email address.');
        return;
      }
      if (password.length < 8) {
        showError('Password must be at least 8 characters.');
        return;
      }
      if (!terms) {
        showError('You must accept the Terms of Service.');
        return;
      }

      const btn = signupForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.innerHTML = '<i class="lni lni-checkmark-circle" aria-hidden="true"></i> Creating account...';
        btn.disabled = true;
      }

      // Demo: redirect to vendor portal
      setTimeout(() => {
        window.location.href = 'vendor-portal.html';
      }, 900);
    });
  }

});