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
    const adressuser = JSON.parse(localStorage.getItem("dbUsuario"));
    const activeadress = (adressuser.direcciones).find(direccion => direccion.default == true);
    let icon = selectIcon(activeadress.tipo);
    let phone = adressuser.telefonos[0];

    selectIcon((activeadress.tipo), icon);

    adresscard.innerHTML += `
        <h5 class="card-title">${icon} ${activeadress.calle} ${activeadress.numero}</h5>
        <p class="card-text mb-2">${activeadress.ciudad} - ${activeadress.departamento}</p>
    `

    if (activeadress.indicaciones != "") {
        adresscard.innerHTML += `
        <p class="card-text mb-2">${activeadress.indicaciones}</p>
        `
    }

    adresscard.innerHTML += `
        <p class="card-text mb-4"><small class="text-body-secondary">${adressuser.nombre} ${adressuser.apellido} - ${phone}</small></p>
        <a class="btn btn-link btn-sm p-0 m-0" data-bs-toggle="modal" href="#exampleModalToggle" role="button">Modificar dirección de envío / Contacto</a>
    `



    /* Modificar datos de envío y contacto a través de modal */

    const moddir = document.getElementById("modifyadress");
    const modcont = document.getElementById("modifycontact");

    (adressuser.direcciones).forEach(direccion => {
        let alldirs = document.createElement("button");
        alldirs.classList.add("text-decoration-none");
        alldirs.setAttribute("role", "button");
        alldirs.setAttribute("onclick", "funcionprueba()")
        alldirs.innerHTML += `
            <div class="card mb-3 bg-body-tertiary" style="max-width: 500px;">
                <div class="row g-0">
                    <div class="col-1">
                        <span class="rounded-start card-border"><span>
                    </div>
                    <div class="col-11">
                        <div class="ms-3 card-body">
                            <h5 class="card-title">${(selectIcon(direccion.tipo))} ${direccion.calle} ${direccion.numero}</h5>
                            <p class="card-text">${direccion.ciudad} - ${direccion.departamento}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

      
        moddir.appendChild(alldirs);

        moddir.innerHTML += `
        <button class="btn btn-outline-secondary btn-sm" data-bs-target="#exampleModalToggle3" data-bs-toggle="modal"><i class="bi bi-plus-square"></i> Agregar nueva dirección</button>
    `;



        /* Agregar nueva dirección de envío */
        const formndir = document.getElementById("nuevoenvio");
        console.log(adressuser);

        formndir.addEventListener("submit", (e) => {
            e.preventDefault();

            const ncity = document.getElementById("New-City").value;
            const ndir = document.getElementById("New-Dir").value;
            const ndep = document.getElementById("Departamento").value;
            const nnum = document.getElementById("New-Num").value;
            const infoad = document.getElementById("infoadd").value;
            const typedom = document.getElementsByName("dirtype");
            let selectedirtype;

            typedom.forEach(option => {
                if (option.checked) {
                    selectedirtype = option.value;
                    return;
                }
            })
            let ndeliver;

            ndeliver = {
                default: false,
                tipo: selectedirtype,
                departamento: ndep,
                ciudad: ncity,
                calle: ndir,
                numero: nnum,
                indicaciones: infoad,
            };

            (adressuser.direcciones).push(ndeliver);
            alert("Nueva dirección añadida");
            console.log(adressuser);
        })
    });

});

function selectIcon(domicilio) {
    if (domicilio === "house") {
        return `<i class="bi bi-house-fill"></i>`;
    } else {
        if (domicilio === "building") {
            return `<i class="bi bi-building-fill"></i>`;
        } else {
            if (domicilio === "work") {
                return `<i class="bi bi-briefcase-fill"></i>`;
            }
        }
    }
};

function funcionprueba() {
    console.log("hola");
} 