// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const categoryFilter = document.getElementById('categoryFilter');

// Populate category filter dynamically
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

// Show random quote (with filter)
function showRandomQuote() {
    let filteredQuotes = quotes;
    if (categoryFilter.value !== 'all') {
        filteredQuotes = quotes.filter(q => q.category === categoryFilter.value);
    }

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes in this category. Add one!";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

// Add new quote
function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();
    if (text && category) {
        const newQuote = { text, category };
        quotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        updateCategoryFilter();
        showRandomQuote();
        newQuoteText.value = '';
        newQuoteCategory.value = '';
    } else {
        alert("Both quote text and category are required!");
    }
}

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
categoryFilter.addEventListener('change', showRandomQuote);

// Initial setup
updateCategoryFilter();
showRandomQuote();
