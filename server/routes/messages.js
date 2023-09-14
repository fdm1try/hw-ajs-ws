const Router = require('koa-router');
const MessageList = require('../MessageList');
const UserList = require('../UserList');

const router = new Router();

router.post('/messages/send', async (ctx) => {
  if (!ctx.request.body) {
    ctx.response.status = 400;
    return;
  }
  const { userId, message } = ctx.request.body;
  const user = UserList.findById(userId);
  if (!user) {
    ctx.response.status = 401;
    ctx.response.body = JSON.stringify({ error: 'User with this nickname already in chat!' });
    return;
  }
  MessageList.add(user, message, Date.now());
  ctx.response.status = 201;
  ctx.response.body = { status: 'ok' };
});

module.exports = router;
