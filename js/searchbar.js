document.addEventListener("DOMContentLoaded", function () {

    const iconbusq = document.getElementById("icon-busq");
    const barrabusq = document.getElementById("search-bar");

    iconbusq.addEventListener("click", function (event) {
        event.stopPropagation();    
        barrabusq.classList.toggle("oculto");
        if (!barrabusq.classList.contains("oculto")) {
            barrabusq.focus();
        } else {
            barrabusq.vaule = "";
        }
    })

    document.addEventListener("click", function (event) {
        if (!barrabusq.contains(event.target)) {
            barrabusq.classList.add("oculto");
            barrabusq.value = "";
        }
    })
});