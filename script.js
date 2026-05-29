const API_URL = "https://remaniai.ashrithmv.workers.dev"; // 👈 replace this

// Send message to AI
async function sendMessage(message) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message
      })
    });

    // If server error
    if (!res.ok) {
      const errText = await res.text();
      console.error("Server error:", errText);
      return "Server error. Try again.";
    }

    const data = await res.json();
    return data.reply || "No reply received";

  } catch (error) {
    console.error("Fetch failed:", error);
    return "Cannot connect to Remani AI";
  }
}


// UI handling
async function handleSend() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");

  const message = input.value.trim();
  if (!message) return;

  // show user message
  chatBox.innerHTML += `<div class="user">You: ${message}</div>`;
  input.value = "";

  // show loading
  chatBox.innerHTML += `<div class="bot">Remani: typing...</div>`;

  // call AI
  const reply = await sendMessage(message);

  // replace last "typing..."
  const messages = chatBox.getElementsByClassName("bot");
  messages[messages.length - 1].innerHTML = `Remani: ${reply}`;

  chatBox.scrollTop = chatBox.scrollHeight;
}


// Enter key support
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      handleSend();
    }
  });
});
