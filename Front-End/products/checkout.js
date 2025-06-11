document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("checkout-items");
  const totalPriceElement = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout");
  const doneBtn = document.getElementById("done-btn");
  const checkoutForm = document.getElementById("checkout-form");
  const cancelOrderBtn = document.getElementById("cancel-order");

  let orderId = null;
  let cancelTimeout = null;

  const getAuthToken = () => {
    return sessionStorage.getItem("token") || "";
  };

  const displayError = (message) => {
    container.innerHTML = `<p>${message}</p>`;
    totalPriceElement.textContent = "Total: $0.00";
  };

  const fetchCart = async () => {
    const token = getAuthToken();
    if (!token) {
      displayError("Please log in again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5035/api/cart/GetCart", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart.");
      }

      const data = await response.json();

      const { cartItems: items, totalPrice: total } = data;

      if (!items.length) {
        container.innerHTML = `<p>Your cart is empty.</p>`;
        totalPriceElement.textContent = "Total: $0.00";
        return;
      }

      container.innerHTML = "";
      items.forEach((item) => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `<h3>${item.productName}</h3><p>Quantity: ${item.quantity}</p><p>Price: $${Number(item.price).toFixed(2)}</p>`;
        container.appendChild(div);
      });

      totalPriceElement.textContent = `Total: $${Number(total).toFixed(2)}`;
    } catch (error) {
      displayError(error.message);
    }
  };

  const completeCheckout = async () => {
    const token = getAuthToken();
    const location = document.getElementById("location")?.value?.trim();

    if (!location) {
      Swal.fire({
        icon: "warning",
        title: "Location Missing",
        text: "Please enter a valid location.",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5035/api/Order/AddOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ DeliveryLocation: location }),
      });

      if (!response.ok) throw new Error("Order creation failed");

      const result = await response.json();
      orderId = result.orderId;

      Swal.fire({
        icon: "success",
        title: "Order Confirmed!",
        text: `Order #${orderId} has been created.`,
        confirmButtonText: "OK",
      });
      checkoutForm.style.display = "none";
      doneBtn.style.display = "none";
      checkoutBtn.style.display = "none";
      cancelOrderBtn.style.display = "block";

      cancelTimeout = setTimeout(() => {
        cancelOrderBtn.style.display = "none";
        orderId = null;
      }, 120000);

    } catch (error) {
      console.error("Error during checkout: ", error);
    }
  };

 const cancelOrder = async () => {
  if (!orderId) return;

  const token = getAuthToken();
  try {
    const response = await fetch(`http://localhost:5035/api/Order/CancelOrder/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ OrderStatus: "Cancelled" }),
    });

    if (!response.ok) throw new Error("Failed to cancel order.");

    const result = await response.json();
    Swal.fire({
      icon: "info",
      title: "Order Cancelled",
      text: result.message,
      confirmButtonText: "OK",
    });
    clearTimeout(cancelTimeout);
    cancelOrderBtn.style.display = "none";
    orderId = null;
    container.innerHTML = `<p>Your cart is empty.</p>`;
    totalPriceElement.textContent = "Total: $0.00";
    checkoutForm.style.display = "none"; 

  } catch (error) {
    console.error("Error cancelling order: ", error);
  }
};


  checkoutBtn.addEventListener("click", () => {
    checkoutForm.style.display = "block";
    doneBtn.style.display = "inline-block";
  });

  doneBtn.addEventListener("click", completeCheckout);
  cancelOrderBtn.addEventListener("click", cancelOrder);

  fetchCart();
});
