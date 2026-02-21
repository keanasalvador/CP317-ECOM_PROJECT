function getCart() {
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function setCart(cartObj) {
  localStorage.setItem("cart", JSON.stringify(cartObj));
}

function addToCart(productId, amount = 1) {
  const cart = getCart();
  const next = (cart[productId] || 0) + amount;
  cart[productId] = next > 0 ? next : 0;
  if (cart[productId] === 0) {
    delete cart[productId];
  }
  setCart(cart);
  return cart;
}

function removeFromCart(productId) {
  const cart = getCart();
  delete cart[productId];
  setCart(cart);
  return cart;
}

function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const normalized = Number.isFinite(quantity) ? Math.floor(quantity) : 0;
  if (normalized <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = normalized;
  }
  setCart(cart);
  return cart;
}

function getCartItemCount() {
  const cart = getCart();
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function getCartSubtotal(products) {
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const cart = getCart();
  let subtotal = 0;

  Object.entries(cart).forEach(([id, qty]) => {
    const product = byId[id];
    if (product) {
      subtotal += product.price * qty;
    }
  });

  return subtotal;
}
