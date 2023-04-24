const createButton = document.querySelector("button");
const form = document.querySelector("form");
const table = document.querySelector("table");

document.addEventListener("DOMContentLoaded", fetchFromLocalstorage);

createButton.addEventListener("click", addItem);

const inputs = document.querySelectorAll("input");
inputs.forEach((input) => {
  input.addEventListener("input", checkInputs);
});

function generateUniqueId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.random() * 1000000;
  const uniqueId = `${timestamp}${randomNum}`;
  return uniqueId;
}

function editItem(e) {
  console.log("here");
  const row = e.target.parentNode.parentNode.parentNode;
  const item_id = row.children[0].textContent;
  const item_name = row.children[1].textContent;
  const item_price = row.children[2].textContent;

  document.getElementById("item_id").value = item_id;
  document.getElementById("item_name").value = item_name;
  document.getElementById("item_price").value = item_price.slice(1);
  document.getElementById("item_id").disabled = true;

  createButton.disabled = false;
  createButton.textContent = "Update";
  createButton.removeAttribute("id");
  createButton.setAttribute("id", "edit_button");
}

function saveToLocalstorage(new_item) {
  let stored_items = JSON.parse(localStorage.getItem("items"));

  if (stored_items) {
    const item_index = stored_items.findIndex(
      (stored_items) => stored_items.id === new_item.id
    );

    if (item_index === -1) {
      stored_items.push(new_item);
    } else {
      stored_items[item_index] = new_item;
    }
  } else {
    const new_items = [new_item];
    localStorage.setItem("items", JSON.stringify(new_items));
    return;
  }
  localStorage.setItem("items", JSON.stringify(stored_items));
}

function deleteFromLocalStorage(id) {
  let stored_items = JSON.parse(localStorage.getItem("items"));

  if (stored_items) {
    stored_items = stored_items.filter((stored_item) => stored_item.id !== id);
    localStorage.setItem("items", JSON.stringify(stored_items));
  }
}

function addItem(e) {
  e.preventDefault();

  const ID_input = document.getElementById("item_id");
  const item_name_input = document.getElementById("item_name");
  const item_price_input = document.getElementById("item_price");

  saveToLocalstorage({
    id: ID_input.value,
    item_name: item_name_input.value,
    item_price:
      item_price_input.value[0] === "$"
        ? item_price_input.value
        : "$" + item_price_input.value,
  });

  const new_row = document.createElement("tr");
  const ID_cell = document.createElement("td");
  const item_name_cell = document.createElement("td");
  const item_price_cell = document.createElement("td");
  const operations_cell = document.createElement("td");

  ID_cell.textContent = ID_input.value;
  item_name_cell.textContent = item_name_input.value;
  item_price_cell.textContent =
    item_price_input.value[0] === "$"
      ? item_price_input.value
      : "$" + item_price_input.value;

  const operations_div = document.createElement("div");
  operations_div.classList.add("operations");

  const edit_button = document.createElement("button");
  edit_button.classList.add("edit");
  edit_button.textContent = "Edit";

  const delete_button = document.createElement("button");
  delete_button.classList.add("delete");
  delete_button.textContent = "Delete";

  operations_div.appendChild(edit_button);
  operations_div.appendChild(delete_button);

  operations_cell.appendChild(operations_div);

  new_row.appendChild(ID_cell);
  new_row.appendChild(item_name_cell);
  new_row.appendChild(item_price_cell);
  new_row.appendChild(operations_cell);
  new_row.setAttribute("id", ID_input.value);

  if (createButton.textContent === "Update") {
    const row = document.getElementById(ID_input.value);
    row.innerHTML = "";
    row.appendChild(ID_cell);
    row.appendChild(item_name_cell);
    row.appendChild(item_price_cell);
    row.appendChild(operations_cell);

    createButton.disabled = true;
    createButton.textContent = "Add Item";
    createButton.removeAttribute("id");
    createButton.setAttribute("id", "submit_button");
  } else {
    table.appendChild(new_row);
  }

  ID_input.value = "";
  item_name_input.value = "";
  item_price_input.value = "";
  document.getElementById("item_id").disabled = false;
  addEventListenerToEditButtons();
  addEventListenerToDeleteButtons();
}

function fetchFromLocalstorage() {
  let stored_items = JSON.parse(localStorage.getItem("items"));
  if (stored_items) {
    stored_items.map((stored_item) => {
      const new_row = document.createElement("tr");
      new_row.setAttribute("id", stored_item.id);
      const ID_cell = document.createElement("td");
      const item_name_cell = document.createElement("td");
      const item_price_cell = document.createElement("td");
      const operations_cell = document.createElement("td");

      ID_cell.textContent = stored_item.id;
      item_name_cell.textContent = stored_item.item_name;
      item_price_cell.textContent = stored_item.item_price;

      const operations_div = document.createElement("div");
      operations_div.classList.add("operations");

      const edit_button = document.createElement("button");
      edit_button.classList.add("edit");
      edit_button.textContent = "Edit";

      const delete_button = document.createElement("button");
      delete_button.classList.add("delete");
      delete_button.textContent = "Delete";

      operations_div.appendChild(edit_button);
      operations_div.appendChild(delete_button);

      operations_cell.appendChild(operations_div);

      new_row.appendChild(ID_cell);
      new_row.appendChild(item_name_cell);
      new_row.appendChild(item_price_cell);
      new_row.appendChild(operations_cell);

      table.appendChild(new_row);
      addEventListenerToEditButtons();
      addEventListenerToDeleteButtons();
    });
  }
}

function addEventListenerToEditButtons() {
  let editButtons = document.getElementsByClassName("edit");
  editButtons = [...editButtons];
  editButtons.map((editButton) => {
    editButton.addEventListener("click", editItem);
  });
}

function deleteRow(e) {
  const row = e.target.parentNode.parentNode.parentNode;
  table.removeChild(row);
  deleteFromLocalStorage(row.id);
}

function addEventListenerToDeleteButtons() {
  let deleteButtons = document.getElementsByClassName("delete");
  deleteButtons = [...deleteButtons];
  deleteButtons.map((deleteButton) => {
    deleteButton.addEventListener("click", deleteRow);
  });
}

function checkInputs() {
  const item_id = document.getElementById("item_id").value;
  const item_name = document.getElementById("item_name").value;
  const item_price = document.getElementById("item_price").value;

  let stored_items = JSON.parse(localStorage.getItem("items"));

  let IdExist = false;
  if (stored_items) {
    if (
      createButton.textContent !== "Update" &&
      stored_items.some((item) => item.id === item_id)
    ) {
      IdExist = true;
    }
  }

  if (
    item_id !== "" &&
    item_name !== "" &&
    item_price !== "" &&
    !IdExist &&
    item_id > 0
  ) {
    createButton.disabled = false;
  } else {
    createButton.disabled = true;
  }
}
