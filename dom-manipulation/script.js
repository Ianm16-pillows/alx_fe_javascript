// Quotes data
let quotes = [
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", category: "Motivation" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "Programming" },
  { text: "Life is 10% what happens to you and 90% how you react.", author: "Charles R. Swindoll", category: "Motivation" }
];

// Restore saved category
let savedCategory = localStorage.getItem("selectedCategory") || "all";

/* ======================================================
   REQUIRED FUNCTION: populateCategories
   Extracts unique categories and populates dropdown
====================================================== */
function populateCategories() {
  const select = document.getElementById("categoryFilter");

  const categories = [...new Set(quotes.map(q => q.category))];

  // Remove existing options except "all"
  select.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
}

/* ======================================================
   REQUIRED FUNCTION: filterQuote
   Filters and updates displayed quotes
====================================================== */
function filterQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  // Save selected category
  localStorage.setItem("selectedCategory", selectedCategory);

  const container = document.getElementById("quoteContainer");
  container.innerHTML = "";

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    container.innerHTML = "<p>No quotes found.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  const div = document.createElement("div");
  div.className = "quote";
  div.innerHTML = `<strong>${quote.text}</strong><br>— ${quote.author} <em>(${quote.category})</em>`;
  container.appendChild(div);
}

/* ======================================================
   Add new quote and update categories
====================================================== */
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const author = document.getElementById("quoteAuthor").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (!text || !author || !category) {
    alert("Fill all fields");
    return;
  }

  quotes.push({ text, author, category });

  populateCategories();
  filterQuote();

  document.getElementById("quoteText").value = "";
  document.getElementById("quoteAuthor").value = "";
  document.getElementById("quoteCategory").value = "";
}

/* ======================================================
   Restore state on page load
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  document.getElementById("categoryFilter").value = savedCategory;
  filterQuote();
});
