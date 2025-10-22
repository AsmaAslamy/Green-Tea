
'use strict';

  // --- تابع‌های کمکی ---
  const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) return value;
    }
    return null;
  };

  const deleteCookie = (name) => {
    // حذف کوکی با زمان منقضی شده
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // --- بررسی ورود ---
  const cookieUser = getCookie("username");
  const localUser = localStorage.getItem("username");

  if (!cookieUser && !localUser) {
    alert("Not logged in!");
    window.location.href = "form.html";
  }

  // --- دکمه خروج ---
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      deleteCookie("username");
      localStorage.removeItem("username");
      alert("Logged out!");
      window.location.href = "form.html";
    });
  } else {
    console.error("❌ Logout button not found!");
  }


// make shop cart 
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartColse = document.querySelector("#cart-close");

cartIcon.addEventListener("click" , ()=> cart.classList.add("active"));
cartColse.addEventListener("click" , ()=> cart.classList.remove("active"));

const addCartButtons = document.querySelectorAll(".add-cart");
addCartButtons.forEach(button => {
    button.addEventListener("click" , event => {
        const productBox = event.target.closest(".product-box");
        addToCart(productBox);
    });
});

const cartContent = document.querySelector(".cart-content");
const addToCart = productBox => {
    const productTmgSrc = productBox.querySelector("img").src;
    const productTitle = productBox.querySelector(".product-title").textContent;
    const productPrice = productBox.querySelector(".price").textContent;

    const cartItems = cartContent.querySelectorAll(".cart-product-title");
    for (let item of cartItems) {
        if (item.textContent === productTitle) {
            alert("This item is already in the cart.");
            return;
        }
    }

    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    cartBox.innerHTML = `
    <img src="${productTmgSrc}" class="cart-img">
    <div class="cart-detail">
        <h2 class="cart-product-title">${productTitle}</h2>
        <span class="cart-price">${productPrice}</span>
        <div class="cart-quantity">
            <button id="decrement">-</button>
            <span class="number">1</span>
            <button id="increment">+</button>
        </div>
    </div>
    <i class="ri-delete-bin-6-line cart-remove"></i>
    `;

    cartContent.appendChild(cartBox);

    cartBox.querySelector(".cart-remove").addEventListener("click", () =>{
        cartBox.remove();

        updateCartCount(-1);

        updateTotalPrice();
    });

    cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
        const numberElement = cartBox.querySelector(".number");
        const decrementButton = cartBox.querySelector("#decrement");
        let quantity = numberElement.textContent;

        if (event.target.id === "decrement" && quantity > 1) {
            quantity--;
            if (quantity === 1) {
                decrementButton.style.color = "#999";
            } 
        } else if (event.target.id === "increment") {
                quantity++;
                decrementButton.style.color = "#333";
        }

        numberElement.textContent = quantity;

        updateTotalPrice();
    });

    updateCartCount(1);

    updateTotalPrice();
     
};

const updateTotalPrice = () => {
    const totalPriceElement = document.querySelector(".total-price");
    const cartBoxes = document.querySelectorAll(".cart-box");
    let total = 0;
    cartBoxes.forEach(cartBox => {
        const priceElement = cartBox.querySelector(".cart-price");
        const quantityElement = cartBox.querySelector(".number");
        const price = priceElement.textContent.replace("$", "");
        const quantity = quantityElement.textContent;
        total += price * quantity;
    });
    totalPriceElement.textContent = `$${total}`;
};

let cartItemCount = 0;
const updateCartCount = change => {
    const cartItemCountBadge = document.querySelector(".cart-item-count");
    cartItemCount += change;
    if (cartItemCount > 0) {
        cartItemCountBadge.style.visibility = "visible";
        cartItemCountBadge.textContent = cartItemCount;
    } else {
        cartItemCountBadge.style.visibility = "hidden";
        cartItemCountBadge.textContent = "";
    }
};

const buyNowButton = document.querySelector(".btn-buy");
buyNowButton.addEventListener("click", ()=> {
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    if (cartBoxes.length === 0) {
        alert("Your cart is empty. Pleae add items to Your cart before buying");
        return;
    }

    cartBoxes.forEach(cartBox => cartBox.remove());

    cartItemCount = 0;
    updateCartCount(0);

    updateTotalPrice();


alert("Thank you for your purchase!");
});




// <!-- 🌿 Mobile -->
const toggle = document.getElementById('menu-toggle');
const links = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
  links.classList.toggle('active');
});






// <!-- 🌿 Camera Icon -->
const modal = document.getElementById("starModal"); // یا modal مخصوص دوربین
const modalImg = document.getElementById("modalImg");
const closeBtn = document.querySelector(".close");

// انتخاب همه آیکن‌های دوربین
const cameraIcons = document.querySelectorAll(".ri-eye-line");

cameraIcons.forEach(camera => {
    camera.addEventListener("click", (e) => {
        const img = e.target.closest(".product-box").querySelector("img").src;
        modalImg.src = img;   // عکس کارت داخل modal نمایش داده شود
        modal.style.display = "flex";
    });
});

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});




// <!-- 🌿 Favorid Icon -->
document.addEventListener("DOMContentLoaded", () => {
    const heart = document.querySelector(".heart");
    const heartContent = document.querySelector(".heart-content");
    const heartClose = document.querySelector("#heart-close");
    const heartIcon = document.querySelector("#heart-icon");
    let favoriteCount = 0;
    const addedCards = new Set();

    // badge روی ستاره نوبار
    const badge = document.createElement("span");
    badge.classList.add("heart-badge");
    heartIcon.style.position = "relative";
    badge.style.cssText = `
        position: absolute;
        top: -5px;
        right: -5px;
        background: red;
        color: white;
        font-size: 12px;
        width: 18px;
        height: 18px;
        text-align: center;
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;`;
    heartIcon.appendChild(badge);

    // باز و بسته شدن پنجره فقط با ستاره نوبار
    heartIcon.addEventListener("click", () => heart.classList.add("active"));
    heartClose.addEventListener("click", () => heart.classList.remove("active"));

    // ستاره‌های کارت‌ها
    const starIcons = document.querySelectorAll(".ri-star-line");

    starIcons.forEach(star => {
        star.addEventListener("click", (e) => {
            e.stopPropagation(); // مهم! جلوگیری از باز شدن پنجره خودکار

            const productBox = e.target.closest(".product-box");
            const imgSrc = productBox.querySelector("img").src;
            const title = productBox.querySelector(".product-title").innerText;
            const key = imgSrc;

            if (addedCards.has(key)) {
                alert("این کارت قبلاً اضافه شده است!");
                return;
            }

            addedCards.add(key);

            // اضافه کردن کارت به پنجره
            const heartProduct = document.createElement("div");
            heartProduct.classList.add("heart-product-box");
            heartProduct.innerHTML = `
                <div class="heart-img-box">
                    <img src="${imgSrc}" alt="">
                </div>
                <h2 class="heart-product-title">${title}</h2>
                <button class="heart-remove-btn">×</button>`
            ;
            heartContent.appendChild(heartProduct);

            // حذف کارت با دکمه ×
            const removeBtn = heartProduct.querySelector(".heart-remove-btn");
            removeBtn.addEventListener("click", () => {
                heartProduct.remove();
                addedCards.delete(key);
                favoriteCount--;
                if (favoriteCount === 0) badge.style.display = "none";
                else badge.innerText = favoriteCount;
            });

            // بروزرسانی badge
            favoriteCount++;
            badge.style.display = "flex";
            badge.innerText = favoriteCount;
        });
    });
});






// <!-- 🌿 Home -->
const slides = document.querySelectorAll('#curlZillSlider .slide');
let current = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}


// تغییر خودکار هر 5 ثانیه
setInterval(() => {
  current = (current + 1) % slides.length;
  showSlide(current);
}, 5000);





// search resulte 
// لیست چای‌ها
const teas = [
  "Matcha Tea",
  "Sencha Tea",
  "Gunpowder Tea",
  "Genmaicha Tea",
  "Gyokuro Tea",
  "Mao Feng Tea",
  "Long Jing Tea",
  "Bancha Tea"
];

const searchInput = document.querySelector(".search-box input");
const searchResults = document.querySelector(".search-results");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  searchResults.innerHTML = "";

  if (query === "") {
    searchResults.style.display = "none";
    return;
  }

  const filteredTeas = teas.filter(tea => tea.toLowerCase().startsWith(query));

  filteredTeas.forEach(tea => {
    const item = document.createElement("div");
    item.classList.add("search-result-item");
    item.innerHTML = `
      <span>${tea}</span>
      <button class="add-cart">Add to Cart</button>`
    ;

    const teaImages = {
        "Matcha Tea": "../img-Asma/cart-1.webp",
        "Sencha Tea": "../img-Asma/cart-2.jpg",
        "Gunpowder Tea": "../img-Asma/cart-3.webp",
        "Genmaicha Tea": "../img-Asma/cart-4.webp",
        "Gyokuro Tea": "../img-Asma/cart-5.webp",
        "Mao Feng Tea": "../img-Asma/cart-6.jpg",
        "Long Jing Tea": "../img-Asma/cart-7.webp",
        "Bancha Tea": "../img-Asma/cart-8.avif"
    };

    // اضافه کردن به کارت با همان تابع موجود
    item.querySelector(".add-cart").addEventListener("click", () => {
      const fakeProductBox = document.createElement("div");
      fakeProductBox.classList.add("product-box");
      fakeProductBox.innerHTML = `
        <img src="${teaImages[tea]}" alt="${tea}">
        <h2 class="product-title">${tea}</h2>
        <span class="price">$10</span>`
      ;
      addToCart(fakeProductBox);
      searchResults.style.display = "none";
      searchInput.value = "";
    });

    searchResults.appendChild(item);
  });

  searchResults.style.display = filteredTeas.length ? "block" : "none";
});

// بستن نتایج اگر روی صفحه کلیک شد
document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
    searchResults.style.display = "none";
  }
});

