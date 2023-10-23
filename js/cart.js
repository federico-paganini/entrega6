function actualizarSubtotal(cantIngresada, costoUnitario) {
    const cantidad = cantIngresada.value;
    const impResult = cantIngresada.parentElement.parentElement.nextElementSibling;
    const moneda = impResult.innerText.split(" ")[0];
    const resultado = costoUnitario * cantidad;
    impResult.innerText = `${moneda} ${resultado}`;

    //PONER DATOS EN LA TABLA DE COSTOS 

let Subtotal = document.getElementById("Subtotal");
let costoEnvio;
let ponercostoenvio= document.getElementById("costoEnvio")
let totalFinal= document.getElementById("totalFinal")


var opciones = document.getElementsByName("opcionCompra");

let opcionSeleccionada; 

for (var i = 0; i < opciones.length; i++) {
  opciones[i].addEventListener("change", function() {
    for (var j = 0; j < opciones.length; j++) {
      if (opciones[j].checked) {
        opcionSeleccionada=opciones[j].value;
        break;
      }
    }
    console.log("esta es la opcion seleccionada"+ opcionSeleccionada);

if (opcionSeleccionada==1){
    costoEnvio= resultado*0.15;
    ponercostoenvio.textContent=`${costoEnvio}`
}
else if(opcionSeleccionada==2){
    costoEnvio= resultado*(0.07)
    ponercostoenvio.textContent=`${costoEnvio}`
}
else if(opcionSeleccionada==3){
    costoEnvio= resultado*0.05;
    ponercostoenvio.textContent=`${costoEnvio}`
}
else{
    console.log("no se encuentra un valor de envio");
}

let totalFinalValor = resultado + costoEnvio;
totalFinal.textContent = `${totalFinalValor}`;

  });
}



Subtotal.textContent=`${resultado}`

}

function subTotal(costoUnitario, cantidad) {
    return costoUnitario * cantidad;
}

document.addEventListener('DOMContentLoaded', function () {
    const productosCarrito = document.getElementById("productosCarrito");

    fetch(`https://japceibal.github.io/emercado-api/user_cart/25801.json`)
        .then(response => response.json())
        .then(cartData => {

            cartData.articles.forEach(product => {
                agregarProductoFecheado(product);
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
});

//LINEAS DE CÓDIGO PARA CREAR EL MODAL PARA SELECCIONAR FORMA DE PAGO
document.addEventListener("DOMContentLoaded",()=>{
    
let BotonModal=document.getElementById("BotonFormaPago")
let EspacioModal=document.createElement("div")
EspacioModal.className= 'modal fade';

function DesplegarModal(){ //Función para crear y desplegar el modal que muestra las opciones de pago

    EspacioModal.innerHTML= `
<div class="modal-dialog" role="document">
    <div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title fs-4 fw-bold">Forma de pago</h5>
        <button type="button" class="close" id="CerrarModal" data-dismiss="modal" aria-label="Cerrar">
        <span aria-hidden="true">&times;</span>
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

$(EspacioModal).modal('show');

//Evento para el boton cerrar del modal
let BotonCerrarModal = document.getElementById("CerrarModal");
    BotonCerrarModal.addEventListener("click", CerrarModal);

    function CerrarModal() {
        $(EspacioModal).modal('hide');
    }

//Lineas de código que manejan que unas opciones de deshabilitan al seleccionar otras
let PagoTarjeta=document.getElementById("TarjetaCredito")
let TransferenciaBanco=document.getElementById("TransferenciaBancaria")

if(PagoTarjeta && TransferenciaBanco){
    PagoTarjeta.addEventListener("change", ()=>{
        if(PagoTarjeta.checked){
            document.getElementById("TarjetaNumero").disabled = false;
            document.getElementById("CodigoTarjeta").disabled = false;
            document.getElementById("FechaVencimiento").disabled = false;

            document.getElementById("NumeroCuenta").disabled = true;
        };
    })
    TransferenciaBanco.addEventListener("change", ()=>{
                if(TransferenciaBanco.checked){
                    document.getElementById("NumeroCuenta").disabled = false;

                    document.getElementById("TarjetaNumero").disabled = true;
                    document.getElementById("CodigoTarjeta").disabled = true;
                    document.getElementById("FechaVencimiento").disabled = true;
                };
    })
    }

//Función para envíar los datos del modal/formulario al hacer click en el bóton aceptar
let BotonEnviarDatosPago=document.getElementById("EnviarFormPago")
let MensajePago=document.getElementById("MensajePago")

BotonEnviarDatosPago.addEventListener("click", ()=>{
if(!PagoTarjeta.checked && !TransferenciaBanco.checked){
    alert("Debe seleccionar un metodo de pago")
    return
}

    if (PagoTarjeta.checked){
        if (
            document.getElementById("TarjetaNumero").value === "" ||
            document.getElementById("CodigoTarjeta").value === "" ||
            document.getElementById("FechaVencimiento").value === ""
        ) {
            alert("Por favor complete todos los campos.");
            return; 
        }
        MensajePago.innerHTML="Se ha seleccionado TARJETA DE CRÉDITO como forma de pago"

    } else if(TransferenciaBanco.checked){
        if (document.getElementById("NumeroCuenta").value === ""){
            alert("Por favor complete todos los campos.");
            return; 
        }

        MensajePago.innerHTML="Se ha seleccionado TRANSFERENCIA BANCARIA como forma de pago"
    } 

    $(EspacioModal).modal('hide');
})
}

BotonModal.addEventListener("click", DesplegarModal);
});