// 나중에 객체로 만들깅

const loadHandler = (chooseProject) => {
  fetch(`http://127.0.0.1:4000/project/todo/${chooseProject}`, {
    // userId, projectName 받아와서 기본세팅
    method: "GET",
    credentials: "include",
  })
    .then((res) => res.json())
    .then(({ msg, userId, project, todolist }) => {
      // title 초기화
      // userId, projectName

      const user = document.querySelector(".user");
      const projectName = document.querySelector(".project");
      user.innerHTML = userId;
      projectName.innerHTML = project;

      const lists = document.querySelectorAll(".list");

      if (msg === "fail") {
        alert("잘못된 접근입니다.");
        location.href = "#";
      } else if (msg !== "not exist") {
        renderTodoList(userId, todolist);
      }

      let index = 0;

      for (index in lists) {
        if (index === "entries") break;
        /* rendering */
        const list = lists[index].children[1];
        let itemCount = list.childElementCount;
        const height = 125 + 50 * itemCount;
        lists[index].style.height += height + "px";

        /* add Event */
        list.addEventListener("drop", drop);
        list.addEventListener("dragover", allowDrop);

        const items = list.children;

        for (index2 in items) {
          if (index2 === "length") break;
          items[index2].addEventListener("dragstart", drag);
          items[index2].addEventListener("click", markToggleHandler);

          const removeBtn = items[index2].children[1];
          removeBtn.addEventListener("click", removeBtnHandler);
        }
      }

      const addCard = document.querySelectorAll(".add-item-container");

      for (index in addCard) {
        if (index === "entries") break;

        const addBtn = addCard[index].children[0];
        const textArea = addCard[index].children[1];
        const textAreaCloseBtn = textArea.children[1];

        addBtn.addEventListener("click", addBtnHandler);
        textArea.addEventListener("keypress", textAreaHandler);
        textAreaCloseBtn.addEventListener("click", closeBtnHandler);
      }
      const signoutBtn = document.querySelector(".signout");
      signoutBtn.addEventListener("click", () => {
        location.href = "#signOut";
      });
    });
};

const renderTodoList = (userId, todoList) => {
  // userId??
  const lists = document.querySelectorAll(".list");
  let i = 0;
  for (key in todoList) {
    const list = lists[i++].children[1];
    let html = "";
    todoList[key].forEach(({ name, marked }) => {
      html += `<div class="list-item pt-2 pb-2 pr-2 mb-2" draggable="true">`;
      if (marked === "true") html += `<a class="text-secondary ml-4 marked">${name}</a>`;
      else html += `<a class="text-secondary ml-4">${name}</a>`;
      html += `</a>
            <button type="button" class="close close-btn" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>`;
    });

    list.innerHTML += html;
  }
};

const renderRemove = (target) => {
  const listHeight = parseInt(target.style.height, 10);
  target.style.height = listHeight - 50 + "px";
};

const renderAppend = (target) => {
  const listHeight = parseInt(target.style.height, 10);
  target.style.height = listHeight + 50 + "px";
};
/**
 * D & D 기능 구현
 * allowDrop / drag / drop
 */
const allowDrop = () => {
  event.preventDefault();
};

const drag = () => {
  const { dataTransfer, target } = event;
  const preState = target.parentNode.classList[0];
  const index = getIndex(target);
  const data = { preState, index };
  dataTransfer.setData("text/plain", JSON.stringify(data)); // todo / doing / done? // 몇 번째?
};

// 일정 수정
const drop = () => {
  event.preventDefault();
  let target = event.target;
  const dataTransfer = event.dataTransfer;
  const { preState, index } = JSON.parse(dataTransfer.getData("text/plain"));
  const preStateList = document.querySelector(`.${preState}`);

  const targetItem = preStateList.children[index];

  const preTarget = preStateList.parentNode;

  if (target.classList[0] !== "list") target = target.closest(".list");
  // div를 item에 위치할 경우 (중첩 대비)

  const project = document.querySelector(".project").innerHTML;
  const fromState = preState.split("-")[0];
  const toState = target.classList[2];
  let name, marked;

  name = targetItem.children[0].innerHTML;
  
  console.log(targetItem);

  if (targetItem.children[0].classList.contains('marked')) {
    marked = "true";
  } else {
    marked = "false";
  }


  const data = { fromState, toState, name, marked };

  fetch(`http://127.0.0.1:4000/project/todo/${project}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then((res) => res.json())
    .then(({ msg }) => {
      if (msg === "success") {
        renderRemove(preTarget);
        renderAppend(target);
        target.children[1].appendChild(targetItem);
      }
    });
};

const createNewElement = (name) => {
  const newItem = document.createElement("div");
  newItem.innerHTML += `<a class="text-secondary ml-4">${name}</a>`;
  const removeBtn = document.createElement("button");

  removeBtn.type = "button";
  removeBtn.className = "close close-btn";
  removeBtn["aria-label"] = "Close";
  removeBtn.addEventListener("click", removeBtnHandler);
  removeBtn.innerHTML = '<span aria-hidden="true">&times;</span>';

  newItem.className = "list-item pt-2 pb-2 pr-2 mb-2";
  newItem.draggable = "true";
  newItem.appendChild(removeBtn);
  newItem.addEventListener("click", markToggleHandler);
  newItem.addEventListener("dragstart", drag);

  return newItem;
};

const getIndex = (element) => {
  const parent = element.parentNode;
  return Array.prototype.indexOf.call(parent.children, element);
};

// 일정 등록
const textAreaHandler = () => {
  const { target, keyCode } = event;
  const addCard = target.closest(".add-item-container");
  const addBtn = addCard.children[0];
  const textArea = addCard.children[1];

  if (keyCode == 13) {
    const name = textArea.children[0].value;
    if (name.length === 0) return;

    const project = document.querySelector(".project").innerHTML;
    const state = addCard.parentNode.classList[2];
    const data = { state, name, marked: "false" };

    fetch(`http://127.0.0.1:4000/project/todo/${project}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then((res) => res.json())
      .then(({ msg }) => {
        if (msg === "success") {
          addBtn.style.display = "block";
          textArea.style.display = "none";

          textArea.children[0].value = "";

          const list = addCard.previousElementSibling;
          const newItem = createNewElement(name);
          list.appendChild(newItem);
          renderAppend(list.parentNode);
        }
      });
  }
};

const closeBtnHandler = () => {
  let target = event.target;
  if (target.matches("span")) target = target.parentNode;

  const textArea = target.closest(".form-group");
  const addBtn = textArea.previousElementSibling;

  addBtn.style.display = "block";
  textArea.children[0].value = "";
  textArea.style.display = "none";
};

const addBtnHandler = () => {
  let target = event.target;
  const parentNode = target.parentNode;
  if (target.matches("a")) target = parentNode; // div 하위 요소 이벤트 발생 대비

  const textArea = target.closest(".add-item-container").children[1];
  target.style.display = "none";
  textArea.style.display = "block";
};

// 일정 삭제
const removeBtnHandler = () => {
  const { target } = event;
  const item = target.closest(".list-item");
  const list = item.parentNode;
  const listContainer = list.parentNode;

  const content = item.children[0];
  let removedName, marked;

  if (content.children.length !== 0) {
    removedName = content.children[0].innerHTML;
    marekd = "true";
  } else {
    removedName = content.innerHTML;
    marked = "false";
  }

  const project = document.querySelector(".project").innerHTML;
  const state = listContainer.classList[2];
  const data = { state, name: removedName, marked };

  fetch(`http://127.0.0.1:4000/project/todo/${project}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then((res) => res.json())
    .then(({ msg }) => {
      if (msg === "success") {
        list.removeChild(item);
        renderRemove(listContainer);
      }
    });
};

const markToggleHandler = () => {
  let { target } = event;
  const item = target.closest('.list-item').children[0];

  if (item.classList.contains('marked')) {
    marked = "false";
  } else {
    marked = "true";
  }

  item.classList.toggle('marked');

  const project = document.querySelector(".project").innerHTML;
  const state = target.closest(".list").classList[2];
  console.log(item);

  const name = item.innerHTML;
  const data = {
    state,
    name,
    marked,
  };

  console.log('send data...');
  console.log(data);

  fetch(`http://127.0.0.1:4000/project/todo/mark/${project}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then((res) => res.json())
    .then(({ msg }) => {
      console.log(msg);
    });
};

module.exports = {
  loadHandler,
};
