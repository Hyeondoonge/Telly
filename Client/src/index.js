import "./index.css";
import * as Login from "./login.js";
import * as SignUp from "./signUp.js";
import * as Project from "./project.js";
import * as UserPage from "./userPage.js";

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
      Login.loadHandler();
      break;
    case "signOut":
      data = "signout";
      Login.loadHandler(data);
      break;
    case "signUp":
      SignUp.loadHandler();
      break;
    case "userPage":
      UserPage.loadHandler();
      break;
    case "project":
      Project.loadHandler(data);
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
