document.addEventListener("DOMContentLoaded", function () {
    const cancelBtn = document.getElementById("cancel-btn");
    const timerElement = document.getElementById("timer");
    let countdown = 300;
  
    // دالة لإرسال طلب الإلغاء
    const cancelOrder = async () => {
      const orderId = sessionStorage.getItem("lastOrderId");
      if (!orderId) return;
  
      try {
        const response = await fetch(`http://localhost:5035/api/orders/CancelOrder/${orderId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        if (response.ok) {
          alert("Order cancelled successfully.");
          cancelBtn.disabled = true;
          timerElement.textContent = "Order has been cancelled.";
        } else {
          alert("Failed to cancel order.");
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
      }
    };
  
    // بدء العد التنازلي
    const startCountdown = () => {
      const interval = setInterval(() => {
        if (countdown <= 0) {
          clearInterval(interval);
          cancelBtn.disabled = true;
          timerElement.textContent = "Time to cancel has expired.";
        } else {
          const minutes = Math.floor(countdown / 60);
          const seconds = countdown % 60;
          timerElement.textContent = `Cancel available for: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
          countdown--;
        }
      }, 1000);
    };
  
    // إضافة حدث للزر
    cancelBtn.addEventListener("click", cancelOrder);
  
    // بدء العد التنازلي
    startCountdown();
  });
  