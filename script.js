const input = document.getElementById("userInput");

/* 🔥 ENTER KEY SUPPORT */
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage()
  }
});

async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  setStatus("Thinking... 🤔");
  setAvatar("remani-default.jpg");

  const res = await fetch("https://remaniai.ashrithmv.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();

  addMessage(data.reply, "bot");
  updateEmotion(data.reply);
  speak(data.reply);
}

function addMessage(text, type) {
  const chat = document.getElementById("chatBox");
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

/* 🎭 Emotion System (Avatar Switching) */
function updateEmotion(text) {
  const t = text.toLowerCase();

  if (t.includes("angry")) {
    setAvatar("remani-default.jpg");
    setStatus("Angry mode 😡");
  }
  else if (t.includes("love") || t.includes("sweet")) {
    setAvatar("remani-default.jpg");
    setStatus("Soft mode 🥰");
  }
  else if (t.includes("haha") || t.includes("😂")) {
    setAvatar("remani-default.jpg");
    setStatus("Laughing 😂");
  }
  else if (t.includes("confused") || t.includes("sorry")) {
    setAvatar("remani-default.jpg");
    setStatus("Confused 😵");
  }
  else {
    setAvatar("remani-default.jpg");
    setStatus("Sassy mode 😏");
  }
}

function setAvatar(img) {
  document.getElementById("avatarImg").src = img;
}

function setStatus(text) {
  document.getElementById("status").innerText = text;
}

/* 🔊 Voice */
function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.rate = 1;
  speech.pitch = 1.2;
  speech.lang = "en-IN";
  window.speechSynthesis.speak(speech);
}
