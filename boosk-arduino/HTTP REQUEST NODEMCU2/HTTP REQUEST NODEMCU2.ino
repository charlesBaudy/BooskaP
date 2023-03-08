/*
  Complete project details: https://RandomNerdTutorials.com/esp8266-nodemcu-https-requests/ 
  Based on the BasicHTTPSClient.ino Created on: 20.08.2018 (ESP8266 examples)
*/

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <ArduinoJson.h>

#define LED_0_G D1
#define LED_0_R D2

#define LED_1_G D3
#define LED_1_R D4

#define LED_2_G D5
#define LED_2_R D6

#define LED_3_G D7
#define LED_3_R D8


// Replace with your network credentials
const char* ssid = "iPhone de Mathieu";
const char* password = "1234567890";

void setup() {

  pinMode(LED_0_G, OUTPUT);
  pinMode(LED_0_R, OUTPUT);

  pinMode(LED_1_G, OUTPUT);
  pinMode(LED_1_R, OUTPUT);

  pinMode(LED_2_G, OUTPUT);
  pinMode(LED_2_R, OUTPUT);
  
  pinMode(LED_3_G, OUTPUT);
  pinMode(LED_3_R, OUTPUT);


  digitalWrite(LED_0_G, LOW);
  digitalWrite(LED_0_R, LOW); 

  digitalWrite(LED_1_G, LOW);
  digitalWrite(LED_1_R, LOW);
  
  digitalWrite(LED_2_G, LOW);
  digitalWrite(LED_2_R, LOW);

  Serial.begin(115200);
  //Serial.setDebugOutput(true);

  Serial.println();
  Serial.println();
  Serial.println();

  //Connect to Wi-Fi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
}

void loop() {
  // wait for WiFi connection

  if ((WiFi.status() == WL_CONNECTED)) {

    Serial.print("\n HTTP GET requête envoyée \n");

    WiFiClient client;
    HTTPClient http;


//ec2-18-117-154-6.us-east-2.compute.amazonaws.com

http.useHTTP10(true);
http.begin(client, "http://ec2-18-117-154-6.us-east-2.compute.amazonaws.com:3000/api/ild/getAll");
http.GET();

// Parse response
DynamicJsonDocument doc(2048);
deserializeJson(doc, http.getStream());

// Read values
for(int i = 0; i < 9; i++){
  Serial.print("LED");
  Serial.print(i);
 //Serial.print(" " + doc[i]["ok"].as<String>()); // true ou false, ce qui recupère de la bdd

  if(doc[i]["ok"].as<String>() == "true")
    Serial.println(" VERT" );
  else
    Serial.println(" ROUGE" );
}



//LED 0
if(doc[4]["ok"].as<String>() == "true"){
digitalWrite(LED_0_G, HIGH);
digitalWrite(LED_0_R, LOW); 
}
else{
digitalWrite(LED_0_G, LOW); 
digitalWrite(LED_0_R, HIGH); 
}

//LED 1
if(doc[5]["ok"].as<String>() == "true"){
digitalWrite(LED_1_G, HIGH);
digitalWrite(LED_1_R, LOW); 
}
else{
digitalWrite(LED_1_G, LOW); 
digitalWrite(LED_1_R, HIGH); 
}

//LED 2
if(doc[6]["ok"].as<String>() == "true"){
digitalWrite(LED_2_G, HIGH);
digitalWrite(LED_2_R, LOW); 
}
else{
digitalWrite(LED_2_G, LOW); 
digitalWrite(LED_2_R, HIGH); 
}

//LED 3
if(doc[7]["ok"].as<String>() == "true"){
digitalWrite(LED_3_G, HIGH);
digitalWrite(LED_3_R, LOW); 
}
else{
digitalWrite(LED_3_G, LOW); 
digitalWrite(LED_3_R, HIGH); 
}

// Disconnect
http.end();
  Serial.println();
  Serial.println("Attente de 1 sec avant la prochaine requête...");
  delay(2000);
  }}