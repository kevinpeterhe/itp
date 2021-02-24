//import libraries
#include <Arduino_JSON.h>
#include <ezButton.h>

//variables for led pins
int ledPin3 = 3;
int ledPin2 = 5;
int ledPin1 = 6;
int val = 1;
//variables for time thresholds
const int PRESS_TIME_1  = 1000; 
const int PRESS_TIME_2  = 2000; 
const int PRESS_TIME_3  = 3000; 

// create ezButton object that attach to pin 7;
ezButton button(7);

//variables for button states
unsigned long pressedTime  = 0;
unsigned long releasedTime = 0;
bool isPressing = false;
bool is1Detected = false;
bool is2Detected = false;
bool is3Detected = false;

// variables to hold previous led states:
int ledState1 = LOW;
int ledState2 = LOW;
int ledState3 = LOW;
int lastledState1 = LOW;
int lastledState2 = LOW;
int lastledState3 = LOW;

//variables for serial handshake
String handshake;
int h;

// if the inputs have changed:
bool inputsChanged = false;
// a JSON object to hold the data to send:
JSONVar outgoing;

void setup() {
  Serial.begin(9600);
  button.setDebounceTime(50); // set debounce time to 50 milliseconds
  pinMode(ledPin1, OUTPUT);  // declare LED as output
  pinMode(ledPin2, OUTPUT);  // declare LED as output
  pinMode(ledPin3, OUTPUT);  // declare LED as output

  // initialize values in JSON object:
  outgoing["pressed"] = 1;
  outgoing["led1"] = 0;
  outgoing["led2"] = 0;
  outgoing["led3"] = 0;
}

void loop(){
  button.loop(); // MUST call the loop() function first

  //button pressed down
  if(button.isPressed()){
    outgoing["pressed"] = 1;
    pressedTime = millis();
    isPressing = true;
    is1Detected = false;
    is2Detected = false;
    is3Detected = false;
  }

  //button is released
  if(button.isReleased()) {
    outgoing["pressed"] = 0;
    Serial.println(outgoing);
    //if detect serial data from HTML
    if (Serial.available() > 0) {
      handshake  = Serial.readStringUntil('\n');
      if (handshake = 'h') {
    //TURN OFF LEDs
        delay(2000);
        digitalWrite(ledPin3, LOW);  // turn LED OFF
        ledState3 = LOW;
        check();
        send();
        delay(1000);
        digitalWrite(ledPin2, LOW);
        ledState2 = LOW;
        check();
        send();
        delay(1000);
        digitalWrite(ledPin1, LOW);
        ledState1 = LOW;
        check();
        send();
      }
    }
    isPressing = false;
    releasedTime = millis();
    long pressDuration = releasedTime - pressedTime;
    //if press time is shorter than 1 second, no LEDs are turned on
    if( pressDuration < PRESS_TIME_1) {
      Serial.println("Button was pressed for less than 1 second");
    }
  }

  if(isPressing == true && is1Detected == false) {
    long pressDuration = millis() - pressedTime;
    // if press duration is between 1 and 2 seconds
    if( pressDuration >= PRESS_TIME_1 && pressDuration < PRESS_TIME_2) {
      //turn on LED1
      digitalWrite(ledPin1, HIGH);
      ledState1 = HIGH;
      check();
      send();
//      Serial.println("Button was pressed for more than 1 second");
      is1Detected = true;
    }
  }
  // if press duration is between 2 and 3 seconds
  if(isPressing == true && is2Detected == false) { 
    long pressDuration = millis() - pressedTime;
    
    if( pressDuration >= PRESS_TIME_2 && pressDuration < PRESS_TIME_3) {
      //turn on LED2
      digitalWrite(ledPin2, HIGH);
      ledState2 = HIGH;
      check();
      send();
//      Serial.println("Button was pressed for more than 2 seconds");
      is2Detected = true;
    }
  }
  // if press duration is longer than 3 seconds
  if(isPressing == true && is3Detected == false) {
    long pressDuration = millis() - pressedTime;
    if( pressDuration > PRESS_TIME_3 ) {
      //turn on LED3
      digitalWrite(ledPin3, HIGH);
      ledState3 = HIGH;
      check();
      send();
//      Serial.println("Button was pressed for more than 3 seconds");
      is3Detected = true;
    }
  }
}

//function to check LED state
void check(){
  // if the led state has changed:
  if (ledState3 != lastledState3) {
    outgoing["led3"] = ledState3;
    // save led state state for comparison next time:
    lastledState3 = ledState3;
    // set change flag so serial will send:
    inputsChanged = true;
  }
  if (ledState2 != lastledState2) {
    outgoing["led2"] = ledState2;
    // save led state for comparison next time:
    lastledState2 = ledState2;
    // set change flag so serial will send:
    inputsChanged = true;
  }
  if (ledState1 != lastledState1) {
    outgoing["led1"] = ledState1;
    // save led state for comparison next time:
    lastledState1 = ledState1;
    // set change flag so serial will send:
    inputsChanged = true;
  }
}

// if the LED has been lit, send it:
void send(){
  if (inputsChanged) {
    Serial.println(outgoing);
    // clear the change flag:
    inputsChanged = false;
  }
}