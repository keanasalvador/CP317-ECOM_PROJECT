import { db } from "./firebase.js";
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const managerSummary = document.getElementById("managerSummary");

async function loadDashboard() {
  const snapshot = await getDocs(query(collection(db, "orders"), orderBy("created_at", "desc")));
  const orders = snapshot.docs.map((doc) => doc.data());

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const rows = orders
    .map(
      (o) => `
        <tr>
          <td>${o.order_id}</td>
          <td>${o.customer_name}</td>
          <td>${o.customer_email}</td>
          <td>$${Number(o.total || 0).toFixed(2)}</td>
          <td>${o.status}</td>
          <td>${new Date(o.created_at).toLocaleDateString()}</td>
        </tr>
      `
    )
    .join("");

  managerSummary.innerHTML = `
    <div class="cartSummary">
      <div class="summaryRow">
        <span>Total Orders Stored</span>
        <strong>${orders.length}</strong>
      </div>
    </div>

    <div class="cartSummary">
      <div class="summaryRow">
        <span>Total Revenue</span>
        <strong>$${totalRevenue.toFixed(2)}</strong>
      </div>
    </div>

    <div class="cartSummary" style="overflow-x:auto;">
      <table style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align:left; padding:8px;">Order ID</th>
            <th style="text-align:left; padding:8px;">Customer</th>
            <th style="text-align:left; padding:8px;">Email</th>
            <th style="text-align:left; padding:8px;">Total</th>
            <th style="text-align:left; padding:8px;">Status</th>
            <th style="text-align:left; padding:8px;">Date</th>
          </tr>
        </thead>
        <tbody>
          ${rows || '<tr><td colspan="6" style="padding:8px;">No orders found.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

loadDashboard().catch((error) => {
  console.error("Error loading manager dashboard:", error);
  managerSummary.innerHTML = '<div class="empty">Unable to load dashboard right now.</div>';
});
