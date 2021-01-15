const admin = require("firebase-admin");

// Initialize Firebase
let serviceAccount = require("./chat-ae088-a2504d6aefb6.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

let messages = [];

db.collection("messages")
  .orderBy("createdAt", "asc")
  .onSnapshot((querySnapshot) => {
    let docs = [];
    querySnapshot.forEach((doc) => {
      docs.push({ ...doc.data() });
    });
    messages = [...docs];
    //console.log(messages);
  });

const getMessages = (request, response) => {
  console.log("getMessages");

  response.status(200).json(messages);
};

const createMessage = async (request, response) => {
  let message = { ...request.body };

  try {
    await db
      .collection("messages")
      .doc()
      .set({ ...message, createdAt: Date.now() });

    console.log("new Message created");
    response.status(201).send("new Message created");
  } catch (error) {
    console.error(error);
  }
};

/**
 *  SOCKET DB
 */

const getSocketMessages = () => {
  return new Promise((resolve) => {
    console.log("getSocketMessages");

    const messagesRef = db.collection("messages");
    let lastTen = messagesRef
      .orderBy("createdAt", "asc")
      .limit(10)
      .get()
      .then((snapshot) => {
        let docs = [];
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }

        snapshot.forEach((doc) => {
          //console.log(doc.id, '=>', doc.data());
          docs.push({ ...doc.data() });
        });

        messages = [...docs];
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });

    //console.log(messages);
    resolve(messages);
  });
};

const createSocketMessage = async (message) => {
  return new Promise(async (resolve) => {
    console.log("createSocketMessage");

    try {
      await db
        .collection("messages")
        .doc()
        .set({
          username: message.username,
          text: message.text,
          createdAt: Date.now(),
        });

      console.log("new Socket Message created");

      resolve("new Message created");
    } catch (error) {
      console.error(error);
    }
  });
};

module.exports = {
  getMessages,
  createMessage,
  getSocketMessages,
  createSocketMessage,
};
