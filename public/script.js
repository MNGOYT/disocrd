// ✅ FIX for Render (https → wss)
const wsProtocol = location.protocol === "https:" ? "wss" : "ws";
const ws = new WebSocket(`${wsProtocol}://${location.host}`);

let username = "";

const input = document.getElementById("input");
const messages = document.getElementById("messages");

function login() {
  const usernameInput = document.getElementById("usernameInput").value.trim();

  if (!usernameInput) return;

  username = usernameInput;

  ws.send(JSON.stringify({
    type: "login",
    username: username
  }));

  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("app").style.display = "flex";
}

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  ws.send(JSON.stringify({
    type: "message",
    text: text
  }));

  input.value = "";
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  const msg = document.createElement("div");
  msg.className = "message";
  msg.textContent = `${data.username}: ${data.text}`;

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
};

// Enter key
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
