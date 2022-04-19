const displaySnackbar = (msg) => {
  Toastify({
    text: msg,
    duration: 3000,
    gravity: "bottom",
    position: "center",
    stopOnFocus: true,
    style: {
      padding: "1.5rem 3rem",
      background: "rgb(0, 37, 44)",
      color: "#fff",
      borderRadius: "0.5rem",
    },
    onClick: function () {},
  }).showToast();
};
