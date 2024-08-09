document.getElementById('returnToRedirectionButton').addEventListener('click', () => {
    window.location.href = '../index.html';
});

document.getElementById('orders').addEventListener('click', () => {
    window.location.href = 'Administrator Orders.html';
});

document.getElementById('tickets').addEventListener('click', () => {
    window.location.href = 'Administrator Tickets.html';
});

function displayOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderContainer = document.getElementById('orderContainer');
    orderContainer.innerHTML = '';

    if (orders.length === 0) {
        orderContainer.innerHTML = '<p id="nothing">No orders have been placed.</p>';
        return;
    }

    orders.forEach(orderId => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-item';
        orderDiv.innerHTML = `
            <p class="order-item-info">Order ID: ${orderId}</p>
        `;
        orderContainer.appendChild(orderDiv);
    });
}

document.getElementById('resetData').addEventListener('click', () => {
    localStorage.removeItem('orders');
    displayOrders();
});

document.addEventListener('DOMContentLoaded', () => {
    displayOrders();
});
