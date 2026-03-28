import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const checkoutForm = document.getElementById("checkoutForm");
const checkoutError = document.getElementById("checkoutError");
const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");

const products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

function getCartObject() {
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function getOrderItems() {
  const productById = Object.fromEntries(products.map((p) => [p.id, p]));
  const cart = getCartObject();

  return Object.entries(cart)
    .map(([id, quantity]) => {
      const product = productById[id];
      if (!product || quantity <= 0) return null;

      return {
        id: product.id,
        name: product.name,
        price: Number(product.price || 0),
        quantity: Number(quantity)
      };
    })
    .filter(Boolean);
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

  if (!fullName || !email || !address || !city || !postal || !cardName || !cardNumber || !expiry || !cvv) {
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

function renderOrderSummary() {
  const items = getOrderItems();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (checkoutItems) {
    checkoutItems.innerHTML = items.length
      ? items
          .map(
            (item) => `
              <div class="summaryRow">
                <span>${item.name} x${item.quantity}</span>
                <strong>${money(item.price * item.quantity)}</strong>
              </div>
            `
          )
          .join("")
      : '<div class="empty">Your cart is empty.</div>';
  }

  if (checkoutTotal) {
    checkoutTotal.textContent = money(total);
  }
}

async function placeOrder(orderData) {
  await addDoc(collection(db, "orders"), {
    order_id: orderData.orderId,
    items: orderData.items,
    total: orderData.total,
    customer_name: orderData.name,
    customer_email: orderData.email,
    shipping_address: orderData.address,
    status: "Processing",
    created_at: new Date().toISOString()
  });

  localStorage.setItem("lastOrderId", orderData.orderId);
  localStorage.removeItem("cart");
  window.location.href = `confirmation.html?orderId=${encodeURIComponent(orderData.orderId)}`;
}

if (checkoutForm) {
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    checkoutError.textContent = "";

    const items = getOrderItems();
    if (items.length === 0) {
      checkoutError.textContent = "Your cart is empty.";
      return;
    }

    const errorMessage = validateCheckoutForm();
    if (errorMessage) {
      checkoutError.textContent = errorMessage;
      return;
    }

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const shippingAddress = [
      document.getElementById("address").value.trim(),
      document.getElementById("city").value.trim(),
      document.getElementById("postal").value.trim()
    ].join(", ");

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData = {
      orderId: `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      items,
      total,
      name: fullName,
      email,
      address: shippingAddress
    };

    try {
      await placeOrder(orderData);
    } catch (error) {
      console.error("Error placing order:", error);
      checkoutError.textContent = "Unable to place order right now. Please try again.";
    }
  });
}

renderOrderSummary();
