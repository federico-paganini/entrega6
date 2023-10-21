function actualizarSubtotal(cantIngresada, costoUnitario) {
    const cantidad = cantIngresada.value;
    const impResult = cantIngresada.parentElement.parentElement.nextElementSibling;
    const moneda = impResult.innerText.split(" ")[0];
    const resultado = costoUnitario * cantidad;

    /* Actualizar cantidad de elementos en el carrito del Usuario */
    const fila = cantIngresada.closest('tr');
    const infoProducto = JSON.parse(localStorage.getItem('infoProducto')) || [];
    const nombreProducto = fila.querySelector('td:nth-child(2)').textContent;

    impResult.innerText = `${moneda} ${resultado}`;


    const index = infoProducto.findIndex(item => item.nombre === nombreProducto);
    if (index !== -1) {
        infoProducto[index].cantidad = cantidad;
        localStorage.setItem('infoProducto', JSON.stringify(infoProducto));
    }

    //PONER DATOS EN LA TABLA DE COSTOS 

    let Subtotal = document.getElementById("Subtotal");
    let costoEnvio;
    let ponercostoenvio = document.getElementById("costoEnvio")
    let totalFinal = document.getElementById("totalFinal")


    var opciones = document.getElementsByName("opcionCompra");

    let opcionSeleccionada;

    for (var i = 0; i < opciones.length; i++) {
        opciones[i].addEventListener("change", function () {
            for (var j = 0; j < opciones.length; j++) {
                if (opciones[j].checked) {
                    opcionSeleccionada = opciones[j].value;
                    break;
                }
            }
            console.log("esta es la opcion seleccionada" + opcionSeleccionada);

            if (opcionSeleccionada == 1) {
                costoEnvio = resultado * 0.15;
                ponercostoenvio.textContent = `${costoEnvio}`
            }
            else if (opcionSeleccionada == 2) {
                costoEnvio = resultado * (0.07)
                ponercostoenvio.textContent = `${costoEnvio}`
            }
            else if (opcionSeleccionada == 3) {
                costoEnvio = resultado * 0.05;
                ponercostoenvio.textContent = `${costoEnvio}`
            }
            else {
                console.log("no se encuentra un valor de envio");
            }

            let totalFinalValor = resultado + costoEnvio;
            totalFinal.textContent = `${totalFinalValor}`;

        });
    }



    Subtotal.textContent = `${resultado}`
}

function subTotal(costoUnitario, cantidad) {
    return costoUnitario * cantidad;
}

document.addEventListener('DOMContentLoaded', function () {
    const productosCarrito = document.getElementById("productosCarrito");
    const nsubtotal = document.getElementById("Subtotal");

    fetch(`https://japceibal.github.io/emercado-api/user_cart/25801.json`)
        .then(response => response.json())
        .then(cartData => {

            cartData.articles.forEach(product => {
                agregarProductoFecheado(product);
                let ncosto = product.count * product.unitCost;
                nsubtotal.innerHTML = `USD ${ncosto}`;
            });
        })
        .catch(error => {
            console.error("La solicitud no se completó correctamente", error);
        });


    function agregarProductoFecheado(producto) {
        agregarProducto(producto.name, producto.currency, producto.image, producto.unitCost, producto.count);
    }


    function agregarProducto(nombre, moneda, imagen, costoUnitario, cantidad) {
        const resultado = subTotal(costoUnitario, cantidad);

        productosCarrito.innerHTML += `
                <tr class="text-center">
                    <th><img id="imageCart" src=${imagen}></th>
                    <td>${nombre}</td>
                    <td>${moneda + " " + costoUnitario}</td>
                    <td>
                        <div class="form-group justify-content-center d-flex">
                            <input type="number" class="form-control small-input-carrito" value=${cantidad} min="1" onchange="actualizarSubtotal(this, ${costoUnitario})">
                        </div>
                    </td>
                    <td class="negrita" id="impResult">${moneda + " " + resultado}</td>
                    <td>
                        <button class="btn btn-danger"><i class="bi bi-trash3-fill"></i></button>
                    </td>
                </tr>`;

    }

    const infoProducto = JSON.parse(localStorage.getItem('infoProducto')) || [];
    infoProducto.forEach((DatosProducto) => {
        agregarProducto(DatosProducto.nombre, DatosProducto.moneda, DatosProducto.imagen, DatosProducto.precio, DatosProducto.cantidad);
    });




    /* Añadir tarjeta con dirección de envío */

    const adresscard = document.getElementById("sendAdress");
    const adressuser = JSON.parse(localStorage.getItem("domicilios"));

    adresscard.innerHTML = `
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="..." class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                        <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                    </div>
                </div>
            </div>
        S</div>
    `
});


