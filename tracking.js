function money(n) {
  return `$${n.toFixed(2)}`;
}

const orderIdInput = document.getElementById("orderIdInput");
const trackBtn = document.getElementById("trackBtn");
const trackingError = document.getElementById("trackingError");
const trackingResult = document.getElementById("trackingResult");

function getOrders() {
  try {
    const raw = localStorage.getItem("orders");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function renderOrder(order) {
  const itemsHtml = (order.items || [])
    .map(item => {
      return `
        <div class="confirmItem">
          <div>
            <strong>${item.name}</strong>
            <p>Quantity: ${item.quantity}</p>
          </div>
          <strong>${money(item.lineTotal)}</strong>
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
      <p><strong>Order ID:</strong> ${order.orderId}</p>
      <p><strong>Name:</strong> ${order.fullName}</p>
      <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.postal}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Date:</strong> ${order.date}</p>
    </div>

    <div class="confirmItems">
      <h3>Items</h3>
      ${itemsHtml || "<p>No items found for this order.</p>"}
    </div>

    <div class="cartSummary">
      <div class="summaryRow">
        <span>Total</span>
        <strong>${money(order.total || 0)}</strong>
      </div>
    </div>
  `;
}

function trackOrder() {
  trackingError.textContent = "";
  trackingResult.innerHTML = "";

  const orderId = orderIdInput.value.trim();

  if (orderId === "") {
    trackingError.textContent = "Please enter an order ID.";
    return;
  }

  const orders = getOrders();
  const foundOrder = orders.find(order => order.orderId === orderId);

  if (!foundOrder) {
    trackingError.textContent = "Order not found. Please check your order ID.";
    return;
  }

  renderOrder(foundOrder);
}

trackBtn.addEventListener("click", trackOrder);

orderIdInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    trackOrder();
  }
});