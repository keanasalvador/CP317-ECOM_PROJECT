import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

const confirmationBox = document.getElementById("confirmationBox");
const orderIdFromUrl = new URLSearchParams(window.location.search).get("orderId");
const orderId = orderIdFromUrl || localStorage.getItem("lastOrderId");

async function loadConfirmation() {
  if (!orderId) {
    confirmationBox.innerHTML = '<div class="empty">Missing order ID.</div>';
    return;
  }

  const q = query(collection(db, "orders"), where("order_id", "==", orderId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    confirmationBox.innerHTML = '<div class="empty">Order not found.</div>';
    return;
  }

  const data = snapshot.docs[0].data();
  localStorage.setItem("lastOrderId", data.order_id);
  const itemsHtml = (data.items || [])
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

  confirmationBox.innerHTML = `
    <div class="confirmMessage">
      <h3>Thank you for your purchase!</h3>
      <p>Your order has been placed successfully.</p>
    </div>

    <div class="confirmDetails">
      <p><strong>Order ID:</strong> ${data.order_id}</p>
      <p><strong>Name:</strong> ${data.customer_name}</p>
      <p><strong>Email:</strong> ${data.customer_email}</p>
      <p><strong>Address:</strong> ${data.shipping_address}</p>
      <p><strong>Status:</strong> ${data.status}</p>
      <p><strong>Date:</strong> ${new Date(data.created_at).toLocaleString()}</p>
    </div>

    <div class="confirmItems">
      <h3>Order Summary</h3>
      ${itemsHtml || "<p>No items found for this order.</p>"}
    </div>

    <div class="cartSummary">
      <div class="summaryRow">
        <span>Total</span>
        <strong>${money(data.total)}</strong>
      </div>
    </div>

    <div class="actions">
      <a class="linkBtn" href="index.html">Continue Shopping</a>
    </div>
  `;
}

loadConfirmation().catch((error) => {
  console.error("Failed to load confirmation:", error);
  confirmationBox.innerHTML = '<div class="empty">Unable to load order confirmation right now.</div>';
});
