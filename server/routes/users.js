const Router = require('koa-router');
const UserList = require('../UserList');

const router = new Router();

router.post('/users/register', async (ctx) => {
  const { nickname } = ctx.request.body;
  if (!nickname || !nickname.length) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify({ error: 'Пустое имя пользователя' });
    return;
  }
  if (UserList.findByName(nickname)) {
    ctx.response.status = 401;
    ctx.response.body = JSON.stringify({ error: 'Псевдоним занят' });
    return;
  }
  const user = UserList.add(nickname);
  ctx.response.status = 201;
  ctx.response.body = user;
});

module.exports = router;
