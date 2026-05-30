let history = JSON.parse(localStorage.getItem("remaniHistory")) || [];

/* =========================
   SOUND STATE
========================= */
let soundEnabled = true;

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("soundToggle");

  if (toggle) {
    soundEnabled = toggle.checked;

    toggle.addEventListener("change", (e) => {
      soundEnabled = e.target.checked;

      // 🔥 instant stop voice
      if (!soundEnabled) {
        window.speechSynthesis.cancel();
      }
    });
  }
});

/* =========================
   ENTER KEY SUPPORT
========================= */
document.getElementById("userInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

/* =========================
   TEXT NORMALIZER (MANGISH FIX)
========================= */
function normalizeText(text) {
  return text
    .replace(/machane|macha|da|di|bro|dude|sahoo/gi, "")
    .replace(/entha|enthaa|kya|what|എന്താ/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================
   MAIN MESSAGE FUNCTION
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

    // keep memory small
    localStorage.setItem(
      "remaniHistory",
      JSON.stringify(history.slice(-20))
    );

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
   STATUS + EMOTION
========================= */
function setStatus(text) {
  const el = document.getElementById("status");
  if (el) el.innerText = text;
}

function updateEmotion(text) {
  const t = text.toLowerCase();

  if (t.includes("love")) {
    setStatus("Soft 🥰");
  } else if (t.includes("haha") || t.includes("lol")) {
    setStatus("Laughing 😂");
  } else if (t.includes("angry")) {
    setStatus("Annoyed 😤");
  } else {
    setStatus("Sassy 😏");
  }
}

/* =========================
   VOICE SYSTEM (FIXED)
========================= */
function speak(text) {
  if (!soundEnabled) return;

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-IN";
  speech.rate = 1;
  speech.pitch = 1.4;
  speech.volume = 1;

  const voices = window.speechSynthesis.getVoices();

  const femaleVoice =
    voices.find(v => v.name.toLowerCase().includes("female")) ||
    voices.find(v => v.name.toLowerCase().includes("zira")) ||
    voices.find(v => v.name.toLowerCase().includes("samantha")) ||
    voices.find(v => v.lang.includes("en")) ||
    voices[0];

  if (femaleVoice) {
    speech.voice = femaleVoice;
  }

  window.speechSynthesis.speak(speech);
}

/* =========================
   FORCE VOICE LOAD FIX
========================= */
window.speechSynthesis.onvoiceschanged = () => {
  window.speechSynthesis.getVoices();
};
