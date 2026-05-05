    document.addEventListener("DOMContentLoaded", () => {
    

      // 🛍️ المنتجات
        // products = [{ id: 1, name: "xlim pro", price: 750, img: "/assets/259A0029.jpg", link: "../../منتجات/html/xlimPro.html",brand:"xlim",brandLink:"", },
        // { id: 2, name: "xlim go", price: 475, img: "/assets/259A4814.jpg", link: "../../منتجات/html/xlimGo.html" ,brand:"xlim",brandLink:"",},
        // { id: 3, name: "xlim go 2", price: 625, img: "/assets/259A3510.jpg", link: "../../منتجات/html/xlimGo2.html",brand:"xlim",brandLink:"", },
        // { id: 4, name: "nexlim go", price: 750, img: "/assets/NeXLIM IG Pic (13).jpg", link: "../../منتجات/html/nexlimGo.html",brand:"xlim",brandLink:"", },
        // { id: 5, name: "xlim pro 2", price: 900, img: "/assets/259A3367.jpg", link: "../../منتجات/html/xlimPro2.html",brand:"xlim",brandLink:"", },
        // { id: 6, name: "NeXLIM", price: 1200, img: "/assets/259A8535.jpg", link: "../../منتجات/html/nexlim.html",brand:"xlim",brandLink:"", },
        // { id: 7, name: "XLIM SQ PRO", price: 775, img: "/assets/259A8790.jpg", link: "../../منتجات/html/xlimSqPro.html" ,brand:"xlim",brandLink:"",},
        // { id: 8, name: "XLIM SQ PRO 2", price: 1050, img: "/assets/259A2379.jpg", link: "../../منتجات/html/xlimSqPro2.html" ,brand:"xlim",brandLink:"",},
        //   { id: 9, name: "XLIM PRO 2 DNA Version", price: 1325, img: "/assets/ALL COLOR.jpg", link: "../../منتجات/html/xlimPro2Dna.html" ,brand:"xlim",brandLink:"",},
        // { id: 10, name: "UWELL Caliburn Explorer Dual Pod Kit", price: 1225 , img: "https://888vapour.com/cdn/shop/files/UWELL-Caliburn-Explorer-Kits-Grouped-1080px.jpg?v=1743761924", link: "../../منتجات/html/uwellCaiburn.html",brand:"UWELL",brandLink:"", }]

      

const productParent = document.querySelector(".product-parent");

fetch("/add/pod/proudct/on/page")
.then(res => res.json())
.then(data => {

    if (!productParent) return;

    let html = "";

    data.forEach(product => {

        let stockText = product.stock == 0
            ? "out of stock"
            : `on stock: ${product.stock}`;

        html += `
            <div class="card card_slide">

                <a href="${product.link}">
                    <img class="card_img" src="/assets/${product.image}">
                    <h3 class="proudct_name">${product.name}</h3>
                    <p class="price">Price: ${product.price} EGP</p>
                </a>

                <button class="buy_btn"
                    data-id="${product.id}"
                    data-name="${product.name}"
                    data-price="${product.price}"
                    data-img="${product.image}"
                    data-stock="${product.stock}">
                    AddToCart
                </button>

                <br>

                <div class="model_text">
                    <span style="color:white;">ModelName:</span>
                    <span class="brandName">${product.brand}</span>
                    <br>

                    </div>
                    <span class="stock" data-stock="${product.stock}">
                        ${stockText}
                    </span>

            </div>
        `;
    });

    productParent.innerHTML = html;
});
          
       

        
    
    
    // عرض المنتجات
   
   




      
      //  filter open
      
    let filter_conteiner=document.querySelector(".filter_conteiner");
    let filterBtn =document.querySelector(".openFilters");
    let filtericon= document.querySelector(".fa-filter");
    filterBtn.addEventListener('click',()=>{
      filter_conteiner.classList.toggle("active");
      filterBtn.classList.toggle("hide");
    })
    filtericon.addEventListener("click",()=>{
      filter_conteiner.classList.toggle("active");
      filterBtn.classList.toggle("hide");
      
    })

    let closeFilerBtn=document.querySelector(".fa-circle-xmark");
    closeFilerBtn.addEventListener("click",()=>{
      filter_conteiner.classList.remove("active");
      filterBtn.classList.remove("hide");
    })

      // pricefilter 
    let minPrice = document.querySelector(".priceFilterInputMin");
    let maxPrice = document.querySelector(".priceFilterInputMax");

    let xlimbtn = document.querySelector(".xlimBtn");
    let voopoo =document.querySelector(".VooPooBtn")
    let uwellbtn = document.querySelector(".uwellBtn");
    let allproudct = document.querySelector(".allproudct");


    let currentModel =JSON.parse(sessionStorage.getItem("model"))||"all";

    function filterProducts() {

      let min = Number(minPrice.value) || 0;
      let max = Number(maxPrice.value) || Infinity;

      sessionStorage.setItem("minPrice", JSON.stringify(min));
      sessionStorage.setItem("maxPrice", JSON.stringify(max));
      
      let cards = document.querySelectorAll(".card");
      
      

      cards.forEach(c => {

        let priceText = c.querySelector(".price").innerText;  
        let price = parseInt(priceText.replace(/[^0-9]/g, ''));

        let modelName = c.querySelector(".brandName").innerText;

        let matchModel = 
          currentModel === "all" || 
          modelName.toLowerCase() === currentModel.toLowerCase();

        let matchPrice = price >= min && price <= max;

        if (matchModel && matchPrice) {
          c.style.display = "flex";
        } else {
          c.style.display = "none";
        }
        

      });
    }
    minPrice.value =  0;
    maxPrice.value =  Infinity;
    filterProducts();


    // أحداث السعر
    minPrice.addEventListener("input", filterProducts);
    maxPrice.addEventListener("input", filterProducts);

    // أحداث الموديل
    xlimbtn.addEventListener("click", () => {
      currentModel = "xlim";
      filterProducts();
    });

    uwellbtn.addEventListener("click", () => {
      currentModel = "UWELL";
      filterProducts();
    });

    allproudct.addEventListener("click", () => {
      currentModel = "all";
      filterProducts();
    });
    
    
    voopoo.addEventListener("click",()=>{
      currentModel = "VooPoo"
      filterProducts();
    })
    
  });

   