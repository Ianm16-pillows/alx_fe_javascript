let quotes = [
  { text: "Discipline beats motivation.", category: "Mindset" },
  { text: "Code, sleep, repeat.", category: "Tech" },
];

function showRandomQuote() {
  const random = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerText = `"${quotes[random].text}" — ${quotes[random].category}`;
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (text && category) {
    quotes.push({ text, category });
    document.getElementById("quoteDisplay").innerText = `"${text}" — ${category}`;
  }
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
