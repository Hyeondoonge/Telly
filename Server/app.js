const env = require("dotenv").config();
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const Router = require("koa-router");
const Logger = require("koa-logger");
const session = require("koa-session");
const mongo = require("koa-mongo");

const userpageRouter = require("./routes/userPage");
const projectRouter = require("./routes/project");

const app = new Koa();
const router = new Router();

app.keys = ["some secret hurr"];

const CONFIG = {
  key: "koa.sess",
  maxAge: 86400000,
  renew: false,
};

app.use(bodyParser());
app.use(session(CONFIG, app));
app.use(
  mongo({
    user: process.env.USERID,
    pass: process.env.PASSWORD,
    db: process.env.DB,
    authSource: process.env.AUTHSOURCE,
    max: 100,
    min: 1,
  })
);

router.use("/user", userpageRouter.routes());
router.use("/project", projectRouter.routes());
app.use(Logger());
app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running on port 4000");
});

router.options("/new", async (ctx) => {
  ctx.status = 200;
  ctx.set({
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
  });
});

router.post("/new", async (ctx) => {
  const { user, pw } = ctx.request.body;
  try {
    await ctx.db.collection("Users").findOne({ _id: user });
    ctx.session.id = user;
    await ctx.db.collection("Users").insertOne({ _id: user, pw });
    await ctx.db.collection("Project").insertOne({ _id: user, name: [] });
    ctx.body = JSON.stringify({ msg: "create successfully" });
  } catch (err) {
    ctx.body = JSON.stringify({ msg: "already exist email" });
  }
  ctx.set({
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Credentials": "true",
  });
});

router.options("/", async (ctx) => {
  ctx.status = 200;
  ctx.set({
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
  });
});

router.post("/", async (ctx) => {
  const { _id, pw } = ctx.request.body;
  const result = await ctx.db.collection("Users").findOne({ _id });
  if (pw === result.pw) {
    ctx.session.id = _id;
    ctx.body = JSON.stringify({ msg: "ok" });
  } else ctx.body = JSON.stringify({ msg: "fail" });
  ctx.set({
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Credentials": "true",
  });
});

router.delete("/", async (ctx) => {
  delete ctx.session.id;
  ctx.body = JSON.stringify({ msg: "success" });
  ctx.set({
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Credentials": "true",
  });
});
