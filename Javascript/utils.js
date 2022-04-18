const searchInput = document.querySelector("#search-input");

// ------------------- on input change, fire the searchItems function (both these addEventListeners do the same thing)
// ------------------- but first... when user starts to search something, disable sort and get the displayed list back to normal (none)

searchInput.addEventListener("input", (e) => {
  sortItems("none");
  searchItems(e.target.value);
});

searchInput.addEventListener("propertychange", (e) => {
  sortItems("none");
  searchItems(e.target.value);
});

// ------------------- get the desired term, search the keys in the list and display found items

const searchItems = (term) => {
  const foundItems = apiInfo.filter((element) => element.apiKey.includes(term));

  displayListItems(foundItems);
};

const sort = document.querySelector("#sort");
const sortTerm = document.querySelector("#sort-term");

let sortBy = false;

// ------------------- on click, toggle the displayed text

sort.addEventListener("click", () => {
  sortBy = !sortBy;
  sortBy ? sortItems("username") : sortItems("none");
});

// ------------------- sort items based on the selected term

const sortItems = (sortType) => {
  switch (sortType) {
    case "none":
      sortTerm.innerText = "None";
      displayListItems(apiInfo);
      break;

    case "username":
      sortTerm.innerText = "Username";
      const foundItems = [...apiInfo].sort((a, b) =>
        a.username.localeCompare(b.username)
      );
      displayListItems(foundItems);
      break;

    default:
      break;
  }
};
