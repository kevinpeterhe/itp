//colors
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

let rect1;
let timerID;
let counter = 0;

let pressHoldEvent = new CustomEvent("pressHold");

// Increase or decreae value to adjust how long
// one should keep pressing down before the pressHold
// event fires
let pressHoldDuration = 100;

// let item = document.getElementById("rect3");
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


function serialEvent() {
  // read a line of incoming data:
  var inData = serial.readLine();
  // if the line is not empty, parse it to JSON:
  if (inData) {
    var sensors = JSON.parse(inData);
    // button value:
    // if the button's changed and it's pressed, take action:
    if (sensors.led1 !== lastButtonState1) {
      if (sensors.led1 === 1) {
        setPowerState1(sensors.led1);
        // bg.style.backgroundColor = color1;
        document.getElementById("rect1").style.backgroundColor = color1;
        document.getElementById("rect1").style.visibility = "visible";
      }
      if (sensors.led1 === 0) {
        setPowerState1(sensors.led1);
        document.getElementById("rect1").style.backgroundColor = color0;
        document.getElementById("rect1").style.visibility = "hidden";
      }
      // save button value for next time:
      lastButtonState1 = sensors.led1;
    }
    // if the button's changed and it's pressed, take action:
    if (sensors.led2 !== lastButtonState2) {
      if (sensors.led2 === 1) {
        setPowerState2(sensors.led2);
        document.getElementById("rect2").style.backgroundColor = color2;
        document.getElementById("rect2").style.visibility = "visible";
      }
      if (sensors.led2 === 0) {
        setPowerState2(sensors.led2);
        document.getElementById("rect2").style.backgroundColor = color1;
        document.getElementById("rect2").style.visibility = "hidden";
      }
      // save button value for next time:
      lastButtonState2 = sensors.led2;
    }
      // if the button's changed and it's pressed, take action:
      if (sensors.led3 !== lastButtonState3) {
        if (sensors.led3 === 1) {
          setPowerState3(sensors.led3);
          document.getElementById("rect3").style.backgroundColor = color3;
          document.getElementById("rect3").style.visibility = "visible";
          pressingDown();
          doSomething();
        }
        // if (sensors.pressed === 0) {
        //   setPowerState3(sensors.led3);
        //   document.getElementById("rect3").style.backgroundColor = color2;
        //   document.getElementById("rect3").style.visibility = "hidden";
        //   // document.getElementById("rect3").addEventListener("mouseup", notPressingDown, false);
        //   // document.getElementById("rect3").addEventListener("mouseleave", notPressingDown, false);
        //   serial.write('h');
        // }
        // save button value for next time:
        lastButtonState3 = sensors.led3;
      }
      console.log("sensors" + sensors.pressed);
      if (sensors.pressed === 0) {
        // pressingDown();

        notPressingDown();
        setPowerState3(sensors.led3);
      }

    // fan slider value:
    // setFanSpeed(sensors.knob);
  }
}

// add a listener for the page to load:
window.addEventListener('DOMContentLoaded', setup);


function turnoff() {

  document.getElementById("rect3").style.backgroundColor = color2;
  document.getElementById("rect3").style.visibility = "hidden";
  serial.write('h\n');
}

function pressingDown(e) {
  // Start the timer
  requestAnimationFrame(timer);

  // e.preventDefault();

  console.log("Pressing!");
}

function notPressingDown(e) {
  // // Stop the timer
  // cancelAnimationFrame(timerID);
  // counter = 0;

  // rect3.style.transform = "scale(" + 1 + ", " + 1 + ")";
  requestAnimationFrame(timer2);

  // timerID = requestAnimationFrame(timer);
  // // console.log("falling timerID" + timerID);
  // counter--;
  // // console.log("falling counter" + counter);
  // x = 2 - counter / 100;
  // rect3.style.transform = "scale(" + 1 + ", " + x + ")";

  cancelAnimationFrame(timerID2);
  // counter = 0;
  console.log("Not pressing!");
}

//
// Runs at 60fps when you are pressing down
//
function timer() {
  console.log("counter: " + counter);

  if (counter < pressHoldDuration) {
    timerID = requestAnimationFrame(timer);
    // console.log(timerID);
    counter++;

    x = 1 + counter / 100;
    // console.log("rising counter" + x);
    rect3.style.transform = "scale(" + 1 + ", " + x + ")";
  } else {
    console.log("Press threshold reached!");
   rect3.dispatchEvent(pressHoldEvent);
  }
}

function timer2() {
  console.log("counter: " + counter);

  if (counter > 0) {
    timerID2 = requestAnimationFrame(timer2);
    // console.log(timerID);
    counter--;

    x = 1 + counter / 100;
    console.log("x Val: " + x);
    rect3.style.transform = "scale(" + 1 + ", " + x + ")";
  } else if ( x === 1 ) {
    console.log("Zero reached!");
    cancelAnimationFrame(timerID);
    rect3.dispatchEvent(pressHoldEvent);
    turnoff();
  }
}

function doSomething(e) {
  console.log("pressHold event fired!");
}

// let scale = 1 + counter / 100;
// rect3.style.transform = "scale(" + 1 + ", " + scale + ")";
