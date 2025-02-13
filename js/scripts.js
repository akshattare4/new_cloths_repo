
let likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateWishlistCount() {
    document.getElementById('wishlist-count').textContent = likedProducts.length;
}

function updateBasketCount() {
    let totalItems = 0;
    let totalPrice = 0;
    cart.forEach(product => {
        totalItems += product.quantity;
        totalPrice += product.price * product.quantity;
    });
    document.getElementById('basket-count').textContent = totalItems;
    document.getElementById('basket-total').textContent = `₹${totalPrice.toFixed(2)}`;
}

function addToCart(productName, productPrice, productImage) {
    const existingProductIndex = cart.findIndex(product => product.name === productName);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1, image: productImage });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(productName + " has been added to your cart at ₹" + productPrice);
    updateBasketCount();
}

function likeProduct(productName, productPrice, productImage) {
    if (!likedProducts.some(product => product.name === productName)) {
        likedProducts.push({ name: productName, price: productPrice, image: productImage });
        alert(productName + " has been added to your liked products.");
    } else {
        alert(productName + " is already in your liked products.");
    }
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
    updateWishlistCount();
}

function displayLikedProducts() {
    const likedList = document.getElementById('likedList');
    likedList.innerHTML = '';
    likedProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product';
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" width="100" height="100">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            <button onclick="removeLikedProduct('${product.name}')">Remove</button>
        `;
        likedList.appendChild(productItem);
    });
}

function removeLikedProduct(productName) {
    likedProducts = likedProducts.filter(product => product.name !== productName);
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
    displayLikedProducts();
    updateWishlistCount();
}

function displayCart() {
    const cartList = document.getElementById('cartList');
    const totalPriceElement = document.getElementById('totalPrice');
    cartList.innerHTML = '';
    let totalPrice = 0;
    cart.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product';
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" width="100" height="100">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            <input type="number" value="${product.quantity}" min="1" onchange="updateQuantity('${product.name}', this.value)">
            <button onclick="removeCartItem('${product.name}')">Remove</button>
        `;
        cartList.appendChild(productItem);
        totalPrice += product.price * product.quantity;
    });
    totalPriceElement.innerText = `Total Price: ₹${totalPrice.toFixed(2)}`;
}

function updateQuantity(productName, quantity) {
    const productIndex = cart.findIndex(product => product.name === productName);
    if (productIndex !== -1) {
        cart[productIndex].quantity = parseInt(quantity);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateBasketCount();
    }
}

function removeCartItem(productName) {
    cart = cart.filter(product => product.name !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateBasketCount();
}

function placeOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    generateReceipt();
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateBasketCount();
    alert("Order placed successfully!");
}

function generateReceipt() {
    let receiptContent = "ClothMart Receipt\n\n";
    let totalPrice = 0;
    cart.forEach(product => {
        receiptContent += `${product.name} - ₹${product.price} x ${product.quantity}\n`;
        totalPrice += product.price * product.quantity;
    });
    receiptContent += `\nTotal Price: ₹${totalPrice.toFixed(2)}`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'receipt.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// Initialize liked products and cart display if elements exist
if (document.getElementById('likedList')) {
    displayLikedProducts();
}

if (document.getElementById('cartList')) {
    displayCart();
    document.getElementById('placeOrderBtn').addEventListener('click', placeOrder);
}