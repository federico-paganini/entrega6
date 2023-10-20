document.addEventListener("DOMContentLoaded", () => {


    const settedmode = localStorage.getItem("darktheme");

    if (settedmode === "true") {
        document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-bs-theme", "light");
    }
});