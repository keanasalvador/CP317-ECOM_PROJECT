function money(n) {
  return `$${n.toFixed(2)}`;
}

const cartList = document.getElementById("cartList");
const cartSummary = document.getElementById("cartSummary");

const checkoutForm = document.getElementById("checkoutForm");
const checkoutError = document.getElementById("checkoutError");
const cardNumberInput = document.getElementById("cardNumber");
const expiryInput = document.getElementById("expiry");

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

// ==============================
// UI-5 PAYMENT SECURITY / CHECKOUT
// ==============================

function clearCartData() {
  localStorage.removeItem("cart");
}

function validateCheckoutForm() {
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const postal = document.getElementById("postal").value.trim();
  const cardName = document.getElementById("cardName").value.trim();
  const cardNumber = document.getElementById("cardNumber").value.replace(/\s/g, "").trim();
  const expiry = document.getElementById("expiry").value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  if (
    fullName === "" ||
    email === "" ||
    address === "" ||
    city === "" ||
    postal === "" ||
    cardName === "" ||
    cardNumber === "" ||
    expiry === "" ||
    cvv === ""
  ) {
    return "All fields are required.";
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return "Please enter a valid email address.";
  }

  if (!/^\d{16}$/.test(cardNumber)) {
    return "Card number must be 16 digits.";
  }

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return "Expiry date must be in MM/YY format.";
  }

  if (!/^\d{3,4}$/.test(cvv)) {
    return "CVV must be 3 or 4 digits.";
  }

  return "";
}

function buildOrderObject() {
  const items = getLineItems().map(({ product, qty }) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: qty,
    lineTotal: product.price * qty
  }));

  return {
    orderId: `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    address: document.getElementById("address").value.trim(),
    city: document.getElementById("city").value.trim(),
    postal: document.getElementById("postal").value.trim(),
    cardName: document.getElementById("cardName").value.trim(),
    maskedCard: "**** **** **** " + document.getElementById("cardNumber").value.replace(/\s/g, "").slice(-4),
    items: items,
    total: getCartSubtotal(PRODUCTS),
    status: "Placed",
    date: new Date().toLocaleString()
  };
}

async function placeOrderInFirestore(order) {
  const [{ db }, { collection, addDoc }] = await Promise.all([
    import("./firebase.js"),
    import("https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js")
  ]);

  await addDoc(collection(db, "orders"), {
    order_id: order.orderId,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    total: order.total,
    customer_name: order.fullName,
    customer_email: order.email,
    shipping_address: `${order.address}, ${order.city}, ${order.postal}`,
    status: "Processing",
    created_at: new Date().toISOString()
  });
}

if (cardNumberInput) {
  cardNumberInput.addEventListener("input", () => {
    let value = cardNumberInput.value.replace(/\D/g, "");
    value = value.substring(0, 16);

    let formatted = "";
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += " ";
      }
      formatted += value[i];
    }

    cardNumberInput.value = formatted;
  });
}

if (expiryInput) {
  expiryInput.addEventListener("input", () => {
    let value = expiryInput.value.replace(/\D/g, "");
    value = value.substring(0, 4);

    if (value.length >= 3) {
      expiryInput.value = value.substring(0, 2) + "/" + value.substring(2);
    } else {
      expiryInput.value = value;
    }
  });
}

if (checkoutForm) {
  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (checkoutError) {
      checkoutError.textContent = "";
    }

    const cart = getCart();
    if (Object.keys(cart).length === 0) {
      if (checkoutError) {
        checkoutError.textContent = "Your cart is empty.";
      }
      return;
    }

    const errorMessage = validateCheckoutForm();
    if (errorMessage !== "") {
      if (checkoutError) {
        checkoutError.textContent = errorMessage;
      }
      return;
    }

    const order = buildOrderObject();

    try {
      await placeOrderInFirestore(order);
      localStorage.setItem("lastOrderId", order.orderId);
      clearCartData();
      renderCart();
      window.location.href = `confirmation.html?orderId=${encodeURIComponent(order.orderId)}`;
    } catch (error) {
      console.error("Error placing order:", error);
      if (checkoutError) {
        checkoutError.textContent = "Unable to place order right now. Please try again.";
      }
    }
  });
}

renderCart();
