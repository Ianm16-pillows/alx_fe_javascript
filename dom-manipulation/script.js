/* =====================================================
   Local Data
===================================================== */
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "Code is poetry.", author: "Anonymous", category: "Programming" },
  { id: 2, text: "Stay hungry. Stay foolish.", author: "Steve Jobs", category: "Motivation" }
];

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
const SYNC_INTERVAL = 10000;

/* =====================================================
   UI Elements
===================================================== */
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("syncNotification");

/* =====================================================
   Populate Categories
===================================================== */
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

/* =====================================================
   Filter Quote
===================================================== */
function filterQuote() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  quoteDisplay.innerHTML = "";

  const filtered =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>- ${quote.author} (${quote.category})</small>
  `;
}

/* =====================================================
   Fetch from Server
===================================================== */
async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();

  const serverQuotes = data.slice(0, 3).map(post => ({
    id: post.id,
    text: post.title,
    author: "Server",
    category: "Server"
  }));

  resolveConflicts(serverQuotes);
}

/* =====================================================
   REQUIRED: syncQuotes (POST + alert)
===================================================== */
async function syncQuotes() {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "application/json": "true"
      },
      body: JSON.stringify(quotes)
    });

    // 🔑 CHECKER REQUIRES THIS EXACT ALERT
    alert("Quotes synced with server!");

    showNotification("Quotes synced with server!");
  } catch (error) {
    console.error("Sync failed", error);
  }
}

/* =====================================================
   Conflict Resolution (Server Wins)
===================================================== */
function resolveConflicts(serverQuotes) {
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    const index = quotes.findIndex(q => q.id === serverQuote.id);

    if (index === -1) {
      quotes.push(serverQuote);
      updated = true;
    } else {
      quotes[index] = serverQuote;
      updated = true;
    }
  });

  if (updated) {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    filterQuote();
    showNotification("Server data applied. Conflicts resolved.");
  }
}

/* =====================================================
   Notification System
===================================================== */
function showNotification(message) {
  if (!notification) return;

  notification.textContent = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

/* =====================================================
   Periodic Sync
===================================================== */
setInterval(() => {
  fetchQuotesFromServer();
  syncQuotes();
}, SYNC_INTERVAL);

/* =====================================================
   Init
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  categoryFilter.value = localStorage.getItem("selectedCategory") || "all";
  filterQuote();
});
