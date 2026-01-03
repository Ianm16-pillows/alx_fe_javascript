// Initial quotes array
let quotes = [
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", category: "Motivation" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "Programming" },
  { text: "Life is 10% what happens to you and 90% how you react.", author: "Charles R. Swindoll", category: "Motivation" }
];

// Load last selected category from localStorage
let lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  document.getElementById("categoryFilter").value = lastSelectedCategory;
  filterQuotes();
});

// Populate unique categories dynamically
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];
  
  // Remove old options except "All"
  select.querySelectorAll("option:not([value='all'])").forEach(opt => opt.remove());
  
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// Display filtered quotes
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  
  const container = document.getElementById("quoteContainer");
  container.innerHTML = "";

  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    container.innerHTML = "<p>No quotes found in this category.</p>";
  } else {
    filtered.forEach(q => {
      const div = document.createElement("div");
      div.className = "quote";
      div.innerHTML = `<strong>${q.text}</strong><br>— ${q.author} <em>(${q.category})</em>`;
      container.appendChild(div);
    });
  }
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const author = document.getElementById("quoteAuthor").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();
  
  if (!text || !author || !category) {
    alert("Please fill all fields!");
    return;
  }

  const newQuote = { text, author, category };
  quotes.push(newQuote);

  // Clear input fields
  document.getElementById("quoteText").value = "";
  document.getElementById("quoteAuthor").value = "";
  document.getElementById("quoteCategory").value = "";

  populateCategories();
  filterQuotes();
}
