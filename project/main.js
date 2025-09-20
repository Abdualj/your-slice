// main.js
document.addEventListener('DOMContentLoaded', function() {
   // Scroll to builder section when "Build Your Slice Now" button is clicked
    const buildButton = document.querySelector('.hero .btn-primary');
    const builderSection = document.querySelector('.builder-section');
    
    buildButton.addEventListener('click', function() {
        builderSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
    
    // Step navigation functionality
    const steps = document.querySelectorAll('.step');
    const prevButton = document.querySelector('.navigation-buttons .btn:first-child');
    const nextButton = document.querySelector('.navigation-buttons .btn:last-child');
    const stepTitles = ['Base', 'Sauce', 'Cheese', 'Toppings', 'Size'];
    let currentStep = 1;
    
    // Option selection
    const optionCards = document.querySelectorAll('.option-card');
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards in the same container
            const parent = this.closest('.options-grid');
            parent.querySelectorAll('.option-card').forEach(c => {
                c.classList.remove('selected');
            });
            
            // Add selected class to clicked card
            this.classList.add('selected');
        });
    });
    
    // Next button functionality
    nextButton.addEventListener('click', function() {
        if (currentStep < 5) {
            // Move to next step
            steps[currentStep - 1].classList.remove('active');
            currentStep++;
            steps[currentStep - 1].classList.add('active');
            
            // Update button text
            if (currentStep === 5) {
                this.textContent = 'Complete Your Slice';
            } else {
                this.textContent = `Next: Choose ${stepTitles[currentStep]}`;
            }
            
            // Enable previous button after first step
            if (currentStep > 1) {
                prevButton.disabled = false;
            }
        } else {
            // Completion action - add custom pizza to cart
            const selectedBase = document.querySelector('.options-grid .option-card.selected h3').textContent;
            
            // Add to cart
            addToCart(
                'Custom Pizza Slice', 
                6.50, 
                'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                [selectedBase]
            );
            
            // Reset builder
            resetBuilder();
        }
    });
    
    // Previous button functionality
    prevButton.addEventListener('click', function() {
        if (currentStep > 1) {
            steps[currentStep - 1].classList.remove('active');
            currentStep--;
            steps[currentStep - 1].classList.add('active');
            
            // Update button text
            nextButton.textContent = `Next: Choose ${stepTitles[currentStep]}`;
            
            // Disable previous button on first step
            if (currentStep === 1) {
                this.disabled = true;
            }
            
            // If we're not on the last step, make sure Next button says "Next"
            if (currentStep < 5) {
                nextButton.textContent = `Next: Choose ${stepTitles[currentStep]}`;
            }
        }
    });
    
    // Add to cart buttons for menu items
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const name = menuItem.querySelector('h3').textContent;
            const price = parseFloat(menuItem.querySelector('.price').textContent.replace('€', ''));
            const image = menuItem.querySelector('img').src;
            
            addToCart(name, price, image);
            
            // Animation feedback
            this.textContent = 'Added!';
            setTimeout(() => {
                this.textContent = 'Add to Cart';
            }, 1500);
        });
    });
    
    // Reset builder function
    function resetBuilder() {
        currentStep = 1;
        steps.forEach((step, index) => {
            if (index === 0) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        nextButton.textContent = 'Next: Choose Sauce';
        prevButton.disabled = true;
        
        // Reset selection to first option in each step
        const firstOption = document.querySelector('.options-grid .option-card:first-child');
        document.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });
        if (firstOption) firstOption.classList.add('selected');
    }
    
    // Cart functionality
    const cartPanel = document.querySelector('.cart-panel');
    const cartIcon = document.querySelector('.cart-icon');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartSubtotal = document.querySelector('.cart-subtotal');
    const cartTotal = document.querySelector('.cart-total');
    const emptyCart = document.querySelector('.empty-cart');
    
    let cart = [];
    
    // Toggle cart panel
    cartIcon.addEventListener('click', function() {
        cartPanel.classList.add('open');
        document.body.classList.add('cart-open');
    });
    
    closeCart.addEventListener('click', function() {
        cartPanel.classList.remove('open');
        document.body.classList.remove('cart-open');
    });
    
    // Add to cart functionality
    function addToCart(name, price, image, customizations = []) {
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => 
            item.name === name && 
            JSON.stringify(item.customizations) === JSON.stringify(customizations)
        );
        
        if (existingItemIndex >= 0) {
            // Increase quantity if item exists
            cart[existingItemIndex].quantity += 1;
        } else {
            // Add new item to cart
            cart.push({
                name,
                price,
                image,
                customizations,
                quantity: 1
            });
        }
        
        updateCart();
        
        // Show cart panel when adding an item
        cartPanel.classList.add('open');
        document.body.classList.add('cart-open');
    }
    
    // Update cart display
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Clear cart items
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            // Show empty cart message
            const emptyCartClone = emptyCart.cloneNode(true);
            cartItems.appendChild(emptyCartClone);
            return;
        }
        
        // Calculate totals
        let subtotal = 0;
        
        // Add each item to cart
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    ${item.customizations.length > 0 ? 
                      `<p>${item.customizations.join(', ')}</p>` : ''}
                    <div class="cart-item-price">€${itemTotal.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                        <button class="remove-item" data-index="${index}">×</button>
                    </div>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Update totals
        const deliveryFee = 2.50;
        const total = subtotal + deliveryFee;
        
        cartSubtotal.textContent = `€${subtotal.toFixed(2)}`;
        cartTotal.textContent = `€${total.toFixed(2)}`;
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart[index].quantity += 1;
                updateCart();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
        const index = parseInt(this.dataset.index);
        cart.splice(index, 1); // Poista tuote korista

        if (cart.length === 0) {
            // Jos kori on tyhjä, näytä tyhjä viesti ja nollaa summat
            cartItems.innerHTML = '';
            cartCount.textContent = '0';
            cartSubtotal.textContent = '€0.00';
            cartTotal.textContent = '€0.00'; // Ei toimitusmaksua
            document.querySelector('.delivery-fee').textContent = '€0.00'; // Nollaa toimitusmaksu
            cartItems.appendChild(emptyCart.cloneNode(true));
        } else {
            updateCart(); // Päivitä kori ja summat
        }
    });


});

    }
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cart.length > 0) {
            alert('Proceeding to checkout! This would open a checkout form in a real application.');
            // In a real app, you would redirect to a checkout page or show a form
        } else {
            alert('Your cart is empty. Add some items first!');
        }
    });
    
    // Menu scroll functionality
    const scrollContainer = document.querySelector('.menu-scroll-container');
    const menuItems = document.querySelectorAll('.menu-item');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const dots = document.querySelectorAll('.dot');
    
    // Set up arrow functionality
    leftArrow.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    rightArrow.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
    });
    
    // Set up dot indicators
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const scrollPosition = index * (menuItems[0].offsetWidth + 20);
            scrollContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        });
    });
    
    // Update dot indicators on scroll
    scrollContainer.addEventListener('scroll', () => {
        const scrollPos = scrollContainer.scrollLeft;
        const itemWidth = menuItems[0].offsetWidth + 20;
        const activeIndex = Math.round(scrollPos / itemWidth);
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    });
    
    // Initialize cart
    updateCart();
});

          // Login dialog functionality
        const loginDialog = document.getElementById('loginDialog');
        document.getElementById('openLoginDialog').addEventListener('click', (e) => {
            e.preventDefault();
            loginDialog.showModal();
        });


        // Sign up dialog functionality
        const signupDialog = document.getElementById('signupDialog');
        document.getElementById('openSignupDialog').addEventListener('click', (e) => {
            e.preventDefault();
            signupDialog.showModal();
        });


 // Add close button functionality
        const closeBtns = document.querySelectorAll('.close-btn');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                loginDialog.close();
                signupDialog.close();
            });
        });

       // Close dialog when clicking outside
        loginDialog.addEventListener('click', (e) => {
            if (e.target === loginDialog) {
                loginDialog.close();
            }
        });

        signupDialog.addEventListener('click', (e) => {
            if (e.target === signupDialog) {
                signupDialog.close();
            }
        });


       // Form submission handling
        const loginForm = document.querySelector('.login-form');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Login successful! Welcome back.');
            loginDialog.close();
        });
        
        const signupForm = document.querySelector('.signup-form');
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Account created successfully! Welcome to Your Slice.');
            signupDialog.close();
        });

        // Burger menu functionality
        const burgerMenu = document.getElementById('burgerMenu');
        const navMobile = document.getElementById('navMobile');
        
        if (burgerMenu && navMobile) {
            burgerMenu.addEventListener('click', () => {
                navMobile.classList.toggle('active');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!burgerMenu.contains(e.target) && !navMobile.contains(e.target) && navMobile.classList.contains('active')) {
                    navMobile.classList.remove('active');
                }
            });
        }

