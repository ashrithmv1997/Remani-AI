let history = JSON.parse(localStorage.getItem("remaniHistory")) || [];

/* =========================
   SOUND STATE
========================= */
let soundEnabled = true;

/* =========================
   INIT TOGGLE
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("soundToggle");

  if (toggle) {
    soundEnabled = toggle.checked;

    toggle.addEventListener("change", (e) => {
      soundEnabled = e.target.checked;

      // 🔥 INSTANT STOP SOUND
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
  if (e.key === "Enter") {
    sendMessage();
  }
});

/* =========================
   MANGISH / SLANG NORMALIZER
========================= */
function normalizeText(text) {
  return text
    .replace(/machane|macha|da|di|bro|dude|sahoo/gi, "")
    .replace(/entha|enthaa|kya|what|എന്താ/gi, "")
    .replace(/\s+/g, " ")
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

    // keep last 20 messages only
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
   AVATAR (optional)
========================= */
function setAvatar(img) {
  document.getElementById("avatarImg").src = img;
}

/* =========================
   SAFE SPEECH ENGINE (FIXED)
========================= */
let soundEnabled = true;

/* =========================
   FORCE VOICE LOAD
========================= */
window.speechSynthesis.onvoiceschanged = () => {
  window.speechSynthesis.getVoices();
};

/* =========================
   FIXED SPEAK FUNCTION (FEMALE PRIORITY)
========================= */
function speak(text) {
  if (!soundEnabled) return;

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-IN";
  speech.rate = 1;
  speech.pitch = 1.5;
  speech.volume = 1;

  const voices = window.speechSynthesis.getVoices();

  // Strong female voice selection
  const femaleVoice =
    voices.find(v => v.name.toLowerCase().includes("female")) ||
    voices.find(v => v.name.toLowerCase().includes("zira")) ||
    voices.find(v => v.name.toLowerCase().includes("samantha")) ||
    voices.find(v => v.lang === "en-IN") ||
    voices[0];

  if (femaleVoice) {
    speech.voice = femaleVoice;
  }

  speechSynthesis.speak(speech);
}

/* =========================
   FIX TOGGLE (IMPORTANT)
========================= */
document.getElementById("soundToggle").addEventListener("change", (e) => {
  soundEnabled = e.target.checked;

  if (!soundEnabled) {
    window.speechSynthesis.cancel(); // instant stop
  }
});
