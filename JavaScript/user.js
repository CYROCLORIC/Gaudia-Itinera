async function fetchAndSaveTickets() {
    try {
        const response = await fetch('JSON/tickets.json');
        const jsonData = await response.json();
        localStorage.setItem('tickets', JSON.stringify(jsonData.tickets));
        return jsonData.tickets;
    } catch (error) {
        console.error('Failed to fetch tickets:', error);
        return [];
    }
}

function addToCart(ticket) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingTicket = cart.find(item => item.type === ticket.type);

    if (existingTicket) {
        existingTicket.quantity += 1;
    } else {
        cart.push({ ...ticket, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

function displayTickets(tickets) {
    const ticketContainer = document.getElementById('ticketContainer');
    if (!ticketContainer) return;
    ticketContainer.innerHTML = '';

    tickets.forEach(ticket => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <p class="cardInformation">${ticket.type}</p>
            <p class="cardInformation">${ticket.description}</p>
            <p class="cardInformation">€${ticket.price}</p>
            <button class="addToCartButton">ADD TO CART</button>
        `;

        card.querySelector('.addToCartButton').addEventListener('click', () => {
            addToCart(ticket);
        });

        ticketContainer.appendChild(card);
    });
}

function displayCartItems(message = null) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutContainer = document.getElementById('checkoutContainer');
    if (!checkoutContainer) return;
    checkoutContainer.innerHTML = '';

    if (cart.length === 0) {
        checkoutContainer.innerHTML = `<p>${message || 'Your cart is empty.'}</p>`;
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

    const totalPrice = cart.reduce((total, ticket) => total + ticket.price * ticket.quantity, 0);

    localStorage.setItem('totalPrice', totalPrice);

    const totalPriceBox = document.createElement('div');
    totalPriceBox.id = 'totalPriceBox';
    totalPriceBox.className = 'totalPriceBox';
    totalPriceBox.textContent = `Total: €${totalPrice.toFixed(2)}`;

    const buyButton = document.createElement('button');
    buyButton.id = 'buyButton';
    buyButton.textContent = 'BUY';
    buyButton.addEventListener('click', () => {
        processOrder();
    });

    checkoutContainer.appendChild(totalPriceBox);
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
    const totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

    if (cart.length === 0) {
        displayCartItems('Your cart is empty.');
        return;
    }

    const order = {
        orderId: orderId,
        items: cart,
        totalPrice: totalPrice,
    };

    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.removeItem('cart');
    localStorage.removeItem('totalPrice');

    displayCartItems(`Your order has been placed. Order ID: ${orderId}`);
}

document.addEventListener('DOMContentLoaded', async () => {
    const ticketContainer = document.getElementById('ticketContainer');
    if (ticketContainer) {
        let tickets = JSON.parse(localStorage.getItem('tickets'));
        if (!tickets || tickets.length === 0) {
            tickets = await fetchAndSaveTickets();
        }
        displayTickets(tickets);
    }

    const checkoutContainer = document.getElementById('checkoutContainer');
    if (checkoutContainer) {
        displayCartItems();
    }
});
