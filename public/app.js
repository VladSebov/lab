const PORT = 3001;

fetch(`http://localhost:${PORT}/data`)
  .then((res) => res.json())
  .then((res) => JSON.parse(res))
  .then((res) => init(res));

function init(tableData) {
  const addBtn = document.querySelector(".add");
  const addForm = document.querySelector(".add-form");
  const submitAdd = document.querySelector(".submit-add");
  const table = document.querySelector("#table");
  const deleteBtns = document.querySelectorAll(".delete-btn");
  const deleteForm = document.querySelector("#remove");
  const changeBtns = document.querySelectorAll(".change-btn");
  const changeForm = document.querySelector(".change-form");
  const submitChange = document.querySelector(".submit-change");
  let currentRow;

  tableData.forEach((obj) => {
    render(obj);
  });

  // Добавление
  addBtn.addEventListener("click", (e) => {
    addForm.style.display = "block";
  });

  submitAdd.addEventListener("click", (e) => {
    const data = getDataFromForm(addForm);
    render(data);
    closeForms();
    fetch(`http://localhost:${PORT}/data/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({ data: data }),
    }).then((res) => {
      console.log(res);
    });
  });

  // Удаление
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      deleteForm.style.display = "block";
      let row = e.target.parentElement.parentElement;
      deleteRow(row);
    });
  });

  // Изменение
  changeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      changeForm.style.display = "block";
      insertDataInInputs(e);
    });
  });

  submitChange.addEventListener("click", (e) => {
    let allRowCells = [...currentRow.children];
    let numberOfRow = getNumberOfRow(currentRow);
    console.log(numberOfRow);
    const data = getDataFromForm(changeForm);
    const arrayOfData = Object.values(data);
    for (let i = 0; i < allRowCells.length - 1; i++) {
      if (i === 1) {
        allRowCells[i].textContent = arrayOfData[i].split("-").reverse().join(".");
      } else {
        allRowCells[i].textContent = arrayOfData[i];
      }
    }

    fetch(`http://localhost:${PORT}/data/change`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        data: data,
        number: numberOfRow,
      }),
    }).then((res) => {
      console.log(res);
    });
    closeForms();
  });

  // Закрытие окон на крестик и на кнопку отмена
  const allCloseBtns = document.querySelectorAll(".close");
  allCloseBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      closeForms();
    });
  });

  // Функции

  function getDataFromForm(form) {
    return {
      name: form.querySelector(".name").value,
      date: form.querySelector(".date").value,
      group: form.querySelector(".group").value,
      phone: form.querySelector(".phone").value,
    };
  }

  function render(data) {
    let isNeedDateRefactor = false;
    for (let i = 0; i < data.date.length; i++) {
      if (data.date[i] === "-") {
        isNeedDateRefactor = true;
        break;
      }
    }
    if (isNeedDateRefactor) {
      data.date = data.date.split("-").reverse().join(".");
    }

    const buttonsTd = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.classList.add("delete-btn", "button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.addEventListener("click", (evt) => {
      deleteForm.style.display = "block";
      deleteRow(tr);
    });
    const change = document.createElement("button");
    change.classList.add("change-btn", "button");
    change.type = "button";
    change.textContent = "Изменить";

    change.addEventListener("click", (e) => {
      changeForm.style.display = "block";
      insertDataInInputs(e);
    });

    buttonsTd.append(deleteBtn);
    buttonsTd.append(change);

    const element = `
        <td>${data.name}</td>
        <td>${data.date}</td>
        <td>${data.group}</td>
        <td>${data.phone}</td>
  `;
    const tr = document.createElement("tr");
    tr.innerHTML = element;
    tr.append(buttonsTd);
    // tr.dataset.id = id;
    table.append(tr);
    // return id;
  }

  function insertDataInInputs(e) {
    currentRow = e.target.parentElement.parentElement;
    let allRowCells = [...currentRow.children];
    const allChangeFormInputs = changeForm.querySelectorAll("input");
    for (let i = 0; i < allRowCells.length - 1; i++) {
      if (i === 1) {
        allChangeFormInputs[i].value = allRowCells[i].textContent.split(".").reverse().join("-");
      } else {
        allChangeFormInputs[i].value = allRowCells[i].textContent;
      }
    }
  }

  function deleteRow(row) {
    // Получение номера строки
    let number = getNumberOfRow(row);
    // Удаление
    let submitDelete = document.querySelector(".submit-delete");
    submitDelete.onclick = function () {
      row.remove();
      fetch(`http://localhost:${PORT}/data/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(number),
      });
      closeForms();
    };

    let otmena = document.querySelector(".close-delete");
    otmena.addEventListener("click", (e) => {
      closeForms();
    });
  }

  function closeForms() {
    addForm.style.display = "none";
    addForm.querySelector("form").reset();
    deleteForm.style.display = "none";
    changeForm.style.display = "none";
    changeForm.querySelector("form").reset();
  }

  function getNumberOfRow(row) {
    let number;
    [...table.children].forEach((item, i) => {
      if (item === row) number = i;
    });
    return number;
  }
}
