const ws = new WebSocket(`ws://${location.host}`);

const input = document.getElementById("input");
const messages = document.getElementById("messages");

function sendMessage() {
  if (input.value.trim() !== "") {
    ws.send(input.value);
    input.value = "";
  }
}

ws.onmessage = (event) => {
  const msg = document.createElement("div");
  msg.className = "message";
  msg.textContent = event.data;

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
};

// Press Enter to send
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
