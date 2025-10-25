// script.js

// Initialize quotes array (pull from localStorage if available)
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Discipline equals freedom.", category: "Motivation" },
  { text: "Stay hungry, stay foolish.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Push yourself because no one else is going to do it for you.", category: "Motivation" }
];

// DOM Elements
const quoteContainer = document.getElementById("quoteContainer");
const categoryFilter = document.getElementById("categoryFilter");

// --- Step 1: Populate categories dynamically ---
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories.map(cat => 
    `<option value="${cat}">${cat}</option>`
  ).join("");

  // Restore last selected category
  const lastFilter = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = lastFilter;
  filterQuotes();
}

// --- Step 2: Filter quotes based on selected category ---
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);

  const filteredQuotes = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  displayQuotes(filteredQuotes);
}

// --- Step 3: Display quotes ---
function displayQuotes(quotesToDisplay) {
  quoteContainer.innerHTML = quotesToDisplay.map(q =>
    `<div class="quote"><p>"${q.text}"</p><small>${q.category}</small></div>`
  ).join("");
}

// --- Step 4: Add new quote + update categories in real time ---
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (!text || !category) return alert("Please fill in both fields.");

  const newQuote = { text, category };
  quotes.push(newQuote);

  // Save to localStorage
  localStorage.setItem("quotes", JSON.stringify(quotes));

  // Update UI and categories dynamically
  populateCategories();
  filterQuotes();

  // Clear input fields
  document.getElementById("quoteText").value = "";
  document.getElementById("quoteCategory").value = "";
}

// --- On Page Load ---
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
});
