const quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
    { text: "Do what you can, with what you have, where you are.", category: "Wisdom" }
];

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p><strong>"${quotes[randomIndex].text}"</strong> - ${quotes[randomIndex].category}</p>`;
}

// Function to create the Add Quote form dynamically
function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(formContainer);
}

// Function to add a new quote dynamically
function addQuote() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");
    
    if (textInput.value.trim() === "" || categoryInput.value.trim() === "") {
        alert("Please enter both quote text and category.");
        return;
    }

    const newQuote = {
        text: textInput.value,
        category: categoryInput.value
    };
    
    quotes.push(newQuote);
    textInput.value = "";
    categoryInput.value = "";
    showRandomQuote(); // Update the DOM with the new quote
    alert("Quote added successfully!");
}

// Create and append the Show New Quote button
document.addEventListener("DOMContentLoaded", () => {
    const button = document.createElement("button");
    button.textContent = "Show New Quote";
    button.addEventListener("click", showRandomQuote);
    document.body.appendChild(button);
});
