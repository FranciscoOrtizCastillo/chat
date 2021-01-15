const socket = io("http://localhost:8000");
const form = document.querySelector("form");
const messages = document.querySelector("#messages");

let alternate = false;
function createMessage(msg) {
  if (msg.text == "") return;

  const div = document.createElement("div");
  //li.textContent = `${msg.text}, ${msg.username}, ${new Date(msg.createdAt).toLocaleString()}`;

  div.classList.add("card");
  div.classList.add("w");
  div.classList.add("75");

  if (alternate) {
    div.classList.add("text-end");
    div.classList.add("bg-info");
  }

  alternate = !alternate;

  const div2 = document.createElement("div");
  div2.classList.add("card-body");
  div.append(div2);

  const h5 = document.createElement("h5");
  h5.classList.add("card-title");
  h5.textContent = `${msg.username}`;
  div2.append(h5);

  const h6 = document.createElement("h6");
  h6.classList.add("card-subtitle");
  h6.classList.add("mb-2");
  h6.classList.add("text-muted");
  h6.textContent = `${new Date(msg.createdAt).toLocaleString()}`;
  div2.append(h6);

  const p = document.createElement("p");
  p.classList.add("card-text");
  p.textContent = `${msg.text}`;
  div2.append(p);

  messages.append(div);
}

function createMessages(msgs) {
  msgs.forEach(createMessage);
}

fetch("http://localhost:3000/messages")
  .then((res) => res.json())
  .then(createMessages);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit(
    "chat message",
    JSON.stringify({
      text: document.querySelector("#m").value,
      username: document.querySelector("#username").value,
    })
  );
  e.target.reset();
});

socket.on("chat message", function (msgs) {
  //console.log(msgs)
  messages.innerHTML = "";
  createMessages(msgs);
});
