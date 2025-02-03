const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
    { text: "Do what you can, with what you have, where you are.", category: "Wisdom" }
];

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p><strong>"${quotes[randomIndex].text}"</strong> - ${quotes[randomIndex].category}</p>`;
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quotes[randomIndex])); // Save last viewed quote in session storage
}

// Function to create the Add Quote form dynamically
function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
        <button onclick="exportToJsonFile()">Export Quotes</button>
        <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
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
    saveQuotes(); // Save updated quotes to local storage
    textInput.value = "";
    categoryInput.value = "";
    showRandomQuote(); // Update the DOM with the new quote
    alert("Quote added successfully!");
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                alert("Quotes imported successfully!");
            } else {
                alert("Invalid JSON format.");
            }
        } catch (error) {
            alert("Error reading JSON file.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Load last viewed quote from session storage (if available)
document.addEventListener("DOMContentLoaded", () => {
    const lastViewedQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
    if (lastViewedQuote) {
        const quoteDisplay = document.getElementById("quoteDisplay");
        quoteDisplay.innerHTML = `<p><strong>"${lastViewedQuote.text}"</strong> - ${lastViewedQuote.category}</p>`;
    }
    
    const button = document.createElement("button");
    button.textContent = "Show New Quote";
    button.addEventListener("click", showRandomQuote);
    document.body.appendChild(button);
});
