function renderManagerSummary() {
  const orders = getOrders();
  const totalOrders = orders.length;

  const completedOrders = orders.filter(order =>
    order.status === "Placed" || order.status === "Completed"
  ).length;

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => {
    return sum + (order.totalPrice || 0); // ensure totalPrice exists
  }, 0);

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
