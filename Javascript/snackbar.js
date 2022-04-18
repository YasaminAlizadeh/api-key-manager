const displaySnackbar = (msg) => {
  var snackbar = document.getElementById("snackbar");
  snackbar.innerText = msg;

  snackbar.classList.add("show");

  setTimeout(() => {
    snackbar.classList.remove("show");
  }, 3000);
};
