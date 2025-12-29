// Initial quotes array
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
const categoryFilter = document.getElementById('categoryFilter');
const addQuoteFormContainer = document.getElementById('addQuoteForm');

// ------------------------------
// Display Random Quote Function
// ------------------------------
function showRandomQuote() {
    let filteredQuotes = quotes;
    if (categoryFilter.value !== 'all') {
        filteredQuotes = quotes.filter(q => q.category === categoryFilter.value);
    }

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes in this category. Add one!";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}" — ${quote.category}`;
}

// ------------------------------
// Add Quote Function
// ------------------------------
function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');

    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (text && category) {
        const newQuote = { text, category };
        quotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        updateCategoryFilter();
        showRandomQuote();
        textInput.value = '';
        categoryInput.value = '';
    } else {
        alert("Both quote text and category are required!");
    }
}

// ------------------------------
// Create Add Quote Form Function
// ------------------------------
function createAddQuoteForm() {
    // Clear container
    addQuoteFormContainer.innerHTML = '';

    // Quote text input
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.id = 'newQuoteText';
    textInput.placeholder = 'Enter a new quote';

    // Category input
    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.id = 'newQuoteCategory';
    categoryInput.placeholder = 'Enter quote category';

    // Add button
    const addBtn = document.createElement('button');
    addBtn.id = 'addQuoteBtn';
    addBtn.textContent = 'Add Quote';
    addBtn.addEventListener('click', addQuote);

    // Append inputs and button
    addQuoteFormContainer.appendChild(textInput);
    addQuoteFormContainer.appendChild(categoryInput);
    addQuoteFormContainer.appendChild(addBtn);
}

// ------------------------------
// Update Category Filter Function
// ------------------------------
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
// Event Listeners
// ------------------------------
newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', showRandomQuote);

// ------------------------------
// Initial Setup
// ------------------------------
createAddQuoteForm();
updateCategoryFilter();
showRandomQuote();
