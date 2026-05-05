// scrol to up Btn
let topBtn =document.querySelector(".topBtn");
window=addEventListener(("scroll"),()=>{
if(window.scrollY>=300){
  topBtn.style.display="block"
}else{
   topBtn.style.display="none"
}


topBtn.addEventListener("click",()=>{
  window.scrollTo({
    left:0,
    top:0,
    behavior:"smooth",
})

})


})