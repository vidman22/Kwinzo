const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const passport = require('passport');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const root = require('./graphql/reducers');
const io = module.exports.io = require('socket.io')(server);
const SocketManager = require('./SocketManager');

require('dotenv').config();

io.on('connection', ( socket ) => { 
	SocketManager(socket);
});

const PORT = process.env.PORT || 5000;

const schema  = require('./graphql/typeDefs');

app.use(passport.initialize());
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


// app.use(cors({
// 	origin: 'http://localhost:3000'
// }));


server.listen(PORT, () => {
	console.log("Connected on port " + PORT + "!");
});
