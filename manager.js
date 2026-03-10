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

const managerSummary = document.getElementById("managerSummary");

function renderManagerSummary() {
  const orders = getOrders();
  const totalOrders = orders.length;

  const completedOrders = orders.filter(order =>
    order.status === "Placed" || order.status === "Completed"
  ).length;

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
  `;
}

renderManagerSummary();