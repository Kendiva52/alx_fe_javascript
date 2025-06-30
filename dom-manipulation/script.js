let quotes = [];

// Simulated server data
let serverQuotes = [
  { text: "Server wisdom prevails.", category: "server" },
  { text: "This is synced from the server.", category: "sync" }
];

// Load local storage or initialize default quotes
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "Believe in yourself.", category: "inspiration" },
      { text: "Life is short. Enjoy it.", category: "life" },
      { text: "Never stop learning.", category: "motivation" }
    ];
    saveQuotes();
  }
}

// Save to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  const display = document.getElementById("quoteDisplay");

  if (filtered.length === 0) {
    display.textContent = "No quotes available for this category.";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  display.textContent = `"${random.text}" — ${random.category}`;

  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim().toLowerCase();

  if (!text || !category) {
    alert("Please fill both quote and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  postToServer(newQuote); // sync to "server"
  alert("Quote added and synced!");

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Populate dropdown with categories
function populateCategories() {
  const categories = Array.from(new Set(quotes.map(q => q.category)));
  const filter = document.getElementById("categoryFilter");
  filter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    filter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    filter.value = savedFilter;
  }
}

// Filter quotes by category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// Export to JSON
function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Import from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid JSON");

      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      showNotification("Quotes imported successfully!");
    } catch (err) {
      alert("Import failed: Invalid file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Notify user
function showNotification(message) {
  const note = document.getElementById("notification");
  note.textContent = message;
  note.style.display = "block";

  setTimeout(() => {
    note.style.display = "none";
  }, 5000);
}

// Simulate POST to server
function postToServer(newQuote) {
  serverQuotes.push(newQuote);
  console.log("Posted to server:", newQuote);
}

// Simulate GET from server with conflict resolution
function fetchFromServer() {
  console.log("Checking for server updates...");

  let hasConflict = false;
  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(
      local => local.text === serverQuote.text
    );
    if (!exists) {
      quotes.push(serverQuote);
      hasConflict = true;
    }
  });

  if (hasConflict) {
    saveQuotes();
    populateCategories();
    showNotification("New quotes synced from server.");
  }
}

// Periodic sync every 20 seconds
setInterval(fetchFromServer, 20000);

// Load everything on start
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
loadQuotes();
populateCategories();
showRandomQuote();





    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      padding: 20px;
    }
    #quoteDisplay {
      padding: 20px;
      margin: 15px 0;
      background: #fff;
      border-left: 4px solid #007bff;
    }
    input, select, button {
      padding: 8px;
      margin: 5px;
    }
    #notification {
      display: none;
      background-color: #d1ecf1;
      border-left: 4px solid #0c5460;
      padding: 10px;
      margin-top: 10px;
    }
  