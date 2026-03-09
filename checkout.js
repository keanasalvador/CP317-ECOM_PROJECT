document.getElementById("checkoutForm").addEventListener("submit", function(e) {

  e.preventDefault();

  const fullName = document.getElementById("fullName").value;
  const address = document.getElementById("address").value;
  const cardNumber = document.getElementById("cardNumber").value;
  const expiry = document.getElementById("expiry").value;
  const cvv = document.getElementById("cvv").value;

  if(fullName === "" || address === "" || cardNumber === "" || expiry === "" || cvv === "") {
    document.getElementById("checkoutError").textContent = "Please fill all required fields.";
    return;
  }

  const order = {
    id: "ORD-" + Date.now(),
    name: fullName,
    last4: cardNumber.slice(-4),
    date: new Date().toLocaleString()
  };

  localStorage.setItem("latestOrder", JSON.stringify(order));

  alert("Order placed successfully!");

  window.location.href = "index.html";

});
