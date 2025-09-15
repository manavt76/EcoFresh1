// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Add to cart buttons on product pages
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    if (addToCartButtons) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const productName = this.dataset.name;
                const productPrice = parseFloat(this.dataset.price);
                const quantity = parseInt(document.getElementById('quantity').value);
                const flavor = document.getElementById('flavor').value;
                
                addToCart(productId, productName, productPrice, quantity, flavor);
                alert('Added to cart!');
            });
        });
    }
});

function addToCart(id, name, price, quantity, flavor) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingIndex = cart.findIndex(item => item.id === id && item.flavor === flavor);
    
    if (existingIndex > -1) {
        // Update quantity if product exists
        cart[existingIndex].quantity += quantity;
    } else {
        // Add new product to cart
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: quantity,
            flavor: flavor
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// For cart page
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTable = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartTable) {
        if (cart.length === 0) {
            cartTable.innerHTML = '<tr><td colspan="5" class="empty-cart">Your cart is empty</td></tr>';
            cartTotal.textContent = '0.00';
            return;
        }
        
        let tableHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            tableHTML += `
                <tr>
                    <td>${item.name} (${item.flavor})</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>$${itemTotal.toFixed(2)}</td>
                    <td><button class="remove-btn" data-index="${index}">Remove</button></td>
                </tr>
            `;
        });
        
        cartTable.innerHTML = tableHTML;
        cartTotal.textContent = total.toFixed(2);
        
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                removeFromCart(index);
            });
        });
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Initialize cart page if we're on it
if (document.getElementById('cart-items')) {
    loadCart();
}