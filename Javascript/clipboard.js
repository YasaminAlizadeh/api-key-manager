const copyToClipBoard = (txtContainer, id) => {
  const selectedItem = findListItem(id);
  let copyValue = null;

  switch (txtContainer.dataset.type) {
    case "username":
      copyValue = selectedItem.username;
      break;

    case "key":
      copyValue = selectedItem.apiKey;
      break;

    case "secret":
      copyValue = selectedItem.apiSecret;
      break;

    default:
      break;
  }

  navigator.clipboard.writeText(copyValue);
  displaySnackbar("Copied to Clipboard");
};
