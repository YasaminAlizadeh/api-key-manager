const apiForm = document.querySelector("#api-form");
const usernameInput = document.querySelector("#username");
const apiKeyInput = document.querySelector("#api-key");
const apiSecretInput = document.querySelector("#api-secret");
const itemSubmitBtn = document.querySelector("#form-submit-btn");
const itemEditBtn = document.querySelector("#form-edit-btn");

const apiList = document.querySelector("#api-table");

let apiInfo = [];
let formState = "add";
let selectedId = null;

apiForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (usernameInput.value && apiKeyInput.value && apiSecretInput.value) {
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    switch (formState) {
      case "add":
        handleSubmit(formProps);
        break;

      case "edit":
        handleEdit(formProps);
        break;

      default:
        break;
    }
    apiForm.reset();

    displayListItems();
  } else {
    displaySnackbar("Oops... Please fill the form properly");
    console.log("Oops... Please fill the form properly");
  }
});

const handleSubmit = (itemData) => {
  if (!duplicateCheck(itemData)) {
    apiInfo.push({
      id: `${apiInfo.length + 1}_${new Date().getTime()}`,
      ...itemData,
    });
  } else {
    displaySnackbar("Such item already exists...");
    console.log("Such item already exists...");
  }
};

const handleEdit = (itemData) => {
  const { username, apiKey, apiSecret } = itemData;
  const { index } = findListItem(selectedId);

  apiInfo.splice(index, 1, {
    id: selectedId,
    username: username,
    apiKey: apiKey,
    apiSecret: apiSecret,
  });

  selectedId = null;
  formState = "add";
  itemSubmitBtn.innerText = "Submit";
};

const duplicateCheck = (newApiObject) => {
  const { username, apiKey, apiSecret } = newApiObject;

  if (
    apiInfo.filter(
      (element) =>
        element.username === username &&
        element.apiKey === apiKey &&
        element.apiSecret === apiSecret
    ).length > 0
  ) {
    return true;
  } else {
    return false;
  }
};

const generateListItem = (index, data) => {
  const { id, username, apiKey, apiSecret } = data;

  const newItem = document.createElement("tr");
  newItem.id = id;
  newItem.className = "table__row";

  const itemData = `
        <td class="row__number">
          ${index}
        </td>
        <td class="row__info row__username">
          <div class="row__item">
            <p class="td__text">
              ${username}
            </p>
            <span class="clipboard__icon">
              <ion-icon name="clipboard-outline"></ion-icon>
            </span>
          </div>
        </td>
        <td class="row__info row__key">
          <div class="row__item">
            <p class="td__text">
              ${apiKey}
            </p>
            <span class="clipboard__icon">
              <ion-icon name="clipboard-outline"></ion-icon>
            </span>
          </div>
        </td>
        <td class="row__info row__secret">
          <div class="row__item">
            <p class="td__text">
              ${displayApiSecret(apiSecret)}
            </p>
            <span class="clipboard__icon">
              <ion-icon name="clipboard-outline"></ion-icon>
            </span>        
          </div>
        </td>
        <td class="row__btns">
            <button class="item__btn item__edit">Edit</button>
            <button class="item__btn item__delete">Delete</button>
        </td>
  `;

  newItem.innerHTML = itemData;

  newItem.querySelector(".item__edit").addEventListener("click", () => {
    editListItem(id);
  });

  newItem.querySelector(".item__delete").addEventListener("click", () => {
    deleteListItem(id);
  });

  [...newItem.querySelectorAll(".row__info")].forEach((td) => {
    td.addEventListener("click", () => {
      copyToClipBoard(td, id);
    });
  });

  apiList.appendChild(newItem);
};

const displayListItems = () => {
  apiList.innerHTML = "";

  apiInfo.map((element, index) => {
    generateListItem(index, element);
  });
};

const findListItem = (id) => {
  const selectedItemIndex = apiInfo.findIndex((element) => element.id === id);
  const selectedItem = apiInfo[selectedItemIndex];

  return {
    index: selectedItemIndex,
    username: selectedItem.username,
    apiKey: selectedItem.apiKey,
    apiSecret: selectedItem.apiSecret,
  };
};

const editListItem = (id) => {
  const { username, apiKey, apiSecret } = findListItem(id);

  formState = "edit";
  itemSubmitBtn.innerText = "Update";

  usernameInput.value = username;
  apiKeyInput.value = apiKey;
  apiSecretInput.value = apiSecret;

  selectedId = id;
};

const deleteListItem = (id) => {
  apiInfo = apiInfo.filter((element) => element.id !== id);

  displayListItems();
  apiForm.reset();

  selectedId = null;
  formState = "add";
  itemSubmitBtn.innerText = "Submit";
};

const displaySnackbar = (msg) => {
  var snackbar = document.getElementById("snackbar");
  snackbar.innerText = msg;

  snackbar.classList.add("show");

  setTimeout(() => {
    snackbar.classList.remove("show");
  }, 3000);
};

const displayApiSecret = (str) => {
  let newSecret = "";

  if (str.length >= 10) {
    newSecret =
      str.slice(0, 4) +
      "*".repeat(str.length - 6 <= 10 ? str.length - 6 : 10) +
      str.slice(-2);
  } else if (str.length >= 4) {
    newSecret = str.slice(0, 2) + "*".repeat(str.length - 4) + str.slice(-2);
  } else {
    newSecret = str.slice(0, 1) + "*".repeat(str.length - 1);
  }

  return newSecret;
};

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
