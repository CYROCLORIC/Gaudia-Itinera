document.getElementById('homeButton').addEventListener('click', () => {
    window.location.href = '../index.html';
});

document.getElementById('cartButton').addEventListener('click', () => {
    window.location.href = 'cart.html';
});

document.getElementById('administratorButton').addEventListener('click', () => {
    window.location.href = '../Administrator/administratorOrders.html';
});

function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutContainer = document.getElementById('checkoutContainer');
    checkoutContainer.innerHTML = '';

    if (cart.length === 0) {
        checkoutContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach((ticket, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <p class="cart-item-info">${ticket.type} (x${ticket.quantity})</p>
            <p class="cart-item-info">${ticket.description}</p>
            <p class="cart-item-info">€${ticket.price} each</p>
            <button class="removeItemButton" data-index="${index}">REMOVE</button>
            <hr>
        `;

        itemDiv.querySelector('.removeItemButton').addEventListener('click', () => {
            removeItemFromCart(index);
        });

        checkoutContainer.appendChild(itemDiv);
    });

    const buyButton = document.createElement('button');
    buyButton.id = 'buyButton';
    buyButton.textContent = 'BUY';
    buyButton.addEventListener('click', () => {
        processOrder();
    });

    checkoutContainer.appendChild(buyButton);
}

function removeItemFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity -= 1;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

function processOrder() {
    const orderId = `#${Math.floor(Math.random() * 1000000)}`;
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const order = {
        orderId: orderId,
        items: cart,
    };

    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.removeItem('cart');
    alert(`Your order has been placed. Order ID: ${orderId}`);
    displayCartItems();
}

document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
});
