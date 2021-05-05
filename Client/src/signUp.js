const loadHandler = () => {
  const signupBtn = document.querySelector(".btn");
  signupBtn.addEventListener("click", signupBtnHandler);
};

const signupBtnHandler = () => {
  const emailForm = document.querySelector("input[role=email]");
  const pwForm = document.querySelector("input[role=password]");
  const cfpwForm = document.querySelector("input[role=cfpassword]");

  const user = emailForm.value;
  const pw = pwForm.value;
  const cfpw = cfpwForm.value;

  if (pw !== cfpw) {
    alert("비밀번호가 일치하지 않습니다");
    return;
  }
  const data = { user, pw };

  console.log(data);

  fetch("http://127.0.0.1:4000/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then(({ msg }) => {
      if (msg === "create successfully") location.href = "#userPage";
      else alert(msg);
    });
};

module.exports = { loadHandler };
