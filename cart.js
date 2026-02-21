function money(n) {
  return `$${n.toFixed(2)}`;
}

const cartList = document.getElementById("cartList");
const cartSummary = document.getElementById("cartSummary");

const productById = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

function getLineItems() {
  const cart = getCart();
  return Object.entries(cart)
    .map(([id, qty]) => ({ product: productById[id], qty }))
    .filter((entry) => entry.product && entry.qty > 0);
}

function renderCart() {
  const items = getLineItems();

  if (items.length === 0) {
    cartList.innerHTML = `
      <div class="empty">Your cart is empty.</div>
    `;
    cartSummary.innerHTML = "";
    return;
  }

  cartList.innerHTML = items
    .map(({ product, qty }) => {
      const lineTotal = product.price * qty;
      return `
        <div class="cartItem">
          <div class="cartInfo">
            <div class="thumb">${product.icon}</div>
            <div>
              <h3>${product.name}</h3>
              <p>${money(product.price)} each</p>
            </div>
          </div>

          <div class="cartControls">
            <div class="qtyControls">
              <button class="linkBtn" data-action="dec" data-id="${product.id}">-</button>
              <input class="qtyInput" data-action="qty" data-id="${product.id}" value="${qty}" type="number" min="1" />
              <button class="linkBtn" data-action="inc" data-id="${product.id}">+</button>
            </div>
            <strong>${money(lineTotal)}</strong>
            <button class="linkBtn danger" data-action="remove" data-id="${product.id}">Remove</button>
          </div>
        </div>
      `;
    })
    .join("");

  const subtotal = getCartSubtotal(PRODUCTS);
  cartSummary.innerHTML = `
    <div class="summaryRow">
      <span>Subtotal</span>
      <strong>${money(subtotal)}</strong>
    </div>
  `;
}

cartList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const action = target.dataset.action;
  const id = target.dataset.id;
  if (!action || !id) return;

  if (action === "inc") {
    addToCart(id, 1);
  }

  if (action === "dec") {
    const current = getCart()[id] || 0;
    updateCartQuantity(id, current - 1);
  }

  if (action === "remove") {
    removeFromCart(id);
  }

  renderCart();
});

cartList.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.dataset.action !== "qty") return;

  const id = target.dataset.id;
  if (!id) return;

  const quantity = Number(target.value);
  updateCartQuantity(id, quantity);
  renderCart();
});

renderCart();
