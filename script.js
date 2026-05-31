let history =
JSON.parse(
  localStorage.getItem("remaniHistory")
) || [];

let introLaughPlayed = false;
/* =========================
   SOUND CONTROL
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
   CLEAN INPUT (FIXES "WIS TOYS" ISSUE)
========================= */
function cleanInput(text) {
  return text
    .replace(/\s+/g, " ")   // fix broken spacing only
    .trim();
}

/* =========================
   MAIN SEND FUNCTION
========================= */
async function sendMessage() {

  const inputEl =
  document.getElementById("userInput");

  let text =
  inputEl.value.trim();

  if (!text) return;

  if(!introLaughPlayed){

    introLaughPlayed = true;

    const laugh =
    document.getElementById("introLaugh");

    if(laugh){

      inputEl.value = "";

      setStatus("😊 Hehe...");

      laugh.volume = 0.5;

      laugh.play().catch(() => {});

      setTimeout(() => {

        continueSend(text);

      }, 1500);

      return;

    }
  }

  inputEl.value = "";

  continueSend(text);

}
  text = cleanInput(text);

  addMessage(text, "user");

  history.push({
    role: "user",
    content: text
  });

  inputEl.value = "";

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

    /* =========================
       SAFE RESPONSE PARSE (IMPORTANT)
    ========================= */
    const raw = await res.text();

    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      throw new Error("Invalid server response");
    }

    const reply = data.reply || "No response 😵";

    addMessage(reply, "bot");

    history.push({
      role: "assistant",
      content: reply
    });

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
   STATUS
========================= */
function setStatus(text) {
  const el = document.getElementById("status");
  if (el) el.innerText = text;
}

/* =========================
   EMOTION ENGINE
========================= */
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
   VOICE SYSTEM (FIXED FEMALE PRIORITY)
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
   VOICE LOAD FIX
========================= */
window.speechSynthesis.onvoiceschanged = () => {
  window.speechSynthesis.getVoices();
};
/* =========================================
   REMANI STARTUP SEQUENCE
========================================= */

window.addEventListener("load", () => {

  setTimeout(() => {

    const laugh =
      document.getElementById("introLaugh");

    if (laugh) {

      laugh.currentTime = 0;
      laugh.volume = 0.5;

      laugh.play().catch(err => {
        console.log("Audio blocked:", err);
      });

    }

  }, 1200);

});
async function continueSend(text){

  addMessage(text,"user");

  history.push({
    role:"user",
    content:text
  });

  setStatus("Thinking... 🤔");

  try{

    const res =
    await fetch(
      "https://remaniai.ashrithmv.workers.dev",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          message:text,
          history:history
        })
      }
    );

    const data =
    await res.json();

    const reply =
    data.reply || "No response";

    addMessage(reply,"bot");

    history.push({
      role:"assistant",
      content:reply
    });

    localStorage.setItem(
      "remaniHistory",
      JSON.stringify(
        history.slice(-20)
      )
    );

    updateEmotion(reply);

    speak(reply);

    setStatus("Online 😎");

  }

  catch(err){

    console.error(err);

    addMessage(
      "Connection error 😵",
      "bot"
    );

    setStatus("Offline ❌");

  }

}
