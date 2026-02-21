function money(n) {
  return `$${n.toFixed(2)}`;
}

const detailsEl = document.getElementById("details");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const product = PRODUCTS.find((p) => p.id === id);

if (!product) {
  detailsEl.innerHTML = `
    <h2>Product not found</h2>
    <p>Try going back and selecting a product again.</p>
    <div class="actions">
      <a class="linkBtn" href="index.html">← Back to products</a>
    </div>
  `;
} else {
  const availabilityText = product.inStock ? "In stock" : "Out of stock";

  detailsEl.innerHTML = `
    <div class="detailsHeader">
      <div class="detailsIcon">${product.icon}</div>
      <div class="detailsMeta">
        <h2>${product.name}</h2>
        <div class="price"><strong>${money(product.price)}</strong></div>
        <div style="margin-top: 8px;">
          <span class="badge">${availabilityText}</span>
          <span class="badge">${product.category}</span>
        </div>
      </div>
    </div>

    <p>${product.description}</p>

    <div class="actions">
      <button class="primary" id="addToCartBtn" ${product.inStock ? "" : "disabled"}>
        Add to Cart
      </button>
      <a class="linkBtn" href="cart.html">View cart</a>
      <a class="linkBtn" href="index.html">Continue shopping</a>
    </div>
  `;

  const btn = document.getElementById("addToCartBtn");
  if (btn && product.inStock) {
    btn.addEventListener("click", () => {
      addToCart(product.id);
      btn.textContent = "Added!";
      setTimeout(() => {
        btn.textContent = "Add to Cart";
      }, 900);
    });
  }
}
