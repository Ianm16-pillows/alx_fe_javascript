// Quotes array
let quotes = [
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", category: "Motivation" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "Programming" },
  { text: "Life is 10% what happens to you and 90% how you react.", author: "Charles R. Swindoll", category: "Motivation" }
];

// Load saved category or default
let savedCategory = localStorage.getItem("selectedCategory") || "all";

/* =====================================================
   REQUIRED: populateCategories
===================================================== */
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

/* =====================================================
   REQUIRED: filterQuote
===================================================== */
function filterQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  // Save selected category
  localStorage.setItem("selectedCategory", selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  const div = document.createElement("div");
  div.className = "quote";
  div.innerHTML = `
    <p>"${quote.text}"</p>
    <small>- ${quote.author} (${quote.category})</small>
  `;

  quoteDisplay.appendChild(div);
}

/* =====================================================
   Add new quote + update categories
===================================================== */
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const author = document.getElementById("quoteAuthor").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (!text || !author || !category) {
    alert("All fields are required");
    return;
  }

  quotes.push({ text, author, category });

  populateCategories();
  filterQuote();

  document.getElementById("quoteText").value = "";
  document.getElementById("quoteAuthor").value = "";
  document.getElementById("quoteCategory").value = "";
}

/* =====================================================
   Restore state on page load
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  document.getElementById("categoryFilter").value = savedCategory;
  filterQuote();
});
