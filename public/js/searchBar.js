// العناصر الأساسية
const productList = document.querySelector(".ProudctList");
const searchbar = document.querySelector(".SearchBarInput");
const searchContainer = document.querySelector(".continerOfSerch");
const searchIcons = document.querySelectorAll(".searchIcon");

// =======================
// تحميل المنتجات
// =======================
Promise.all([
  fetch("/add/pod/proudct/on/page").then(res => res.json()),
  fetch("/add/liqued/proudct/on/page").then(res => res.json()),
  fetch("/add/mod/proudct/on/page").then(res => res.json())
])
.then(([pod, liquids, mods]) => {
  
  const allProducts = [...pod, ...liquids, ...mods];

  let html = "";

  allProducts.forEach(product => {
    html += `
      <div class="Proudct" style="display:none; flex-direction: column; gap:10px; justify-content: center; align-items: center;">
        <div class="ProudctImg">
          <a href="${product.link}">
            <img style="width:100px;" src="/img/${product.image}" alt="${product.alt || product.name}">
          </a>
        </div>
        <div class="info" style="color: white; padding-bottom: 25px;">
          <a class="linkSearch" href="${product.link}">
            <h3 class="proudct_name">${product.name}</h3>
            <p class="proudct_price">price: ${product.price} EG</p>
          </a>
        </div>
      </div>
    `;
  });

  productList.innerHTML = html;

  initSearch(); // تشغيل البحث بعد تحميل المنتجات
});

// =======================
// البحث (مع debounce)
// =======================
function initSearch() {
  const productsDOM = document.querySelectorAll(".Proudct");
  const productNames = document.querySelectorAll(".proudct_name");

  function searchFunction() {
    let searchValue = searchbar.value.toUpperCase().replace(/\s+/g, "");

    if (searchValue === "") {
      productsDOM.forEach(p => p.style.display = "none");
      return;
    }

    for (let i = 0; i < productNames.length; i++) {
      const productText = productNames[i].textContent.toUpperCase().replace(/\s+/g, "");
      productsDOM[i].style.display =
        productText.includes(searchValue) ? "flex" : "none";
    }
  }

  // debounce
  function debounce(fn, delay) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(fn, delay);
    };
  }

  searchbar.addEventListener("keyup", debounce(searchFunction, 300));
}

// =======================
// فتح البحث من الأيقونات
// =======================
searchIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    searchContainer.classList.add("active");
    searchbar.classList.add("active");
    productList.classList.add("active");

    searchbar.value = "";
    searchbar.focus();
  });
});

// =======================
// قفل البحث عند الضغط برا
// =======================
document.addEventListener("click", (e) => {
  if (e.target.closest(".searchIcon")) {
    searchContainer.classList.add("active");
    searchbar.classList.add("active");
    productList.classList.add("active");

    searchbar.value = "";
    searchbar.focus();
  }
});
document.addEventListener("click", (e) => {
  const isClickInsideSearch = searchContainer.contains(e.target);
  const isSearchIcon = e.target.closest(".searchIcon");

  // لو الضغط مش جوه السيرش ومش على أيقونة البحث
  if (!isClickInsideSearch && !isSearchIcon) {
    searchContainer.classList.remove("active");
    searchbar.classList.remove("active");
    productList.classList.remove("active");
  }
});