// Product Management Functionality
const addProductBtn = document.getElementById("addProductBtn");
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const productsTableBody = document.querySelector("#productsTable tbody");

// Add product functionality
addProductBtn.addEventListener("click", function () {
  const name = productNameInput.value.trim();
  const price = parseFloat(productPriceInput.value);

  if (!name || isNaN(price) || price <= 0) {
    alert("Please enter a valid product name and price.");
    return;
  }

  // Create new row
  const tr = document.createElement("tr");

  tr.innerHTML = `
                <td>${name}</td>
                <td>€${price.toFixed(2)}</td>
                <td><button class="delete-btn">Delete</button></td>
            `;

  // Add row to table
  productsTableBody.appendChild(tr);

  // Add delete functionality to the new button
  const deleteBtn = tr.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this product?")) {
      tr.remove();
    }
  });

  // Clear inputs
  productNameInput.value = "";
  productPriceInput.value = "";
});

// Add delete functionality to existing buttons
document.querySelectorAll(".delete-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this product?")) {
      this.closest("tr").remove();
    }
  });
});

// Allow adding product with Enter key
productNameInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addProductBtn.click();
  }
});

productPriceInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addProductBtn.click();
  }
});
