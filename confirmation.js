// confirmation.js

function money(n) {
  return `$${n.toFixed(2)}`;
}

const confirmationBox = document.getElementById("confirmationBox");

function renderConfirmation() {

  const latestOrder = JSON.parse(localStorage.getItem("latestOrder"));

  if (!latestOrder) {
    confirmationBox.innerHTML = `
      <div class="empty">No recent order was found.</div>
    `;
    return;
  }

  // REP-4: Ensure total exists for revenue calculation
  latestOrder.total = latestOrder.items.reduce((sum, item) => sum + (item.lineTotal || 0), 0);

  // REP-4: Store orders for revenue calculation
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  const exists = orders.some(order => order.orderId === latestOrder.orderId);

  if (!exists) {
    orders.push(latestOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
  }

  const itemsHtml = latestOrder.items
    .map((item) => {
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

  confirmationBox.innerHTML = `
    <div class="confirmMessage">
      <h3>Thank you for your purchase!</h3>
      <p>Your order has been placed successfully.</p>
    </div>

    <div class="confirmDetails">
      <p><strong>Order ID:</strong> ${latestOrder.orderId}</p>
      <p><strong>Name:</strong> ${latestOrder.fullName}</p>
      <p><strong>Address:</strong> ${latestOrder.address}, ${latestOrder.city}, ${latestOrder.postal}</p>
      <p><strong>Payment Method:</strong> ${latestOrder.maskedCard}</p>
      <p><strong>Status:</strong> ${latestOrder.status}</p>
      <p><strong>Date:</strong> ${latestOrder.date}</p>
    </div>

    <div class="confirmItems">
      <h3>Order Summary</h3>
      ${itemsHtml}
    </div>

    <div class="cartSummary">
      <div class="summaryRow">
        <span>Total</span>
        <strong>${money(latestOrder.total)}</strong>
      </div>

      <!-- REP-4 Revenue Summary -->
      <div class="summaryRow">
        <span>Total Revenue (All Orders)</span>
        <strong id="revenueTotal">$0.00</strong>
      </div>
    </div>

    <div class="actions">
      <a class="linkBtn" href="index.html">Continue Shopping</a>
    </div>
  `;

  calculateRevenue();
}

// REP-4: Calculate total revenue across all orders
function calculateRevenue() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  let totalRevenue = 0;

  orders.forEach(order => {
    totalRevenue += order.total; // total is guaranteed to exist now
  });

  const revenueEl = document.getElementById("revenueTotal");
  if (revenueEl) {
    revenueEl.innerText = money(totalRevenue);
  }
}

renderConfirmation();
