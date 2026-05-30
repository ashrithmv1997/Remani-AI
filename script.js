let history = JSON.parse(localStorage.getItem("remaniHistory")) || [];

let soundEnabled = true;

/* =========================
   SOUND TOGGLE
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("soundToggle");
  if (toggle) {
    soundEnabled = toggle.checked;

    toggle.addEventListener("change", (e) => {
      soundEnabled = e.target.checked;
    });
  }
});

/* =========================
   ENTER KEY SUPPORT
========================= */
const inputBox = document.getElementById("userInput");

inputBox.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

/* =========================
   MANGISH NORMALIZER
========================= */
function normalizeText(text) {
  return text
    .replace(/machane|macha|da|di|bro|dude|sahoo/gi, "")
    .replace(/entha|enthaa|kya|what|എന്താ/gi, "")
    .trim();
}

/* =========================
   MAIN SEND FUNCTION
========================= */
async function sendMessage() {
  const input = document.getElementById("userInput");
  let text = input.value.trim();

  if (!text) return;

  text = normalizeText(text);

  addMessage(text, "user");

  history.push({
    role: "user",
    content: text
  });

  input.value = "";

  setStatus("Thinking... 🤔");

  try {
    const res = await fetch("https://remaniai.ashrithmv.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text,
        history: history
      })
    });

    const data = await res.json();
    const reply = data.reply || "No response 😵";

    addMessage(reply, "bot");

    history.push({
      role: "assistant",
      content: reply
    });

    localStorage.setItem("remaniHistory", JSON.stringify(history.slice(-20)));

    updateEmotion(reply);
    speak(reply);

    setStatus("Online 😎");

  } catch (err) {
    console.error(err);
    addMessage("Connection error 😵", "bot");
    setStatus("Offline ❌");
  }
}

/* =========================
   CHAT UI
========================= */
function addMessage(text, type) {
  const chat = document.getElementById("chatBox");

  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.innerText = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

/* =========================
   EMOTION ENGINE (simple)
========================= */
function updateEmotion(text) {
  const t = text.toLowerCase();

  if (t.includes("love") || t.includes("cute")) {
    setStatus("Soft 🥰");
  } else if (t.includes("haha") || t.includes("lol")) {
    setStatus("Laughing 😂");
  } else if (t.includes("angry") || t.includes("bad")) {
    setStatus("Annoyed 😤");
  } else {
    setStatus("Sassy 😏");
  }
}

/* =========================
   STATUS UPDATE
========================= */
function setStatus(text) {
  const el = document.getElementById("status");
  if (el) el.innerText = text;
}

/* =========================
   AVATAR CHANGE (optional use)
========================= */
function setAvatar(img) {
  document.getElementById("avatarImg").src = img;
}

/* =========================
   VOICE OUTPUT (TOGGLE SAFE)
========================= */
function speak(text) {
  if (!soundEnabled) return;

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-IN";
  speech.rate = 1;
  speech.pitch = 1.3;
  speech.volume = 1;

  const voices = speechSynthesis.getVoices();

  const femaleVoice =
    voices.find(v => v.name.includes("Female")) ||
    voices.find(v => v.name.includes("Google")) ||
    voices.find(v => v.lang.includes("en"));

  if (femaleVoice) {
    speech.voice = femaleVoice;
  }

  speechSynthesis.speak(speech);
}
