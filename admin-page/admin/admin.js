// === Logout Button ===
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    // Reload or redirect to login page
    location.href = '/admin-page/admin/adminPage.html';
  });
}

// === Filter buttons ===
document.addEventListener('DOMContentLoaded', function() {
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
document.addEventListener('change', (e) => {
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
  switch (value) {
    case 'process': newStatus = 'Processing'; break;
    case 'complete': newStatus = 'Completed'; break;
    case 'cancel': newStatus = 'Cancelled'; break;
    default: newStatus = statusCell ? statusCell.textContent : '';
  }

  if (statusCell && newStatus) {
    statusCell.textContent = newStatus;
    statusCell.className = 'status'; // reset
    if (newStatus === 'Processing') statusCell.classList.add('status-processing');
    else if (newStatus === 'Completed') statusCell.classList.add('status-completed');
    else if (newStatus === 'Cancelled') statusCell.classList.add('status-cancelled');
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

    // Poista nappи
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

/* === User Dropdown Menu === */
const userInfo = document.getElementById('userInfo');
const userMenu = document.getElementById('userMenu');

if (userInfo && userMenu) {
  userInfo.addEventListener('click', () => {
    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', (e) => {
    if (!userInfo.contains(e.target)) {
      userMenu.style.display = 'none';
    }
  });
}