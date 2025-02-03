// Define the endpoint for simulating server interaction (mock API)
const SERVER_API_URL = "https://jsonplaceholder.typicode.com/posts";

// Initial quotes array, with a fallback if localStorage is empty
const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
    { text: "Do what you can, with what you have, where you are.", category: "Wisdom" }
];

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to show a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p><strong>"${quotes[randomIndex].text}"</strong> - ${quotes[randomIndex].category}</p>`;
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quotes[randomIndex])); // Save last viewed quote in session storage
}

// Function to fetch quotes from the mock server (simulating server interaction)
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_API_URL);
        const serverQuotes = await response.json();

        // Simulate conflict resolution: Server data takes precedence
        syncQuotes(serverQuotes);
    } catch (error) {
        console.error("Failed to fetch quotes from server:", error);
    }
}

// Function to handle syncing data and resolving conflicts
function syncQuotes(serverQuotes) {
    // In a real-world scenario, you'd compare timestamps, versioning, or similar conflict resolution.
    // For simplicity, we'll replace the local data with the server's data if there's a discrepancy.

    if (serverQuotes.length !== quotes.length) {
        quotes.length = 0; // Clear the local quotes array
        quotes.push(...serverQuotes); // Push new server data
        saveQuotes(); // Save updated data to local storage
        alert("Quotes have been updated from the server!"); // UI notification for data update
        showRandomQuote(); // Display updated quote
    } else {
        alert("No changes detected between local and server data.");
    }
}

// Function to post a new quote to the server (simulating posting data)
async function postQuoteToServer(newQuote) {
    try {
        const response = await fetch(SERVER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newQuote)
        });

        if (response.ok) {
            alert("New quote has been posted to the server!"); // UI notification
            fetchQuotesFromServer(); // After posting, fetch and sync data
        } else {
            alert("Failed to post the quote to the server.");
        }
    } catch (error) {
        console.error("Error posting quote to the server:", error);
    }
}

// Function to add a new quote
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
    saveQuotes(); // Save updated quotes to local storage
    textInput.value = "";
    categoryInput.value = "";
    showRandomQuote(); // Update the DOM with the new quote
    alert("Quote added successfully!");

    // Post the new quote to the server
    postQuoteToServer(newQuote);
}

// Function to sync quotes every 30 seconds (simulating periodic updates from the server)
setInterval(fetchQuotesFromServer, 30000);

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
    const lastViewedQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
    if (lastViewedQuote) {
        const quoteDisplay = document.getElementById("quoteDisplay");
        quoteDisplay.innerHTML = `<p><strong>"${lastViewedQuote.text}"</strong> - ${lastViewedQuote.category}</p>`;
    }

    // Set up the "Show New Quote" button
    const newQuoteButton = document.getElementById("newQuote");
    newQuoteButton.addEventListener("click", showRandomQuote);

    // Optionally, you could display the first quote when the page loads
    showRandomQuote();
});
