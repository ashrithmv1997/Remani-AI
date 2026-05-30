let history =
JSON.parse(
  localStorage.getItem("remaniHistory")
) || [];

const input =
document.getElementById("userInput");

input.addEventListener(
  "keydown",
  function(event){

    if(event.key==="Enter"){
      sendMessage();
    }

  }
);

async function sendMessage(){

  const input =
  document.getElementById("userInput");

  const text =
  input.value.trim();

  if(!text) return;

  addMessage(text,"user");

  history.push({
    role:"user",
    content:text
  });

  input.value="";

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
    data.reply ||
    "No response";

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

function addMessage(text,type){

  const chat =
  document.getElementById("chatBox");

  const div =
  document.createElement("div");

  div.className =
  `msg ${type}`;

  div.innerText=text;

  chat.appendChild(div);

  chat.scrollTop=
  chat.scrollHeight;

}

function updateEmotion(text){

  const t =
  text.toLowerCase();

  if(
    t.includes("love")
  ){
    setStatus("Soft 🥰");
  }

  else if(
    t.includes("haha")
  ){
    setStatus("Laughing 😂");
  }

  else{
    setStatus("Sassy 😏");
  }

}

function setAvatar(img){

  document
  .getElementById("avatarImg")
  .src = img;

}

function setStatus(text){

  document
  .getElementById("status")
  .innerText = text;

}

function speak(text){

  const speech =
  new SpeechSynthesisUtterance(
    text
  );

  speech.lang="en-IN";

  speech.rate=1;

  speech.pitch=1.5;

  const voices =
  speechSynthesis.getVoices();

  const femaleVoice =

    voices.find(
      v =>
      v.name.includes(
        "Samantha"
      )
    )

    ||

    voices.find(
      v =>
      v.name
      .toLowerCase()
      .includes(
        "female"
      )
    )

    ||

    voices.find(
      v =>
      v.lang.includes(
        "en"
      )
    );

  if(femaleVoice){
    speech.voice =
    femaleVoice;
  }

  speechSynthesis.speak(
    speech
  );

}
