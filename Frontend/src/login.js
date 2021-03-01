const loadHandler = (data) => {
  if (data) signOut();

  const signinBtn = document.querySelector(".btn");
  signinBtn.addEventListener("click", signinBtnHandler);
};

const signinBtnHandler = () => {
  const emailForm = document.querySelector("input[type=email]");
  const pwForm = document.querySelector("input[type=password]");

  const _id = emailForm.value;
  const pw = pwForm.value;

  const data = { _id, pw };

  fetch("http://127.0.0.1:4000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then(({ msg }) => {
      if (msg === "ok") location.href = "#userPage";
      else alert("아이디와 비밀번호가 맞지 않습니다");
      // hashchange
    });
};

const signOut = () => {
  fetch("http://127.0.0.1:4000/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((res) => res.json())
    .then(() => {
      alert("로그아웃 되었습니다");
      // hashchange
    });
};

module.exports = { loadHandler };
