// ======== data & storage keys ========
const STORAGE_KEY = "df_quotes_v1";       // localStorage key
const SESSION_LAST_KEY = "df_last_quote"; // sessionStorage key

// Minimum quotes array (will be overwritten by storage if present)
let quotes = [
  { text: "Discipline over motivation.", category: "Mindset" },
  { text: "Code, create, repeat.", category: "Tech" },
  { text: "The grind pays off.", category: "Hustle" }
];

// ======== storage helpers ========
function saveQuotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch (err) {
    console.error("Failed to save quotes:", err);
  }
}

function loadQuotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // basic validation: ensure objects have text + category
        const valid = parsed.filter(q => q && typeof q.text === "string" && typeof q.category === "string");
        if (valid.length) quotes = valid;
      }
    }
  } catch (err) {
    console.error("Failed to load quotes:", err);
  }
}

// session storage demo: save last shown index
function saveLastShown(index) {
  try {
    sessionStorage.setItem(SESSION_LAST_KEY, String(index));
  } catch (err) {
    console.warn("session save failed", err);
  }
}

function getLastShown() {
  try {
    const v = sessionStorage.getItem(SESSION_LAST_KEY);
    return v === null ? null : Number(v);
  } catch (err) {
    return null;
  }
}

// ======== UI logic ========
function updateDisplayByIndex(idx) {
  const display = document.getElementById("quoteDisplay");
  if (!display) return;
  if (!quotes.length) {
    display.innerText = "No quotes available.";
    return;
  }
  const q = quotes[idx];
  display.innerText = `"${q.text}" — ${q.category}`;
  saveLastShown(idx);
}

function displayRandomQuote() {
  if (!Array.isArray(quotes) || !quotes.length) {
    const display = document.getElementById("quoteDisplay");
    if (display) display.innerText = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  updateDisplayByIndex(randomIndex);
}

// addQuote: reads inputs, validates, pushes to quotes, updates storage + DOM
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  if (!textInput || !categoryInput) return;

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  // show the newly added quote (last index)
  updateDisplayByIndex(quotes.length - 1);

  // clear inputs
  textInput.value = "";
  categoryInput.value = "";
}

// ======== JSON export/import ========
function exportToJsonFile() {
  try {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert("Export failed. See console for details.");
    console.error(err);
  }
}

function importFromJsonFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!Array.isArray(parsed)) {
        alert("Imported JSON must be an array of quote objects.");
        return;
      }
      // validate objects
      const valid = parsed.filter(q => q && typeof q.text === "string" && typeof q.category === "string");
      if (!valid.length) {
        alert("No valid quote objects found in file.");
        return;
      }
      // Merge: avoid duplicates (simple check by exact text+category)
      const existingKeys = new Set(quotes.map(q => `${q.text}|||${q.category}`));
      let added = 0;
      valid.forEach(q => {
        const key = `${q.text}|||${q.category}`;
        if (!existingKeys.has(key)) {
          quotes.push(q);
          existingKeys.add(key);
          added++;
        }
      });
      if (added) {
        saveQuotes();
        alert(`${added} new quote(s) imported successfully.`);
        // show the last imported quote
        updateDisplayByIndex(quotes.length - 1);
      } else {
        alert("No new quotes were added (duplicates skipped).");
      }
    } catch (err) {
      alert("Failed to parse JSON file. Check format.");
      console.error(err);
    }
  };
  reader.readAsText(file);
}

// ======== init & event wiring ========
document.addEventListener("DOMContentLoaded", () => {
  // attempt to load saved quotes first
  loadQuotes();

  // restore last-shown from session if present
  const last = getLastShown();
  if (last !== null && !Number.isNaN(last) && quotes[last]) {
    updateDisplayByIndex(last);
  } else {
    // show a random one on first load
    displayRandomQuote();
  }

  // Event listeners
  const showBtn = document.getElementById("newQuote");
  if (showBtn) showBtn.addEventListener("click", displayRandomQuote);

  const addBtn = document.getElementById("addQuoteBtn");
  if (addBtn) addBtn.addEventListener("click", addQuote);

  const exportBtn = document.getElementById("exportBtn");
  if (exportBtn) exportBtn.addEventListener("click", exportToJsonFile);

  const importInput = document.getElementById("importFile");
  if (importInput) {
    importInput.addEventListener("change", (evt) => {
      const f = evt.target.files && evt.target.files[0];
      if (f) importFromJsonFile(f);
      // reset input so same file can be chosen again if needed
      evt.target.value = "";
    });
  }
});
