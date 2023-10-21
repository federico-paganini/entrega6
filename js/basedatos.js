document.addEventListener("DOMContentLoaded", () => {
    const baseDatos = JSON.parse(localStorage.getItem("Usuariosdb"));
    let usuarioActivo;
    const dataLocation = localStorage.getItem("dataLocation");
    /* Verificar si los datos están en session storage o local storage y traer los datos de usuario:
    Tema seleccionado, carrito, etc. */
    if (dataLocation) {
        usuarioActivo = baseDatos.find(usuario => usuario.nombreUsuario === localStorage.getItem("UsuarioActivo"));
        localStorage.setItem("darktheme", usuarioActivo.selectedtheme);
        localStorage.setItem("infoProducto", JSON.stringify(usuarioActivo.carrito));
        localStorage.setItem("domicilios", JSON.stringify(usuarioActivo.direcciones));
    } else {
        usuarioActivo = baseDatos.find(usuario => usuario.nombreUsuario === sessionStorage.getItem("UsuarioActivo"));
        localStorage.setItem("darktheme", usuarioActivo.selectedtheme);
        localStorage.setItem("infoProducto", JSON.stringify(usuarioActivo.carrito));
        localStorage.setItem("domicilios", JSON.stringify(usuarioActivo.direcciones));
    }
});