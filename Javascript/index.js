const apiForm = document.querySelector("#api-form");
const usernameInput = document.querySelector("#username");
const apiKeyInput = document.querySelector("#api-key");
const apiSecretInput = document.querySelector("#api-secret");
const itemSubmitBtn = document.querySelector("#form-submit-btn");
const itemEditBtn = document.querySelector("#form-edit-btn");

const apiList = document.querySelector("#api-table");

const apiUrl = "/api/v1";

let apiInfo = [];
let formState = "add";
let selectedId = null;

// ------------------- Get all data from backend after load

fetch(apiUrl + "/info", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    apiInfo = [...data.info];
    displayListItems(apiInfo);
  })
  .catch((error) => {
    console.log(`Error: ${error}`);
  });

// ------------------- on submit, check formState and fire the proper function to change our list. then display items from the list.

apiForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const _username = usernameInput.value;
  const _apiKey = apiKeyInput.value;
  const _apiSecret = apiSecretInput.value;

  if (_username && _apiKey && _apiSecret) {
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
  } else {
    displaySnackbar("Oops... Please fill the form properly");
  }
});

// ------------------- on submit (if formState === "Add"), add the new input values to the list

const handleSubmit = (itemData) => {
  if (!duplicateCheck(itemData)) {
    const data = JSON.stringify({
      ...itemData,
    });

    fetch(apiUrl + "/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          apiInfo.push(itemData);
          displayListItems(apiInfo);
        }
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  } else {
    displaySnackbar("Such item already exists...");
  }
};
// ------------------- on submit (if formState === "Edit"), add the new input values instead of the previous data to the list

const handleEdit = (itemData) => {
  const { index } = findListItem(selectedId);
  const { username, apiKey, apiSecret } = itemData;

  const data = JSON.stringify({
    ...itemData,
  });

  fetch(apiUrl + `/info/${selectedId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        apiInfo.splice(index, 1, {
          id: selectedId,
          username: username,
          apiKey: apiKey,
          apiSecret: apiSecret,
        });

        displayListItems(apiInfo);

        selectedId = null;
        formState = "add";
        itemSubmitBtn.innerText = "Submit";
      } else {
        displaySnackbar(`Error: ${data.message}`);
      }
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
    });
};

// ------------------- check if the given data already exist in our list

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

// ------------------- get the data of an item and display them as a row in table

const generateListItem = (index, data) => {
  const { id, username, apiKey, apiSecret } = data;

  const newItem = document.createElement("tr");
  newItem.id = id;
  newItem.className = "table__row";

  const itemData = `
        <td class="row__number">
          ${index}
        </td>
        <td class="row__info row__username" data-type="username">
          <div class="row__item">
            <p class="td__text">
              ${username}
            </p>
            <span class="clipboard__icon">
              <ion-icon name="clipboard-outline"></ion-icon>
            </span>
          </div>
        </td>
        <td class="row__info row__key" data-type="key">
          <div class="row__item">
            <p class="td__text">
              ${apiKey}
            </p>
            <span class="clipboard__icon">
              <ion-icon name="clipboard-outline"></ion-icon>
            </span>
          </div>
        </td>
        <td class="row__info row__secret" data-type="secret">
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
    displayPopup(`Are you sure you want to delete "${apiKey}"?`);
    selectedId = id;
  });

  [...newItem.querySelectorAll(".row__info")].forEach((td) => {
    td.addEventListener("click", () => {
      copyToClipBoard(td, id);
    });
  });

  apiList.appendChild(newItem);
};

// ------------------- iterate through given list and show the items inside of it

const displayListItems = (data) => {
  apiList.innerHTML = "";

  data.map((element, index) => {
    generateListItem(index, element);
  });
};

// ------------------- find the desired item using its id and return its data

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

// ------------------- get the selected item based on its Id and display its data in form inputs

const editListItem = (id) => {
  const { username, apiKey, apiSecret } = findListItem(id);

  formState = "edit";
  itemSubmitBtn.innerText = "Update";

  usernameInput.value = username;
  apiKeyInput.value = apiKey;
  apiSecretInput.value = apiSecret;

  selectedId = id;
};

// ------------------- delete selected item based on its id

const deleteListItem = (id) => {
  fetch(apiUrl + `/info/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        apiInfo = apiInfo.filter((item) => item.id !== id);
        displayListItems(apiInfo);

        apiForm.reset();

        selectedId = null;
        formState = "add";
        itemSubmitBtn.innerText = "Submit";
      } else {
        displaySnackbar(`Error: ${data.message} `);
      }
    })
    .catch((error) => {
      displaySnackbar(`Error: ${error}`);
    });
};

// ------------------- show Popup to confirm delete action before actually deleting item from list

const popup = document.querySelector("#popup");

const displayPopup = (msg) => {
  popup.querySelector(".popup__text").innerText = msg;
  popup.classList.add("popup__Wrapper--show");
};

const closePopup = () => {
  popup.classList.remove("popup__Wrapper--show");
};

const popupCancelBtn = popup.querySelector(".popup__btn--cancel");
const popupDeleteBtn = popup.querySelector(".popup__btn--delete");

popupCancelBtn.addEventListener("click", () => {
  closePopup();
});

popupDeleteBtn.addEventListener("click", () => {
  deleteListItem(selectedId);
  closePopup();
  selectedId = null;
});

// ------------------- display Api Secret correctly according to its length

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
