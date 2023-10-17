/* Mostrar un formulario u otro */

const btnlog = document.getElementById("btn-log");
const btnreg = document.getElementById("btn-reg");
const formlog = document.getElementById("form-log");
const formreg = document.getElementById("form-reg");
const btn = document.getElementById("btn");

btnlog.addEventListener("click", function () {
    formlog.classList.add('form-activo');
    formlog.classList.remove('form-inactivo');
    formreg.classList.remove('form-activo');
    formreg.classList.add('form-inactivo');
    btn.style.transform = "translateX(0%)";
})

btnreg.addEventListener("click", () => {
    formreg.classList.add('form-activo');
    formreg.classList.remove('form-inactivo');
    formlog.classList.remove('form-activo');
    formlog.classList.add('form-inactivo');
    btn.style.transform = "translateX(100%)";
})

 /* Adaptar el fondo según el tamaño de la pantalla */ 
 const background = document.getElementsByTagName("body")[0];

 function cambiarFondo() {
   const width = window.innerWidth;
   const height = window.innerHeight;

   if (width > height) {
     background.style.background = 'url("../img/Fondo_login.png"), linear-gradient(to left, #ff914d, #ff3131)';
     background.style.backgroundRepeat = 'no-repeat'
     background.style.backgroundSize = 'contain';
   } else {
     background.style.background = 'url("../img/fondo_login_sm.jpg"), linear-gradient(to left, #ff914d, #ff6740)';
     background.style.backgroundRepeat = 'no-repeat'
     background.style.backgroundSize = 'contain';
   }
 }

 window.addEventListener('load', cambiarFondo);
 window.addEventListener('resize', cambiarFondo);

 cambiarFondo();

/* Redireccion a index con login realizado */

document.addEventListener("DOMContentLoaded", function () {

    const btnsub = document.getElementById("btn-submitlog");
    const form = document.querySelector("#form-log");

    btnsub.addEventListener("click", function (event) {
        event.preventDefault();

        const user = form.querySelector("#User");
        const pass = form.querySelector("#Pass");


        if (user.value && pass.value && (pass.value.length >= 6)) {
            alert("Logueado correctamente");
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem("email", user.value);
            setTimeout(function () {
                window.location.href = "index.html";
            }, 2000);
        } else {
            if (!user.value) {
                alert("Debes llenar el campo Usuario");
            } else {
                if (pass.value.length < 6) {
                    alert("La contraseña debe tener 6 caracteres o más");
                } else {
                    alert("Debes ingresar una contraseña");
                }
            }
        }
    });
    /* Verificación formulario de Registro */

    formreg.addEventListener("submit", function (event) {
        event.preventDefault();

        const npass = document.getElementById("newpass").value;
        const confpass = document.getElementById("confpass").value;
        const ndep = document.getElementById("Departamento").value;

        console.log(npass, confpass, ndep);

        if (npass === confpass && ndep !== "--Elige un Departamento--") {
            alert("Registrado con éxito");
        } else {
            if (npass !== confpass) {
                alert("Las contraseñas no son iguales");
            } else {
                if (ndep === "--Elige un Departamento--") {
                    alert("Debes elegir un departamento");
                }
            }
        }
    });
});


