function showAlert(message) {
  alert(message);
}

function redirectToPageWithDelay(url, minDelay, maxDelay) {
  const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

  setTimeout(function () {
    window.location.href = url;
  }, delay * 1000);
}


function checkLogin() {
  if (localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn')) {

  } else {
    localStorage.removeItem("darktheme");
    showAlert("¡No estás loggeado!");
    redirectToPageWithDelay('login.html', 3, 5);
  }
}
function login() {
  localStorage.setItem('isLoggedIn', 'true');
  redirectToPageWithDelay('login.html', 3, 5);
}
function logout() {
  localStorage.removeItem('isLoggedIn');
  redirectToPageWithDelay('login.html', 3, 5);
}
window.onload = function () {
  checkLogin();
}