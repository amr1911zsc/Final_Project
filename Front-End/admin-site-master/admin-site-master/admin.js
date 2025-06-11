
  //////////////////////////////////////////////////////
const urlParams = new URLSearchParams(window.location.search);
    const adminName = urlParams.get('userName');
    const token = urlParams.get('token');
    console.log("Admin name from URL:", adminName);

sessionStorage.setItem("userName", adminName); // تخزين الاسم في sessionStorage
  sessionStorage.setItem("token", token); // تخزين التوكن في sessionStorage
     
console.log("Admin name found in sessionStorage:", adminName);
       const displayadminname =    document.getElementById("adminNameDisplay");
      //  const firstName = adminName.split(' ')[0];
   debugger;

      displayadminname.innerHTML = `<span style="color: palevioletred; font-weight: bold;">welcom 👋: </span>${adminName}`;

  // نتأكد ان العنصر ظاهر ولو فيه أي تعديل ستايل
  displayadminname.style.display = 'inline-block';
  displayadminname.style.marginLeft = 'auto';
 displayadminname.style.fontWeight = 'bold';
     //   document.getElementById("adminNameDisplay").textContent = adminName;
    
     //   document.getElementById("adminNameDisplay").textContent = adminName;
     
        // لو مفيش اسم مخزن، ممكن تعيد توجيه أو تعرض رسالة
        console.log("No admin name found in sessionStorage.");







/*window.onload = function() {
    const adminName =localStorage.getItem("userName");
    console.log("Admin name found in localStorage:", adminName);
    if (adminName) {
        document.getElementById("adminNameDisplay").textContent = adminName;
    } else {
        // لو مفيش اسم مخزن، ممكن تعيد توجيه أو تعرض رسالة
        console.log("No admin name found in sessionStorage.");
    }
};*/


//////////////////////////////////////////
// جلب عدد الطلبات التي تم توصيلها
fetch('http://localhost:5035/api/Order/GetDeliveredOrdersCount')
  .then(response => response.json())
  .then(data => {
    document.getElementById('deliveredCount').innerText = data.deliveredOrders;
  })
  .catch(error => {
    console.error('Error fetching delivered orders count:', error);
  });

// جلب عدد الطلبات المعلقة
fetch('http://localhost:5035/api/Order/GetPendingOrdersCount')
  .then(response => response.json())
  .then(data => {
    document.getElementById('pendingCount').innerText = data.pendingOrders;
  })
  .catch(error => {
    console.error('Error fetching pending orders count:', error);
  });

// جلب العدد الكلي للطلبات
fetch('http://localhost:5035/api/Order/GetOrdersCount')
  .then(response => response.json())
  .then(data => {
    document.getElementById('totalOrdersCount').innerText = data.ordersCount;
  })
  .catch(error => {
    console.error('Error fetching total orders count:', error);
  });

window.onload = function () {
  fetch('http://localhost:5035/api/Account/GetUsersCount')
    .then(response => response.json())
    .then(data => {
      document.getElementById('usersCount').innerText = data.numberOfUsers;
    })
    .catch(error => {
      console.error('Error fetching users count:', error);
    });
}

function fetchProduct() {
  const productId = document.getElementById("productIdInput").value;

  if (!productId) {
    alert("Please enter a product ID.");
    return;
  }

  fetch(`http://localhost:5035/api/Products/${productId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error("Product not found");
      }
      return res.json();
    })
    .then(product => {
      // عرض البيانات
    document.getElementById("productImage").src = `http://localhost:5035/${product.imagePath}`;

      document.getElementById("productName").textContent = product.name;
      document.getElementById("productType").textContent = product.type;
      document.getElementById("productPrice").textContent = product.price;
      document.getElementById("productQty").textContent = product.quantity;

      // إظهار القسم الخاص بالتفاصيل
      document.getElementById("productDetails").style.display = "block";
    })
    .catch(error => {
      console.error("Error fetching product:", error);
      alert("Product not found or error occurred.");
      document.getElementById("productDetails").style.display = "none";
    });
}



function submitProduct(event) {
  event.preventDefault();

  const formData = new FormData(document.getElementById("productForm"));
  const description = {
    care: document.getElementById("care").value,
    season: document.getElementById("season").value,
    sunlight: document.getElementById("sunlight").value,
    soil: document.getElementById("soil").value
  };
  formData.append("description", JSON.stringify(description));

fetch("http://localhost:5035/api/Products/AddNewProduct", {
  method: "POST",
  body: formData
})
  .then(res => {
    if (res.ok) {
      alert("Product added successfully!");
      document.getElementById("productForm").reset();
    } else {
      alert("Failed to add product.");
    }
  })
  .catch(error => {
    console.error("Error adding product:", error);
    alert("Failed to add product.");
  });

}

function deleteProduct() {
  const id = document.getElementById("productId").value;
  fetch(`http://localhost:5035/api/Products/${id}`, {
    method: "DELETE"
  })
    .then(res => {
      if (res.ok) {
        alert("Product deleted successfully.");
      } else {
        throw new Error("Product not found");
      }
    })
    .catch(error => {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    });
}

// التبديل بين إظهار واخفاء الفورم
function toggleForm(formId) {
  const form = document.getElementById(formId);
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// تحديث المنتج
document.getElementById('updateProductBtn').addEventListener('click', async function (e) {
  e.preventDefault();  // منع إعادة تحميل الصفحة عند النقر على الزر

  const id = document.getElementById("updateProductId").value;
  const formData = new FormData();
  formData.append("price", document.getElementById("updatePrice").value);
  formData.append("quantity", document.getElementById("updateQuantity").value);

  const image = document.getElementById("updateImage").files[0];
  if (image) {
    formData.append("imageFile", image);
  } else {
    console.log("No image selected");
  }

  try {
    const response = await fetch(`http://localhost:5035/api/Products/${id}`, {
      method: "PUT",
      body: formData
    });

    const result = await response.json();
    if (response.ok) {
      alert("Product updated successfully!");
    } else {
      alert("Failed to update product.");
    }
  } catch (error) {
    console.error("Error updating product:", error);
    alert("An error occurred while updating the product.");
  }
});


/*
function updateProduct() {
  const id = document.getElementById("updateProductId").value;
  const formData = new FormData();
  formData.append("price", document.getElementById("updatePrice").value);
  formData.append("quantity", document.getElementById("updateQuantity").value);

  const image = document.getElementById("updateImage").files[0];
  if (image) {
    formData.append("image", image);
  } else {
    console.log("No image selected");
  }

  fetch(`http://localhost:5035/api/Products/${id}`, {
    method: "PUT",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      alert("Product updated successfully!");
    })
    .catch(error => {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    });
}*/


//////////////////////////////////////////////////////////

function toggleForm(formId) {
  const form = document.getElementById(formId);
  const allForms = document.querySelectorAll('.form-section');
  allForms.forEach(f => {
    if (f.id !== formId) f.style.display = 'none';
  });
  form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
}

function getAllCategories() {
  fetch('http://localhost:5035/api/Category/GetAllCategories')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('categoryList'); // تعديل هنا
      list.innerHTML = '';
      data.forEach(cat => {
        list.innerHTML += `<p>ID: ${cat.id} - Name: ${cat.name}</p>`;
      });
    })
    .catch(err => console.error('Error:', err));
}


function addCategory(event) {
  event.preventDefault();
  const name = document.getElementById('categoryName').value;
  fetch('http://localhost:5035/api/Category/AddCategory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  })
    .then(res => res.json())
    .then(data => alert('Category Added'))
    .catch(err => console.error('Error:', err));
}

function deleteCategory() {
  const id = document.getElementById('categoryIdToDelete').value;
  fetch(`http://localhost:5035/api/Category/DeleteCategory/${id}`, {
    method: 'DELETE'
  })
    .then(() => alert('Category Deleted'))
    .catch(err => console.error('Error:', err));
}

function updateCategory() {
  const id = document.getElementById('categoryIdToUpdate').value;
  const newName = document.getElementById('newCategoryName').value;
  fetch(`http://localhost:5035/api/Category/UpdateCategory/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Id: id, Name: newName }) // إرسال الـ id هنا مع الـ name
  })
    .then(() => alert('Category Updated'))
    .catch(err => console.error('Error:', err));
}

//////////////////////////////////////////////////

function toggleForm(formId) {
  const form = document.getElementById(formId);
  if (form.style.display === "none" || form.style.display === "") {
    form.style.display = "block";
  } else {
    form.style.display = "none";
  }
}



function submitRole(event) {
  event.preventDefault(); // لمنع الإرسال التلقائي

  const roleName = document.getElementById("roleName").value;
  const messageDiv = document.getElementById("message");

  // إرسال البيانات إلى الـ API لإنشاء الدور باستخدام query parameter في الـ URL
  fetch(`http://localhost:5035/api/Role/create-role?roleName=${roleName}`, {
    method: "POST",
    headers: {
      "accept": "*/*",  // تحديث الهيدر ليكون متوافقاً مع ما في الـ curl
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // إذا كانت الاستجابة نص عادي وليس JSON
      return response.text();
    })
    .then(data => {
      // إذا كان الرد عبارة عن نص بنجاح
      messageDiv.textContent = data;
      messageDiv.className = "message success";
      messageDiv.style.display = "block";
    })
    .catch(error => {
      messageDiv.textContent = "Error: " + error.message;
      messageDiv.className = "message error";
      messageDiv.style.display = "block";
    });
}


//////////////////////////////////////////////////////////////////////

function toggleSection(header) {
  const content = header.nextElementSibling;
  content.classList.toggle("hidden");
}

// Fetch order by ID
async function getOrder() {
  const orderId = document.getElementById("orderIdInput").value;
  const container = document.getElementById("orderDetails");
  container.innerHTML = "";

  try {
    const response = await fetch(`http://localhost:5035/api/Order/GetOrderById/${orderId}`);
    if (!response.ok) {
      container.style.display = "block";
      container.innerHTML = "<p style='color: crimson;'>Order not found.</p>";
      return;
    }

    const order = await response.json();

    container.style.display = "block";
    container.innerHTML = `
    <strong>Order ID:</strong> ${order.ordersId}<br>
    <strong>Date:</strong> ${new Date(order.dateOfOrder).toLocaleString()}<br>
    <strong>Total Price:</strong> ${order.totalPrice}<br>
    <strong>Status:</strong> ${order.orderStatus}<br>
    <strong>Delivery Location:</strong> ${order.deliveryAddress}<br>
    <strong>Delivery Date:</strong> ${order.deliveryDate ?? 'Not Set'}<br>
    <strong>User ID:</strong> ${order.userId}
  `;

  } catch (err) {
    container.innerHTML = "<p style='color: crimson;'>Error fetching order.</p>";
  }
}

// Update order status
async function updateStatus() {
  const id = document.getElementById("updateOrderId").value;
  const status = document.getElementById("updateOrderStatus").value;
  const deliveryDate = document.getElementById("updateDeliveryDate").value;

  const payload = {
    OrderStatus: status,
    DeliveryDate: deliveryDate || null
  };

  try {
    const response = await fetch(`http://localhost:5035/api/Order/UpdateOrderStatus/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    const responseBox = document.getElementById("updateResponse");
    responseBox.style.display = "block";
    responseBox.innerHTML = `<strong>Message:</strong> ${result.message}`;
  } catch (error) {
    const responseBox = document.getElementById("updateResponse");
    responseBox.style.display = "block";
    responseBox.innerHTML = `<p style="color:red;">Error updating order.</p>`;
  }
}

async function getAllOrders() {
  const container = document.getElementById("allOrders");
  container.innerHTML = "";

  try {
    const response = await fetch("http://localhost:5035/api/Order/GetAllOrders");
    if (!response.ok) {
      container.style.display = "block";
      container.innerHTML = "<p style='color: crimson;'>Error fetching orders.</p>";
      return;
    }

    const orders = await response.json();
    if (orders.length === 0) {
      container.innerHTML = "<p>No orders found.</p>";
      return;
    }

    container.style.display = "block";
    container.innerHTML = orders.map(order => `
      <div class="order-item">
        <strong>Order ID:</strong> ${order.ordersId}<br>
        <strong>Date:</strong> ${new Date(order.dateOfOrder).toLocaleString()}<br>
        <strong>Total Price:</strong> ${order.totalPrice}<br>
        <strong>Status:</strong> ${order.orderStatus}<br>
        <strong>Delivery Location:</strong> ${order.deliveryAddress}<br>
        <strong>Delivery Date:</strong> ${order.deliveryDate ?? 'Not Set'}<br>
        <strong>User ID:</strong> ${order.userId}
        <hr>
      </div>
    `).join("");
  } catch (err) {
    container.innerHTML = "<p style='color: crimson;'>Error fetching orders.</p>";
  }
}





///////////////////////////////////////////////////////////////////

document.querySelectorAll(".side-dropdown li a").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const parent = this.closest("li").parentElement.previousElementSibling.textContent.trim().toLowerCase();
    const action = this.textContent.trim().toLowerCase();

    showForm(parent, action);
  });
});

function showForm(type, action) {
  let html = "";

  if (action === "add") {
    html = `
        <h2>Add ${type}</h2>
        <form onsubmit="submitForm(event, '${type}', '${action}')">
          <input type="text" name="name" placeholder="Enter ${type} name" required><br>
          <button type="submit">Submit</button>
        </form>
      `;
  } else if (action === "remove") {
    html = `
        <h2>Remove ${type}</h2>
        <form onsubmit="submitForm(event, '${type}', '${action}')">
          <input type="text" name="id" placeholder="Enter ${type} ID to remove" required><br>
          <button type="submit">Remove</button>
        </form>
      `;
  } else if (action === "getall") {
    fetch(endpoints[type][action])
      .then(res => res.json())
      .then(data => {
        html = `<h2>All ${type}</h2><pre>${JSON.stringify(data, null, 2)}</pre>`;
        contentArea.innerHTML = html;
      });
    return;
  } else if (action === "update") {
    html = `
        <h2>Update ${type}</h2>
        <form onsubmit="submitForm(event, '${type}', '${action}')">
          <input type="text" name="id" placeholder="Enter ${type} ID to update" required><br>
          <input type="text" name="name" placeholder="Enter new ${type} name" required><br>
          <button type="submit">Update</button>
        </form>
      `;
  }

  contentArea.innerHTML = html;
}

document.querySelectorAll(".side-dropdown li a").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const parent = this.closest("li").parentElement.previousElementSibling.textContent.trim().toLowerCase();
    const action = this.textContent.trim().toLowerCase();

    if (parent === "products" && action === "add") {
      document.getElementById("add-product-form").style.display = "block";
      document.querySelector(".sidebar").style.display = "none";
    }
  });
});

function submitForm(event, type, action) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  fetch(endpoints[type][action], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(response => {
      contentArea.innerHTML = `<p>${action.toUpperCase()} successful: ${JSON.stringify(response)}</p>`;
    })
    .catch(err => {
      contentArea.innerHTML = `<p>Error: ${err.message}</p>`;
    });
}



// SIDEBAR DROPDOWN
const allDropdown = document.querySelectorAll('#sidebar .side-dropdown');
const sidebar = document.getElementById('sidebar');

allDropdown.forEach(item => {
  const a = item.parentElement.querySelector('a:first-child');
  a.addEventListener('click', function (e) {
    e.preventDefault();

    if (!this.classList.contains('active')) {
      allDropdown.forEach(i => {
        const aLink = i.parentElement.querySelector('a:first-child');

        aLink.classList.remove('active');
        i.classList.remove('show');
      })
    }

    this.classList.toggle('active');
    item.classList.toggle('show');
  })
})





// SIDEBAR COLLAPSE
const toggleSidebar = document.querySelector('nav .toggle-sidebar');
const allSideDivider = document.querySelectorAll('#sidebar .divider');

if (sidebar.classList.contains('hide')) {
  allSideDivider.forEach(item => {
    item.textContent = '-'
  })
  allDropdown.forEach(item => {
    const a = item.parentElement.querySelector('a:first-child');
    a.classList.remove('active');
    item.classList.remove('show');
  })
} else {
  allSideDivider.forEach(item => {
    item.textContent = item.dataset.text;
  })
}

toggleSidebar.addEventListener('click', function () {
  sidebar.classList.toggle('hide');

  if (sidebar.classList.contains('hide')) {
    allSideDivider.forEach(item => {
      item.textContent = '-'
    })

    allDropdown.forEach(item => {
      const a = item.parentElement.querySelector('a:first-child');
      a.classList.remove('active');
      item.classList.remove('show');
    })
  } else {
    allSideDivider.forEach(item => {
      item.textContent = item.dataset.text;
    })
  }
})




sidebar.addEventListener('mouseleave', function () {
  if (this.classList.contains('hide')) {
    allDropdown.forEach(item => {
      const a = item.parentElement.querySelector('a:first-child');
      a.classList.remove('active');
      item.classList.remove('show');
    })
    allSideDivider.forEach(item => {
      item.textContent = '-'
    })
  }
})



sidebar.addEventListener('mouseenter', function () {
  if (this.classList.contains('hide')) {
    allDropdown.forEach(item => {
      const a = item.parentElement.querySelector('a:first-child');
      a.classList.remove('active');
      item.classList.remove('show');
    })
    allSideDivider.forEach(item => {
      item.textContent = item.dataset.text;
    })
  }
})




// PROFILE DROPDOWN
const profile = document.querySelector('nav .profile');
const imgProfile = profile.querySelector('img');
const dropdownProfile = profile.querySelector('.profile-link');

imgProfile.addEventListener('click', function () {
  dropdownProfile.classList.toggle('show');
})




// MENU
const allMenu = document.querySelectorAll('main .content-data .head .menu');

allMenu.forEach(item => {
  const icon = item.querySelector('.icon');
  const menuLink = item.querySelector('.menu-link');

  icon.addEventListener('click', function () {
    menuLink.classList.toggle('show');
  })
})



window.addEventListener('click', function (e) {
  if (e.target !== imgProfile) {
    if (e.target !== dropdownProfile) {
      if (dropdownProfile.classList.contains('show')) {
        dropdownProfile.classList.remove('show');
      }
    }
  }

  allMenu.forEach(item => {
    const icon = item.querySelector('.icon');
    const menuLink = item.querySelector('.menu-link');

    if (e.target !== icon) {
      if (e.target !== menuLink) {
        if (menuLink.classList.contains('show')) {
          menuLink.classList.remove('show')
        }
      }
    }
  })
})





// PROGRESSBAR
const allProgress = document.querySelectorAll('main .card .progress');

allProgress.forEach(item => {
  item.style.setProperty('--value', item.dataset.value)
})






// APEXCHART
var options = {
  series: [{
    name: 'series1',
    data: [31, 40, 28, 51, 42, 109, 100]
  }, {
    name: 'series2',
    data: [11, 32, 45, 32, 34, 52, 41]
  }],
  chart: {
    height: 350,
    type: 'area'
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {
    type: 'datetime',
    categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy HH:mm'
    },
  },
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();


function addProduct() {
  var title = document.getElementById("product-title").value;
  var image = document.getElementById("product-image").value;
  var price = document.getElementById("product-price").value;

  if (!title || !image || !price) {
    alert("Please fill all fields.");
    return;
  }

  var newProduct = { title, image, price };
  var products = JSON.parse(localStorage.getItem("products")) || [];
  products.push(newProduct);
  localStorage.setItem("products", JSON.stringify(products));

  alert("Product added successfully!");
  document.getElementById("product-title").value = "";
  document.getElementById("product-image").value = "";
  document.getElementById("product-price").value = "";
}

