const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const config = require('../webpack.config.js');
const compiler = webpack(config);
const webpackHotMiddleware = require("webpack-hot-middleware");
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const root = require('./graphql/psqlreducers');
const io = module.exports.io = require('socket.io')(server, {
  upgradeTimeout: 120000,
  timeout: 160000,
});
const SocketManager = require('./SocketManager');

require('dotenv').config();

io.on('connection', ( socket ) => { 
  SocketManager(socket);
  setTimeout(() => socket.disconnect(true), 300000);
});

const PORT = process.env.PORT || 5000;

const schema  = require('./graphql/typeDefs');

app.use(middleware(compiler, {
  publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql:true
}));

app.use(express.static(path.join(__dirname, '../build')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})


server.listen(PORT, () => {
	console.log("Connected on port " + PORT + "!");
});
