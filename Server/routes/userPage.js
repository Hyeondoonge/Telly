const Router = require("koa-router");
const userpageRouter = new Router();

userpageRouter.options("/projects", async (ctx) => {
  ctx.status = 200;
  ctx.set({
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
  });
});
/* 프로젝트 조회 */
userpageRouter.get("/projects", async (ctx) => {
  try {
    const userId = ctx.session.id;
    const { name } = await ctx.db
      .collection("Project")
      .findOne({ _id: userId });
    ctx.body = JSON.stringify({ userId, name });
  } catch (err) {
    ctx.body = JSON.stringify({ msg: "잘못된 접근 입니다" });
  }
  ctx.set({
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Credentials": "true",
  });
});

/* 프로젝트 생성 */
userpageRouter.post("/projects", async (ctx) => {
  const userId = ctx.session.id;
  const { projectName } = ctx.request.body;
  await ctx.db
    .collection("Project")
    .updateOne({ _id: userId }, { $push: { name: projectName } });
  await ctx.db.collection("TodoList").insertOne({
    _id: { user: userId, project: projectName },
    todo: [],
    doing: [],
    done: [],
  });
  ctx.body = JSON.stringify({ msg: "ok" });
  ctx.set({
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Credentials": "true",
  });
});

/* 프로젝트 삭제 */
userpageRouter.delete("/projects", async (ctx) => {
  const userId = ctx.session.id;
  const { projectName } = ctx.request.body;

  // Project table에서 삭제
  await ctx.db
    .collection("Project")
    .updateOne({ _id: userId }, { $pull: { name: projectName } });

  // Todo에서 삭제
  await ctx.db
    .collection("TodoList").deleteOne({_id: { user: userId, project: projectName }});
  const { name } = await ctx.db.collection("Project").findOne({ _id: userId });
  ctx.body = JSON.stringify({ userId, name }); // 삭제후 새로 렌더링
  ctx.set({
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Credentials": "true",
  });
});

module.exports = userpageRouter;
