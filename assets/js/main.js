var watches=[];
const BASE_URL="assets/js/";

function ajaxCallBack(fileName,callback){
  $.ajax({
     url:BASE_URL+fileName,
     method:"get",
     dataType:"json",
     success:callback,
     error:function(e){
      console.log(e);
     }
  });
}

window.onload=function(){
   ajaxCallBack("brendovi.json",function(data){
  displayForm(data,"brend");
 });
 ajaxCallBack("kategorije.json",function(data){
  displayForm(data,"pol");
 });
 ajaxCallBack("proizvodi.json",productsBest);
 ajaxCallBack("proizvodi.json",function(data){
  watches=data;
  displayAllProducts(watches);
  setLS("sviSatovi",watches);
 });


   if(document.querySelector("#korpa")){
      displayProducts();
   }

 ajaxCallBack("nav.json",function(data){
  dispalyMenu(data);
  countProducts();
 });
 
seikoAction();

}


var hamburger = document.querySelector(".hamburger");
var nav_menu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  nav_menu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
  hamburger.classList.remove("active");
  nav_menu.classList.remove("active");
}));
//ispis menija
function dispalyMenu(links){
  let display="";
  for(let link of links){
     display+=`<li class="nav-item">
     <a href="${link.href}" class="nav-link">${link.text}</a>
   </li>`
  }
  document.querySelector("#meni").innerHTML=display;
}


//read more
$(document).ready(function() {
                                          
  $("#aboutBlockTwo").hide();                                                    
   $("#dugmeReadMore").click(function() {
   $("#aboutBlockTwo").toggle(600);                  
   let btn = $(this);
   if(btn.text() == "Read less") {
        btn.text("Read more");
  } else {
        btn.text("Read less");
   }         
   })
   });


//ispis best sellera
function productsBest(watches){
  let display="";
  for(let watch of watches){
   if(watch.bestseller){
   display+=`<div class="col-12 col-md-6 col-lg-3 mb-4">
   <div class="card">
     <img src="${watch.srcSlika}" class="card-img-top" alt="${watch.naziv}">
     <div class="card-body">
       <h5 class="card-title">${watch.naziv}</h5>
       <div class="cena">${price(watch.cena)}</div
       <ul>${specifications(watch.specifikacije)}</ul>
     </div>
   </div>
 </div>`
 }
}
document.querySelector("#prikazProizvoda").innerHTML=display;
  
}


//ispis svih proizvoda
 function displayAllProducts(watches){

  let display="";
   watches=filterBrand(watches);
   watches=filterPol(watches);
   watches=sort(watches);
   watches=filterSearch(watches);
  if(watches.length>0){
  for(let w of watches){
   display+=`<div class="col-12 col-md-6 col-lg-3 mb-4">
   <div class="card">
     <img src="${w.srcSlika}" class="card-img-top" alt="${w.naziv}">
     <div class="card-body">
       <h5 class="card-title">${w.naziv}</h5>
       <ul>${specifications(w.specifikacije)}</ul>
        <div class="cena">${price(w.cena)}</div>
       <button type="button"  class="btna" data-id="${w.id}">
       ADD TO CART
   </button>
     </div>
   </div>
 </div>`
  }
 }
 else{
  display=`<div class=" text-center mt-5">
                 <h3>No products found.</h3>
               </div>`;
 }
document.querySelector("#prikazProizvodaSvih").innerHTML=display;
document.querySelectorAll(".btna").forEach(btn => {
    btn.addEventListener("click",function(){
      add(this);
    });
});
}
//prover cene
function price(old){
  let display="";
   if(old.staraCena != null){
    display+=`<span class="stara">${old.staraCena}€</span>
             <span class="aktuelna">${old.aktuelnaCena}€</span>`
   }
   else{
    display+=`
    <p></p>
    <span class="aktuelna">${old.aktuelnaCena}€</span>`
   }
   return display;
}
//obrada specifikacije
function specifications(specif){
  let display="";
  for(let s of specif){
    display+=`<li><b>·</b> ${s.naziv} : ${s.vrednost}</li>`
  }
  return display;
}

//forma za sortiranje
//var brands=[];
//var kategorijePol=[];

var form=`<form id="forma"><input type="search" name="pretraga" id="pretraga" placeholder="Search products"/>`;
function displayForm(data,filter){
  
  if(filter=="brend"){
     form+=`<p class="prodFilter">Brands:</p>`;
     for(let p of data){
      form+=`<input type="checkbox" value="${p.id}" name="brendovi" id="brn-${p.id}"/>
      <label for="brn-${p.id}">${p.naziv}</label><br/>`
     }
  }
  else if(filter=="pol"){
    form+=`<h5 class="mt-5">Gender:</h5>`;
    for(let p of data){
     form+=`<input type="checkbox" value="${p.id}" name="pol" id="pol-${p.id}"/>
     <label for="pol-${p.id}">${p.naziv}</label><br/>`
    }
    form+=`<div class="mt-5">
    <h5>Sort by:</h5>
    <form>
       <select class="form-control" id="ddlSort">
         <option value="0" selected>Sort by:</option>
         <option value="1">Price ascending</option>
         <option value="2">Price descending</option>
         <option value="3">Name A-Z</option>
       </select>
       </form>
    </div>
    <input type="button" value="Reset filters" id="btnReset" class="my-3"/>
`
  }
  document.querySelector("#sortiranjeForma").innerHTML=form;
  filterProducts();

}

var selectedBrand=[];
var selectedSex=[];

function filterProducts(){
  var elementBrand=document.getElementsByName("brendovi");
  elementBrand=Array.from(elementBrand);
  elementBrand.forEach(el=>{
    el.addEventListener("change",function(){
     if(this.checked){
      selectedBrand.push(el.id.substring(4,(el.id).length));
      displayAllProducts(watches);
     }
     else{
      selectedBrand.splice(selectedBrand.indexOf(el.id),1);
      displayAllProducts(watches);
     }
    });
  })

  var elementSex=document.getElementsByName("pol");
  elementSex=Array.from(elementSex);
  elementSex.forEach(el=>{
    el.addEventListener("change",function(){
     if(this.checked){
      selectedSex.push(el.id.substring(4,(el.id).length));
      displayAllProducts(watches);
     }
     else{
      selectedSex.splice(selectedSex.indexOf(el.id),1);
      displayAllProducts(watches);
     }
    });
  })

  document.querySelector("#ddlSort").addEventListener("change",function(){
    displayAllProducts(watches);
  });
  document.querySelector("#pretraga").addEventListener("keyup", function(){
    displayAllProducts(watches);
  });
  document.querySelector("#btnReset").addEventListener("click",resetFIlters);
}

function filterBrand(products){
  if(selectedBrand.length==0){
    return products;
  }
 let niz=[];
 for(let i=0;i<products.length;i++){
  for(let j=0;j<selectedBrand.length;j++){
    if(products[i].brend.includes(selectedBrand[j])){
      niz.push(products[i]);
    }
  }
 }
 return niz;
}

function filterPol(products){
  if(selectedSex.length==0){
    return products;
  }
 let niz=[];
 for(let i=0;i<products.length;i++){
  for(let j=0;j<selectedSex.length;j++){
    if(products[i].kategorija.includes(selectedSex[j])){
      niz.push(products[i]);
    }
  }
 }
 return niz;
}
//filter pretraga
function filterSearch(products){
  var inputSearch=document.querySelector("#pretraga").value.toLowerCase();
  if(inputSearch==""){
    return products;
  }
   return products.filter(p=>p.naziv.toLowerCase().includes(inputSearch));
}

function sort(products){
  let copyP=[...products];
  let sortProduct = [];
  let vred = document.querySelector("#ddlSort").value;
  if(vred == "0"){
      sortProduct = copyP;
  }
  else{
      sortProduct = copyP.sort(function(a, b){
          if(vred == "1"){
              return a.cena.aktuelnaCena - b.cena.aktuelnaCena;
          }
          if(vred == "2"){
              return b.cena.aktuelnaCena - a.cena.aktuelnaCena;
          }
          if(vred == "3"){
              if(a.naziv < b.naziv){
                  return -1;
              }
              else if(a.naziv > b.naziv){
                  return 1;
              }
              else{
                  return 0;
              }
          }
      })
  }
  return sortProduct;
}
//kontakt
if(document.querySelector("#btnPrijava")){
let taster = document.querySelector("#btnPrijava");
taster.addEventListener("click", procesForm);

}

function procesForm(){
  var countErr = 0;
  let objname,objEmail, objAdress,objTextarea;

  objname = document.querySelector("#tbImePrezime");
  objEmail = document.querySelector("#tbEmail");
  objAdress = document.querySelector("#tbAdresa");
  objTextarea = document.querySelector("#taNapomena");

  let reName,reEmail, reAdress;
  reName = /^[A-Z][a-z]{2,14}(\s[A-Z][a-z]{2,14})+$/;
  reEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`~-]+@[a-zA-Z0-9-]+(.com)+$/;
  reAdress = /^(([A-Z][a-z]{1,15}(\.)?)|([1-9][0-9]{0,2}(\.)?))[a-zA-Z0-9\s\/\-]+$/;

  checkRegEx(reName, objname, "First and Last name must start with uppercase!(Example:Ana Johnson)");
  checkRegEx(reEmail, objEmail, "Email must be in format: something@example.com");
  checkRegEx(reAdress, objAdress, "Address must be in format:");

  function checkRegEx(regex, obj, message){
      if(!regex.test(obj.value)){
          obj.nextElementSibling.classList.remove("sakrij");
          obj.nextElementSibling.innerHTML = message;
          obj.classList.add("crvena-bordura");
          countErr++;
      }
      else{
          obj.nextElementSibling.classList.add("sakrij");
          obj.nextElementSibling.innerHTML = "";
          obj.classList.remove("crvena-bordura");
      }
  }
  if(objTextarea.value.length < 10){
      objTextarea.nextElementSibling.classList.remove("sakrij");
      objTextarea.nextElementSibling.innerHTML = "Note must be at least 10 characters long!";
      objTextarea.classList.add("crvena-bordura");
      countErr++;
  }
  else{
      objTextarea.nextElementSibling.classList.add("sakrij");
      objTextarea.nextElementSibling.innerHTML = "";
      objTextarea.classList.remove("crvena-bordura");
  }

  if(countErr == 0){
      let divDisplay = document.querySelector("#ispis");
      divDisplay.setAttribute("class", "alert alert-success mt-4");

      let formatForDisplay = `Your message is sent!`;

      divDisplay.innerHTML = formatForDisplay;

      document.getElementById("forma-prijava").reset();
  }

}

function resetFIlters(){
  selectedBrand=[];
  selectedSex=[];
  let brands=document.getElementsByName("brendovi");
  brands=Array.from(brands);
  brands.forEach(b => {
     b.checked=false
  });

  let sexInput=document.getElementsByName("pol");
  sexInput=Array.from(sexInput);
  sexInput.forEach(p=>{
   p.checked=false; 
  });

  document.querySelector("#ddlSort").value="0";
  document.querySelector("#pretraga").value="";
  displayAllProducts(watches);
}

//dodaj u LS
function setLS(name,data){
  localStorage.setItem(name,JSON.stringify(data));
}
//uzmi iz LS
function getLS(name){
  return JSON.parse(localStorage.getItem(name));
}

//dodajem u korpu
function add(btn){
   let productId=$(btn).data('id');
   let cartLS=getLS("cart");
   if(!cartLS){
     cartLS=[];
   }
   let pLS=cartLS.find(p=>p.id==productId);
   if(pLS){
    pLS.item++;
   }
   else{
    cartLS.push({
      id:productId,
      item:1
    });
  }
  setLS("cart",cartLS);
  countProducts();
}

function countProducts(){
  let productsLS=getLS("cart");
   let cartHtml=document.querySelector("#brProizvoda");
  if(productsLS){
    let numberOfProd=productsLS.length;
    cartHtml.innerHTML=`(${numberOfProd})`;
  }
  else{
     cartHtml.innerHTML="(0)";
  }
}
function displayProducts(){
   let carttHtml=document.querySelector("#korpa");
   let cartLS=getLS("cart");
   let watches=getLS("sviSatovi");
   let display="";
   let total=0;
   if(!cartLS || cartLS.length==0){
     display+=`<div class="praznaKorpa">
           <h1>Your cart is empty!</h1>
           <a href="prodavnica.html" class="con">Continue shopping</a>
           </div>`;
   }else{
    display=`<table class="tabela text-center">
            <thead>
            <th>Product</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Sum</th>
            <th>Delete</th>
            </thead><tbody>`
    for(let itemFromCart of cartLS){
      let product=watches.find(w=>w.id==itemFromCart.id);
      total+=product.cena.aktuelnaCena*itemFromCart.item;
       display+=`<tr class="border">
         <td class="slikaMala"><img src="${product.srcSlika}" alt="${product.naziv}"/></td>
         <td>${product.naziv}</td>
         <td>${product.cena.aktuelnaCena}€</td>
         <td>
            <button type="button" class="minus" data-id="${product.id}">-</button>
            <span class="mx-1">${itemFromCart.item}</span>
            <button type="button" class="plus" data-id="${product.id}">+</button>
         </td>
         <td>${product.cena.aktuelnaCena*itemFromCart.item}€</td>
         <td><button type="button" data-id="${product.id}" class="delete"><i class="fa fa-trash"></i></button></td>
    </tr>`;
    }
    display+=`</tbody></table>
                <div class="right">
                <div class="total-line">
                  <span>Total:</span>
                  <span>${total}€</span>
                </div>
               
                  <button id="btnOrder">Order</button>
                  <button id="btnDel">Delete cart</button>
                </div>
            `;
   }

   carttHtml.innerHTML=display;

   document.querySelectorAll(".plus").forEach(btnPlus => {
   btnPlus.addEventListener("click", function(){
     // let id = this.dataset.id;
      increment(this.dataset.id);
   });
});
document.querySelectorAll(".minus").forEach(btnMinus=>{
  btnMinus.addEventListener("click",function(){
     decrement(this.dataset.id);
  });
});
document.querySelectorAll(".delete").forEach(btnDelete=>{
    btnDelete.addEventListener("click",function(){
       deleteBtn(this.dataset.id);
    });
});

let btnDel = document.querySelector("#btnDel");
if(btnDel){
  btnDel.addEventListener("click", deleteCart);
}
let btnOrder=document.querySelector("#btnOrder");
if(btnOrder){
  btnOrder.addEventListener("click",order);
}

}

function increment(btnp){
   let cartLS = getLS("cart");
  // let productId=btnp.dataset.id;
   let product = cartLS.find(p => p.id == btnp);
   if(product){
      product.item++;
   }

   setLS("cart", cartLS);
   displayProducts();
   countProducts();
}

function decrement(btnm){
  let cartLS=getLS("cart");
  //let productId=btnm.dataset.id;
  let btnmBroj=Number(btnm);
  let product=cartLS.find(p=>p.id==btnmBroj);
  if(product){
    product.item--;
  }
  if(product.item==0){
   cartLS= cartLS.filter(p=>p.id != btnmBroj);    
  }
  setLS("cart",cartLS);
  displayProducts();
  countProducts();
}

function deleteBtn(btnd){
  let cartLS=getLS("cart");
  cartLS=cartLS.filter(c=>c.id != btnd);
  setLS("cart",cartLS);
  displayProducts();
  countProducts();
}

function order(){
  let cart = document.querySelector("#korpa");

  cart.innerHTML = `
    <div class="ispod">
      <h2>Purchase completed successfully!</h2>
      <a href="prodavnica.html" class="con">Continue shopping</a>
    </div>
  `;

  localStorage.removeItem("cart");
  countProducts();
}

function deleteCart(){
  localStorage.removeItem("cart");
  displayProducts();
  countProducts();
}

let year=new Date().getFullYear();
document.querySelector(".horoDatum").innerHTML=year;

function seikoAction(){
  let today=new Date();
  let last=new Date("2026-04-25");
  let html="";
  if(today<=last){
    let r=last-today;
    let day=Math.ceil(r/(1000 * 60 * 60 * 24));
    html+=`<div class="akcija-tekst">
            SALE ON SEIKO WATCHES -20%<br/>
            ONLY IN STORE <br/>
             ${day} DAYS LEFT!
         </div>`

  }
  document.querySelector("#seikoAction").innerHTML=html;
  
}