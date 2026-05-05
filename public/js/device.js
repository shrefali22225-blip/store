document.addEventListener("DOMContentLoaded", () => {

  /* -------------------- بيانات المنتجات -------------------- */
  let lequed = [
    { id:1, name:"Vape Station Ice Grape", price:180, img:"https://el-clan.com/cdn/shop/files/e309c15b-07ed-4192-893f-52dc3aa64ed5.jpg?crop=center&height=720&v=1742061885&width=720", link:"", brand:"vapeStation", brandLink:"" },
    { id:2, name:"Vape Station Gold Mango", price:180, img:"https://el-clan.com/cdn/shop/files/05310bac-1300-4299-ae0e-aae84053dd15.jpg?crop=center&height=1066&v=1742062591&width=1066", link:"", brand:"vapeStation", brandLink:"" },
    { id:3, name:"Vape Station Pinky", price:180, img:"https://el-clan.com/cdn/shop/files/7e74f813-6e95-47c2-b6d5-d24c96b36d76.jpg?crop=center&height=1066&v=1742061784&width=1066", link:"", brand:"vapeStation", brandLink:"" },
    { id:4, name:"Vape Station Just Berryy", price:180, img:"https://el-clan.com/cdn/shop/files/b0a355c1-517e-4c04-9291-de1ac7267c35.jpg?crop=center&height=1066&v=1742061850&width=1066", link:"", brand:"vapeStation", brandLink:"" },
    { id:5, name:"Sprinkles Tobacco Caramel", price:200, img:"https://el-clan.com/cdn/shop/files/el-clan-Sprinkles_Tobacco_Caramel.jpg?crop=center&height=1066&v=1755673276&width=1066", link:"", brand:"sprinkles", brandLink:"" },
    { id:6, name:"Sprinkles Ice Mango", price:200, img:"https://el-clan.com/cdn/shop/files/el-clan-Sprinkles_Ice_Mango60ml_1.jpg?crop=center&height=1066&v=1755762493&width=1066", link:"", brand:"sprinkles", brandLink:"" },
    { id:7, name:"Sprinkles Cappuccino Ice Cream", price:200, img:"https://el-clan.com/cdn/shop/files/el-clan-Sprinkles_Cappuccino_Ice_Cream.jpg?crop=center&height=1066&v=1755528994&width=1066", link:"", brand:"sprinkles", brandLink:"" },
    { id:8, name:"Sprinkles Ice Peach", price:200, img:"https://el-clan.com/cdn/shop/files/el-clan-Sprinkles-peach30ml_1_6101d5c2-08a6-4353-ba01-a93091fd5f64.jpg?crop=center&height=720&v=1755520898&width=720", link:"", brand:"sprinkles", brandLink:"" },
    { id:9, name:"Sprinkles Ice Pineapple Soda", price:200, img:"https://el-clan.com/cdn/shop/files/el-clan-Sprinkles_Ice_Pineapple_Soda_1_7ce7eca1-88fb-4493-b376-d713c05ff819.jpg?crop=center&height=720&v=1755527932&width=720", link:"", brand:"sprinkles", brandLink:"" },
    { id:10, name:"Sprinkles Tobacco Biscuit Butter", price:200, img:"https://el-clan.com/cdn/shop/files/el-clan-Sprinkles_Tobacco_Biscuit_Butter_1.jpg?crop=center&height=720&v=1755675710&width=720", link:"", brand:"sprinkles", brandLink:"" }
  ];

  let mod = [
    { id:1, name:"Drag 4 kit", price:2350, img:"https://el-clan.com/cdn/shop/files/voopoo-drag-4-vape-starter-kit__35681.jpg?crop=center&height=720&v=1731619422&width=720", link:"", brand:"voopoo", brandLink:"" },
    { id:2, name:"Drag X Plus Kit Professional Edition Drag X Plus Kit", price:2300, img:"https://el-clan.com/cdn/shop/files/WhatsApp_Image_2024-12-05_at_8.07.55_AM_6.jpg?crop=center&height=720&v=1733397059&width=720", link:"", brand:"voopoo", brandLink:"" },
    { id:3, name:"Drag 3 TPP X Kit ", price:2400, img:"https://el-clan.com/cdn/shop/files/drag-3-tpp-x-kit-drj-3-kyt-voopoo-lkln-fyb-stwr.jpg?crop=center&height=720&v=1732380230&width=720", link:"", brand:"voopoo", brandLink:"" },
    { id:4, name:"Drag M100 S Kit", price:2000, img:"https://el-clan.com/cdn/shop/files/drag-m100-s-drj-m-100-s-kyt-voopoo-lkln-fyb-stwr.jpg?crop=center&height=720&v=1732379026&width=720", link:"", brand:"voopoo", brandLink:"" },
    { id:5, name:"Argus GT 2 Kit", price:2699, img:"https://el-clan.com/cdn/shop/files/argus-gt-2-kit-rjws-kyt-2-voopoo-lkln-fyb-stwr.jpg?crop=center&height=720&v=1732375733&width=720", link:"", brand:"voopoo", brandLink:"" },
    { id:6, name:"GeekVape E100 Kit", price:0, img:"https://el-clan.com/cdn/shop/files/9LBx6PZbKNVXUKIitvmQ8uvgfIZEUtr7Rgq8aWf6.webp?crop=center&height=720&v=1736694949&width=720", link:"", brand:"Geekvape", brandLink:"" },
    { id:7, name:"Drag M100 S mod", price:1800, img:"https://el-clan.com/cdn/shop/files/VOOPOO-DRAG-M100S-100W-Mod-1_1024x.jpg-768x768.webp?crop=center&height=720&v=1761149677&width=720", link:"", brand:"voopoo", brandLink:"" }
  ];

  const products = [
    { id: 1, name: "xlim pro", price: 750, img: "/assets/259A0029.jpg", link: "../../منتجات/html/xlimPro.html", brand:"xlim", brandLink:"" },
    { id: 2, name: "xlim go", price: 475, img: "/assets/259A4814.jpg", link: "../../منتجات/html/xlimGo.html", brand:"xlim", brandLink:"" },
    { id: 3, name: "xlim go 2", price: 625, img: "/assets/259A3510.jpg", link: "../../منتجات/html/xlimGo2.html", brand:"xlim", brandLink:"" },
    { id: 5, name: "xlim pro 2", price: 900, img: "/assets/259A3367.jpg", link: "../../منتجات/html/xlimPro2.html", brand:"xlim", brandLink:"" },
    { id: 6, name: "NeXLIM", price: 1200, img: "/assets/259A8535.jpg", link: "../../منتجات/html/nexlim.html", brand:"xlim", brandLink:"" },
    { id: 7, name: "XLIM SQ PRO", price: 775, img: "/assets/259A8790.jpg", link: "../../منتجات/html/xlimSqPro.html", brand:"xlim", brandLink:"" },
    { id: 8, name: "XLIM SQ PRO 2", price: 1050, img: "/assets/259A2379.jpg", link: "../../منتجات/html/xlimSqPro2.html", brand:"xlim", brandLink:"" },
    { id: 9, name: "XLIM PRO 2 DNA Version", price: 1325, img: "/assets/ALL COLOR.jpg", link: "../../منتجات/html/xlimPro2Dna.html", brand:"xlim", brandLink:"" },
    { id: 10, name: "UWELL Caliburn Explorer Dual Pod Kit", price: 1225, img: "https://888vapour.com/cdn/shop/files/UWELL-Caliburn-Explorer-Kits-Grouped-1080px.jpg?v=1743761924", link: "../../منتجات/html/uwellCaiburn.html", brand:"UWELL", brandLink:"" }
  ];

  const PodList = [
    { id: 1, name: "xlim pro", price: 750, img: "../../259A0029.jpg", link: "../../منتجات/html/xlimPro.html", brand:"xlim", brandLink:"" },
    { id: 3, name: "xlim go 2", price: 625, img: "../../259A3510.jpg", link: "../../منتجات/html/xlimGo2.html", brand:"xlim", brandLink:"" },
    { id: 4, name: "nexlim go", price: 750, img: "../../NeXLIM IG Pic (13).jpg", link: "../../منتجات/html/nexlimGo.html", brand:"xlim", brandLink:"" },
    { id: 5, name: "xlim pro 2", price: 900, img: "../../259A3367.jpg", link: "../../منتجات/html/xlimPro2.html", brand:"xlim", brandLink:"" },
    { id: 6, name: "NeXLIM", price: 1200, img: "../../259A8535.jpg", link: "../../منتجات/html/nexlim.html", brand:"xlim", brandLink:"" },
    { id: 2, name: "xlim go", price: 475, img: "../../259A4814.jpg", link: "../../منتجات/html/xlimGo.html", brand:"xlim", brandLink:"" },
    { id: 7, name: "XLIM SQ PRO", price: 775, img: "../../259A8790.jpg", link: "../../منتجات/html/xlimSqPro.html", brand:"xlim", brandLink:"" },
    { id: 8, name: "XLIM SQ PRO 2", price: 1050, img: "../../259A2379.jpg", link: "../../منتجات/html/xlimSqPro2.html", brand:"xlim", brandLink:"" },
    { id: 9, name: "XLIM PRO 2 DNA Version", price: 1325, img: "../../ALL COLOR.jpg", link: "../../منتجات/html/xlimPro2Dna.html", brand:"xlim", brandLink:"" },
    { id: 10, name: "UWELL Caliburn Explorer Dual Pod Kit", price: 1225, img: "https://888vapour.com/cdn/shop/files/UWELL-Caliburn-Explorer-Kits-Grouped-1080px.jpg?v=1743761924", link: "../../منتجات/html/uwellCaiburn.html", brand:"UWELL", brandLink:"" }
  ];

  /* -------------------- عناصر DOM -------------------- */
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  const ProudctList = document.querySelector(".ProudctList");
  const SearchBarInput = document.querySelector(".SearchBarInput");
  const searchIcon = document.querySelector(".fa-magnifying-glass");
  const colseMark = document.querySelector(".colse-mark");
  const seeMoreBtn = document.querySelector(".seeMoreBtn");
  const d1 = document.querySelector(".d1");
  const d2 = document.querySelector(".d2");
  const d3 = document.querySelector(".d3");
  const categoryBtn = document.querySelector(".categoryBtn");
  const categoryList = document.querySelector(".categoryList");
  const menuIcon = document.querySelector(".fa-bars");
  const xmark = document.querySelector(".fa-xmark");
  const ul_List = document.querySelector("nav ul");
  const body = document.querySelector("body");

  /* -------------------- current page filename -------------------- */
  const currentPageFile = window.location.pathname.split('/').pop(); // ex: "xlimPro.html" or "" for index

  /* -------------------- دمج المنتجات وإزالة التكرار -------------------- */
  const FullProductList = [
    ...products,
    ...mod,
    ...lequed,
    ...PodList
  ];

  const uniqueList = [...new Map(
    FullProductList.map(item => [(item.name || "").toString().trim().toLowerCase(), item])
  ).values()];

  /* -------------------- دوال مساعدة -------------------- */
  function escapeHtml(text) {
    if (!text) return "";
    return text.toString().replace(/[&<>"']/g, function (m) {
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[m];
    });
  }

  // Fisher-Yates shuffle (يخلّي الترتيب عشوائي)
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createSearchItemHTML(item) {
    return `
      <div class="Proudct" data-name="${escapeHtml(item.name || "")}">
        <div class="ProudctImg">
          <a href="${item.link || '#'}">
            <img src="${item.img || ''}" alt="${escapeHtml(item.name || '')}">
          </a>
        </div>
        <div class="info">
          <a class="linkSearch" href="${item.link || '#'}">
            <h3 class="proudct_name">${escapeHtml(item.name || '')}</h3>
            <p class="proudct_price">price: ${item.price || 0} EG</p>
          </a>
        </div>
      </div>`;
  }

  /* -------------------- عرض الـ swiper مع استبعاد المنتج الحالي + ترتيب عشوائي -------------------- */
  function populateSwiper() {
    if (!swiperWrapper) return;
    swiperWrapper.innerHTML = "";

    // استبعد المنتج الحالي بناءً على اسم ملف الرابط (لو الرابط موجود)
    let filteredProducts = products.filter(p => {
      const pFile = (p.link || "").toString().split('/').pop();
      if (!currentPageFile) return true;
      return pFile !== currentPageFile;
    });

    // اعمل shuffle للمنتجات عشان ترتيب عشواءي في كل صفحة
    filteredProducts = shuffle(filteredProducts.slice()); // slice عشان ما نغير ال array الأصلي

    filteredProducts.forEach(product => {
      swiperWrapper.innerHTML += `
        <div class="swiper-slide">
          <div class="card_slide">
          <a href="${product.link}">
          <img src="${product.img}" alt="${escapeHtml(product.name)}">
          <div class="card_content">
              <h3 class="proudctName">${escapeHtml(product.name)}</h3>
              <p>price: ${product.price} EG</p>
            </a>
            <button class="buy_btn">AddToCart</button><br>
          </div>
            <a class="brandLink" href="${product.brandLink}"><span style="color:white;">brandName: </span>${escapeHtml(product.brand)}</a>
          </div>
        </div>`;
    });
  }

  /* -------------------- توليد قائمة البحث -------------------- */
  function populateSearchList() {
    if (!ProudctList) return;
    ProudctList.innerHTML = "";
    uniqueList.forEach(item => {
      ProudctList.innerHTML += createSearchItemHTML(item);
    });
    document.querySelectorAll(".Proudct").forEach(p => p.style.display = "none");
  }

  /* -------------------- دالة البحث -------------------- */
  function searchBar() {
    if (!SearchBarInput) return;
    const raw = SearchBarInput.value || "";
    const searchValue = raw.toUpperCase().replace(/\s+/g, "");

    const items = Array.from(document.querySelectorAll(".Proudct"));
    if (searchValue === "") {
      items.forEach(it => it.style.display = "none");
      return;
    }

    items.forEach(item => {
      const nameEl = item.querySelector(".proudct_name");
      const text = (nameEl ? nameEl.innerText : "").toUpperCase().replace(/\s+/g, "");
      if (text.indexOf(searchValue) >= 0) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  }

  /* -------------------- تهيئة وevents -------------------- */
  populateSwiper();
  populateSearchList();

  // محاولة تهيئة swiper لو مكتبة متاحة
  try {
    var swiper = new Swiper(".mySwiper", {
      slidesPerView: 6,
      spaceBetween: 0,
      breakpoints: {
        1500: { slidesPerView: 6, spaceBetween: 30 },
        1200: { slidesPerView: 4, spaceBetween: 30 },
        1026: { slidesPerView: 6, spaceBetween: 30 },
        880:  { slidesPerView: 4, spaceBetween: 30 },
        699:  { slidesPerView: 4, spaceBetween: 1 },
        600:  { slidesPerView: 3, spaceBetween: 1 },
        530:  { slidesPerView: 3, spaceBetween: 1 },
        485:  { slidesPerView: 2, spaceBetween: 10 },
        480:  { slidesPerView: 2, spaceBetween: 10 },
        350:  { slidesPerView: 2, spaceBetween: 10 },
        150:  { slidesPerView: 2, spaceBetween: 10 }
      }
    });
  } catch (e) {}

  if (SearchBarInput) SearchBarInput.addEventListener("keyup", searchBar);

  if (searchIcon) {
    searchIcon.addEventListener("click", () => {
      SearchBarInput.classList.toggle("active");
      ProudctList.classList.toggle("active");
      searchIcon.classList.toggle("toggle");
      if (colseMark) colseMark.classList.toggle("active");
      SearchBarInput.focus();
      if (SearchBarInput.value.trim() === "") {
        document.querySelectorAll(".Proudct").forEach(p => p.style.display = "none");
      } else {
        searchBar();
      }
    });
  }

  if (colseMark) {
    colseMark.addEventListener("click", () => {
      SearchBarInput.classList.remove("active");
      ProudctList.classList.remove("active");
      searchIcon.classList.remove("toggle");
      colseMark.classList.remove("active");
      document.querySelectorAll(".Proudct").forEach(p => p.style.display = "none");
    });
  }

  if (seeMoreBtn) {
    seeMoreBtn.addEventListener("click", () => {
      if (d1) d1.classList.toggle("active");
      if (d2) d2.classList.toggle("active");
      if (d3) d3.classList.toggle("active");
    });
  }

  if (categoryBtn) {
    categoryBtn.addEventListener("click", () => { if (categoryList) categoryList.classList.toggle("active"); });
  }

  function toggleMenu() {
    if (menuIcon) menuIcon.classList.toggle("active");
    if (xmark) xmark.classList.toggle("active");
    if (ul_List) ul_List.classList.toggle("active");
    body.style.overflow = (menuIcon && menuIcon.classList.contains("active")) ? "hidden" : "auto";
  }
  if (menuIcon) menuIcon.addEventListener("click", toggleMenu);
  if (xmark) xmark.addEventListener("click", toggleMenu);

  /* -------------------- WhatsApp selector (محفوظ) -------------------- */
  const select = document.getElementById('colorS');
  const waLink = document.querySelector('.whatsappLink');
  const phone = '201225798813';
  const priceText = document.querySelector(".price") ? document.querySelector(".price").innerText : "";
  const currentPod = PodList.find(p => currentPageFile && currentPageFile.includes((p.link || "").split('/').pop())) || { name: "منتج غير معروف", price: priceText };

  if (select) {
    select.addEventListener('change', () => {
      const color = select.value;
      if (color && currentPod) {
        const msg = `مرحباً، أود أن أشتري ${currentPod.name} بلون ${color} بسعر ${currentPod.price} EG`;
        waLink.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      } else {
        waLink.removeAttribute('href');
      }
    });
  }

});
