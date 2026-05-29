const API_URL = "https://remani-ai.ashrithmv.workers.dev";

async function sendMessage(message) {

  try {

    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: message
      })

    });

    const data = await response.json();

    return data.reply || data.error;

  } catch (err) {

    console.error(err);

    return "Connection failed";

  }

}

async function handleSend() {

  const input = document.getElementById("userInput");

  const chatBox = document.getElementById("chatBox");

  const message = input.value.trim();

  if (!message) return;

  // show user message
  chatBox.innerHTML += `
    <div class="user">
      You: ${message}
    </div>
  `;

  input.value = "";

  // loading
  chatBox.innerHTML += `
    <div class="bot" id="typing">
      Remani: typing...
    </div>
  `;

  // get AI reply
  const reply = await sendMessage(message);

  // replace typing
  document.getElementById("typing").remove();

  chatBox.innerHTML += `
    <div class="bot">
      Remani: ${reply}
    </div>
  `;

  chatBox.scrollTop = chatBox.scrollHeight;

}

// ENTER key support
document.getElementById("userInput")
  .addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
      handleSend();
    }

});
