const searchInput = document.querySelector("#search-input");

searchInput.addEventListener("input", (e) => {
  searchItems(e.target.value);
});

searchInput.addEventListener("propertychange", (e) => {
  searchItems(e.target.value);
});

const searchItems = (term) => {
  const foundItems = apiInfo.filter((element) => element.apiKey.includes(term));

  displayListItems(foundItems);
};

const sort = document.querySelector("#sort");
const sortTerm = document.querySelector("#sort-term");

let sortBy = false;

sort.addEventListener("click", () => {
  sortBy = !sortBy;
  sortBy ? sortItems("username") : sortItems("none");
});

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
