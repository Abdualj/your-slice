// === LOGIN LOGIC ===
document.addEventListener('DOMContentLoaded', function() {
  const dialog = document.getElementById('loginDialog');
  const adminContainer = document.querySelector('.admin-container');

  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (!isLoggedIn) {
    dialog.showModal();
  } else {
    adminContainer.style.display = 'flex';
    document.body.classList.remove('pre-login');
  }

  const loginForm = document.getElementById('loginForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  const closeBtn = document.querySelector('.close-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => dialog.close());

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    let isValid = true;

    if (nameInput.value.length < 3) {
      nameError.style.display = 'block';
      isValid = false;
    } else {
      nameError.style.display = 'none';
    }

    if (!emailInput.value.endsWith('@metropolia.fi')) {
      emailError.style.display = 'block';
      isValid = false;
    } else {
      emailError.style.display = 'none';
    }

    const hasUpperCase = /[A-Z]/.test(passwordInput.value);
    const hasNumber = /[0-9]/.test(passwordInput.value);

    if (passwordInput.value.length < 6 || !hasUpperCase || !hasNumber) {
      passwordError.style.display = 'block';
      isValid = false;
    } else {
      passwordError.style.display = 'none';
    }

    if (isValid) {
      dialog.close();
      adminContainer.style.display = 'flex';
      document.body.classList.remove('pre-login');

      localStorage.setItem('isLoggedIn', 'true');
    }
  });
});