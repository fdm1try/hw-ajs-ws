const WS = require('ws');
const Koa = require('koa');
const http = require('http');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const router = require('./routes');
const MessageList = require('./MessageList');
const UserList = require('./UserList');

const PORT = 8123;

const corsOptions = {};
const [corsOrigin] = process.argv.slice(2);
if (corsOrigin) corsOptions.origin = corsOrigin;

const app = new Koa();
app.use(cors(corsOptions));
app.use(koaBody());
app.use(router());
const server = http.createServer(app.callback());

const wsServer = new WS.Server({ server });
wsServer.on('connection', (ws) => {
  let user;
  MessageList.addNewMessageEventListener((message) => ws.send(JSON.stringify(message)));
  MessageList.addNewMessageEventListener((messageData) => {
    const { name } = messageData.user;
    const { message } = messageData;
    ws.send(JSON.stringify({ type: 'newMessage', data: { name, message } }));
  });

  setInterval(() => ws.send(JSON.stringify({ type: 'ping' })), 2000);

  const broadcast = (message) => wsServer.clients.forEach((client) => client.send(message));

  ws.on('message', (message) => {
    const { type, data } = JSON.parse(message);
    if (type === 'subscribe') {
      user = UserList.findById(data);
      if (user) {
        broadcast(JSON.stringify({ type: 'updateChatUsers', data: UserList.all.map((item) => ({ name: item.name })) }));
      } else {
        ws.send(JSON.stringify({ type: 'subscribeError', error: { message: 'Пользователь не зарегистрирован!' } }));
      }
    }
  });

  ws.on('close', () => {
    UserList.remove(user);
    broadcast(JSON.stringify({ type: 'updateChatUsers', data: UserList.all.map((item) => ({ name: item.name })) }));
  });
});

wsServer.on('error', console.error);

server.listen(PORT);
console.log('Server started...');
