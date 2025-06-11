
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');
fetch(`http://localhost:5035/api/Products/CareProductsByType?keyword=${category}`)
  .then(res => res.json())
  .then(data => {
    const products = data;
    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = "";

    products.forEach(product => {
      let careInfo = {};
      try {
        careInfo = JSON.parse(product.description);
      } catch (e) {
        console.warn("Invalid JSON in description", product.description);
      }

      const slide = document.createElement("div");
      slide.className = "swiper-slide";

      slide.innerHTML = `
      <div class="store__card">
        <h4>${product.name}</h4>
        <img src="http://localhost:5035/${product.imagePath}" alt="${product.name}" />
        <div class="care__info">
          <p><strong>🌱 Care:</strong> ${careInfo.care || 'N/A'}</p>
          <p><strong>☀️ Sunlight:</strong> ${careInfo.sunlight || 'N/A'}</p>
          <p><strong>🪴 Soil:</strong> ${careInfo.soil || 'N/A'}</p>
          <p><strong>🌼 Season:</strong> ${careInfo.season || 'N/A'}</p>
        </div>
      </div>
    `;
    
      productContainer.appendChild(slide);
    });
  })
  .catch(err => console.error("Error fetching products:", err));

///////////////////////////////////////////////////////////////////////////////////////


const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__image img", {
  ...scrollRevealOption,
  origin: "right",
});
ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".header__content p", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".header__image__content ", {
  duration: 1000,
  delay: 1500,
});

ScrollReveal().reveal(".product__image img", {
  ...scrollRevealOption,
  origin: "left",
});
ScrollReveal().reveal(".product__card", {
  ...scrollRevealOption,
  delay: 500,
  interval: 500,
});

const swiper = new Swiper(".swiper", {
  loop: true,
  effect: "coverflow",
  grabCursor: true,
  centerSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 0,
    depth: 250,
    modifier: 1,
    scale: 0.75,
    slideShadows: false,
    stretch: -100,
  },

  pagination: {
    el: ".swiper-pagination",
  },
});