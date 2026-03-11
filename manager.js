
const managerSummary = document.getElementById("managerSummary");

// Function to get orders safely from localStorage
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

  // Count completed orders
  const completedOrders = orders.filter(
    order => order.status === "Placed" || order.status === "Completed"
  ).length;

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  // Set innerHTML using template literal
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

// Call the function to render the dashboard
renderManagerSummary();
