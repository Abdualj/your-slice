// Show login dialog on page load
document.addEventListener('DOMContentLoaded', function() {
  const dialog = document.getElementById('loginDialog');
  dialog.showModal();

  // Add close button functionality
  const closeBtn = document.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => {
    dialog.close();
  });

  // Form validation
  const loginForm = document.getElementById('loginForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  // Validate inputs on change
  nameInput.addEventListener('input', function() {
    if (nameInput.validity.valid) {
      nameError.style.display = 'none';
    } else {
      nameError.style.display = 'block';
    }
  });

  emailInput.addEventListener('input', function() {
    if (emailInput.validity.valid) {
      emailError.style.display = 'none';
    } else {
      emailError.style.display = 'block';
    }
  });

  passwordInput.addEventListener('input', function() {
    if (passwordInput.validity.valid) {
      passwordError.style.display = 'none';
    } else {
      passwordError.style.display = 'block';
    }
  });

  // Handle form submission
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    let isValid = true;

    // Validate name
    if (nameInput.value.length < 3) {
      nameError.style.display = 'block';
      isValid = false;
    } else {
      nameError.style.display = 'none';
    }

    // Validate email
    if (!emailInput.value.endsWith('@metropolia.fi')) {
      emailError.style.display = 'block';
      isValid = false;
    } else {
      emailError.style.display = 'none';
    }

    // Validate password
    const hasUpperCase = /[A-Z]/.test(passwordInput.value);
    const hasNumber = /[0-9]/.test(passwordInput.value);

    if (passwordInput.value.length < 6 || !hasUpperCase || !hasNumber) {
      passwordError.style.display = 'block';
      isValid = false;
    } else {
      passwordError.style.display = 'none';
    }

    // If form is valid, close dialog and show admin dashboard
    if (isValid) {
      dialog.close();
      document.querySelector('.admin-container').style.display = 'flex';
      document.body.classList.remove('pre-login');
    }
  });

  // Cancel button functionality (varmistus jos nappi puuttuu)
  const cancelBtn = document.querySelector('.cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      dialog.close();
    });
  }

  // Filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      // In a real app, this would filter the orders table
    });
  });
});

/* === Action select: päivitä Status tai poista rivi === */
document.addEventListener('change', (e)=>{
  if (!e.target.classList.contains('action-select')) return;

  const row = e.target.closest('tr');
  const statusCell = row.querySelector('.status');
  const value = e.target.value;

  // jos valinta on Delete → poista koko rivi
  if (value === 'delete') {
    if (confirm('Haluatko varmasti poistaa tämän tilauksen?')) {
      row.remove();
    }
    return; // ei jatketa statuksen päivitystä
  }

  // muut valinnat päivittävät Status-kentän
  let newStatus = '';
  switch(value){
    case 'process':  newStatus = 'Processing'; break;
    case 'complete': newStatus = 'Completed';  break;
    case 'cancel':   newStatus = 'Cancelled';  break;
    default: newStatus = statusCell ? statusCell.textContent : ''; 
  }

  if (statusCell && newStatus){
    statusCell.textContent = newStatus;
    statusCell.className = 'status'; // reset
    if (newStatus==='Processing') statusCell.classList.add('status-processing');
    else if (newStatus==='Completed') statusCell.classList.add('status-completed');
    else if (newStatus==='Cancelled') statusCell.classList.add('status-cancelled');
  }
});

/* === Product Management === */
const addProductBtn = document.getElementById('addProductBtn');
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const productsTableBody = document.querySelector('#productsTable tbody');

// Poista tuote (delegointi)
if (productsTableBody) {
  productsTableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
      if (confirm('Poistetaanko tuote?')) {
        e.target.closest('tr').remove();
      }
    }
  });
}

if (addProductBtn) {
  addProductBtn.addEventListener('click', function() {
    const name = productNameInput.value.trim();
    const price = parseFloat(productPriceInput.value);

    if (!name || isNaN(price)) {
      alert('Täytä tuotteen nimi ja hinta oikein.');
      return;
    }

    // Luo uusi rivi
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${name}</td>
      <td>€${price.toFixed(2)}</td>
      <td><button class="delete-btn">Delete</button></td>
    `;

    // Lisää rivi taulukkoon
    productsTableBody.appendChild(tr);

    // Poista nappi
    const deleteBtn = tr.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      if (confirm('Haluatko varmasti poistaa tuotteen?')) {
        tr.remove();
      }
    });

    // Tyhjennä inputit
    productNameInput.value = '';
    productPriceInput.value = '';
  });
}