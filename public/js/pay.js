// const paymentForm = document.getElementById("paymentForm");
// const formDiv = document.querySelector(".form_div");
// const payBtn = document.querySelector(".payBtn");

// paymentForm.addEventListener("submit", async function(e){
//     e.preventDefault();

//     // 1. اسحب السلة من الـ localStorage (عشان السيرفر محتاجها)
//     const cart = JSON.parse(localStorage.getItem("cart")) || [];

//     // تأكد إن السلة مش فاضية
//     if (cart.length === 0) {
//         alert("السلة فارغة! يرجى إضافة منتجات أولاً.");
//         return;
//     }

//     // 2. اجمع بيانات الفورم والمبلغ وضيف عليهم الـ cart
//     const formData = {
//         firstName: paymentForm.firstName.value,
//         lastName: paymentForm.lastName.value,
//         email: paymentForm.email.value,
//         phone: paymentForm.phone?.value || "01000000000",
//         country: paymentForm.country.value,
//         address: paymentForm.address.value,
//         amount: parseFloat(document.querySelector(".totaling").textContent) || 0,
//         cart: cart // <--- ❗ دي اللي كانت ناقصة ومسببة المشكلة في السيرفر
//     };

    

//     try {
//         // تغيير حالة الزر أثناء التحميل
//         payBtn.disabled = true;
//         payBtn.textContent = "جاري التحميل...";

//         // 3. إرسال البيانات للسيرفر
//         const res = await fetch("/pay", {
//             method: "POST",
//             headers: {"Content-Type":"application/json"},
//             body: JSON.stringify(formData)
//         });

//         const data = await res.json();

//         if(data.iframeUrl){
//             // 4. إخفاء الفورم وإظهار الـ Iframe
//             formDiv.style.display = "none";

//             let container = document.getElementById("paymentIframe");
//             if (!container) {
//                 container = document.createElement("div");
//                 container.id = "paymentIframe";
//                 // تأكد إن عندك ديف بكلاس checkout أو ضيفه في أي مكان مناسب
//                 document.querySelector(".checkout").appendChild(container);
//             }
            
//             // وضع الـ Iframe داخل الصفحة
//             container.innerHTML = `
//                 <iframe 
//                     class="paymentiframe" 
//                     src="${data.iframeUrl}" 
//                     height="600px" 
//                     width="100%" 
//                     style="border:none; border-radius:15px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
//                 </iframe>`;

//         } else {
//             alert("حدث خطأ أثناء إنشاء عملية الدفع: " + (data.error || "تأكد من إعدادات Paymob"));
//             payBtn.disabled = false;
//             payBtn.textContent = "Pay Now";
//         }
//     } catch (err) {
//         console.error("Fetch Error:", err);
//         alert("خطأ في الاتصال بالسيرفر، تأكد أن السيرفر يعمل");
//         payBtn.disabled = false;
//         payBtn.textContent = "Pay Now";
//     }
// });


const paymentForm = document.getElementById("paymentForm");
const formDiv = document.querySelector(".form_div");
const payBtn = document.querySelector(".payBtn");

paymentForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // 1. اسحب السلة من localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // 2. تأكد إن السلة مش فاضية
    if (cart.length === 0) {
        alert("السلة فارغة! يرجى إضافة منتجات أولاً.");
        return;
    }

    // 3. جهّز البيانات (بدون amount نهائيًا)
    const formData = {
        firstName: paymentForm.firstName.value,
        lastName: paymentForm.lastName.value,
        email: paymentForm.email.value,
        phone: paymentForm.phone?.value || "01000000000",
        country: paymentForm.country.value,
        address: paymentForm.address.value,
        cart: cart
    };

    try {
        // 4. تعطيل الزر أثناء التحميل
        payBtn.disabled = true;
        payBtn.textContent = "جاري التحميل...";

        // 5. إرسال البيانات للسيرفر
        const res = await fetch("/pay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        // 6. نجاح الدفع
        if (data.iframeUrl) {

            formDiv.style.display = "none";

            let container = document.getElementById("paymentIframe");

            if (!container) {
                container = document.createElement("div");
                container.id = "paymentIframe";
                document.querySelector(".checkout").appendChild(container);
            }

            container.innerHTML = `
                <iframe 
                    class="paymentiframe" 
                    src="${data.iframeUrl}" 
                    height="600px" 
                    width="100%" 
                    style="border:none; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.15);">
                </iframe>
            `;

        } else {
            alert("حدث خطأ أثناء إنشاء عملية الدفع: " + (data.error || "تأكد من إعدادات Paymob"));

            payBtn.disabled = false;
            payBtn.textContent = "Pay Now";
        }

    } catch (err) {
        console.error("Fetch Error:", err);
        alert("خطأ في الاتصال بالسيرفر");

        payBtn.disabled = false;
        payBtn.textContent = "Pay Now";
    }
});