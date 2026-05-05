// document.addEventListener("DOMContentLoaded", () => {

//     let cart = JSON.parse(localStorage.getItem("cart")) || [];

//     const openCartBtn = document.querySelectorAll(".openCartBtn")
//     const closeCartbtn = document.querySelector(".closeCartbtn");
//     const cartbox = document.querySelector(".cart");
//     const cartContainer = document.querySelector(".cartItem");
//     const totalPrice = document.querySelector(".totalPrice");
    

//     // Debug logging
//     console.log("✓ DOM loaded");
//     console.log("✓ openCartBtn:", openCartBtn);
//     console.log("✓ cartbox:", cartbox);
//     console.log("✓ cartContainer:", cartContainer);

//    // ============================
//     // فتح / غلق السلة
//     // ============================
//     openCartBtn.forEach(btns=>{

//         if (btns && cartbox) {
//             btns.addEventListener("click", (e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 console.log("🛒 Opening cart");
//                 cartbox.classList.add("open");
//             });
//         }
    
//         if (closeCartbtn && cartbox) {
//             closeCartbtn.addEventListener("click", (e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 console.log("✕ Closing cart");
//                 cartbox.classList.remove("open");
//             });
//         }
    
//         // إغلاق السلة عند النقر في أي مكان خارجها
//         if (cartbox) {
//             document.addEventListener("click", (e) => {
//                 const isClickInsideCart = cartbox.contains(e.target);
//                 const isClickOnButton = openCartBtn && openCartBtn.contains(e.target);
                
//                 if (cartbox.classList.contains("open") && !isClickInsideCart && !isClickOnButton) {
//                     console.log("🖱️ Clicking outside - Closing cart");
//                     cartbox.classList.remove("open");
//                 }
//             });
//         }
//     })

//     // ============================
//     // إضافة المنتج للسلة
//     // ============================
//     document.addEventListener("click", (e) => {
//         let btn = e.target.closest(".buy_btn");
//         if (!btn) return;

//         let stock = Number(btn.dataset.stock || 0);
//         let product_id = btn.dataset.id;
//         let name = btn.dataset.name;
//         let price = Number(btn.dataset.price);
//         let img = btn.dataset.img;

//         console.log("➕ ADD Product:", { product_id, name, price, stock });

//         let existing = cart.find(item => item.product_id == product_id);

//         if (existing) {
//             if (existing.qty >= stock) {
//                 showToast("⚠️ You reached max stock", "error");
//                 return;
//             }
//             existing.qty++;
//             console.log("📊 Updated qty to:", existing.qty);
//         } else {
//             if (stock <= 0) {
//                 showToast("❌ Out of stock", "error");
//                 return;
//             }
//             cart.push({ product_id, name, price, img, qty: 1, stock });
//             console.log("✨ New product added");
//         }

//         updateCart();
//         showToast("✓ Added to cart successfully!", "success");
//     });

//     // ============================
//     // تحديث السلة
//     // ============================
//     function updateCart() {
//         console.log("🔄 Updating cart...", cart.length, "items");

//         // ✅ Cart Drawer (Navbar)
//         if (cartContainer) {
//             if (cart.length === 0) {
//                 cartContainer.innerHTML = `
//                     <div class="emptyCartMessage">
//                         <i class="fas fa-shopping-bag"></i>
//                         <p>Your cart is empty</p>
//                         <p style="font-size: 12px; color: #666; margin-top: 8px;">
//                             Add some products to get started!
//                         </p>
//                     </div>
//                 `;
//             } else {
//                 let html = "";
//                 cart.forEach((item) => {
//                     html += `
//                         <div class="cartRow" data-id="${item.product_id}">
//                             <div class="cartRowImageContainer">
//                                 <img 
//                                     class="ImgCart" 
//                                     src="/img/${item.img}"
//                                     alt="${item.name}"
//                                     onerror="this.src='https://via.placeholder.com/90x90?text=No+Image'"
//                                 >
//                                 <span class="cartRowBadge">IN STOCK</span>
//                             </div>
//                             <div class="cartIcons">
//                                 <h3>${item.name}</h3>
//                                 <p>${Number(item.price).toLocaleString()} EGP</p>
//                                 <span class="quantity-controls">
//                                     <i class="fa-solid fa-plus plus" title="Increase quantity"></i>
//                                     <span class="qty-value">${item.qty}</span>
//                                     <i class="fa-solid fa-minus minus" title="Decrease quantity"></i>
//                                 </span>
//                             </div>
//                             <i class="fa-solid fa-trash deleteItem" title="Remove from cart"></i>
//                         </div>
//                     `;
//                 });
//                 cartContainer.innerHTML = html;
//             }
//         }

//         // ✅ Checkout page
//         let items = document.querySelector(".items");
//         if (items) {
//             if (cart.length === 0) {
//                 items.innerHTML = `
//                     <div style="text-align: center; padding: 40px 20px; color: #888;">
//                         <i class="fas fa-shopping-cart" style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;"></i>
//                         <p>Your cart is empty</p>
//                     </div>
//                 `;
//             } else {
//                 let html = "";
//                 cart.forEach(item => {
//                     html += `
//                         <div class="item_cart" data-id="${item.product_id}">
//                             <div class="img_name">
//                                 <img 
//                                     src="/img/${item.img}"
//                                     alt="${item.name}"
//                                     onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'"
//                                 >
//                                 <div class="content">
//                                     <h3>${item.name}</h3>
//                                     <p>${Number(item.price).toLocaleString()} EGP</p>
//                                     <div class="quantity">
//                                         <button class="quantityBtn minus" title="Decrease">−</button>
//                                         <span class="qty-value">${item.qty}</span>
//                                         <button class="quantityBtn plus" title="Increase">+</button>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div class="trash_continer">
//                                 <button class="removeCartBtn deleteItem" title="Remove from cart">
//                                     <i class="fa-solid fa-trash-alt"></i>
//                                 </button>
//                             </div>
//                         </div>
//                     `;
//                 });
//                 items.innerHTML = html;
//             }
//         }

//         // ============================
//         // الحسابات
//         // ============================
//         let total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
//         console.log("💰 Total:", total);

//         let subtotal = document.querySelector(".subtotal");
//         let shipping = document.querySelector(".shipping");
//         let totaling = document.querySelector(".totaling");

//         if (subtotal) subtotal.textContent = total.toLocaleString() + " EGP";
//         if (shipping) shipping.textContent = "50 EGP";
//         if (totaling) totaling.textContent = (total + 50).toLocaleString() + " EGP";
        
//         if (totalPrice) {
//             const totalSpan = totalPrice.querySelector("span:last-child");
//             if (totalSpan) {
//                 totalSpan.textContent = total.toLocaleString() + " EGP";
//             }
//         }

//         // تحديث عدد المنتجات في الأيقونة
//         if (openCartBtn) {
//             openCartBtn.setAttribute("data-count", cart.length);
//         }

//         localStorage.setItem("cart", JSON.stringify(cart));

//         updateStockUI();
//     }

//     // ============================
//     // تحديث stock في الأزرار
//     // ============================
//     function updateStockUI() {

//         document.querySelectorAll(".buy_btn").forEach(btn => {
//             let productId = btn.dataset.id;
//             let stock = Number(btn.dataset.stock || 0);

//             let inCart = cart.find(p => p.product_id == productId);
//             let qtyInCart = inCart ? inCart.qty : 0;

//             let remaining = stock - qtyInCart;

//             btn.disabled = remaining <= 0;
//             btn.classList.toggle("disabled", remaining <= 0);

//             if (remaining <= 0) {
//                 btn.innerHTML = `<i class="fa fa-ban"></i> Out of Stock`;
//                 btn.style.background = "#3a3a3d";
//                 btn.style.color = "#777";
//                 btn.style.cursor = "not-allowed";
//             } else {
//                 btn.innerHTML = `<i class="fa fa-shopping-cart"></i> Add to Cart`;
//                 btn.style.background = "";
//                 btn.style.color = "";
//                 btn.style.cursor = "pointer";
//             }
//         });
//     }

//     // ============================
//     // + - حذف (محسنة)
//     // ============================
//     document.addEventListener("click", (e) => {

//         let row = e.target.closest(".cartRow") || e.target.closest(".item_cart");
//         if (!row) return;

//         let id = row.dataset.id;
//         let product = cart.find(p => p.product_id == id);
//         if (!product) return;

//         // زيادة الكمية
//         if (e.target.closest(".plus")) {
//             e.preventDefault();
//             e.stopPropagation();
//             if (product.qty < product.stock) {
//                 product.qty++;
//                 console.log("➕ Qty increased to:", product.qty);
//                 updateCart();
//             } else {
//                 showToast("⚠️ Max stock reached", "error");
//             }
//             return;
//         }

//         // تقليل الكمية
//         if (e.target.closest(".minus")) {
//             e.preventDefault();
//             e.stopPropagation();
//             if (product.qty > 1) {
//                 product.qty--;
//                 console.log("➖ Qty decreased to:", product.qty);
//                 updateCart();
//             } else {
//                 showToast("❌ Minimum quantity is 1", "error");
//             }
//             return;
//         }

//         // حذف المنتج
//         if (e.target.closest(".deleteItem")) {
//             e.preventDefault();
//             e.stopPropagation();
//             console.log("🗑️ Removing item:", id);
//             row.classList.add("removing");
//             setTimeout(() => {
//                 cart = cart.filter(p => p.product_id != id);
//                 updateCart();
//                 showToast("✓ Removed from cart", "success");
//             }, 300);
//         }
//     });

//     // ============================
//     // Toast Notifications
//     // ============================
//     function showToast(message, type = "info") {
//         let toast = document.querySelector(".toast");
        
//         if (!toast) {
//             toast = document.createElement("div");
//             toast.className = "toast";
//             document.body.appendChild(toast);
//         }

//         toast.textContent = message;
//         toast.className = `toast ${type}`;
//         toast.classList.add("show");

//         setTimeout(() => {
//             toast.classList.remove("show");
//         }, 2500);
//     }

//     // ============================
//     // أول تشغيل
//     // ============================
//     updateCart();
// });
document.addEventListener("DOMContentLoaded", () => {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const openCartBtn = document.querySelectorAll(".openCartBtn");
    const closeCartbtn = document.querySelector(".closeCartbtn");
    const cartbox = document.querySelector(".cart");
    const cartContainer = document.querySelector(".cartItem");

    console.log("✓ Cart loaded:", cart);

    // ============================
    // فتح / غلق السلة
    // ============================
    openCartBtn.forEach(btn => {

        btn?.addEventListener("click", (e) => {
            e.preventDefault();
            cartbox?.classList.add("open");
        });

        btn.setAttribute("data-count", cart.length);
    });

    closeCartbtn?.addEventListener("click", () => {
        cartbox?.classList.remove("open");
    });

    document.addEventListener("click", (e) => {
        const isInside = cartbox?.contains(e.target);
        const isBtn = Array.from(openCartBtn).some(btn => btn.contains(e.target));

        if (cartbox?.classList.contains("open") && !isInside && !isBtn) {
            cartbox.classList.remove("open");
        }
    });

    // ============================
    // إضافة المنتج
    // ============================
    document.addEventListener("click", (e) => {

        let btn = e.target.closest(".buy_btn");
        if (!btn) return;

        let stock = Number(btn.dataset.stock || 0);
        let product_id = btn.dataset.id;
        let name = btn.dataset.name;
        let price = Number(btn.dataset.price);
        let img = btn.dataset.img;

        let existing = cart.find(p => p.product_id == product_id);

        if (existing) {
            if (existing.qty < existing.stock) {
                existing.qty++;
            }
        } else {
            if (stock <= 0) return;
            cart.push({ product_id, name, price, img, qty: 1, stock });
        }

        updateCart();
    });

    // ============================
    // تحديث السلة
    // ============================
    function updateCart() {

        // ===== Drawer Cart =====
        if (cartContainer) {
            if (cart.length === 0) {
                cartContainer.innerHTML = `<p>Your cart is empty</p>`;
            } else {
                let html = "";

                cart.forEach(item => {
                    html += `
                        <div class="cartRow" data-id="${item.product_id}">

                            <div class="cartRowImageContainer">
                                <img 
                                    class="ImgCart"
                                    src="/img/${item.img}"
                                    onerror="this.src='https://via.placeholder.com/80x80'"
                                >
                            </div>

                            <div class="cartIcons">
                                <h3>${item.name}</h3>
                                <p>${Number(item.price).toLocaleString()} EGP</p>

                                <span class="quantity-controls">
                                    <i class="fa-solid fa-plus plus"></i>
                                    <span>${item.qty}</span>
                                    <i class="fa-solid fa-minus minus"></i>
                                </span>
                            </div>

                            <i class="fa-solid fa-trash deleteItem"></i>
                        </div>
                    `;
                });

                cartContainer.innerHTML = html;
            }
        }

        // ===== Checkout Page =====
        let items = document.querySelector(".items");

        if (items) {
            if (cart.length === 0) {
                items.innerHTML = `
                    <div style="text-align:center; padding:40px; color:#888;">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
            } else {
                let html = "";

                cart.forEach(item => {
                    html += `
                        <div class="item_cart" data-id="${item.product_id}">

                            <div class="img_name">

                                <img 
                                    src="/img/${item.img}"
                                    alt="${item.name}"
                                    onerror="this.src='https://via.placeholder.com/80x80'"
                                >

                                <div class="content">
                                    <h3>${item.name}</h3>
                                    <p>${Number(item.price).toLocaleString()} EGP</p>

                                    <div class="quantity">
                                        <button class="quantityBtn minus">-</button>
                                        <span class="qty-value">${item.qty}</span>
                                        <button class="quantityBtn plus">+</button>
                                    </div>
                                </div>

                            </div>

                            <div class="trash_continer">
                                <button class="removeCartBtn deleteItem">
                                    <i class="fa-solid fa-trash-alt"></i>
                                </button>
                            </div>

                        </div>
                    `;
                });

                items.innerHTML = html;
            }
        }

        // ============================
        // TOTAL FIXED 100%
        // ============================
        let total = cart.reduce((acc, item) => {
            return acc + (Number(item.price) * Number(item.qty));
        }, 0);

        let subtotalEl = document.querySelector(".subtotal");
        let shippingEl = document.querySelector(".shipping");
        let totalEl = document.querySelector(".totaling");

        if (subtotalEl) {
            subtotalEl.textContent = total.toLocaleString() + " EGP";
        }

        if (shippingEl) {
            shippingEl.textContent = "50 EGP";
        }

        if (totalEl) {
            totalEl.textContent = (total + 50).toLocaleString() + " EGP";
        }

        // Save
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // ============================
    // + - حذف
    // ============================
    document.addEventListener("click", (e) => {

        let row = e.target.closest(".item_cart, .cartRow");
        if (!row) return;

        let id = row.dataset.id;
        let product = cart.find(p => p.product_id == id);
        if (!product) return;

        if (e.target.closest(".plus")) {
            if (product.qty < product.stock) product.qty++;
            updateCart();
        }

        if (e.target.closest(".minus")) {
            if (product.qty > 1) product.qty--;
            updateCart();
        }

        if (e.target.closest(".deleteItem")) {
            cart = cart.filter(p => p.product_id != id);
            updateCart();
        }
    });

    updateCart();

});document.addEventListener("DOMContentLoaded", () => {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const openCartBtn = document.querySelectorAll(".openCartBtn");
    const closeCartbtn = document.querySelector(".closeCartbtn");
    const cartbox = document.querySelector(".cart");
    const cartContainer = document.querySelector(".cartItem");

    console.log("✓ Cart loaded:", cart);

    // ============================
    // فتح / غلق السلة
    // ============================
    openCartBtn.forEach(btn => {

        btn?.addEventListener("click", (e) => {
            e.preventDefault();
            cartbox?.classList.add("open");
        });

        btn.setAttribute("data-count", cart.length);
    });

    closeCartbtn?.addEventListener("click", () => {
        cartbox?.classList.remove("open");
    });

    document.addEventListener("click", (e) => {
        const isInside = cartbox?.contains(e.target);
        const isBtn = Array.from(openCartBtn).some(btn => btn.contains(e.target));

        if (cartbox?.classList.contains("open") && !isInside && !isBtn) {
            cartbox.classList.remove("open");
        }
    });

    // ============================
    // إضافة المنتج
    // ============================
    document.addEventListener("click", (e) => {

        let btn = e.target.closest(".buy_btn");
        if (!btn) return;

        let stock = Number(btn.dataset.stock || 0);
        let product_id = btn.dataset.id;
        let name = btn.dataset.name;
        let price = Number(btn.dataset.price);
        let img = btn.dataset.img;

        let existing = cart.find(p => p.product_id == product_id);

        if (existing) {
            if (existing.qty < existing.stock) {
                existing.qty++;
            }
        } else {
            if (stock <= 0) return;
            cart.push({ product_id, name, price, img, qty: 1, stock });
        }

        updateCart();
    });

    // ============================
    // تحديث السلة
    // ============================
    function updateCart() {

        // ===== Drawer Cart =====
        if (cartContainer) {
            if (cart.length === 0) {
                cartContainer.innerHTML = `<p>Your cart is empty</p>`;
            } else {
                let html = "";

                cart.forEach(item => {
                    html += `
                        <div class="cartRow" data-id="${item.product_id}">

                            <div class="cartRowImageContainer">
                                <img 
                                    class="ImgCart"
                                    src="/img/${item.img}"
                                    onerror="this.src='https://via.placeholder.com/80x80'"
                                >
                            </div>

                            <div class="cartIcons">
                                <h3>${item.name}</h3>
                                <p>${Number(item.price).toLocaleString()} EGP</p>

                                <span class="quantity-controls">
                                    <i class="fa-solid fa-plus plus"></i>
                                    <span>${item.qty}</span>
                                    <i class="fa-solid fa-minus minus"></i>
                                </span>
                            </div>

                            <i class="fa-solid fa-trash deleteItem"></i>
                        </div>
                    `;
                });

                cartContainer.innerHTML = html;
            }
        }

        // ===== Checkout Page =====
        let items = document.querySelector(".items");

        if (items) {
            if (cart.length === 0) {
                items.innerHTML = `
                    <div style="text-align:center; padding:40px; color:#888;">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
            } else {
                let html = "";

                cart.forEach(item => {
                    html += `
                        <div class="item_cart" data-id="${item.product_id}">

                            <div class="img_name">

                                <img 
                                    src="/img/${item.img}"
                                    alt="${item.name}"
                                    onerror="this.src='https://via.placeholder.com/80x80'"
                                >

                                <div class="content">
                                    <h3>${item.name}</h3>
                                    <p>${Number(item.price).toLocaleString()} EGP</p>

                                    <div class="quantity">
                                        <button class="quantityBtn minus">-</button>
                                        <span class="qty-value">${item.qty}</span>
                                        <button class="quantityBtn plus">+</button>
                                    </div>
                                </div>

                            </div>

                            <div class="trash_continer">
                                <button class="removeCartBtn deleteItem">
                                    <i class="fa-solid fa-trash-alt"></i>
                                </button>
                            </div>

                        </div>
                    `;
                });

                items.innerHTML = html;
            }
        }

        // ============================
        // TOTAL FIXED 100%
        // ============================
        let total = cart.reduce((acc, item) => {
            return acc + (Number(item.price) * Number(item.qty));
        }, 0);

        let subtotalEl = document.querySelector(".subtotal");
        let shippingEl = document.querySelector(".shipping");
        let totalEl = document.querySelector(".totaling");

        if (subtotalEl) {
            subtotalEl.textContent = total.toLocaleString() + " EGP";
        }

        if (shippingEl) {
            shippingEl.textContent = "50 EGP";
        }

        if (totalEl) {
            totalEl.textContent = (total + 50).toLocaleString() + " EGP";
        }

        // Save
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // ============================
    // + - حذف
    // ============================
    document.addEventListener("click", (e) => {

        let row = e.target.closest(".item_cart, .cartRow");
        if (!row) return;

        let id = row.dataset.id;
        let product = cart.find(p => p.product_id == id);
        if (!product) return;

        if (e.target.closest(".plus")) {
            if (product.qty < product.stock) product.qty++;
            updateCart();
        }

        if (e.target.closest(".minus")) {
            if (product.qty > 1) product.qty--;
            updateCart();
        }

        if (e.target.closest(".deleteItem")) {
            cart = cart.filter(p => p.product_id != id);
            updateCart();
        }
    });

    updateCart();

});