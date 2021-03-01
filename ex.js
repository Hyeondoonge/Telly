const Koa = require('koa');
const app = new Koa();

app.keys = ['name', '현정'];

// app.context.db = db();

// app.use(async ctx => {
//   console.log(ctx.db);
// });

// ctx는 request 마다 생성
app.use(async ctx => {
  ctx; // is the Context

  ctx.request; // is a Koa Request // ctx.req는 노드의 req object
  ctx.path;
  ctx.method;

  ctx.response; // is a Koa Response
  ctx.type;
  ctx.length;

  ctx.state.user = await User.find(id);

  ctx.app;

  ctx.cookies.get('name');
  ctx.cookies.set('name', '현정');

  ctx.throw(400, 'name required');

  switch (ctx.accepts('json', 'html', 'text')) {
    case 'json': break;
    case 'html': break;
    case 'text': break;
    default: ctx.throw(406, 'json, html, or text only');
  }
  
});

// Error handling
app.on('error', err => {
  log.error('server error', err)
});