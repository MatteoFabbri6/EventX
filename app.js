document.addEventListener("DOMContentLoaded", function() {
    const ticketForm = document.getElementById("ticketForm");
    const ticketsList = document.getElementById("ticketsList");

    ticketForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const ticket = {
            eventName: document.getElementById("eventName").value,
            date: document.getElementById("date").value,
            location: document.getElementById("location").value,
            askPrice: parseFloat(document.getElementById("askPrice").value)
        };

        // Mock function to simulate adding to a database
        addTicket(ticket);

        ticketForm.reset();
        displayTickets();
    });

    function addTicket(ticket) {
        let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
        tickets.push(ticket);
        localStorage.setItem("tickets", JSON.stringify(tickets));
    }

    function displayTickets() {
        const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
        ticketsList.innerHTML = tickets.map(ticket => `
            <li>${ticket.eventName} - ${ticket.date} at ${ticket.location} ($${ticket.askPrice})</li>
        `).join("");
    }

    displayTickets();
});
