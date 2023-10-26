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
                const infoProducto = JSON.parse(localStorage.getItem('infoProducto')) || [];
                if (!localStorage.getItem("preaddProd")) {
                    localStorage.setItem("preaddProd", true);
                    console.log(product);

                    const DatosProducto = {
                        id: product.id,
                        nombre: product.name,
                        moneda: product.currency,
                        precio: product.unitCost,
                        imagen: product.image,
                        cantidad: 1,
                    };
                    infoProducto.push(DatosProducto);
                    localStorage.setItem("infoProducto", JSON.stringify(infoProducto));
                    infoProducto.forEach((DatosProducto) => {
                        console.log(DatosProducto);
                        agregarProducto(DatosProducto.nombre, DatosProducto.moneda, DatosProducto.imagen, DatosProducto.precio, DatosProducto.cantidad);
                    });
                } else {
                    infoProducto.forEach((DatosProducto) => {
                        console.log(DatosProducto);
                        agregarProducto(DatosProducto.nombre, DatosProducto.moneda, DatosProducto.imagen, DatosProducto.precio, DatosProducto.cantidad);
                    });
                }

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



    /* Cargar base de datos */
    const baseDatos = JSON.parse(localStorage.getItem("Usuariosdb"));
    let usuarioActivo;
    const dataLocation = localStorage.getItem("dataLocation");
    if (dataLocation) {
        usuarioActivo = baseDatos.find(usuario => usuario.nombreUsuario === localStorage.getItem("UsuarioActivo"));
    } else {
        usuarioActivo = baseDatos.find(usuario => usuario.nombreUsuario === sessionStorage.getItem("UsuarioActivo"));
    }

    /* Añadir tarjeta con dirección de envío */
    const adresscard = document.getElementById("sendAdress");
    const contactinfo = document.getElementById("contactInfo");
    const userdata = usuarioActivo;
    const adressuser = userdata.direcciones;
    let activeadress = (adressuser).find(direccion => direccion.default == true);
    let phone = userdata.telefonos[0];

    desplegarDirecciondeEnvio(adresscard, activeadress);
    desplegarInfoComprador(contactinfo, userdata, phone);


    /* Modificar datos de envío a través de modal */
    const moddir = document.getElementById("modifyadress");

    /* Se despliega por primera vez con las opciones predeterminadas */
    desplegarOpcionesEnvio(adressuser, activeadress, moddir, adresscard, contactinfo, userdata, phone);

    /* Agregar nueva dirección de envío */
    const formndir = document.getElementById("nuevoenvio");

    formndir.addEventListener("submit", (e) => {
        e.preventDefault();

        const ncity = document.getElementById("New-City").value;
        const ndir = document.getElementById("New-Dir").value;
        const ndep = document.getElementById("Departamento").value;
        const nnum = document.getElementById("New-Num").value;
        const infoad = document.getElementById("infoadd").value;
        const typedom = document.getElementsByName("dirtype");
        let selectedirtype;

        for (const type of typedom) {
            if (type.checked) {
                selectedirtype = type.value;
                break;
            }
        }

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

        (adressuser).push(ndeliver);
        userdata.direcciones = adressuser;
        localStorage.setItem('Usuariosdb', JSON.stringify(baseDatos));
        desplegarOpcionesEnvio(adressuser, activeadress, moddir, adresscard, contactinfo, userdata, phone);
        formndir.reset();
        alert("Nueva dirección añadida");
    })


    /* Cambiar destinatario y teléfono de contacto */

    const phonelist = document.getElementById("ncontact");
    const addnumbers = document.getElementById("addnum");

    mostrarTelefonos(userdata, phonelist);

    /* Añadir número de teléfono */
    addnumbers.addEventListener("click", (e) => {
        const nnumero = document.getElementById("nuevophone");
        e.preventDefault();
        e.stopImmediatePropagation();
        if (nnumero.value !== "") {
            if (nnumero.value.length >= 8) {
                let confirmar = (userdata.telefonos).includes(nnumero.value);

                if (!confirmar) {
                    userdata.telefonos.push(nnumero.value);
                    localStorage.setItem('Usuariosdb', JSON.stringify(baseDatos));
                    mostrarTelefonos(userdata, phonelist);
                    nnumero.value = "";
                    nnumero.placeholder = "Nuevo número";
                    alert("Número de contacto agregado con éxito");
                } else {
                    alert("El número ingresado ya existe en sus opciones");
                }
            } else {
                alert("El número ingresado es erróneo");
            }
        } else {
            alert("Ingrese un nuevo número de contacto");
        }

    })

    /* Cambiar número de teléfono y/o destinatario*/

    const btnsvtelodlv = document.getElementById("savedelivch");

    btnsvtelodlv.addEventListener("click", (e) => {
        e.preventDefault();
        const contactinfo = document.getElementById("contactInfo");
        const chphone = document.getElementById("ncontact");
        const newdestiname = document.getElementById("New-Cname");
        const newdestinsurn = document.getElementById("New-Csn");

        if ((newdestiname.value !== "") && (newdestinsurn.value !== "")) {
            let newdlvr = {
                nombre: newdestiname.value,
                apellido: newdestinsurn.value,
            };
            desplegarInfoComprador(contactinfo, newdlvr, chphone.value);
            alert("Datos actualizados con éxito");
        } else {
            if (chphone.value === userdata.telefonos[0]) {
                if (newdestiname.value === "") {
                    alert("Por favor, ingrese el nombre del destinatario o cambie solamente el número de contacto");
                } else {
                    alert("Por favor, ingrese el apellido del destinatario o cambie solamente el número de contacto");
                }
            } else {
                desplegarInfoComprador(contactinfo, userdata, chphone.value);
                alert("Número de contacto actualizado con éxito");
            }
        }
    })
});






/* Función para determinar el ícono de la tarjeta de envío*/
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

/*Función para desplegar en modal las opciones de envío y se agrega función para cambiar la tarjeta principal */
function desplegarOpcionesEnvio(direcciones, activa, desplegar, modifenvio, modifinfo, modifcompr, modifph) {
    desplegar.innerHTML = "";
    (direcciones).forEach(direccion => {
        let alldirs = document.createElement("a");
        alldirs.classList.add("text-decoration-none");
        alldirs.setAttribute("role", "button");
        alldirs.innerHTML += `
            <div class="card mb-3 bg-body-tertiary nonclick" style="max-width: 500px;">
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


        desplegar.appendChild(alldirs);

        alldirs.addEventListener("click", () => {
            activa = direccion;
            desplegarDirecciondeEnvio(modifenvio, activa);
            desplegarInfoComprador(modifinfo, modifcompr, modifph);
            alert("Dirección de envío cambiada exitosamente");
        });
    })
};

/* Despliega la tarjeta principal */
function desplegarDirecciondeEnvio(tarjenvio, direnvio) {
    tarjenvio.innerHTML = "";
    tarjenvio.innerHTML += `
        <h5 class="card-title">${selectIcon(direnvio.tipo)} ${direnvio.calle} ${direnvio.numero}</h5>
        <p class="card-text mb-2">${direnvio.ciudad} - ${direnvio.departamento}</p>
    `;

    if (direnvio.indicaciones != "") {
        tarjenvio.innerHTML += `
        <p class="card-text mb-2">${direnvio.indicaciones}</p>
        `;
    }
};

function desplegarInfoComprador(tarjinfo, infocomprador, telefono) {
    tarjinfo.innerHTML = "";
    tarjinfo.innerHTML += `
    <p class="card-text mb-4"><small class="text-body-secondary">${infocomprador.nombre} ${infocomprador.apellido} - ${telefono}</small></p>
`;
}

/* Función para desplegar teléfonos en las opciones del modal */
function mostrarTelefonos(directorio, lista) {
    lista.innerHTML = "";
    lista.innerHTML += `
            <option disabled>--Elige un número de contacto--</option>
        `;

    (directorio.telefonos).forEach(telefono => {
        lista.innerHTML += `<option>${telefono}</option>`;
    });
};