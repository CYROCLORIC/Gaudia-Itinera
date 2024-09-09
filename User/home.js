document.getElementById('homeButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.getElementById('cartButton').addEventListener('click', () => {
    window.location.href = 'User/cart.html';
});

document.getElementById('administratorButton').addEventListener('click', () => {
    window.location.href = 'Administrator/administratorOrders.html';
});

async function fetchAndSaveTickets() {
    try {
        const response = await fetch('../JSON/tickets.json');
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
    alert(`${ticket.type} added to cart!`);
}

function displayTickets(tickets) {
    const ticketContainer = document.getElementById('ticketContainer');
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

document.addEventListener('DOMContentLoaded', async () => {
    let tickets = JSON.parse(localStorage.getItem('tickets'));

    if (!tickets || tickets.length === 0) {
        tickets = await fetchAndSaveTickets();
    }

    displayTickets(tickets);
});
