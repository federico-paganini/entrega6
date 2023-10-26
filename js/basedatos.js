document.addEventListener("DOMContentLoaded", () => {
    const baseDatos = JSON.parse(localStorage.getItem("Usuariosdb"));
    let usuarioActivo;
    const dataLocation = localStorage.getItem("dataLocation");

    /* Verifica si los datos ya fueron cargados */
    if (!localStorage.getItem("dataLoaded") || !sessionStorage.getItem("dataLoaded") != true) {
        /* Verificar si los datos están en session storage o local storage y trae los datos de usuario:
          Tema seleccionado, carrito, etc. */
        if (dataLocation) {
            usuarioActivo = baseDatos.find(usuario => usuario.nombreUsuario === localStorage.getItem("UsuarioActivo"));
            localStorage.setItem("dataLoaded", true);
            localStorage.setItem("darktheme", usuarioActivo.selectedtheme);
            localStorage.setItem("infoProducto", JSON.stringify(usuarioActivo.carrito));
        } else {
            usuarioActivo = baseDatos.find(usuario => usuario.nombreUsuario === sessionStorage.getItem("UsuarioActivo"));
            sessionStorage.setItem("dataLoaded", true);
            localStorage.setItem("darktheme", usuarioActivo.selectedtheme);
            localStorage.setItem("infoProducto", JSON.stringify(usuarioActivo.carrito));
        }
    }
});