const Router = require("koa-router");
const projectRouter = new Router();

projectRouter.options("/todo/:project", async (ctx) => {
  ctx.status = 200;
  ctx.set({
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
  });
});

projectRouter.options("/todo/mark/:project", async (ctx) => {
  ctx.status = 200;
  ctx.set({
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
  });
});

/* 일정 조회 */
projectRouter.get("/todo/:project", async (ctx) => {
  const project = ctx.params.project;
  const user = ctx.session.id;
  console.log(project, user);
  try {
    const result = await ctx.db
      .collection("TodoList")
      .findOne({ _id: { user, project } });

    console.log(result);

    if (result === null) {
      ctx.body = JSON.stringify({ msg: "not exist", userId: user, project });
    } else {
      const { todo, doing, done } = result;
      ctx.body = JSON.stringify({
        msg: "exist",
        userId: user,
        project,
        todolist: { todo, doing, done },
      });
    }
  } catch (err) {
    ctx.body = JSON.stringify({ msg: "fail" });
  }
  ctx.set({
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Credentials": "true",
  });
});

/* 일정 등록 */
projectRouter.post("/todo/:project", async (ctx) => {
  const project = ctx.params.project;
  const user = ctx.session.id;
  const { state, name } = ctx.request.body;
  const data = {};
  data[state] = { name, marked: 'false' };

  await ctx.db
    .collection("TodoList")
    .updateOne({ _id: { user, project } }, { $push: data });

  ctx.body = JSON.stringify({ msg: "success" });
  ctx.set({
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Credentials": "true",
  });
});

/* 일정 수정 */
projectRouter.put("/todo/:project", async (ctx) => {
  const user = ctx.session.id;
  const project = ctx.params.project;
  const { fromState, toState, name, marked } = ctx.request.body;

  const pullData = {};
  pullData[fromState] = { name, marked };

  const pushData = {};
  pushData[toState] = { name, marked };

  console.log('pull');
  console.log(pullData);
  console.log('push');
  console.log(pushData);

  await ctx.db
    .collection("TodoList")
    .updateOne({ _id: { user, project } }, { $pull: pullData });
  await ctx.db
    .collection("TodoList")
    .updateOne({ _id: { user, project } }, { $push: pushData });

  ctx.body = JSON.stringify({ msg: "success" });
  ctx.set({
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Credentials": "true",
  });
});

/* 일정 마킹 업데이트 */
projectRouter.put("/todo/mark/:project", async (ctx) => {
  const user = ctx.session.id;
  const project = ctx.params.project;
  const { state, name, marked } = ctx.request.body;
  const originMarked = marked  === "true"?  "false" : "true";

  const updatedData = {};
  updatedData[`${state}.$`] = { name, marked };
  console.log(updatedData);

  const findData = {};
  findData._id = { user, project };
  findData[state] = { name, marked: originMarked };

  console.log(findData);
  console.log(updatedData);

  await ctx.db
    .collection("TodoList")
    .updateOne(findData, { $set: updatedData });

  ctx.body = JSON.stringify({ msg: "success" });
  ctx.set({
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Credentials": "true",
  });
});

/* 일정 삭제 */
projectRouter.delete("/todo/:project", async (ctx) => {
  const user = ctx.session.id;
  const project = ctx.params.project;
  const { state, name, marked } = ctx.request.body;
  const pullData = {};
  pullData[state] = { name, marked };

  await ctx.db
    .collection("TodoList")
    .updateOne({ _id: { user, project } }, { $pull: pullData });

  ctx.body = JSON.stringify({ msg: "success" });
  ctx.set({
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Credentials": "true",
  });
});

module.exports = projectRouter;
