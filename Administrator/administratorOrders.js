document.getElementById('returnToRedirectionButton').addEventListener('click', () => {
    window.location.href = '../index.html';
});

document.getElementById('orders').addEventListener('click', () => {
    window.location.href = 'administratorOrders.html';
});

document.getElementById('tickets').addEventListener('click', () => {
    window.location.href = 'administratorTickets.html';
});

function displayOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderContainer = document.getElementById('orderContainer');
    orderContainer.innerHTML = '';

    if (orders.length === 0) {
        orderContainer.innerHTML = '<p id="nothing">No orders have been placed.</p>';
        return;
    }

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-item';
        orderDiv.innerHTML = `
            <h3 class="order-item-info">Order ID: ${order.orderId}</h3>
            <div class="order-items">
                ${order.items.map(item => `
                    <p class="order-item-info">${item.type} (x${item.quantity}) - €${item.price} each</p>
                `).join('')}
            </div>
        `;
        orderContainer.appendChild(orderDiv);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayOrders();
});

document.getElementById('resetData').addEventListener('click', () => {
    localStorage.removeItem('orders');
    displayOrders();
});

document.addEventListener('DOMContentLoaded', () => {
    displayOrders();
});
