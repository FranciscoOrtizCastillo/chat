
const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')

const db = require('./firebase')

const cors = require("cors");

//const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const app = express()

const port = 3000
const socketPort = 8000;

const { emit } = require("process");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
   cors: {
      origin: "http://localhost:"+port,
      methods: ["GET", "POST"],
   },
});

/**
 * Global Middleware 
 */
app.use(cors());

//app.use(mongoSanitize());

//Security HTTP Header middlewire
app.use(helmet());

//Data Sanitization against xss
app.use(xss());

//Rate limiting middlewire
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 1, // No of Requests
    });
app.use(limiter);

//Prevent Parameter Polution
app.use(hpp());

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

/**
 * Home page
 */
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname + '/../public/index.html'))
})

app.use(express.static(path.join(__dirname, '/../public')))

app.get("/messages", db.getMessages);

app.post("/messages", db.createMessage);

app.listen(port, () => {
  console.log(`App running on ${port}.`)
})

// sends out the 10 most recent messages from recent to old
const emitMostRecentMessges = () => {
    db.getSocketMessages()
       .then((result) => io.emit("chat message", result))
       .catch(console.log);
};

// connects, creates message, and emits top 10 messages
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("chat message", (msg) => {
       db.createSocketMessage(JSON.parse(msg))
          .then((_) => {
             emitMostRecentMessges();
          })
          .catch((err) => io.emit(err));
    });
 
    // close event when user disconnects from app
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

});
 
// Displays in terminal which port the socketPort is running on
server.listen(socketPort, () => {
    console.log(`listening on *:${socketPort}`);
});