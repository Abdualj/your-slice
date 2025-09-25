// main.js - Unified, fixed version
document.addEventListener("DOMContentLoaded", function () {
  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const safeAddListener = (el, ev, fn) => { if (el) el.addEventListener(ev, fn); };

  // ---------- Scroll to builder ----------
  const buildButton = $(".hero .btn-primary") || $("#buildNowBtn");
  const builderSection = $(".builder-section");
  if (buildButton && builderSection) {
    buildButton.addEventListener("click", () =>
      builderSection.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  }

  // ---------- GLOBAL CART SYSTEM ----------
  const cartPanel = $(".cart-panel");
  const cartIcon = $(".cart-icon");
  const closeCart = $(".close-cart");
  const cartItemsEl = $(".cart-items");
  const cartCountEl = $(".cart-count");
  const cartSubtotalEl = $(".cart-subtotal");
  const cartTotalEl = $(".cart-total");
  const emptyCartTemplate = $(".empty-cart");
  const deliveryFeeValue = 2.5;

  let cart = [];

  function updateCart() {
    if (!cartItemsEl) return;
    const totalItems = cart.reduce((s, it) => s + it.quantity, 0);
    if (cartCountEl) cartCountEl.textContent = totalItems;

    cartItemsEl.innerHTML = "";

    if (cart.length === 0) {
      if (emptyCartTemplate) cartItemsEl.appendChild(emptyCartTemplate.cloneNode(true));
      if (cartSubtotalEl) cartSubtotalEl.textContent = "€0.00";
      if (cartTotalEl) cartTotalEl.textContent = "€0.00";
      return;
    }

    let subtotal = 0;
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <div class="cart-item-img"><img src="${item.image}" alt="${item.name}"></div>
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          ${item.customizations && item.customizations.length ? `<p>${item.customizations.join(", ")}</p>` : ""}
          <div class="cart-item-price">€${itemTotal.toFixed(2)}</div>
          <div class="cart-item-controls">
            <button class="quantity-btn minus" data-index="${index}">-</button>
            <span class="item-quantity">${item.quantity}</span>
            <button class="quantity-btn plus" data-index="${index}">+</button>
            <button class="remove-item" data-index="${index}">×</button>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(div);
    });

    const total = subtotal + deliveryFeeValue;
    if (cartSubtotalEl) cartSubtotalEl.textContent = `€${subtotal.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `€${total.toFixed(2)}`;

    // Attach listeners (re-query since DOM refreshed)
    $$(".quantity-btn.minus", cartItemsEl).forEach((btn) =>
      btn.addEventListener("click", () => {
        const i = parseInt(btn.dataset.index, 10);
        if (!Number.isFinite(i)) return;
        if (cart[i].quantity > 1) cart[i].quantity -= 1;
        else cart.splice(i, 1);
        updateCart();
      })
    );
    $$(".quantity-btn.plus", cartItemsEl).forEach((btn) =>
      btn.addEventListener("click", () => {
        const i = parseInt(btn.dataset.index, 10);
        if (!Number.isFinite(i)) return;
        cart[i].quantity += 1;
        updateCart();
      })
    );
    $$(".remove-item", cartItemsEl).forEach((btn) =>
      btn.addEventListener("click", () => {
        const i = parseInt(btn.dataset.index, 10);
        if (!Number.isFinite(i)) return;
        cart.splice(i, 1);
        updateCart();
      })
    );
  }

  function addToCart(name, price, image, customizations = []) {
    // normalize customizations array
    const cust = Array.isArray(customizations) ? customizations : [];
    const existingIdx = cart.findIndex(
      (it) => it.name === name && JSON.stringify(it.customizations) === JSON.stringify(cust)
    );
    if (existingIdx >= 0) {
      cart[existingIdx].quantity += 1;
    } else {
      cart.push({ name, price: Number(price) || 0, image: image || "", customizations: cust, quantity: 1 });
    }
    updateCart();
    if (cartPanel) cartPanel.classList.add("open");
    document.body.classList.add("cart-open");
  }

  // Expose the function globally so other modules/scripts can call it
  window.addToCart = addToCart;

  // Cart panel toggles
  safeAddListener(cartIcon, "click", () => {
    if (cartPanel) cartPanel.classList.add("open");
    document.body.classList.add("cart-open");
  });
  safeAddListener(closeCart, "click", () => {
    if (cartPanel) cartPanel.classList.remove("open");
    document.body.classList.remove("cart-open");
  });

  // Checkout
  const checkoutBtn = $(".checkout-btn");
  safeAddListener(checkoutBtn, "click", () => {
    if (cart.length > 0) {
      alert("Proceeding to checkout! This would open a checkout form in a real application.");
    } else {
      alert("Your cart is empty. Add some items first!");
    }
  });

  // ---------- MENU: Add to cart buttons ----------
  $$(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const menuItem = this.closest(".menu-item");
      if (!menuItem) return;
      const nameEl = menuItem.querySelector("h3");
      const priceEl = menuItem.querySelector(".price");
      const imgEl = menuItem.querySelector("img");
      const name = nameEl ? nameEl.textContent.trim() : "Menu Item";
      const price = priceEl ? parseFloat(priceEl.textContent.replace("€", "").trim()) || 0 : 0;
      const image = imgEl ? imgEl.src : "";
      addToCart(name, price, image);
      const originalText = this.textContent;
      this.textContent = "Added!";
      setTimeout(() => (this.textContent = originalText), 1500);
    });
  });

  // ---------- MENU SCROLL (arrows + dots) ----------
  const scrollContainer = $(".menu-scroll-container");
  const menuItems = $$(".menu-item");
  const leftArrow = $(".left-arrow");
  const rightArrow = $(".right-arrow");
  const dots = $$(".dot");

  if (scrollContainer && menuItems.length) {
    safeAddListener(leftArrow, "click", () => scrollContainer.scrollBy({ left: -300, behavior: "smooth" }));
    safeAddListener(rightArrow, "click", () => scrollContainer.scrollBy({ left: 300, behavior: "smooth" }));

    dots.forEach((dot, i) =>
      dot.addEventListener("click", () => {
        const itemWidth = menuItems[0].offsetWidth + 20; // matches CSS gap
        scrollContainer.scrollTo({ left: i * itemWidth, behavior: "smooth" });
      })
    );

    scrollContainer.addEventListener("scroll", () => {
      const scrollPos = scrollContainer.scrollLeft;
      const itemWidth = menuItems[0].offsetWidth + 20;
      const activeIndex = Math.round(scrollPos / itemWidth);
      dots.forEach((dot, i) => dot.classList.toggle("active", i === activeIndex));
    });
  }

  // ---------- PIZZA BUILDER ----------
  // Config and DOM references (defensive)
  const pizzaConfig = {
    base: { name: "Original", price: 0 },
    sauce: { name: "Tomato Sauce", price: 0 },
    cheese: { name: "Mozzarella", price: 0 },
    toppings: [],
    size: { name: "Regular", price: 0, multiplier: 1 },
  };
  const basePrice = 6.5;

  const stepEls = $$(".step");
  const stepContents = $$(".step-content");
  const prevButton = $("#prevBtn");
  const nextButton = $("#nextBtn");
  const optionCards = $$(".option-card");
  const selectedOptionsEl = $("#selectedOptions");
  const currentPriceEl = $("#currentPrice");
  const toppingsCounterEl = $("#selectedToppingsCount");
  const buildNowBtn2 = $("#buildNowBtn"); // optional duplicate

  let currentStep = 1;

  function getSizeMultiplier(size) {
    switch (size) {
      case "large":
        return 1.5;
      case "xl":
        return 2;
      default:
        return 1;
    }
  }

  function renderStepUI() {
    stepEls.forEach((s) => {
      const n = parseInt(s.dataset.step, 10);
      s.classList.toggle("active", n === currentStep);
    });
    stepContents.forEach((c) => {
      const n = parseInt(c.id.replace("step", ""), 10);
      c.style.display = n === currentStep ? "block" : "none";
    });

    if (prevButton) prevButton.disabled = currentStep === 1;
    if (nextButton) {
      if (currentStep === 5) nextButton.textContent = "Complete Your Slice";
      else {
        const titles = ["", "Base", "Sauce", "Cheese", "Toppings", "Size"];
        nextButton.textContent = `Next: Choose ${titles[currentStep + 1] || ""}`;
      }
    }

    updatePizzaVisualization();
    updatePrice();
  }

  function updatePizzaVisualization() {
    if (!selectedOptionsEl) return;
    selectedOptionsEl.innerHTML = `
      <div><strong>Base:</strong> ${pizzaConfig.base.name}</div>
      <div><strong>Sauce:</strong> ${pizzaConfig.sauce.name}</div>
      <div><strong>Cheese:</strong> ${pizzaConfig.cheese.name}</div>
      <div><strong>Toppings:</strong> ${pizzaConfig.toppings.length ? pizzaConfig.toppings.map(t => t.name).join(", ") : "None"}</div>
      <div><strong>Size:</strong> ${pizzaConfig.size.name}</div>
    `;
  }

  function updatePrice() {
    if (!currentPriceEl) return;
    let total = basePrice;
    total += (pizzaConfig.base.price || 0);
    total += (pizzaConfig.sauce.price || 0);
    total += (pizzaConfig.cheese.price || 0);
    total += (pizzaConfig.toppings || []).reduce((s, t) => s + (t.price || 0), 0);
    total += (pizzaConfig.size.price || 0);
    total *= pizzaConfig.size.multiplier || 1;
    currentPriceEl.textContent = `€${total.toFixed(2)}`;
  }

  function updateToppingsCounter() {
    if (!toppingsCounterEl) return;
    toppingsCounterEl.textContent = `${pizzaConfig.toppings.length}/3 toppings selected`;
  }

  // Safe auto-select first option for step when entering
  function autoSelectFirstOptionForStep(step) {
    const content = $(`#step${step}`);
    if (!content) return;
    const first = content.querySelector(".option-card");
    if (!first) return;
    const type = first.dataset.type;
    const name = first.dataset.name;
    const price = parseFloat(first.dataset.price) || 0;

    // If nothing selected in this step, pick first
    const anySelected = Array.from(content.querySelectorAll(".option-card")).some(c => c.classList.contains("selected"));
    if (!anySelected) {
      content.querySelectorAll(".option-card").forEach(c => c.classList.remove("selected"));
      first.classList.add("selected");
      if (type === "size") {
        pizzaConfig.size = { name, price, multiplier: getSizeMultiplier(first.dataset.size) };
      } else if (type === "topping") {
        if (!pizzaConfig.toppings.find(t => t.name === name)) pizzaConfig.toppings.push({ name, price });
      } else {
        pizzaConfig[type] = { name, price };
      }
    }
  }

  // Option card clicks
  optionCards.forEach((card) => {
    card.addEventListener("click", function () {
      const type = this.dataset.type;
      const name = this.dataset.name;
      const price = parseFloat(this.dataset.price) || 0;

      if (type === "topping") {
        const idx = pizzaConfig.toppings.findIndex(t => t.name === name);
        if (idx >= 0) {
          pizzaConfig.toppings.splice(idx, 1);
          this.classList.remove("selected");
        } else if (pizzaConfig.toppings.length < 3) {
          pizzaConfig.toppings.push({ name, price });
          this.classList.add("selected");
        } else {
          // optional: feedback that max toppings reached
          // flash the card or show small message
        }
        updateToppingsCounter();
      } else {
        // single-select
        const parent = this.closest(".options-grid");
        if (parent) parent.querySelectorAll(".option-card").forEach(c => c.classList.remove("selected"));
        this.classList.add("selected");

        if (type === "size") {
          pizzaConfig.size = { name, price, multiplier: getSizeMultiplier(this.dataset.size) };
        } else {
          pizzaConfig[type] = { name, price };
        }
      }
      updatePizzaVisualization();
      updatePrice();
    });
  });

  // Step navigation buttons
  safeAddListener(nextButton, "click", () => {
    if (currentStep < 5) {
      currentStep++;
      // auto-select first option for that step
      autoSelectFirstOptionForStep(currentStep);
      renderStepUI();
    } else {
      // Complete pizza: compute price from currentPriceEl and add to cart
      const totalPrice = currentPriceEl ? parseFloat(currentPriceEl.textContent.replace("€", "")) || basePrice : basePrice;
      const customizations = [
        pizzaConfig.base.name,
        pizzaConfig.sauce.name,
        pizzaConfig.cheese.name,
        ...pizzaConfig.toppings.map(t => t.name),
        pizzaConfig.size.name
      ];
      addToCart("Custom Pizza Slice", totalPrice, "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", customizations);
      alert("Your custom pizza has been added to the cart!");
      // reset builder selections
      resetBuilderState();
    }
  });

  safeAddListener(prevButton, "click", () => {
    if (currentStep > 1) {
      currentStep--;
      renderStepUI();
    }
  });

  // Reset builder state
  function resetBuilderState() {
    currentStep = 1;
    pizzaConfig.base = { name: "Original", price: 0 };
    pizzaConfig.sauce = { name: "Tomato Sauce", price: 0 };
    pizzaConfig.cheese = { name: "Mozzarella", price: 0 };
    pizzaConfig.toppings = [];
    pizzaConfig.size = { name: "Regular", price: 0, multiplier: 1 };
    optionCards.forEach(c => c.classList.remove("selected"));
    // Select first base option if exists
    const firstBase = $("#step1 .option-card");
    if (firstBase) firstBase.classList.add("selected");
    renderStepUI();
    updateToppingsCounter();
  }

  // Make builder accessible via second build button if present
  if (buildNowBtn2 && builderSection) {
    buildNowBtn2.addEventListener("click", () =>
      builderSection.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  }

  // Init builder default
  // auto-select first option of step 1 if present
  const firstBaseOption = $("#step1 .option-card");
  if (firstBaseOption) firstBaseOption.classList.add("selected");
  renderStepUI();
  updateToppingsCounter();

  // ---------- LOGIN & SIGNUP DIALOGS ----------
  const loginDialog = $("#loginDialog");
  const signupDialog = $("#signupDialog");
  safeAddListener($("#openLoginDialog"), "click", (e) => { e && e.preventDefault(); if (loginDialog) loginDialog.showModal(); });
  safeAddListener($("#openSignupDialog"), "click", (e) => { e && e.preventDefault(); if (signupDialog) signupDialog.showModal(); });

  // close buttons
  $$(".close-btn").forEach(btn => btn.addEventListener("click", () => {
    if (loginDialog) loginDialog.close();
    if (signupDialog) signupDialog.close();
  }));

  // close on backdrop click
  if (loginDialog) loginDialog.addEventListener("click", (e) => { if (e.target === loginDialog) loginDialog.close(); });
  if (signupDialog) signupDialog.addEventListener("click", (e) => { if (e.target === signupDialog) signupDialog.close(); });

  // form submissions (simple demo)
  const loginForm = $(".login-form");
  const signupForm = $(".signup-form");
  if (loginForm) loginForm.addEventListener("submit", (e) => { e.preventDefault(); alert("Login successful! Welcome back."); if (loginDialog) loginDialog.close(); });
  if (signupForm) signupForm.addEventListener("submit", (e) => { e.preventDefault(); alert("Account created successfully! Welcome to Your Slice."); if (signupDialog) signupDialog.close(); });

  // ---------- BURGER MENU ----------
  const burgerMenu = $("#burgerMenu");
  const navMobile = $("#navMobile");
  if (burgerMenu && navMobile) {
    burgerMenu.addEventListener("click", (e) => { e.stopPropagation(); navMobile.classList.toggle("active"); });
    document.addEventListener("click", (e) => {
      if (!burgerMenu.contains(e.target) && !navMobile.contains(e.target) && navMobile.classList.contains("active")) {
        navMobile.classList.remove("active");
      }
    });
  }

  // ---------- REVIEWS (localStorage) ----------
  const reviewForm = $("#addReviewForm");
  const reviewsList = $("#reviewsList");
  const STORAGE_KEY = "reviews";
  if (reviewForm && reviewsList) {
    let reviews = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    function saveReviews() { localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews)); }
    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, (s) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
    }
    function addReviewToDOM(review) {
      const li = document.createElement("li");
      li.className = "review-item";
      li.innerHTML = `<div class="review-content"><strong>${escapeHtml(review.name)}</strong> (${escapeHtml(review.rating)}★)<p>${escapeHtml(review.text)}</p></div>`;
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Poista";
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener("click", () => {
        if (confirm("Haluatko varmasti poistaa tämän arvostelun?")) {
          li.remove();
          const idx = reviews.findIndex(r => r.name === review.name && r.rating === review.rating && r.text === review.text);
          if (idx > -1) { reviews.splice(idx, 1); saveReviews(); }
        }
      });
      li.appendChild(deleteBtn);
      reviewsList.appendChild(li);
    }
    // render existing
    reviews.forEach(addReviewToDOM);

    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#reviewerName") ? $("#reviewerName").value.trim() : "";
      const rating = $("#reviewRating") ? $("#reviewRating").value : "";
      const text = $("#reviewText") ? $("#reviewText").value.trim() : "";
      if (!name || !rating || !text) return;
      const review = { name, rating, text };
      reviews.push(review);
      saveReviews();
      addReviewToDOM(review);
      reviewForm.reset();
    });
  }

  // ---------- Final init ----------
  updateCart();
});
