document.getElementById('returnToRedirectionButton').addEventListener('click', () => {
    window.location.href = '../index.html';
});

document.getElementById('orders').addEventListener('click', () => {
    window.location.href = 'Administrator Orders.html';
});

document.getElementById('tickets').addEventListener('click', () => {
    window.location.href = 'Administrator Tickets.html';
});

document.getElementById('resetStorage').addEventListener('click', resetLocalStorageAndFetchData);

document.addEventListener('DOMContentLoaded', async () => {
    let tickets = JSON.parse(localStorage.getItem('tickets'));

    if (!Array.isArray(tickets)) {
        await fetchAndStoreTickets();
    } else {
        displayTickets(tickets);
    }
});

async function fetchAndStoreTickets() {
    try {
        const response = await fetch('../JSON/Tickets.json');
        const jsonData = await response.json();
        const tickets = jsonData.tickets;
        
        if (Array.isArray(tickets)) {
            localStorage.setItem('tickets', JSON.stringify(tickets));
            displayTickets(tickets);
        } else {
            console.error('Error: Tickets data is not an array');
        }
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

async function resetLocalStorageAndFetchData() {
    localStorage.clear();
    await fetchAndStoreTickets();
}

function displayTickets(tickets) {
    const ticketContainer = document.getElementById('ticketContainer');
    ticketContainer.innerHTML = '';

    tickets.forEach((ticket, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <p class="cardInformation" data-index="${index}" data-key="type">${ticket.type}</p>
            <p class="cardInformation" data-index="${index}" data-key="price">€${ticket.price}</p>
            <p class="cardInformation" data-index="${index}" data-key="description">${ticket.description}</p>
            <button class="deleteTicketButton" data-index="${index}">DELETE</button>
        `;
        ticketContainer.appendChild(card);
    });

    const addCard = document.createElement('div');
    addCard.className = 'card';
    addCard.innerHTML = `
        <p class="addCardText">Add New Ticket</p>
    `;
    addCard.addEventListener('click', () => {
        showAddTicketForm();
    });
    ticketContainer.appendChild(addCard);

    document.querySelectorAll('.cardInformation').forEach(element => {
        element.addEventListener('click', handleEdit);
    });

    document.querySelectorAll('.deleteTicketButton').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

function handleEdit(event) {
    const element = event.target;
    const originalText = element.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalText.includes('€') ? originalText.slice(1) : originalText; // Remove € for price editing
    input.className = 'editInput';

    element.replaceWith(input);

    input.focus();

    input.addEventListener('blur', () => {
        saveEdit(input, element);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveEdit(input, element);
        }
    });
}

function saveEdit(input, element) {
    const newValue = input.value;
    const index = element.getAttribute('data-index');
    const key = element.getAttribute('data-key');

    let tickets = JSON.parse(localStorage.getItem('tickets'));
    if (key === 'price') {
        tickets[index][key] = parseFloat(newValue);
        element.textContent = `€${newValue}`;
    } else {
        tickets[index][key] = newValue;
        element.textContent = newValue;
    }
    
    localStorage.setItem('tickets', JSON.stringify(tickets));

    input.replaceWith(element);
}

function showAddTicketForm() {
    const addCard = document.querySelector('.addCardText').parentElement;
    addCard.innerHTML = `
        <input type="text" id="newTicketType" placeholder="Ticket Type">
        <input type="text" id="newTicketPrice" placeholder="Ticket Price">
        <input type="text" id="newTicketDescription" placeholder="Ticket Description">
        <button id="saveNewTicket">Save</button>
        <button id="cancelNewTicket">Cancel</button>
    `;

    const saveButton = document.getElementById('saveNewTicket');
    const cancelButton = document.getElementById('cancelNewTicket');

    saveButton.addEventListener('click', saveNewTicket);

    ['newTicketType', 'newTicketPrice', 'newTicketDescription'].forEach(id => {
        document.getElementById(id).addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                saveNewTicket();
            }
        });
    });

    cancelButton.addEventListener('click', () => {
        const tickets = JSON.parse(localStorage.getItem('tickets'));
        displayTickets(tickets);
    });
}

function saveNewTicket() {
    const type = document.getElementById('newTicketType').value;
    const price = parseFloat(document.getElementById('newTicketPrice').value);
    const description = document.getElementById('newTicketDescription').value;

    if (!type || isNaN(price) || !description) {
        alert('Please fill in all fields with valid data.');
        return;
    }

    const newTicket = { type, price, description };

    let tickets = JSON.parse(localStorage.getItem('tickets'));
    tickets.push(newTicket);
    localStorage.setItem('tickets', JSON.stringify(tickets));

    displayTickets(tickets);
}

function handleDelete(event) {
    const index = event.target.getAttribute('data-index');

    let tickets = JSON.parse(localStorage.getItem('tickets'));
    tickets.splice(index, 1);
    localStorage.setItem('tickets', JSON.stringify(tickets));

    displayTickets(tickets);
}