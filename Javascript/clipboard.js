const copyToClipBoard = (txtContainer, id) => {
  const selectedItem = findListItem(id);
  let copyValue = null;

  switch (txtContainer.className) {
    case "row__username":
      copyValue = selectedItem.username;
      break;

    case "row__key":
      copyValue = selectedItem.apiKey;
      break;

    case "row__secret":
      copyValue = selectedItem.apiSecret;
      break;

    default:
      break;
  }

  navigator.clipboard.writeText(copyValue);
  displaySnackbar("Copied to Clipboard");
};
