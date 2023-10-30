function actualizarSubtotal(cantIngresada, costoUnitario) {
  let cantidad = cantIngresada.value;

  if (cantidad <1)
  {
    console.log("entro");
    cantIngresada.value = 1;
    cantidad = 1;
  }
  const impResult =
    cantIngresada.parentElement.parentElement.nextElementSibling;
  const moneda = impResult.innerText.split(" ")[0];
  const resultado = costoUnitario * cantidad;

  /* Actualizar cantidad de elementos en el carrito del Usuario */
  const fila = cantIngresada.closest("tr");
  const infoProducto = JSON.parse(localStorage.getItem("infoProducto")) || [];
  const nombreProducto = fila.querySelector("td:nth-child(2)").textContent;

  impResult.innerText = `${moneda} ${resultado}`;

  const index = infoProducto.findIndex(
    (item) => item.nombre === nombreProducto
  );
  if (index !== -1) {
    infoProducto[index].cantidad = cantidad;
    localStorage.setItem("infoProducto", JSON.stringify(infoProducto));
  }
  actualizarCostoFinal();
}

let seleccionoForma = false;

function subTotal(costoUnitario, cantidad) {
  return costoUnitario * cantidad;
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
                <td class="negrita" id="impResult">${
                  moneda + " " + resultado
                }</td>
                <td>
                    <button class="btn btn-danger eliminar-producto" onclick="eliminarProducto(this)"><i class="bi bi-trash3-fill"></i></button>
                </td>
            </tr>`;
}

/* Eliminar producto */
function eliminarProducto(botonEliminar) {
  const fila = botonEliminar.closest("tr");
  fila.remove();

  /* Eliminar del Local Storage */
  const infoProducto = JSON.parse(localStorage.getItem("infoProducto")) || [];
  const nombreProducto = fila.querySelector("td:nth-child(2)").textContent;
  const index = infoProducto.findIndex(
    (item) => item.nombre === nombreProducto
  );

  if (index !== -1) {
    infoProducto.splice(index, 1);
    localStorage.setItem("infoProducto", JSON.stringify(infoProducto));
  }
  actualizarCostoFinal();
}

document.addEventListener("DOMContentLoaded", function () {
  const productosCarrito = document.getElementById("productosCarrito");
  const nsubtotal = document.getElementById("Subtotal");

  fetch(`https://japceibal.github.io/emercado-api/user_cart/25801.json`)
    .then((response) => response.json())
    .then((cartData) => {
      cartData.articles.forEach((product) => {
        const infoProducto =
          JSON.parse(localStorage.getItem("infoProducto")) || [];
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
            agregarProducto(
              DatosProducto.nombre,
              DatosProducto.moneda,
              DatosProducto.imagen,
              DatosProducto.precio,
              DatosProducto.cantidad
            );
          });
        } else {
          infoProducto.forEach((DatosProducto) => {
            agregarProducto(
              DatosProducto.nombre,
              DatosProducto.moneda,
              DatosProducto.imagen,
              DatosProducto.precio,
              DatosProducto.cantidad
            );
          });
        }
      });
      var opciones = document.getElementsByName("opcionCompra");
      opciones.forEach((opcion) => {
        opcion.addEventListener("change", actualizarCostoFinal);
      });
      actualizarCostoFinal();

      console.log(document.getElementById("verificar"));
      document.getElementById("verificar").onclick = verificarDatos;
    })
    .catch((error) => {
      console.error("La solicitud no se completó correctamente", error);
    });

  /* Cargar base de datos */
  const baseDatos = JSON.parse(localStorage.getItem("Usuariosdb"));
  let usuarioActivo;
  const dataLocation = localStorage.getItem("dataLocation");
  if (dataLocation) {
    usuarioActivo = baseDatos.find(
      (usuario) =>
        usuario.nombreUsuario === localStorage.getItem("UsuarioActivo")
    );
  } else {
    usuarioActivo = baseDatos.find(
      (usuario) =>
        usuario.nombreUsuario === sessionStorage.getItem("UsuarioActivo")
    );
  }

  /* Añadir tarjeta con dirección de envío */
  const adresscard = document.getElementById("sendAdress");
  const contactinfo = document.getElementById("contactInfo");
  const userdata = usuarioActivo;
  const adressuser = userdata.direcciones;
  let activeadress = adressuser.find((direccion) => direccion.default == true);
  let phone = userdata.telefonos[0];

  desplegarDirecciondeEnvio(adresscard, activeadress);
  desplegarInfoComprador(contactinfo, userdata, phone);

  /* Modificar datos de envío a través de modal */
  const moddir = document.getElementById("modifyadress");

  /* Se despliega por primera vez con las opciones predeterminadas */
  desplegarOpcionesEnvio(
    adressuser,
    activeadress,
    moddir,
    adresscard,
    contactinfo,
    userdata,
    phone
  );

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

    adressuser.push(ndeliver);
    userdata.direcciones = adressuser;
    localStorage.setItem("Usuariosdb", JSON.stringify(baseDatos));
    desplegarOpcionesEnvio(
      adressuser,
      activeadress,
      moddir,
      adresscard,
      contactinfo,
      userdata,
      phone
    );
    formndir.reset();
    alert("Nueva dirección añadida");
  });

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
        let confirmar = userdata.telefonos.includes(nnumero.value);

        if (!confirmar) {
          userdata.telefonos.push(nnumero.value);
          localStorage.setItem("Usuariosdb", JSON.stringify(baseDatos));
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
  });

  /* Cambiar número de teléfono y/o destinatario*/

  const btnsvtelodlv = document.getElementById("savedelivch");

  btnsvtelodlv.addEventListener("click", (e) => {
    e.preventDefault();
    const contactinfo = document.getElementById("contactInfo");
    const chphone = document.getElementById("ncontact");
    const newdestiname = document.getElementById("New-Cname");
    const newdestinsurn = document.getElementById("New-Csn");

    if (newdestiname.value !== "" && newdestinsurn.value !== "") {
      let newdlvr = {
        nombre: newdestiname.value,
        apellido: newdestinsurn.value,
      };
      desplegarInfoComprador(contactinfo, newdlvr, chphone.value);
      alert("Datos actualizados con éxito");
    } else {
      if (chphone.value === userdata.telefonos[0]) {
        if (newdestiname.value === "") {
          alert(
            "Por favor, ingrese el nombre del destinatario o cambie solamente el número de contacto"
          );
        } else {
          alert(
            "Por favor, ingrese el apellido del destinatario o cambie solamente el número de contacto"
          );
        }
      } else {
        desplegarInfoComprador(contactinfo, userdata, chphone.value);
        alert("Número de contacto actualizado con éxito");
      }
    }
  });
});

//LINEAS DE CÓDIGO PARA CREAR EL MODAL PARA SELECCIONAR FORMA DE PAGO
document.addEventListener("DOMContentLoaded", () => {
  let BotonModal = document.getElementById("BotonFormaPago");
  let EspacioModal = document.createElement("div");
  EspacioModal.className = "modal fade";

  function DesplegarModal() {
    //Función para crear y desplegar el modal que muestra las opciones de pago

    EspacioModal.innerHTML = `
<div class="modal-dialog" role="document">
    <div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title fs-4 fw-bold">Forma de pago</h5>
        <button type="button" class="btn-close" id="CerrarModal" data-dismiss="modal" aria-label="Cerrar">
        </button>
    </div>
    <div class="modal-body">
        <p>Seleccione la forma de realizar el pago y complete los campos necesarios</p>

    <hr class="my-3">

    <div id="ModalPago">
        <div class="form-group">
            <input type="radio" name="paymentMethod" id="TarjetaCredito" required value="creditCard">
            <label for="creditCard" class="fs-5 fw-medium mb-3">Tarjeta de crédito</label>
            <input type="number" class="form-control mb-3" id="TarjetaNumero" minlength="18" required placeholder="Número de tarjeta">
            <input type="number" class="form-control mb-3" id="CodigoTarjeta" minlength="3" required placeholder="Código de seguridad">
            <input type="number" class="form-control mb-3" id="FechaVencimiento" minlength="4" required placeholder="Vencimiento (MM/AA)">
        </div>
    
    <hr class="my-3">

        <div class="form-group">
            <input type="radio" name="paymentMethod" id="TransferenciaBancaria" minlength="12" required value="bankTransfer">
            <label for="bankTransfer" class="fs-5 fw-medium mb-3">Transferencia bancaria</label>
            <input type="text" class="form-control" id="NumeroCuenta" required placeholder="Número de cuenta">
        </div>
    </div>

        <hr class="my-3">
    <button type="button" class="btn btn-primary" id="EnviarFormPago"> Aceptar
    </button>

    </div>
    </div>
</div>
`;

    document.body.appendChild(EspacioModal); //Incluir el modal dentro del body de la página web

    $(EspacioModal).modal("show");

    //Evento para el boton cerrar del modal
    let BotonCerrarModal = document.getElementById("CerrarModal");
    BotonCerrarModal.addEventListener("click", CerrarModal);

    function CerrarModal() {
      $(EspacioModal).modal("hide");
    }

    //Lineas de código que manejan que unas opciones de deshabilitan al seleccionar otras
    let PagoTarjeta = document.getElementById("TarjetaCredito");
    let TransferenciaBanco = document.getElementById("TransferenciaBancaria");

    if (PagoTarjeta && TransferenciaBanco) {
      PagoTarjeta.addEventListener("change", () => {
        if (PagoTarjeta.checked) {
          document.getElementById("TarjetaNumero").disabled = false;
          document.getElementById("CodigoTarjeta").disabled = false;
          document.getElementById("FechaVencimiento").disabled = false;

          document.getElementById("NumeroCuenta").disabled = true;
        }
      });
      TransferenciaBanco.addEventListener("change", () => {
        if (TransferenciaBanco.checked) {
          document.getElementById("NumeroCuenta").disabled = false;

          document.getElementById("TarjetaNumero").disabled = true;
          document.getElementById("CodigoTarjeta").disabled = true;
          document.getElementById("FechaVencimiento").disabled = true;
        }
      });
    }

    //Función para envíar los datos del modal/formulario al hacer click en el bóton aceptar
    let BotonEnviarDatosPago = document.getElementById("EnviarFormPago");
    let MensajePago = document.getElementById("MensajePago");

    BotonEnviarDatosPago.addEventListener("click", () => {
      if (!PagoTarjeta.checked && !TransferenciaBanco.checked) {
        alert("Debe seleccionar un metodo de pago");
        seleccionoForma = false;
        return;
      }

      if (PagoTarjeta.checked) {
        if (
          document.getElementById("TarjetaNumero").value === "" ||
          document.getElementById("CodigoTarjeta").value === "" ||
          document.getElementById("FechaVencimiento").value === ""
        ) {
          alert("Por favor complete todos los campos.");
          seleccionoForma = false;
          return;
        }
        MensajePago.innerHTML =
          "Se ha seleccionado TARJETA DE CRÉDITO como forma de pago";
        seleccionoForma = true;
      } else if (TransferenciaBanco.checked) {
        if (document.getElementById("NumeroCuenta").value === "") {
          alert("Por favor complete todos los campos.");
          seleccionoForma = false;
          return;
        }

        MensajePago.innerHTML =
          "Se ha seleccionado TRANSFERENCIA BANCARIA como forma de pago";
        seleccionoForma = true;
      }

      $(EspacioModal).modal("hide");
    });
  }

  BotonModal.addEventListener("click", DesplegarModal);
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
}

/*Función para desplegar en modal las opciones de envío y se agrega función para cambiar la tarjeta principal */
function desplegarOpcionesEnvio(
  direcciones,
  activa,
  desplegar,
  modifenvio,
  modifinfo,
  modifcompr,
  modifph
) {
  desplegar.innerHTML = "";
  direcciones.forEach((direccion) => {
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
                            <h5 class="card-title">${selectIcon(
                              direccion.tipo
                            )} ${direccion.calle} ${direccion.numero}</h5>
                            <p class="card-text">${direccion.ciudad} - ${
      direccion.departamento
    }</p>
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
  });
}

/* Despliega la tarjeta principal */
function desplegarDirecciondeEnvio(tarjenvio, direnvio) {
  tarjenvio.innerHTML = "";
  tarjenvio.innerHTML += `
        <h5 class="card-title">${selectIcon(direnvio.tipo)} ${direnvio.calle} ${
    direnvio.numero
  }</h5>
        <p class="card-text mb-2">${direnvio.ciudad} - ${
    direnvio.departamento
  }</p>
    `;

  if (direnvio.indicaciones != "") {
    tarjenvio.innerHTML += `
        <p class="card-text mb-2">${direnvio.indicaciones}</p>
        `;
  }
}

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

  directorio.telefonos.forEach((telefono) => {
    lista.innerHTML += `<option>${telefono}</option>`;
  });
}

function actualizarCostoFinal() {
  // Calculamos el total de los productos
  const carrito = JSON.parse(localStorage.getItem("infoProducto"));
  let subtotalCarrito = 0;
  console.log("el Carrito:", carrito);
  carrito.forEach((producto) => {
    subtotalCarrito += subTotal(producto.precio, producto.cantidad);
  });

  // Cargamos todos los elementos
  let Subtotal = document.getElementById("Subtotal");
  let costoEnvio = 0;
  let ponercostoenvio = document.getElementById("costoEnvio");
  let totalFinal = document.getElementById("totalFinal");

  var opciones = document.getElementsByName("opcionCompra");

  let opcionSeleccionada;

  for (var i = 0; i < opciones.length; i++) {
    for (var j = 0; j < opciones.length; j++) {
      if (opciones[j].checked) {
        opcionSeleccionada = opciones[j].value;
        break;
      }
    }
    console.log("esta es la opcion seleccionada" + opcionSeleccionada);

    if (opcionSeleccionada == 1) {
      costoEnvio = subtotalCarrito * 0.15;
      ponercostoenvio.textContent = `${costoEnvio.toFixed(2)}`;
    } else if (opcionSeleccionada == 2) {
      costoEnvio = subtotalCarrito * 0.07;
      ponercostoenvio.textContent = `${costoEnvio.toFixed(2)}`;
    } else if (opcionSeleccionada == 3) {
      costoEnvio = subtotalCarrito * 0.05;
      ponercostoenvio.textContent = `${costoEnvio.toFixed(2)}`;
    } else {
      console.log("no se encuentra un valor de envio");
    }

    let totalFinalValor = subtotalCarrito + costoEnvio;
    totalFinal.textContent = `${totalFinalValor.toFixed(2)}`;
  }

  Subtotal.textContent = `${subtotalCarrito.toFixed(2)}`;
}

function verificarDatos() {
  let esValido = false;

  var opciones = document.getElementsByName("opcionCompra");

  let opcionSeleccionada = 0;

  for (var i = 0; i < opciones.length; i++) {
    for (var j = 0; j < opciones.length; j++) {
      if (opciones[j].checked) {
        opcionSeleccionada = opciones[j].value;
        break;
      }
    }
    console.log("esta es la opcion seleccionada " + opcionSeleccionada);
  }
  console.log(opcionSeleccionada);
  if (opcionSeleccionada == 1 || opcionSeleccionada == 2 || opcionSeleccionada == 3  )
  {
      console.log("wwwww");
    esValido = true;
  }

  const carrito = JSON.parse(localStorage.getItem("infoProducto"));
  let productoEnCarrito = carrito.length;

  if (esValido === false) {
    let alerta = document.getElementById("badalert");
    alerta.innerHTML = "Seleccione un tipo de envio.";
    alerta.hidden = false;
    setTimeout(() => {
      alerta.hidden = true;
    }, 3000);
  } else if (!seleccionoForma) {
    let alerta = document.getElementById("badalert");
    alerta.hidden = false;
    alerta.innerHTML = "Seleccione una forma de pago.";
    setTimeout(() => {
      alerta.hidden = true;
    }, 3000);
  } else if (productoEnCarrito < 1) {
    let alerta = document.getElementById("badalert");
    alerta.hidden = false;
    alerta.innerHTML = "No hay prdocutos en el carrito";
    setTimeout(() => {
      alerta.hidden = true;
    }, 3000);
  } else {
    let alerta = document.getElementById("alert");
    alerta.hidden = false;
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  }
}
