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
// Populate Categories
function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    // Restore last selected filter from localStorage
    const lastFilter = localStorage.getItem('lastCategoryFilter');
    if (lastFilter && categories.includes(lastFilter)) {
        categoryFilter.value = lastFilter;
    }
}

// ------------------------------
// Filter and display quotes
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('lastCategoryFilter', selectedCategory);

    let filteredQuotes = quotes;
    if (selectedCategory !== 'all') {
        filteredQuotes
