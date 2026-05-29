let voiceEnabled = true;
const input =
  document.getElementById("userInput");

/* 🔥 ENTER KEY */
input.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Enter") {
      sendMessage();
    }

  }
);


/* 🚀 SEND MESSAGE */
async function sendMessage() {

  const input =
    document.getElementById("userInput");

  const text =
    input.value.trim();

  if (!text) return;

  // user message
  addMessage(text, "user");

  input.value = "";

  setStatus("Thinking... 🤔");

  setAvatar("remani-default.jpg");

  // typing bubble
  const typing =
    document.createElement("div");

  typing.className = "msg bot";

  typing.id = "typing";

  typing.innerText =
    "Remani is typing...";

  document
    .getElementById("chatBox")
    .appendChild(typing);

  try {

    const res = await fetch(
      "https://remaniai.ashrithmv.workers.dev",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          message: text
        })
      }
    );

    const data =
      await res.json();

    // remove typing
    document
      .getElementById("typing")
      .remove();

    const reply =
      data.reply ||
      "No response from Remani";

    addMessage(reply, "bot");

    updateEmotion(reply);

    speak(reply);

    setStatus("Online 😎");

  }

  catch (err) {

    console.error(err);

    // remove typing
    if (
      document.getElementById("typing")
    ) {
      document
        .getElementById("typing")
        .remove();
    }

    addMessage(
      "Connection error 😵",
      "bot"
    );

    setStatus("Offline ❌");

  }

}


/* 💬 ADD MESSAGE */
function addMessage(text, type) {

  const chat =
    document.getElementById("chatBox");

  const div =
    document.createElement("div");

  div.className =
    `msg ${type}`;

  div.innerText = text;

  chat.appendChild(div);

  chat.scrollTop =
    chat.scrollHeight;

}


/* 🎭 EMOTION SYSTEM */
function updateEmotion(text) {

  const t =
    text.toLowerCase();

  if (t.includes("angry")) {

    setAvatar("remani-default.jpg");

    setStatus("Angry 😡");

  }

  else if (
    t.includes("love") ||
    t.includes("sweet")
  ) {

    setAvatar("remani-default.jpg");

    setStatus("Soft 🥰");

  }

  else if (
    t.includes("haha") ||
    t.includes("😂")
  ) {

    setAvatar("remani-default.jpg");

    setStatus("Laughing 😂");

  }

  else if (
    t.includes("confused") ||
    t.includes("sorry")
  ) {

    setAvatar("remani-default.jpg");

    setStatus("Confused 😵");

  }

  else {

    setAvatar("remani-default.jpg");

    setStatus("Sassy 😏");

  }

}


/* 🖼️ AVATAR */
function setAvatar(img) {

  document
    .getElementById("avatarImg")
    .src = img;

}


/* 🟢 STATUS */
function setStatus(text) {

  document
    .getElementById("status")
    .innerText = text;

}


/* 🔊 VOICE */
function speak(text) {

  if (!voiceEnabled) return;

  const speech =
    new SpeechSynthesisUtterance(text);

  speech.rate = 1;

  speech.pitch = 1.2;

  speech.lang = "en-IN";

  window.speechSynthesis.speak(speech);

}
function speak(text) {

  if (!voiceEnabled) return;

  const speech =
    new SpeechSynthesisUtterance(text);

  speech.rate = 1;

  speech.pitch = 1.2;

  speech.lang = "en-IN";

  window.speechSynthesis.speak(speech);

}
