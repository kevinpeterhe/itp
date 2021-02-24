function setup() {
  //UNUSED VARIABLES
  // let num = 570394;
  // let button = select('#submit')
  // let user_input = select('#user_input')
  // let output = select('#output')

  //declare p5.speech variables & functions
  let speech = new p5.Speech();
  let speechRec = new p5.SpeechRec('en-US', chat);
  speechRec.continuous = true;
  speechRec.interimResults = false;
  speechRec.onResult = showResult;
  speechRec.onError = showError;

  //declare rivescript variables & functions
  let bot = new RiveScript();
  bot.loadFile("mind.rive").then(loading_done).catch(loading_error);

  function loading_done() {
    console.log("Bot has finished loading!");
  
    // Now the replies must be sorted!
    bot.sortReplies();
  
    // And now we're free to get a reply from the brain!
  
    // RiveScript remembers user data by their username and can tell
    // multiple users apart.
    let username = "local-user";
  
    // NOTE: the API has changed in v2.0.0 and returns a Promise now.
    bot.reply(username, "Hello, bot!").then(function(reply) {
      console.log("The bot says: " + reply);
    });
  }

  function loading_error(error, filename, lineno) {
    console.log("Error when loading files: " + error);
  }

  //declare user input to start speech detection for Chrome security reasons
  document.body.onclick = function() {
    speechRec.start();
    console.log("I'm listening...");
  }

  //show result of speech in text box
  function showResult() {
    document.getElementById("myText").value = speechRec.resultString;
    console.log('Transcript: '+ speechRec.resultString); 		// log the transcript
    console.log('Confidence: '+ speechRec.resultConfidence); 	// log the confidence
  }
  
  //show error in case detected
  function showError(){
    document.getElementById("myText").value = 'An error occurred!';
    console.log('An error occurred!');
  }

  //use user speech as input to chat bot reply
  function chat(){
    // if (speechRec.resultValue){
      let input = speechRec.resultString;
      bot.reply("local-user", input).then(function(reply) {
        console.log("Bot>", reply);
        // output.html(reply);
        speech.speak(reply)
      });
  
    // }
  }

//PAST FUNCTIONS BELOW

  // function chat(){
  //   if (speechRec.resultValue){
  //     let input = speechRec.resultString;
  //     bot.reply("local-user", input).then(function(reply) {
  //       console.log("Bot>", reply);
  //       output.html(reply);
  //       speech.speak(reply);
  //     });

  //   }
  // }



  // button.mousePressed(chat);

  // function chat(){
  //   let input = user_input.value()
  //   bot.reply("local-user", input).then(function(reply) {
  //     console.log("Bot>", reply);
  //     output.html(reply);
  //     speech.speak(reply)
  //   });

    
  // }


}


