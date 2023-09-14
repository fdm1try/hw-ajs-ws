const combineRouters = require('koa-combine-routers');

const usersRouter = require('./users');
const messagesRouter = require('./messages');

const router = combineRouters(usersRouter, messagesRouter);

module.exports = router;
