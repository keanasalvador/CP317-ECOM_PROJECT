const managerSummary = document.getElementById("managerSummary");

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

function renderManagerSummary() {
  const orders = getOrders();
  const totalOrders = orders.length;

  const completedOrders = orders.filter(order =>
    order.status === "Placed" || order.status === "Completed"
  ).length;

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  // If no orders, show message
  if (totalOrders === 0) {
    managerSummary.innerHTML = `<p>No orders have been placed yet.</p>`;
    return;
  }

  // Render summary
  managerSummary.innerHTML = `
    <div class="cartSummary">
      <div class="summaryRow">
        <span>Total Orders Stored</span>
        <strong>${totalOrders}</strong>
      </div>
    </div>

    <div class="cartSummary">
      <div class="summaryRow">
        <span>Completed Orders</span>
        <strong>${completedOrders}</strong>
      </div>
    </div>

    <div class="cartSummary">
      <div class="summaryRow">
        <span>Total Revenue</span>
        <strong>$${totalRevenue.toFixed(2)}</strong>
      </div>
    </div>
  `;
}

renderManagerSummary();
