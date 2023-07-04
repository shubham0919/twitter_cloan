const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const env = require("dotenv").config();
const jwt = require('jsonwebtoken')
const path = require("path");
const session = require('express-session')


const postController = require('./Controller/apiController')

//Server Listening On This Port
const port = process.env.PORT || 8000;

//Mongodb Connection
const db = require("./config/mongoose");

//Ejs Setup
app.set("view engine", "ejs");
app.set("views", "./views");


//Middlewares

app.use(express.urlencoded());
app.use(express.json());

//Setting The Path Of Ui Assets 
app.use(express.static(path.join(__dirname, "public")));

//Session 
app.use(session({
  secret : process.env.SESSION_KEY,
  resave : true,
  saveUninitialized : false
}))

//Routes
app.use("/", require("./Routes/indexRoute"));



io.use(async (socket, next) => {
  if (socket.handshake.query.token) {
      console.log("===================>",socket.handshake.query.token);
      jwt.verify(socket.handshake.query.token, "privateKey", (err, decoded) => {
          if (err) return next(new Error('Authentication error'));
          socket.decoded = decoded;
          next();
      });
  }
  else {
      next(new Error('Authentication error'));
  }
});


io.on('connection',(socket) => {
  console.log(`${socket.id} is Connected`);

  socket.on('post', async (post) => {
    console.log(post);
    let response = await postController.post(socket,post)
    io.emit('userPostResponse',response)
  })

  //Get All Data
  socket.on("getData", async (postList) => {
    const response = await postController.get(postList);
    socket.emit("userPostList", response);
    console.log("response", response);
});

  socket.on('disconnect',() => {
    console.log(`${socket.id} is Disconnected`);
  })
})

//Server Listening
http.listen(port, () => {
  console.log(`server start http://localhost:${port}`);
})

// app.listen(port, () => {
//   console.log(`server start http://localhost:${port}`);
// });
