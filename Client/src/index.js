import "../public/index.css";
import LoginLoadHandler from "./login.js";
import SignUpLoadHandler from "./signUp.js";
import ProjectLoadHandler from "./project.js";
import UserPageLoadHandler from "./userPage.js";

const root = document.querySelector(".root");

const routes = {
  "": "../data/login.html",
  signOut: "../data/login.html",
  signUp: "../data/signUp.html",
  userPage: "../data/userPage.html",
  project: "../data/project.html",
};

const init = (hash, data) => {
  switch (hash) {
    case "":
      LoginLoadHandler();
      break;
    case "signOut":
      data = "signout";
      LoginLoadHandler(data);
      break;
    case "signUp":
      SignUpLoadHandler();
      break;
    case "userPage":
      UserPageLoadHandler;
      break;
    case "project":
      ProjectLoadHandler(data);
      break;
    default:
      break;
  }
};

const render = async () => {
  try {
    const uri = location.hash.replace("#", "");
    const tokens = uri.split("?");
    const hash = tokens[0];
    const data = tokens[1];
    const url = routes[hash];
    if (!url) {
      root.innerHTML = "Unknown hash";
      return;
    }
    const res = await fetch(url);
    const contentType = res.headers.get("content-type");
    if (contentType.includes("application/json")) {
    } else {
      root.innerHTML = await res.text();
      init(hash, data); //, data
    }
  } catch (err) {
    console.error(err);
  }
};

window.addEventListener("hashchange", render);

window.addEventListener("DOMContentLoaded", render);
