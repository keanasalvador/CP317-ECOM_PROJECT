
//product ID
const PRODUCTS = [
  { id: "p1", name: "Samsung TV 4K", category: "Electronics", price: 499.00, icon: "📺" },
  { id: "p2", name: "T-Shirt", category: "Clothing", price: 25.00, icon: "👕" },
  { id: "p3", name: "Catcher in the Rye", category: "Books", price: 45.00, icon: "📘" },
  { id: "p4", name: "Wireless Headphones", category: "Electronics", price: 120.00, icon: "🎧" },
  { id: "p5", name: "Modern Sofa", category: "Furniture", price: 850.00, icon: "🛋️" },
];

const CATEGORIES = ["All", "Electronics", "Clothing", "Books", "Furniture"];

//FILTER
const state = {
  selectedCategory: "All",
  searchQuery: ""
};

const categoryRow = document.getElementById("categoryRow");
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

function money(n) {
  return `$${n.toFixed(2)}`;
}


function renderCategories() {
  categoryRow.innerHTML = CATEGORIES.map(cat => {
    const active = cat === state.selectedCategory ? "active" : "";
    return `<button class="chip ${active}" data-cat="${cat}">${cat}</button>`;
  }).join("");

  categoryRow.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      state.selectedCategory = btn.dataset.cat;
      renderProducts();
      renderCategories();
    });
  });
  
}


function getFilteredProducts() {
  const q = state.searchQuery.toLowerCase();
  return PRODUCTS
    .filter(p => state.selectedCategory === "All" ? true : p.category === state.selectedCategory)
    .filter(p => p.name.toLowerCase().includes(q));
}


function renderProducts() {
  const filtered = getFilteredProducts();


  emptyState.hidden = filtered.length !== 0;

  productGrid.innerHTML = filtered.map(p => `
    <div class="card">
      <div class="thumb">${p.icon}</div>
      <h3>${p.name}</h3>
      <p>${p.category}</p>
      <strong>${money(p.price)}</strong>
    </div>
  `).join("");
}

searchInput.addEventListener("input", (e) => {
  state.searchQuery = e.target.value;
  renderProducts();
});


renderCategories();

renderProducts();
