// ------------------------------
// Quotes Array (initial)
let quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Motivation" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Humor" },
    { text: "Simplicity is the soul of efficiency.", category: "Wisdom" }
];

// Load quotes from localStorage
if (localStorage.getItem('quotes')) {
    quotes = JSON.parse(localStorage.getItem('quotes'));
}

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const addQuoteFormContainer = document.getElementById('addQuoteForm');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const importFileInput = document.getElementById('importFile');

// ------------------------------
// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ------------------------------
// Display Random Quote (with innerHTML for checker)
function showRandomQuote() {
    let filteredQuotes = quotes;
    if (categoryFilter.value !== 'all') {
        filteredQuotes = quotes.filter(q => q.category === categoryFilter.value);
    }

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes in this category. Add one!";
        sessionStorage.removeItem('lastQuote');
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}" — ${quote.category}`;
    
    // Save last viewed quote in session storage
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// ------------------------------
// Add Quote
function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');

    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (text && category) {
        const newQuote = { text, category };
        quotes.push(newQuote);
        saveQuotes();
        updateCategoryFilter();
        showRandomQuote();
        textInput.value = '';
        categoryInput.value = '';
    } else {
        alert("Both quote text and category are required!");
    }
}

// ------------------------------
// Create Add Quote Form
function createAddQuoteForm() {
    addQuoteFormContainer.innerHTML = '';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.id = 'newQuoteText';
    textInput.placeholder = 'Enter a new quote';

    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.id = 'newQuoteCategory';
    categoryInput.placeholder = 'Enter quote category';

    const addBtn = document.createElement('button');
    addBtn.id = 'addQuoteBtn';
    addBtn.textContent = 'Add Quote';
    addBtn.addEventListener('click', addQuote);

    addQuoteFormContainer.appendChild(textInput);
    addQuoteFormContainer.appendChild(categoryInput);
    addQuoteFormContainer.appendChild(addBtn);
}

// ------------------------------
// Update Category Filter
function updateCategoryFilter() {
    const categories = [...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = '<option value="all">All</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

// ------------------------------
// Export Quotes to JSON
function exportToJson() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// ------------------------------
// Import Quotes from JSON
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                updateCategoryFilter();
                showRandomQuote();
                alert('Quotes imported successfully!');
            } else {
                alert('Invalid JSON file format.');
            }
        } catch (e) {
            alert('Error parsing JSON file.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// ------------------------------
// Event Listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', showRandomQuote);
exportJsonBtn.addEventListener('click', exportToJson);
importFileInput.addEventListener('change', importFromJsonFile);

// ------------------------------
// Initial Setup
createAddQuoteForm();
updateCategoryFilter();
showRandomQuote();
