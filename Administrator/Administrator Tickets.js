document.getElementById(`returnToRedirectionButton`).addEventListener(`click`, () => {
    window.location.href = `../index.html`;
});

document.getElementById(`orders`).addEventListener(`click`, () => {
    window.location.href = `Administrator Orders.html`;
});

document.getElementById(`tickets`).addEventListener(`click`, () => {
    window.location.href = `Administrator Tickets.html`;
});

document.addEventListener(`DOMContentLoaded`, async () => {
    const response = await fetch('../JSON/Tickets.json');
    const jsonData = await response.json();
    const jsonString = JSON.stringify(jsonData);
    localStorage.setItem('tickets', jsonString);

    jsonData.tickets.forEach(ticket => {
        const card = document.createElement(`div`);
        card.className = `card`;
        card.innerHTML = `
            <p class="cardInformation">${ticket.type}</p>
            <p class="cardInformation">€${ticket.price}</p>
            <p class="cardInformation">${ticket.description}</p>
        `;
        document.getElementById(`ticketContainer`).prepend(card);
    });

    document.querySelector(`.cardInformation`).addEventListener(`click`, () => {
        console.log(`idk`);
    });
});