/*
  Complete project details: https://RandomNerdTutorials.com/esp8266-nodemcu-https-requests/ 
  Based on the BasicHTTPSClient.ino Created on: 20.08.2018 (ESP8266 examples)
*/

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

unsigned long debounceDelay = 50;   // Délai de rebondissement
unsigned long lastDebounceTime = 0;  // Temps du dernier rebondissement
int defaultPin = 10;
String stringInput = "";

//LED
const int ledPin = D4;  // Broche utilisée pour la LED

//BOUTON 1
const int buttonPin1 = D1;  // Broche utilisée pour le bouton
int buttonState1 = HIGH;   // État du bouton
int lastButtonState1 = HIGH;  // Dernier état du bouton

//BOUTON 2
const int buttonPin2 = D2;  // Broche utilisée pour le bouton
int buttonState2 = HIGH;   // État du bouton
int lastButtonState2 = HIGH;  // Dernier état du bouton

//BOUTON 3
const int buttonPin3 = 14;  // Broche utilisée pour le bouton
int buttonState3 = HIGH;   // État du bouton
int lastButtonState3 = HIGH;  // Dernier état du bouton

//BOUTON 4
const int buttonPin4 = D6;  // Broche utilisée pour le bouton
int buttonState4 = HIGH;   // État du bouton
int lastButtonState4 = HIGH;  // Dernier état du bouton

//BOUTON 5
const int buttonPin5 = D7;  // Broche utilisée pour le bouton
int buttonState5 = HIGH;   // État du bouton
int lastButtonState5 = HIGH;  // Dernier état du bouton

//BOUTON 6
const int buttonPin6 = 3;  // Broche utilisée pour le bouton
int buttonState6 = HIGH;   // État du bouton
int lastButtonState6 = HIGH;  // Dernier état du bouton

//BOUTON 7
const int buttonPin7 = A0;  // Broche utilisée pour le bouton
int buttonState7 = HIGH;   // État du bouton
int lastButtonState7 = HIGH;  // Dernier état du bouton


//Identifiant WIFI
const char* ssid = "iPhone de Mathieu";
const char* password = "1234567890";
//ec2-18-117-154-6.us-east-2.compute.amazonaws.com
//INFO URL REQUETE
const char* host = "ec2-18-117-154-6.us-east-2.compute.amazonaws.com";
const int port = 3000;
String endpoint = "/api/ild/setOneKO?id=";


void sendBDD(int numberInput, bool booleanInput) {

  if(booleanInput){
     stringInput= "true";
  }
  else{
    stringInput= "false";
  }
     
  Serial.print("Bouton ");
  Serial.print(numberInput);
  Serial.println(" actionné");
  defaultPin = numberInput;

  WiFiClient client;

  endpoint = "/api/ild/setOneKO?id=";
  endpoint.concat(String(numberInput));
  //endpoint.concat("&value=");
  //endpoint.concat(stringInput);

  // Envoi de la requête GET
    if (!client.connect(host, port)) {
      Serial.println("Erreur de connexion");
      delay(1000);
      return;
    }

  client.print(String("GET ") + endpoint + " HTTP/1.1\r\n" +
  "Host: " + host + "\r\n" +
  "Connection: close\r\n\r\n");
  client.stop();
}



void setup() {

  pinMode(buttonPin1, INPUT_PULLUP);
  pinMode(buttonPin2, INPUT_PULLUP);
  pinMode(buttonPin3, INPUT_PULLUP);
  pinMode(buttonPin4, INPUT_PULLUP);
  pinMode(buttonPin5, INPUT_PULLUP);
  pinMode(buttonPin6, INPUT_PULLUP);  
  
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);
  
  
  //Serial.begin(115200);

  //Serial.setDebugOutput(true);

  Serial.println();
  Serial.println();
  Serial.println();

  
  //Connect to Wi-Fi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connexion en cours ...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
    Serial.print("\n\nConnecté au WIFI \n");
    digitalWrite(ledPin, LOW);

}

void loop() {
    
  if ((WiFi.status() == WL_CONNECTED)) {
    digitalWrite(ledPin, LOW);
    
      int reading1 = digitalRead(buttonPin1);  // Lecture de l'état actuel du bouton

      if (reading1 != lastButtonState1) {  // Si l'état du bouton a changé
        lastDebounceTime = millis();   // Mettre à jour le temps du dernier rebondissement
      }
      if ((millis() - lastDebounceTime) > debounceDelay) {  // Si le temps écoulé depuis le dernier rebondissement est supérieur au délai de rebondissement
        if (reading1 != buttonState1) {   // Si l'état actuel du bouton est différent de l'état stocké
          buttonState1 = reading1;   // Mettre à jour l'état stocké du bouton
          if (buttonState1 == HIGH) {   // Si le bouton a été enfoncé
            sendBDD(1,false);
          }
        }
      }
      lastButtonState1 = reading1;   // Mettre à jour le dernier état du bouton
 









            int reading2 = digitalRead(buttonPin2);  // Lecture de l'état actuel du bouton

      if (reading2 != lastButtonState2) {  // Si l'état du bouton a changé
        lastDebounceTime = millis();   // Mettre à jour le temps du dernier rebondissement
      }
      if ((millis() - lastDebounceTime) > debounceDelay) {  // Si le temps écoulé depuis le dernier rebondissement est supérieur au délai de rebondissement
        if (reading2 != buttonState2) {   // Si l'état actuel du bouton est différent de l'état stocké
          buttonState2 = reading2;   // Mettre à jour l'état stocké du bouton
          if (buttonState2 == HIGH) {   // Si le bouton a été enfoncé
           sendBDD(2,false);
          }
        }
      }
      lastButtonState2 = reading2;   // Mettre à jour le dernier état du bouton



      int reading3 = digitalRead(buttonPin3);  // Lecture de l'état actuel du bouton

      if (reading3 != lastButtonState3) {  // Si l'état du bouton a changé
        lastDebounceTime = millis();   // Mettre à jour le temps du dernier rebondissement
      }
      if ((millis() - lastDebounceTime) > debounceDelay) {  // Si le temps écoulé depuis le dernier rebondissement est supérieur au délai de rebondissement
        if (reading3 != buttonState3) {   // Si l'état actuel du bouton est différent de l'état stocké
          buttonState3 = reading3;   // Mettre à jour l'état stocké du bouton
          if (buttonState3 == HIGH) {   // Si le bouton a été enfoncé
           sendBDD(3,false);
          }
        }
      }
      lastButtonState3 = reading3;   // Mettre à jour le dernier état du bouton




       int reading4 = digitalRead(buttonPin4);  // Lecture de l'état actuel du bouton

      if (reading4 != lastButtonState4) {  // Si l'état du bouton a changé
        lastDebounceTime = millis();   // Mettre à jour le temps du dernier rebondissement
      }
      if ((millis() - lastDebounceTime) > debounceDelay) {  // Si le temps écoulé depuis le dernier rebondissement est supérieur au délai de rebondissement
        if (reading4 != buttonState4) {   // Si l'état actuel du bouton est différent de l'état stocké
          buttonState4 = reading4;   // Mettre à jour l'état stocké du bouton
          if (buttonState4 == HIGH) {   // Si le bouton a été enfoncé
           sendBDD(4,false);
          }
        }
      }
      lastButtonState4 = reading4;   // Mettre à jour le dernier état du bouton
 





 int reading5 = digitalRead(buttonPin5);  // Lecture de l'état actuel du bouton

      if (reading5 != lastButtonState5) {  // Si l'état du bouton a changé
        lastDebounceTime = millis();   // Mettre à jour le temps du dernier rebondissement
      }
      if ((millis() - lastDebounceTime) > debounceDelay) {  // Si le temps écoulé depuis le dernier rebondissement est supérieur au délai de rebondissement
        if (reading5 != buttonState5) {   // Si l'état actuel du bouton est différent de l'état stocké
          buttonState5 = reading5;   // Mettre à jour l'état stocké du bouton
          if (buttonState5 == HIGH) {   // Si le bouton a été enfoncé
           sendBDD(5,false);
          }
        }
      }
      lastButtonState5 = reading5;   // Mettre à jour le dernier état du bouton



 int reading6 = digitalRead(buttonPin6);  // Lecture de l'état actuel du bouton

      if (reading6 != lastButtonState6) {  // Si l'état du bouton a changé
        lastDebounceTime = millis();   // Mettre à jour le temps du dernier rebondissement
      }
      if ((millis() - lastDebounceTime) > debounceDelay) {  // Si le temps écoulé depuis le dernier rebondissement est supérieur au délai de rebondissement
        if (reading6 != buttonState6) {   // Si l'état actuel du bouton est différent de l'état stocké
          buttonState6 = reading6;   // Mettre à jour l'état stocké du bouton
          if (buttonState6 == HIGH) {   // Si le bouton a été enfoncé
           sendBDD(6,false);
          }
        }
      }
      lastButtonState6 = reading6;   // Mettre à jour le dernier état du bouton

      int reading7 = 0;
      int analogReading = analogRead(buttonPin7);
      if( analogReading <200){
        reading7 = HIGH;
      }
      else{
        reading7 = LOW;
      }
      //int reading7 = digitalRead(buttonPin7);  // Lecture de l'état actuel du bouton

      if (reading7 != lastButtonState7) {  // Si l'état du bouton a changé
        lastDebounceTime = millis();   // Mettre à jour le temps du dernier rebondissement
      }
      if ((millis() - lastDebounceTime) > debounceDelay) {  // Si le temps écoulé depuis le dernier rebondissement est supérieur au délai de rebondissement
        if (reading7 != buttonState7) {   // Si l'état actuel du bouton est différent de l'état stocké
          buttonState7 = reading7;   // Mettre à jour l'état stocké du bouton
          if (buttonState7 == HIGH) {   // Si le bouton a été enfoncé
           sendBDD(7,false);
          }
        }
      }
      lastButtonState7 = reading7;   // Mettre à jour le dernier état du bouton

 
  }
  else{
      digitalWrite(ledPin, HIGH);
  }}