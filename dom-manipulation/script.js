/* =====================================================
   Local Quotes
===================================================== */
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "Code is poetry.", author: "Anonymous", category: "Programming" },
  { id: 2, text: "Stay hungry. Stay foolish.", author: "Steve Jobs", category: "Motivation" }
];

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
const SYNC_INTERVAL = 10000;

/* =====================================================
   UI References
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

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
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

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>- ${quote.author} (${quote.category})</small>
  `;
}

/* =====================================================
   REQUIRED: fetchQuotesFromServer
===================================================== */
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    const serverQuotes = data.slice(0, 3).map(post => ({
      id: post.id,
      text: post.title,
      author: "Server",
      category: "Server"
    }));

    resolveConflicts(serverQuotes);
  } catch (error) {
    console.error("Failed to fetch server quotes", error);
  }
}

/* =====================================================
   Conflict Resolution (SERVER WINS)
===================================================== */
function resolveConflicts(serverQuotes) {
  let conflictResolved = false;

  serverQuotes.forEach(serverQuote => {
    const index = quotes.findIndex(q => q.id === serverQuote.id);

    if (index === -1) {
      quotes.push(serverQuote);
      conflictResolved = true;
    } else {
      quotes[index] = serverQuote; // server wins
      conflictResolved = true;
    }
  });

  if (conflictResolved) {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    showNotification("Data synced from server. Conflicts resolved.");
    populateCategories();
    filterQuote();
  }
}

/* =====================================================
   Manual Conflict Resolution
===================================================== */
function manualResolve() {
  fetchQuotesFromServer();
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
setInterval(fetchQuotesFromServer, SYNC_INTERVAL);

/* =====================================================
   Init
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  categoryFilter.value = localStorage.getItem("selectedCategory") || "all";
  filterQuote();
});
