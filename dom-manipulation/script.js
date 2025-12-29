// Initial quote array
let quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Motivation" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Humor" },
    { text: "Simplicity is the soul of efficiency.", category: "Wisdom" }
];

// Load quotes from localStorage if available
if (localStorage.getItem('quotes')) {
    quotes = JSON.parse(localStorage.getItem('quotes'));
}

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');

// Show random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available. Add one!";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

// Add new quote
function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();
    if (text && category) {
        const newQuote = { text, category };
        quotes.push(newQuote);
        // Save to localStorage
        localStorage.setItem('quotes', JSON.stringify(quotes));
        // Update display
        showRandomQuote();
        // Clear inputs
        newQuoteText.value = '';
        newQuoteCategory.value = '';
    } else {
        alert("Both quote text and category are required!");
    }
}

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);

// Show a quote on load
showRandomQuote();

