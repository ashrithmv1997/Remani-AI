const input = document.getElementById("userInput");

/* 🔥 ENTER KEY SUPPORT */
input.addEventListener("keydown", function (event) {
if (event.key === "Enter") {
sendMessage();
}
});

async function sendMessage() {

const input = document.getElementById("userInput");

const text = input.value.trim();

if (!text) return;

addMessage(text, "user");

input.value = "";

setStatus("Thinking... 🤔");

try {

    const res = await fetch("https://remaniai.ashrithmv.workers.dev", {
method: "POST",

headers: {
