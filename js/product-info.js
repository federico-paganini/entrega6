const URL = PRODUCT_INFO_URL + localStorage.getItem("ValorID") + EXT_TYPE;

document.addEventListener("DOMContentLoaded", () => {
  getJSONData(URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      info = resultObj.data;
      showInfo(info);
    }
  });
});

//  Funcion para mostrar la info del producto
function showInfo(info) {
  let arrayImg = info.images;
  let htmlContenido = "";
  let htmlImagenes = "";

  htmlContenido += `
        <div class="row">
            <div class="d-flex justify-content-between mb-3 mt-3"> 
                <h2 class="display-md-3 display-sm-6 align-self-center">${info.name}</h2> 
                <div class="d-none d-lg-block align-self-center">
                  <button type="button" onClick="carrito()"  class="btn btn-lg btn-success" id="btnComprar">
                  <i class="bi bi-cart-fill"></i>
                  Agregar al carrito</button>
                </div>
              <div class="d-none d-md-block d-lg-none align-self-center">
                <button type="button" onClick="carrito()" class="btn btn-success" id="btnComprar">
                <i class="bi bi-cart-fill"></i>
                Agregar al carrito</button>
              </div>
              <div class="d-sm-block d-md-none align-self-center">
                <button type="button" onClick="carrito()" class="btn btn-sm btn-success" id="btnComprar">
                <i class="bi bi-cart-fill"></i>
                Agregar al carrito</button>
              </div>
            </div>
            <hr>
            <p class="mb-1 fw-bold">Precio</p>
            <p>${info.currency} ${info.cost}</p><br>
            <p class="mb-1 fw-bold">Descripción</p>
            <p>${info.description}</p><br>
            <p class="mb-1 fw-bold">Categoria</p>
            <p>${info.category}</p><br>
            <p class="mb-1 fw-bold">Cantidad de vendidos</p>
            <p>${info.soldCount}</p><br>
            <p class="mb-3 fw-bold">Imágenes Ilustrativas</p><br>
        </div>
    `;
  document.getElementById("infoLista").innerHTML += htmlContenido;

  htmlImagenes += `
        <div class="carousel-item active">
            <img src="${arrayImg[0]}" alt="productoImg" class="d-block w-100">
        </div>
    `;

  //Mostrar las imagenes, con un for para recorrer el array
  for (let i = 1; i < arrayImg.length; i++) {
    htmlImagenes += `

            <div class="carousel-item">
                <img src="${arrayImg[i]}" alt="productoImg" class="d-block w-100">
            </div>
    `;
  }
  document.getElementById("infoImagenes").innerHTML += htmlImagenes;
}

// Show Comentarios
document.addEventListener("DOMContentLoaded", function (e) {
  var ProductID = localStorage.getItem("ValorID");

  // const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/"; (ya está definido en init.js)

  // Función para obtener los comentarios
  const url = `${PRODUCT_INFO_COMMENTS_URL}${ProductID}.json`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error al cargar los comentarios (${response.status})`);
      }
      return response.json();
    })
    .then((data) => {
      //Funcion para mostrar los comentarios
      const container = document.getElementById("comments-container");

      //Pasar el score a formato de estrellas

      data.forEach((comment) => {
        const divGral = document.createElement("div");
        divGral.classList.add("divGral");

        CreateDiv(divGral, comment.dateTime); //Se crea un nuevo div para mostrar la fecha de la creación de los comentarios

        const stars = ScoreToEstrellas(comment.score);
        divGral.appendChild(stars); //Se crea un nuevo div para mostrar el "score" (estrellas)

        CreateDiv(divGral, `User:  ${comment.user}`); //Se crea un nuevo div para mostrar el nombre de los usuarios

        CreateDiv(divGral, `Descripción:  ${comment.description}`); //Se crea un nuevo div para mostrar el contenido del comentario
        container.appendChild(divGral);
      });
    })
    .catch((error) => {
      console.error("Error al obtener los comentarios:", error);
    });
});

/* Selector de Estrellas */
const estrellas = document.querySelectorAll(".stars-label");

estrellas.forEach(function (estrella, index) {
  estrella.addEventListener("click", function () {
    for (let i = 0; i <= index; i++) {
      estrellas[i].classList.add("checked");
    }
    for (let i = index + 1; i < estrellas.length; i++) {
      estrellas[i].classList.remove("checked");
    }
  });
});

function CreateDiv(container, info) {
  //Función con dos argumentos, para crear un nuevo elemento "div" con información. "Container" (variable con dicho nombre) es el destino donde se inserta el nuevo "div" y "info" son los datos de texto.
  let div = document.createElement("div"); //Variable para crear elemento "div"
  div.textContent = info; //Contenido de texto dentro del elemento "div"
  div.classList.add("subdiv");
  container.appendChild(div); //el nuevo "div" se agrega como hijo al div de la variable "container".
}

function ScoreToEstrellas(score) {
  const maxStars = 5;
  const fullStar = "★";
  const emptyStar = "☆";
  const roundedScore = Math.round(score);
  const fullStars = fullStar.repeat(roundedScore);
  const emptyStars = emptyStar.repeat(maxStars - roundedScore);
  const starSpan = document.createElement("span");
  starSpan.classList.add("estrellas");
  starSpan.textContent = fullStars + emptyStars;
  return starSpan;
}

document.addEventListener("DOMContentLoaded", () => {
  let boton = document.getElementById("submit");

  boton.addEventListener("click", (e) => {
    e.preventDefault();
    let comentario = document.getElementById("comentarioTexto");

    const container = document.getElementById("comments-container");

    const divGral = document.createElement("div");
    divGral.classList.add("divGral");

    const fecha = new Date();
    let dia = fecha.getDay();
    if (dia <= 9) dia = "0" + dia;
    let mes = fecha.getDay();
    if (mes <= 9) mes = "0" + mes;
    CreateDiv(
      divGral,
      `${fecha.getFullYear() +
      "-" +
      mes +
      "-" +
      dia +
      " " +
      fecha.getHours() +
      ":" +
      fecha.getMinutes() +
      ":" +
      fecha.getSeconds()
      }`
    );

    let puntaje = 0;
    estrellas.forEach((estrella) => {
      if (estrella.classList.contains("checked")) {
        puntaje++;
        estrella.classList.remove("checked");
      }
    });

    const stars = ScoreToEstrellas(puntaje);
    divGral.appendChild(stars); //Se crea un nuevo div para mostrar el "score" (estrellas)

    const user = localStorage.getItem("email");
    CreateDiv(divGral, `User:  ${user}`); //Se crea un nuevo div para mostrar el nombre de los usuarios
    const desc = comentario.value;
    CreateDiv(divGral, `Descripción:  ${desc}`); //Se crea un nuevo div para mostrar el contenido del comentario
    container.appendChild(divGral);
    comentario.value = "";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  getJSONData(URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      let product = resultObj.data;
      var primero = true;
      product.relatedProducts.forEach((related) => {

        let div = document.createElement("div"); // <div></div>
        if (primero) {
          div.classList.add("carousel-item"); // <div class="carousel-item"></div>
          div.classList.add("active"); // <div class="carousel-item active"></div>
        }
        else div.classList.add("carousel-item"); // <div class="carousel-item"></div>

        let carta = document.createElement("div");

        carta.classList.add("container-sm");
        carta.classList.add("d-flex");
        carta.classList.add("justify-content-center");


        let carta2 = document.createElement("div");
        carta2.setAttribute("style", "width: 18rem;");
        carta2.classList.add("card");
        carta2.classList.add("card-pointer");
        carta2.innerHTML = `<img src="${related.image}" class="card-img-top">
        <div class="card-body">
        <h5 class="card-title">${related.name}</h5>
        </div>
        `;

        carta2.addEventListener("click", () => {
          let selectedProductID = related.id;
          localStorage.setItem("ValorID", selectedProductID);
          window.location.href = "product-info.html";
        });

        carta.appendChild(carta2);
        div.appendChild(carta);
        primero = false;
        document.getElementById("relacionadosDiv").appendChild(div);
      });
    }
  });
});

 //Evento del boton "agregar al carrito" que esta junto a los productos

function carrito() {
  const infoProducto = JSON.parse(localStorage.getItem('infoProducto')) || [];

  const productoExistente = infoProducto.find(item => item.id === info.id);
  console.log(productoExistente);

  if (productoExistente) {
    productoExistente.cantidad++;
    localStorage.setItem('infoProducto', JSON.stringify(infoProducto));
    alert("El producto ya está en el carrito, se sumó una unidad");
  } else {
    const DatosProducto = {
      id: info.id,
      nombre: info.name,
      moneda: info.currency,
      precio: info.cost,
      imagen: info.images[0],
      cantidad: 1,
    };
    infoProducto.push(DatosProducto);
    localStorage.setItem('infoProducto', JSON.stringify(infoProducto));
    alert("Producto agregado al carrito con éxito.");
  }
  
  
}







