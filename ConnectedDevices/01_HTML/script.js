//colors of fire states
let color0 = "#900C3F";
let color1 = "#C70039";
let color2 = "#FF5733";
let color3 = "#FFC300";
let color4 = "#DAF7A6";

// variables for the DOM elements:
let portSelector;
let powerButton1;
let powerButton2;
let powerButton3;
let fanSlider;
let background;
// variable for the serialport object:
let serial;
// previous state of the serial input from the button:
let lastButtonState1 = 0;
let lastButtonState2 = 0;
let lastButtonState3 = 0;

//variables for timer event
let rect1;
let timerID;
let counter = 0;
let pressHoldEvent = new CustomEvent("pressHold");
let pressHoldDuration = 100;
let item = document.querySelector("#rect3");


// this function is called when the page is loaded. 
// element event listeners are  added here:
function setup(event) {
  // add listeners for the power button and the fan speed:
  powerButton1 = document.getElementById('led1');
  powerButton1.addEventListener('click1', setPowerState1);

  powerButton2 = document.getElementById('led2');
  powerButton2.addEventListener('click2', setPowerState2);

  powerButton3 = document.getElementById('led3');
  powerButton3.addEventListener('click3', setPowerState3);

  // fanSlider = document.getElementById('fanSpeed');
  // fanSlider.addEventListener('change', setFanSpeed);

  background = document.getElementById('bg');

  // initialize the serialport object:
  serial = new p5.SerialPort(); // new instance of the serialport library
  serial.on('list', printList); // callback function for serialport list event
  serial.on('data', serialEvent); // callback function for serialport data event
  serial.list(); // list the serial ports

  // set initial states of the inputs:
  setPowerState1();
  setPowerState2();
  setPowerState3();
  // setFanSpeed();
}


//functions to set button states
function setPowerState1() {
  // change its value, depending on its current value:
  if (powerButton1.value == 'on') {
    powerButton1.value = 'off';
  } else {
    powerButton1.value = 'on';
  }
  // get the span associated with it and change its text:
  let thisSpan = document.getElementById(powerButton1.id + 'Val');
  thisSpan.innerHTML = "Power is " + powerButton1.value;
}

function setPowerState2() {
  // change its value, depending on its current value:
  if (powerButton2.value == 'on') {
    powerButton2.value = 'off';
  } else {
    powerButton2.value = 'on';
  }
  // get the span associated with it and change its text:
  let thisSpan = document.getElementById(powerButton2.id + 'Val');
  thisSpan.innerHTML = "Power is " + powerButton2.value;
}

function setPowerState3() {
  // change its value, depending on its current value:
  if (powerButton3.value == 'on') {
    powerButton3.value = 'off';
  } else {
    powerButton3.value = 'on';
  }
  // get the span associated with it and change its text:
  let thisSpan = document.getElementById(powerButton3.id + 'Val');
  thisSpan.innerHTML = "Power is " + powerButton3.value;
}

// function setFanSpeed(e) {
//  // assume e is a number:
// var currentValue = e;
// // but if it's an object instead, it's because
// // the slider change event called this function. 
// // Extract the number from it:
//   if (typeof e == 'object') {
//     currentValue = e.target.value;
//   } 
//   //get the span associated with it and change its text:
//   let thisSpan = document.getElementById(fanSlider.id + 'Val');
//   thisSpan.innerHTML = currentValue;
// }


// make a serial port selector object:
function printList(portList) {
  // create a select object:
  portSelector = document.getElementById('portSelector');
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // add this port name to the select object:
    var option = document.createElement("option");
    option.text = portList[i];
    portSelector.add(option);
  }
  // set an event listener for when the port is changed:
  portSelector.addEventListener('change', openPort);
}

function openPort() {
  let item = portSelector.value;
  // if there's a port open, close it:
  if (serial.serialport != null) {
    serial.close();
  }
  // open the new port:
  serial.open(item);
}


//function to process incoming JSON data
function serialEvent() {
  // read a line of incoming data:
  var inData = serial.readLine();
  // if the line is not empty, parse it to JSON:
  if (inData) {
    var sensors = JSON.parse(inData);
    // button value:
    // if the button's changed and it's pressed, take action:
    if (sensors.led1 !== lastButtonState1) {
      //if its high
      if (sensors.led1 === 1) {
        //set button state
        setPowerState1(sensors.led1);
        //show rectangle and set color
        document.getElementById("rect1").style.backgroundColor = color1;
        document.getElementById("rect1").style.visibility = "visible";
      }
      //if its low
      if (sensors.led1 === 0) {
        //set button state
        setPowerState1(sensors.led1);
        //hide rectangle and set color
        document.getElementById("rect1").style.backgroundColor = color0;
        document.getElementById("rect1").style.visibility = "hidden";
      }
      // save button value for next time:
      lastButtonState1 = sensors.led1;
    }
    // if the button's changed and it's pressed, take action:
    if (sensors.led2 !== lastButtonState2) {
      //if its high
      if (sensors.led2 === 1) {
        //set button state
        setPowerState2(sensors.led2);
        //show rectangle and set color
        document.getElementById("rect2").style.backgroundColor = color2;
        document.getElementById("rect2").style.visibility = "visible";
      }
      //if its low
      if (sensors.led2 === 0) {
        //set button state
        setPowerState2(sensors.led2);
        //hide rectangle and set color
        document.getElementById("rect2").style.backgroundColor = color1;
        document.getElementById("rect2").style.visibility = "hidden";
      }
      // save button value for next time:
      lastButtonState2 = sensors.led2;
    }
      // if the button's changed and it's pressed, take action:
      if (sensors.led3 !== lastButtonState3) {
        //if its high
        if (sensors.led3 === 1) {
          //set button state
          setPowerState3(sensors.led3);
          //show rectangle and set color
          document.getElementById("rect3").style.backgroundColor = color3;
          document.getElementById("rect3").style.visibility = "visible";
          //trigger timer event
          pressingDown();
          doSomething();
        }
        // save button value for next time:
        lastButtonState3 = sensors.led3;
      }
      console.log("sensors" + sensors.pressed);
      //if its low and previously turned on
      if (sensors.pressed === 0 && sensors.led3 === 1) {
        notPressingDown();
        setPowerState3(sensors.led3);
      }

    // fan slider value:
    // setFanSpeed(sensors.knob);
  }
}


// add a listener for the page to load:
window.addEventListener('DOMContentLoaded', setup);


//function to turn off final rectangle and send serial data to Arduino
function turnoff() {
  document.getElementById("rect3").style.backgroundColor = color2;
  document.getElementById("rect3").style.visibility = "hidden";
  serial.write('h\n');
}

//function to record start of timer event
function pressingDown(e) {
  // Start the timer
  requestAnimationFrame(timer);
  // e.preventDefault();
  console.log("Pressing!");
}

//function to cancel animation after timer runs out
function notPressingDown(e) {
  requestAnimationFrame(timer2);
  timerID2 = requestAnimationFrame(timer2);
  cancelAnimationFrame(timerID2);
  console.log("Not pressing!");
}

// Runs at 60fps when you are pressing down, function to run counter for 1 sec
function timer() {
  console.log("counter: " + counter);
  if (counter < pressHoldDuration) {
    timerID = requestAnimationFrame(timer);
    counter++;
    x = 1 + counter / 100;
    rect3.style.transform = "scale(" + 1 + ", " + x + ")";
  } else {
    console.log("Press threshold reached!");
   rect3.dispatchEvent(pressHoldEvent);
  }
}

// Runs at 60fps when you are pressing down, function to run reverse counter for 1 sec, then turning off rectangle
function timer2() {
  console.log("counter: " + counter);
  if (counter > 0) {
    timerID2 = requestAnimationFrame(timer2);
    counter--;
    x = 1 + counter / 100;
    rect3.style.transform = "scale(" + 1 + ", " + x + ")";
  } else if ( x === 1 ) {
    console.log("Zero reached!");
    cancelAnimationFrame(timerID);
    rect3.dispatchEvent(pressHoldEvent);
    turnoff();
  }
}

//function to log timer event started
function doSomething(e) {
  console.log("pressHold event fired!");
}