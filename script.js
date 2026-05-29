* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #0f0f0f;
  font-family: Arial, sans-serif;
  color: white;

  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* HEADER */
header {
  padding: 15px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;

  background: #151515;

  border-bottom: 1px solid #222;

  position: sticky;
  top: 0;
  z-index: 100;
}

/* CHAT AREA */
#chatBox {
  flex: 1;

  overflow-y: auto;

  padding: 15px;

  display: flex;
  flex-direction: column;

  gap: 12px;

  scroll-behavior: smooth;
}

/* MESSAGE */
.message {
  max-width: 80%;

  padding: 12px 15px;

  border-radius: 18px;

  line-height: 1.4;

  word-wrap: break-word;

  font-size: 15px;
}

/* USER */
.user {
  background: #007aff;
  align-self: flex-end;

  border-bottom-right-radius: 5px;
}

/* BOT */
.bot {
  background: #252525;
  align-self: flex-start;

  border-bottom-left-radius: 5px;
}

/* INPUT AREA */
.inputArea {
  display: flex;

  gap: 10px;

  padding: 12px;

  background: #151515;

  border-top: 1px solid #222;

  position: sticky;
  bottom: 0;
}

/* INPUT */
#userInput {
  flex: 1;

  background: #252525;

  border: none;

  outline: none;

  color: white;

  padding: 14px;

  border-radius: 14px;

  font-size: 16px;
}

/* BUTTON */
button {
  background: #007aff;

  border: none;

  color: white;

  padding: 14px 18px;

  border-radius: 14px;

  font-size: 16px;

  cursor: pointer;

  transition: 0.2s;
}

button:hover {
  opacity: 0.9;
}

/* MOBILE */
@media (max-width: 600px) {

  header {
    font-size: 20px;
    padding: 14px;
  }

  .message {
    font-size: 14px;
    max-width: 90%;
  }

  #userInput {
    font-size: 16px;
  }

}
