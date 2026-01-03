/* =====================================================
   Local Quotes (Source of Truth until Server Says No)
===================================================== */
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "Code is poetry.", author: "Anonymous", category: "Programming" },
  { id: 2, text: "Stay hungry. Stay foolish.", author: "Steve Jobs", category: "Motivation" }
];

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
const SYNC_INTERVAL = 10000; // 10 seconds

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
   Filter Quote (REQUIRED)
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
   SERVER SYNC (Simulation)
===================================================== */
async function fetchServerQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Simulate server quotes
    const serverQuotes = serverData.slice(0, 3).map(post => ({
      id: post.id,
      text: post.title,
      author: "Server",
      category: "Server"
    }));

    resolveConflicts(serverQuotes);
  } catch (error) {
    console.error("Server sync failed:", error);
  }
}

/* =====================================================
   CONFLICT RESOLUTION (SERVER WINS)
===================================================== */
function resolveConflicts(serverQuotes) {
  let conflictDetected = false;

  serverQuotes.forEach(serverQuote => {
    const localIndex = quotes.findIndex(q => q.id === serverQuote.id);

    if (localIndex === -1) {
      quotes.push(serverQuote);
      conflictDetected = true;
    } else {
      // SERVER TAKES PRECEDENCE
      quotes[localIndex] = serverQuote;
      conflictDetected = true;
    }
  });

  if (conflictDetected) {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    showNotification("Quotes synced with server. Conflicts resolved.");
    populateCategories();
    filterQuote();
  }
}

/* =====================================================
   Manual Conflict Resolution
===================================================== */
function manualResolve() {
  fetchServerQuotes();
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
setInterval(fetchServerQuotes, SYNC_INTERVAL);

/* =====================================================
   Init on Load
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  categoryFilter.value =
    localStorage.getItem("selectedCategory") || "all";
  filterQuote();
});
