//  // menubar close and open
  let menuIcon = document.querySelector(".fa-bars");
let xmark = document.querySelector(".fa-xmark");
let ul_List = document.querySelector("nav ul");


function toggleMenu() {
  menuIcon.classList.toggle("active");
  xmark.classList.toggle("active");
  ul_List.classList.toggle("active");


  // منع التمرير عند فتح القائمة
}

menuIcon.addEventListener("click", toggleMenu);
xmark.addEventListener("click", toggleMenu);

window.addEventListener("scroll",()=>{
  
  if(window.scrollY>=200){
ul_List.classList.remove("active");
xmark.classList.remove("active")
menuIcon.classList.remove("active")
  }
})

// categoryList selecte
let categoryBtn=document.querySelector(".categoryBtn");
   let categoryList=document.querySelector(".categoryList");
   categoryBtn.addEventListener("click",()=>{
    categoryList.classList.toggle("active");
   });