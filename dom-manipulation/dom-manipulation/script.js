// quotes array with objects containing text and category
let quotes = [
  { text: "Discipline over motivation.", category: "Mindset" },
  { text: "Code, create, repeat.", category: "Tech" },
  { text: "The grind pays off.", category: "Hustle" }
];

// displayRandomQuote function: picks a random quote and updates DOM
function displayRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  if (!display) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  display.innerText = `"${quote.text}" — ${quote.category}`;
}

// addQuote function: adds a new quote and updates DOM
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    displayRandomQuote();
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please fill in both fields.");
  }
}

// Event listener for “Show New Quote” button
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("newQuote");
  if (button) {
    button.addEventListener("click", displayRandomQuote);
  }
});
