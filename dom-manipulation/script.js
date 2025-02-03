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

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p><strong>"${quotes[randomIndex].text}"</strong> - ${quotes[randomIndex].category}</p>`;
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quotes[randomIndex])); // Save last viewed quote in session storage
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
    
    // Update category filter dynamically
    populateCategories();
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
                showRandomQuote(); // Optionally show a new quote after import
                populateCategories(); // Update categories in the dropdown
            } else {
                alert("Invalid JSON format.");
            }
        } catch (error) {
            alert("Error reading JSON file.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to populate categories in the dropdown dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    
    // Use map to extract categories from the quotes
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    // Clear existing options
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Add new options
    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore the last selected category filter from local storage
    const lastFilter = localStorage.getItem("lastSelectedFilter") || "all";
    categoryFilter.value = lastFilter;
    filterQuotes(); // Filter quotes based on the last selected category
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const quoteDisplay = document.getElementById("quoteDisplay");

    let filteredQuotes;
    if (selectedCategory === "all") {
        filteredQuotes = quotes;
    } else {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }

    // Update the display with filtered quotes
    quoteDisplay.innerHTML = "";
    filteredQuotes.forEach(quote => {
        quoteDisplay.innerHTML += `<p><strong>"${quote.text}"</strong> - ${quote.category}</p>`;
    });

    // Save the selected filter to local storage
    localStorage.setItem("lastSelectedFilter", selectedCategory);
}

// Load last viewed quote from session storage (if available)
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
    
    // Populate categories
    populateCategories();
});
