/* Mostrar un formulario u otro */

const btnlog = document.getElementById("btn-log");
const btnreg = document.getElementById("btn-reg");
const formlog = document.getElementById("form-log");
const formreg = document.getElementById("form-reg");
const btn = document.getElementById("btn");

btnlog.addEventListener("click", function () {
    changeLog();
})

btnreg.addEventListener("click", () => {
    changeReg();
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

    const formlog = document.querySelector("#form-log");
    const usuarios = JSON.parse(localStorage.getItem("Usuariosdb"));

    formlog.addEventListener("submit", function (event) {
        event.preventDefault();
        const user = formlog.querySelector("#User");
        const pass = formlog.querySelector("#Pass");
        const mantsesion = formlog.querySelector("#manteneriniciado");

        /* Creamos en el registro una "base de datos local" para los usuarios y el login 
        ahora revisa si el usuario existe */
        let usuarioinlog;
        let existe = false;

        if (Array.isArray(usuarios) && usuarios.length > 0) {
            usuarios.forEach(usuario => {
                if (usuario.nombre === user.value) {
                    existe = true;
                    usuarioinlog = usuario;
                } else {
                    if (usuario.correo === user.value) {
                        existe = true;
                        usuarioinlog = usuario;
                    } else {
                        existe = false;
                    }
                }
            })
        }


        /*Verifica si el usuario existe en la "base de datos": Si éste no existe, emite un mensaje para registarlo.
        Si el usuario existe, verifica los datos en la "base de datos" */
        if (existe) {
            /*Verifica la contraseña ingresada con la contraseña de la "Base de datos" */
            if (pass.value === usuarioinlog.contraseña) {
                /* Verifica si el usuario quiere mantener la sesión abierta aún así se cierre el navegador */
                if (mantsesion.checked) {
                    alert("Logueado correctamente");
                    sessionStorage.setItem("dataLocation", true);
                    localStorage.setItem('isLoggedIn', true);
                    localStorage.setItem("UsuarioActivo", usuarioinlog.nombre);
                    setTimeout(function () {
                        window.location.href = "index.html";
                    }, 2000);
                } else {
                    alert("Logueado correctamente");
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem("UsuarioActivo", usuarioinlog.nombre);
                    setTimeout(function () {
                        window.location.href = "index.html";
                    }, 2000);
                }
                /* Emite una alerta si la contraseña no es correcta */
            } else {
                alert("La contraseña es incorrecta");
            }
        } else {
            /* Emite un mensaje si el usuario no existe y redirige al login si el nuevo usuario desea registrarse */
            if (confirm("El usuario ingresado no existe.\n¿Desea registrarse?")) {
                changeReg();
            }
        }
    });
    /* Verificación formulario de Registro */

    formreg.addEventListener("submit", function (event) {
        event.preventDefault();
        let nuevosdatosUsuario = {};
        const nuser = document.getElementById("New-User").value;
        const nemail = document.getElementById("New-Mail").value;
        const nphone = document.getElementById("New-Phone").value;
        const npass = document.getElementById("newpass").value;
        const ncity = document.getElementById("New-City").value;
        const ndir = document.getElementById("New-Dir").value;
        const confpass = document.getElementById("confpass").value;
        const ndep = document.getElementById("Departamento").value;

        /*Verificación de datos para registro de nuevo usuario correcto */

        /* Verificación que el usuario a registrar no exista en la base de datos */
        let existe = false;
        if (Array.isArray(usuarios) && usuarios.length > 0) {
            usuarios.forEach(usuario => {
                if (usuario.nombre !== nuser) {
                    existe = false;
                } else {
                    existe = true;
                }
            })
        }
        
        if (existe) {
            alert("El usuario ingresado ya existe");
        } else {
            if (npass === confpass && ndep !== "Departamento") {
                /*Se crea el nuevo usuario */
                alert("Registrado con éxito");
                nuevosdatosUsuario = {
                    nombre: nuser,
                    email: nemail,
                    telefonos: [nphone],
                    departamento: ndep,
                    ciudad: ncity,
                    direccion: ndir,
                    contraseña: confpass,
                    selectedtheme: false,
                    carrito: [],
                }
                /* Se verifica que la base de datos esté creada, sino la crea */
                if (usuarios) {
                    usuarios.push(nuevosdatosUsuario);
                    localStorage.setItem("Usuariosdb", JSON.stringify(usuarios));
                    changeLog();
                } else {
                    let iniciarUsuarios = [nuevosdatosUsuario];
                    localStorage.setItem("Usuariosdb", JSON.stringify(iniciarUsuarios));
                    changeLog();
                }
            } else {
                if (ndep === "Departamento") {
                    alert("Debes elegir un departamento");
                } else {
                    if (npass !== confpass) {
                        alert("Las contraseñas no son iguales");
                    }
                }
            }
        }
    })
});


function changeLog() {
    formlog.classList.add('form-activo');
    formlog.classList.remove('form-inactivo');
    formreg.classList.remove('form-activo');
    formreg.classList.add('form-inactivo');
    btn.style.transform = "translateX(0%)";
}

function changeReg() {
    formreg.classList.add('form-activo');
    formreg.classList.remove('form-inactivo');
    formlog.classList.remove('form-activo');
    formlog.classList.add('form-inactivo');
    btn.style.transform = "translateX(100%)";
}