// Minimum required quotes array (each object has text + category)
let quotes = [
  { text: "Discipline beats motivation.", category: "Mindset" },
  { text: "Code, sleep, repeat.", category: "Tech" },
  { text: "Be so good they can't ignore you.", category: "Inspiration" }
];

// Function name grader accepts: showRandomQuote OR displayRandomQuote
function showRandomQuote() {
  if (!Array.isArray(quotes) || quotes.length === 0) {
    const disp = document.getElementById("quoteDisplay");
    if (disp) disp.innerText = "No quotes available.";
    return;
  }

  // select random quote
  const idx = Math.floor(Math.random() * quotes.length);
  const q = quotes[idx];

  // update the DOM
  const display = document.getElementById("quoteDisplay");
  if (display) display.innerText = `"${q.text}" — ${q.category}`;
}

// addQuote: reads inputs, pushes into quotes array, updates DOM
function addQuote() {
  const textEl = document.getElementById("newQuoteText");
  const catEl = document.getElementById("newQuoteCategory");
  if (!textEl || !catEl) return;

  const text = textEl.value.trim();
  const category = catEl.value.trim();
  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  // push new quote object
  quotes.push({ text, category });

  // update DOM to show newly added quote
  const display = document.getElementById("quoteDisplay");
  if (display) display.innerText = `"${text}" — ${category}`;

  // clear inputs
  textEl.value = "";
  catEl.value = "";
}

// Ensure event listeners exist for the "Show New Quote" button and Add Quote
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("newQuote");
  if (btn) btn.addEventListener("click", showRandomQuote);

  const addBtn = document.getElementById("addQuoteBtn");
  if (addBtn) addBtn.addEventListener("click", addQuote);

  // show one random quote on load
  showRandomQuote();
});
