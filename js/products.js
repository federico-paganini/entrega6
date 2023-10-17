let URL_products = "https://japceibal.github.io/emercado-api/cats_products/";
let URL_categories = "https://japceibal.github.io/emercado-api/cats/cat.json";

async function get_categories_list() {
  const response = await fetch(URL_categories);

  if (response.ok) {
    let categorias = await response.json();
    return categorias;
  } else {
    console.log("Hubo un error");
  }
}

async function get_products_por_nombre(nombre_categoria) {
  const categorias = await get_categories_list();
  let id;
  categorias.forEach((categoria) => {
    if (categoria.name === nombre_categoria) {
      id = categoria.id;
    }
  });
  if (id) {
    return await get_products_por_id(id);
  } else {
    console.log("Categoría no encontrada");
  }
}

async function get_products_por_id(id) {

  let URL = URL_products + id + ".json";

  const response = await fetch(URL);
  if (response.ok) {
    let json = await response.json();
    return json.products;
  } else {
    console.log("Hubo un error");
  }
}

async function mostrar_products() {

  try {
      
     id = localStorage.getItem("catID");
     allProducts = await get_products_por_id(id);
     categorias = await get_categories_list();
    cambiarTitulo(categorias, id);
    displayProducts(allProducts);
    ordenoriginal=allProducts.slice();
  } catch (error) {
    console.error(error);
  }
}

function cambiarTitulo(categorias, id) {
  for (let index = 0; index < categorias.length; index++) {
    if (categorias[index].id == id) {
      document.getElementById("categoriaTitulo").textContent = categorias[index].name;
      break;


    }
  }
}

function displayProducts(products) {
  const productsContainer = document.getElementById("products-container");

  productsContainer.innerHTML = '';  // agregue para que funcione la wea no borraba los datos anteriores al usar filtro. 

  products.forEach(product => {
      
      let productCard = document.createElement("div");
      productCard.classList.add("card", "col-lg-3", "col-md-4", "col-sm-6", "col-12", "cardcursor");  //CAMBIE EL TIPO DE FORMATO DE PRESENTACION DE DATOS A COL POQUE QUEDA MEJOR A LA VISTA QUE LOS MB-4 QUE ESTABAN ANTES 

      let productImage = document.createElement("img");
      productImage.src = product.image;
      productImage.alt = product.name;
      productImage.className = "card-img-top";

      let cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      let productName = document.createElement("h5");
      productName.textContent = product.name;
      productName.classList.add("card-title");

      let productDescription = document.createElement("p");
      productDescription.textContent = product.description;
      productDescription.classList.add("card-text");

      let productcost = document.createElement("p");
      productcost.textContent = `Precio: $${product.cost}`;
      productcost.classList.add("card-text");

      let productQuantitySold = document.createElement("p");
      productQuantitySold.textContent = `Cantidad Vendida: ${product.soldCount}`;
      productQuantitySold.classList.add("card-text");

      cardBody.appendChild(productName);


      cardBody.appendChild(productDescription);


      cardBody.appendChild(productcost);

      cardBody.appendChild(productQuantitySold);

      productCard.appendChild(productImage);
      
      productCard.appendChild(cardBody);

      productsContainer.appendChild(productCard);


         //creo evento dentro del foreach para cada tarjeta que se genera, al tocarla se guarda el id del producto en local storage. 


    productCard.addEventListener("click", function () {

      let selectedProductID = product.id;
      localStorage.setItem("ValorID", selectedProductID);
      window.location.href= "product-info.html"
    });
  });
}




document.getElementById("accionfiltrar").addEventListener("click", aplicarfiltrado);



function aplicarfiltrado() {

    displayProducts(filtrar());
}

function filtrar(){
  const minprecio = parseFloat(document.getElementById("minimofiltro1").value|| 0); 
  const maxprecio = parseFloat(document.getElementById("maximofiltro1").value|| Infinity);


  if (isNaN(minprecio) || isNaN(maxprecio) || minprecio < 0 || maxprecio < 0) {
      alert("Por favor, ingresa valores numéricos válidos.");
      return;
  }

   productosFiltrados = allProducts.filter(producto => producto.cost >= minprecio && producto.cost <= maxprecio);
   return(productosFiltrados);
}


document.addEventListener("DOMContentLoaded",()=>{

  // quitar filtrado
  document.getElementById("eliminarfiltro").addEventListener("click", QuitarFiltrado )
  
  
  function QuitarFiltrado(){
    displayProducts(ordenoriginal);
    
    document.getElementById("minimofiltro1").value = '';
    document.getElementById("maximofiltro1").value = '';
    
    
  }
  document.getElementById("menorRelevancia").addEventListener("click", function(){
    filtrar().sort((a, b) => a.soldCount - b.soldCount);
    displayProducts(productosFiltrados);
  });
  
  document.getElementById("mayorRelevancia").addEventListener("click", function(){
    filtrar().sort((a, b) => b.soldCount - a.soldCount);
    displayProducts(productosFiltrados);
  });
  //odenar alfabeticamente     
  
  document.getElementById("filtrarAZ").addEventListener("click", function(){
    filtrar().sort((a, b) => a.name.localeCompare(b.name));
    displayProducts(productosFiltrados);
  });
  
  document.getElementById("filtrarZA").addEventListener("click", function(){
    filtrar().sort((a, b) => b.name.localeCompare(a.name));
    displayProducts(productosFiltrados);
  });
  
  
  
  
 // Barra de Búsqueda producto

 const barrabusq = document.getElementById("search-bar");
 barrabusq.addEventListener("input", () => {

   const texto = barrabusq.value.toLowerCase();
   const ctn = document.getElementById("products-container");

   //* Agregamos un Set para que no se repitan productos al filtrar por nombre y descripción *//
   //* En un Set, los productos pueden aparecer solamente una vez *//
   const flitrarSinRepetir = new Set();

   allProducts.forEach(producto => {
     const nombreProducto = producto.name.toLowerCase();
     const descripcionProducto = producto.description.toLowerCase();

     //* Compara si el nombre o la descripción contienen el texto de búsqueda *//
     //* Se ubica primero en el if la constante nombreProducto para que se priorice el nombre sobre la descripción *//
     if (nombreProducto.includes(texto) || descripcionProducto.includes(texto)) {
       flitrarSinRepetir.add(producto); // Agregar el producto al conjunto
     }
   });

   const productosFiltrados = [...flitrarSinRepetir]; // Convertir el conjunto en un Array
   if (barrabusq.value !== "") {
     if (productosFiltrados.length === 0) {
       ctn.innerHTML = `<p>Producto no encontrado...</p>`;
     } else {
       ctn.innerHTML = "";
       displayProducts(productosFiltrados); // Mostrar los productos filtrados
     }
   } else {
     displayProducts(allProducts); // Volver a mostrar productos cuando la barra se vacía.
   }

 });


 //* Mostrar todos los productos nuevamente cuando la barra de búsqueda pierde el foco *//

 barrabusq.addEventListener("blur", function () {
   displayProducts(allProducts);
 }); 
  mostrar_products();
});
  
  