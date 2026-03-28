import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

const orderIdInput = document.getElementById("orderIdInput");
const trackBtn = document.getElementById("trackBtn");
const trackingError = document.getElementById("trackingError");
const trackingResult = document.getElementById("trackingResult");

function renderOrder(order) {
  const itemsHtml = (order.items || [])
    .map((item) => {
      return `
        <div class="confirmItem">
          <div>
            <strong>${item.name}</strong>
            <p>Quantity: ${item.quantity}</p>
          </div>
          <strong>${money((item.price || 0) * (item.quantity || 0))}</strong>
        </div>
      `;
    })
    .join("");

  trackingResult.innerHTML = `
    <div class="confirmMessage">
      <h3>Order Found</h3>
      <p>Your order is currently being processed.</p>
    </div>

    <div class="confirmDetails">
      <p><strong>Order ID:</strong> ${order.order_id}</p>
      <p><strong>Name:</strong> ${order.customer_name}</p>
      <p><strong>Email:</strong> ${order.customer_email || "N/A"}</p>
      <p><strong>Address:</strong> ${order.shipping_address}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
    </div>

    <div class="confirmItems">
      <h3>Items</h3>
      ${itemsHtml || "<p>No items found for this order.</p>"}
    </div>

    <div class="cartSummary">
      <div class="summaryRow">
        <span>Total</span>
        <strong>${money(order.total)}</strong>
      </div>
    </div>
  `;
}

async function trackOrder() {
  trackingError.textContent = "";
  trackingResult.innerHTML = "";

  const orderId = orderIdInput.value.trim();

  if (orderId === "") {
    trackingError.textContent = "Please enter an order ID.";
    return;
  }

  const q = query(collection(db, "orders"), where("order_id", "==", orderId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    trackingError.textContent = "Order not found. Please check your order ID.";
    return;
  }

  renderOrder(snapshot.docs[0].data());
}

trackBtn.addEventListener("click", () => {
  trackOrder().catch((error) => {
    console.error("Error tracking order:", error);
    trackingError.textContent = "Unable to track order right now. Please try again.";
  });
});

orderIdInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    trackOrder().catch((error) => {
      console.error("Error tracking order:", error);
      trackingError.textContent = "Unable to track order right now. Please try again.";
    });
  }
});