// Get the manager summary container
const managerSummary = document.getElementById("managerSummary");

// Function to get orders from localStorage safely
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

// Render the manager dashboard summary
function renderManagerSummary() {
  const orders = getOrders();
  const totalOrders = orders.length;

  // Count completed orders (Placed or Completed)
  const completedOrders = orders.filter(order =>
    order.status === "Placed" || order.status === "Completed"
  ).length;

  // Sum total revenue (if totalPrice exists in orders)
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  // Always render the dashboard, even if there are no orders
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

// Call the function to render dashboard
renderManagerSummary();
