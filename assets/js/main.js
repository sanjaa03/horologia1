var satovi=[];
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
  ispisForme(data,"brend");
 });
 ajaxCallBack("kategorije.json",function(data){
  ispisForme(data,"pol");
 });
 ajaxCallBack("proizvodi.json",ispisProizvoda);
 ajaxCallBack("proizvodi.json",function(data){
  satovi=data;
  ispisProizvodaSvih(satovi);
  setLS("sviSatovi",satovi);
 });


   if(document.querySelector("#korpa")){
      displayProducts();
   }

 ajaxCallBack("nav.json",function(data){
  ispisMenija(data);
  countProducts();
 });
 


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
function ispisMenija(linkovi){
  let ispis="";
  for(let link of linkovi){
     ispis+=`<li class="nav-item">
     <a href="${link.href}" class="nav-link">${link.text}</a>
   </li>`
  }
  document.querySelector("#meni").innerHTML=ispis;
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
function ispisProizvoda(satovi){
  let ispis="";
  for(let sat of satovi){
   if(sat.bestseller){
   ispis+=`<div class="col-12 col-md-6 col-lg-3 mb-4">
   <div class="card">
     <img src="${sat.srcSlika}" class="card-img-top" alt="${sat.naziv}">
     <div class="card-body">
       <h5 class="card-title">${sat.naziv}</h5>
       <div class="cena">${obradaCene(sat.cena)}</div
       <ul>${specifikacijaObrada(sat.specifikacije)}</ul>
     </div>
   </div>
 </div>`
 }
}
document.querySelector("#prikazProizvoda").innerHTML=ispis;
  
}


//ispis svih proizvoda
 function ispisProizvodaSvih(satovi){

  let ispis="";
   satovi=filterBrend(satovi);
   satovi=filterPol(satovi);
   satovi=sortiranje(satovi);
   satovi=filterPretraga(satovi);
  if(satovi.length>0){
  for(let sat of satovi){
   ispis+=`<div class="col-12 col-md-6 col-lg-3 mb-4">
   <div class="card">
     <img src="${sat.srcSlika}" class="card-img-top" alt="${sat.naziv}">
     <div class="card-body">
       <h5 class="card-title">${sat.naziv}</h5>
       <ul>${specifikacijaObrada(sat.specifikacije)}</ul>
        <div class="cena">${obradaCene(sat.cena)}</div>
       <button type="button"  class="btna" data-id="${sat.id}">
       ADD TO CART
   </button>
     </div>
   </div>
 </div>`
  }
 }
 else{
  ispis=`<div class=" text-center mt-5">
                 <h3>No products found.</h3>
               </div>`;
 }
document.querySelector("#prikazProizvodaSvih").innerHTML=ispis;
document.querySelectorAll(".btna").forEach(btn => {
    btn.addEventListener("click",function(){
      add(this);
    });
});
//$('.btna').click(dodajUKorpu);
}
//prover cene
function obradaCene(stara){
  let ispis="";
   if(stara.staraCena != null){
    ispis+=`<span class="stara">${stara.staraCena}€</span>
             <span class="aktuelna">${stara.aktuelnaCena}€</span>`
   }
   else{
    ispis+=`
    <p></p>
    <span class="aktuelna">${stara.aktuelnaCena}€</span>`
   }
   return ispis;
}
//obrada specifikacije
function specifikacijaObrada(specif){
  let ispis="";
  for(let s of specif){
    ispis+=`<li><b>·</b> ${s.naziv} : ${s.vrednost}</li>`
  }
  return ispis;
}

//forma za sortiranje
var brendovi=[];
var kategorijePol=[];

var forma=`<form id="forma"><input type="search" name="pretraga" id="pretraga" placeholder="Search products"/>`;
function ispisForme(podaci,filter){
  
  if(filter=="brend"){
     forma+=`<p class="prodFilter">Brands:</p>`;
     for(let p of podaci){
      forma+=`<input type="checkbox" value="${p.id}" name="brendovi" id="brn-${p.id}"/>
      <label for="brn-${p.id}">${p.naziv}</label><br/>`
     }
  }
  else if(filter=="pol"){
    forma+=`<h5 class="mt-5">Gender:</h5>`;
    for(let p of podaci){
     forma+=`<input type="checkbox" value="${p.id}" name="pol" id="pol-${p.id}"/>
     <label for="pol-${p.id}">${p.naziv}</label><br/>`
    }
    forma+=`<div class="mt-5">
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
  document.querySelector("#sortiranjeForma").innerHTML=forma;
  filtriranje();

}

var selektovaniBrend=[];
var selektovaniPol=[];

function filtriranje(){
  var poljeBrend=document.getElementsByName("brendovi");
  poljeBrend=Array.from(poljeBrend);
  poljeBrend.forEach(vrsta=>{
    vrsta.addEventListener("change",function(){
     if(this.checked){
      selektovaniBrend.push(vrsta.id.substring(4,(vrsta.id).length));
      ispisProizvodaSvih(satovi);
     }
     else{
      selektovaniBrend.splice(selektovaniBrend.indexOf(vrsta.id),1);
      ispisProizvodaSvih(satovi);
     }
    });
  })

  var poljePol=document.getElementsByName("pol");
  poljePol=Array.from(poljePol);
  poljePol.forEach(vrsta=>{
    vrsta.addEventListener("change",function(){
     if(this.checked){
      selektovaniPol.push(vrsta.id.substring(4,(vrsta.id).length));
      ispisProizvodaSvih(satovi);
     }
     else{
      selektovaniPol.splice(selektovaniPol.indexOf(vrsta.id),1);
      ispisProizvodaSvih(satovi);
     }
    });
  })

  document.querySelector("#ddlSort").addEventListener("change",function(){
    ispisProizvodaSvih(satovi);
  });
  document.querySelector("#pretraga").addEventListener("keyup", function(){
    ispisProizvodaSvih(satovi);
  });
  document.querySelector("#btnReset").addEventListener("click",resetFIlters);
}

function filterBrend(proizvodi){
  if(selektovaniBrend.length==0){
    return proizvodi;
  }
 let niz=[];
 for(let i=0;i<proizvodi.length;i++){
  for(let j=0;j<selektovaniBrend.length;j++){
    if(proizvodi[i].brend.includes(selektovaniBrend[j])){
      niz.push(proizvodi[i]);
    }
  }
 }
 return niz;
}

function filterPol(proizvodi){
  if(selektovaniPol.length==0){
    return proizvodi;
  }
 let niz=[];
 for(let i=0;i<proizvodi.length;i++){
  for(let j=0;j<selektovaniPol.length;j++){
    if(proizvodi[i].kategorija.includes(selektovaniPol[j])){
      niz.push(proizvodi[i]);
    }
  }
 }
 return niz;
}
//filter pretraga
function filterPretraga(proizvodi){
  var unosPretraga=document.querySelector("#pretraga").value.toLowerCase();
  if(unosPretraga==""){
    return proizvodi;
  }
   return proizvodi.filter(p=>p.naziv.toLowerCase().includes(unosPretraga));
}

function sortiranje(proizvodi){
  let kopijaP=[...proizvodi];
  let sortProizvod = [];
  let vred = document.querySelector("#ddlSort").value;
  if(vred == "0"){
      sortProizvod = kopijaP;
  }
  else{
      sortProizvod = kopijaP.sort(function(a, b){
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
  return sortProizvod;
}
//kontakt
if(document.querySelector("#btnPrijava")){
let taster = document.querySelector("#btnPrijava");
taster.addEventListener("click", obradaForme);

}

function obradaForme(){
  var brojGresaka = 0;
  let objImePrezime,objEmail, objAdresa,objNapomena;

  objImePrezime = document.querySelector("#tbImePrezime");
  objEmail = document.querySelector("#tbEmail");
  objAdresa = document.querySelector("#tbAdresa");
  objNapomena = document.querySelector("#taNapomena");

  let reImePrezime,reEmail, reAdresa;
  reImePrezime = /^[A-Z][a-z]{2,14}(\s[A-Z][a-z]{2,14})+$/;
  reEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`~-]+@[a-zA-Z0-9-]+(.com)+$/;
  reAdresa = /^(([A-Z][a-z]{1,15}(\.)?)|([1-9][0-9]{0,2}(\.)?))[a-zA-Z0-9\s\/\-]+$/;

  proveraRegularnimIzrazima(reImePrezime, objImePrezime, "First and Last name must start with uppercase!(Example:Ana Johnson)");
  proveraRegularnimIzrazima(reEmail, objEmail, "Email must be in format: something@example.com");
  proveraRegularnimIzrazima(reAdresa, objAdresa, "Address must be in format:");

  function proveraRegularnimIzrazima(regularni, objekat, poruka){
      if(!regularni.test(objekat.value)){
          objekat.nextElementSibling.classList.remove("sakrij");
          objekat.nextElementSibling.innerHTML = poruka;
          objekat.classList.add("crvena-bordura");
          brojGresaka++;
      }
      else{
          objekat.nextElementSibling.classList.add("sakrij");
          objekat.nextElementSibling.innerHTML = "";
          objekat.classList.remove("crvena-bordura");
      }
  }
  if(objNapomena.value.length < 10){
      objNapomena.nextElementSibling.classList.remove("sakrij");
      objNapomena.nextElementSibling.innerHTML = "Note must be at least 10 characters long!";
      objNapomena.classList.add("crvena-bordura");
      brojGresaka++;
  }
  else{
      objNapomena.nextElementSibling.classList.add("sakrij");
      objNapomena.nextElementSibling.innerHTML = "";
      objNapomena.classList.remove("crvena-bordura");
  }

  if(brojGresaka == 0){
      let divIspis = document.querySelector("#ispis");
      divIspis.setAttribute("class", "alert alert-success mt-4");

      let formatZaIspis = `Your message is sent!`;

      divIspis.innerHTML = formatZaIspis;

      document.getElementById("forma-prijava").reset();
  }

}

function resetFIlters(){
  selektovaniBrend=[];
  selektovaniPol=[];
  let brendovi=document.getElementsByName("brendovi");
  brendovi=Array.from(brendovi);
  brendovi.forEach(b => {
     b.checked=false
  });

  let polovi=document.getElementsByName("pol");
  polovi=Array.from(polovi);
  polovi.forEach(p=>{
   p.checked=false; 
  });

  document.querySelector("#ddlSort").value="0";
  document.querySelector("#pretraga").value="";
  ispisProizvodaSvih(satovi);
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

let godina=new Date().getFullYear();
document.querySelector(".horoDatum").innerHTML=godina;