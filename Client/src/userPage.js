import "../public/userpage.css";

export default function loadHandler () {
  fetch("http://127.0.0.1:4000/user/projects", {
    method: "GET",
    credentials: "include",
  })
    .then((res) => res.json())
    .then(({ msg, userId, name }) => {
      if (msg) {
        alert(msg);
        location.href = "#";
      } else {
        renderProject(userId, name);
        addEventtoElements();
      }
    });
};

const createHandler = () => {
  event.preventDefault();
  const cardList = document.querySelector(".project-card-list");
  const inputForm = document.querySelector(".input-container");
  let createCard = document.querySelector(".create-card");
  const input = document.querySelector(".projectName-input");

  if (input.value.length === 0) return;

  // '/' 는 왜 버그나지?
  // if (input.value.includes("/")) {
  //   alert(`특수문자 '/'를 제외하고 입력해주세요.`);
  //   return;
  // }

  const data = { projectName: input.value };
  /* 새로 생성한 프로젝트 정보 */
  fetch("http://127.0.0.1:4000/user/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then((res) => res.json())
    .then(({ msg }) => {
      console.log(msg);

      const newItem = document.createElement("div");
      newItem.className = "col-sm-3 project-card-container";
      newItem.innerHTML += `<div class="project-card card">
                              <div class="card-body" style="cursor: pointer;">
                                <a class="projectTitle text-center text-primary lead font-weight-bolder">${input.value}</a>
                                <button type="button" class="close close-btn" aria-label="Close">
                                  <span aria-hidden="true" class="delete-btn">&times;</span>
                                </button>
                              </div>
                            </div>`;

      input.value = "";
      cardList.insertBefore(
        newItem,
        createCard.closest(".project-card-container")
      );
      inputForm.style.display = "none";
      upOpacity();
    });
};

const deleteHandler = (target) => {
  const { parentNode } = target;
  const projectName = parentNode.previousElementSibling.innerHTML;

  const data = { projectName };

  fetch("http://127.0.0.1:4000/user/projects", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then((req) => req.json())
    .then(({ userId, name }) => {
      // 노드 삭제 하지않고 다시 렌더링
      renderProject(userId, name);
    });
};

/**
 * 사용자의 프로젝트들을 렌더링합니다.
 */
const renderProject = (userId, nameList) => {
  const user = document.querySelector(".user");
  user.innerHTML = userId;

  const cardList = document.querySelector(".project-card-list");
  let html = "";
  nameList.forEach((name) => {
    html += `<div class="col-sm-3 project-card-container">
               <div class="project-card card">
                <div class="card-body" style="cursor: pointer;">
                  <a class="projectTitle text-center text-primary lead font-weight-bolder">${name}</a>
                  <button type="button" class="close close-btn" aria-label="Close">
                 <span aria-hidden="true" class="delete-btn">&times;</span>
                </button>
               </div>
              </div>
            </div>`;
  });
  html += `<div class="col-sm-3 project-card-container">
            <div class="project-card card">
              <div class="create-card card-body" style="cursor: pointer;">
                <a class="create-text text-center text-primary lead font-weight-bolder">Create a new project (+)</a>
              </div>
            </div>
          </div>`;
  cardList.innerHTML = html;
};

/**
 * 모든 요소들에 이벤트를 등록합니다.
 */
const addEventtoElements = () => {
  const cardList = document.querySelector(".project-card-list");
  const inputForm = document.querySelector(".input-container");

  cardList.addEventListener("click", ({ target }) => {
    const { classList } = target;
    const role = classList[0];

    if (role === "create-card" || role === "create-text") {
      inputForm.style.display = "block";
      downOpacity();
    } else if (role === "card-body" || role === "projectTitle") {
      const chooseProject = target.matches("a")
        ? target.innerHTML
        : target.children[0].innerHTML;
      // 이미 생성된 프로젝트 클릭시
      location.href = `#project?${chooseProject}`;
    } else if (role === "delete-btn") deleteHandler(target);
  });

  const createBtn = document.querySelector(".create-btn");
  createBtn.addEventListener("click", createHandler);

  const input = document.querySelector(".projectName-input");
  input.addEventListener("keypress", () => {
    if (event.keyCode == 13) createHandler();
  });

  const closeBtn = document.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    event.preventDefault();
    input.value = "";
    inputForm.style.display = "none";
    upOpacity();
  });

  const signoutBtn = document.querySelector(".signout");
  signoutBtn.addEventListener("click", () => {
    location.href = "#signOut";
  });
};

const upOpacity = () => {
  const header = document.querySelector(".header");
  const middle = document.querySelector(".middle");

  header.style.opacity = 1;
  middle.style.opacity = 1;
};

const downOpacity = () => {
  const header = document.querySelector(".header");
  const middle = document.querySelector(".middle");

  header.style.opacity = 0.2;
  middle.style.opacity = 0.2;
};
