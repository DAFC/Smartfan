#include <string.h>
#include <stdlib.h>

#include <SHT1x.h>
#define dataPin 50
#define clockPin 48
SHT1x sht1x(dataPin, clockPin);

const int MAX = 20;
const char POWER[] = "Power";
const char TEMPERATURE[] = "Temperature";
const char SWING[] = "Swing";
const char SWITCH[] = "Switch";

double temperature;
double humidity;
String mes;

//double t;  //test

char str[MAX];
int ptr;

boolean isSwitchOn = false;
double power = 0.0;
boolean isSwingOn = false;
double temperatureSetting = 28.0;

void setup(){
  Serial.begin(9600);
  ptr = 0;
  
  Serial1.begin(9600);
  temperature = 0.0;
  humidity = 00.0;
}

void loop(){
  //read hardware devices value
  if(0 == (millis()/1000)%60){
    Serial1.end();
    temperature = sht1x.readTemperatureC();
    humidity = sht1x.readHumidity();
    Serial1.begin(9600);
  }
  
  //recieving piece of code form RaspberryPi
  if(Serial1.available() > 0){
    char c;
    char *code;
    double param;
    c = Serial1.read();
    if(c != '\n'){
      str[ptr] = c;
      ptr++;
    }
    if(c == ';'){
      Serial.println(str);
      code = strtok(str, " ");
      if(code[0] == '\r'){
        code++;
      }
      param = atof(strtok(NULL, ";"));
      Serial.println("Code : " + String(code));
      Serial.println("Parameter : " + DoubleToString(param));
      
      //code from raspberry pi
      if(strcmp(code, POWER) == 0){
        if(param < 0){
          //rhythm
          power = -1.0;
          Serial.println("Smartfan set rhythmical wind");
        }else{
          //0 - 100
          power = param;
          Serial.println("Smartfan set wind power:" + DoubleToString(param) + "%");
        }
      }else if(strcmp(code, TEMPERATURE) == 0){
        //to air conditioner
        temperatureSetting = param;
        Serial.println("Smartfan set temperature:" + DoubleToString(param) + "C");
      }else if(strcmp(code, SWING) == 0){
        //swing option
        isSwingOn = (param != 0);
        Serial.println("Smartfan set swing:" + BooleanToString(isSwingOn));
      }else if(strcmp(code, SWITCH) == 0){
        //power on switch
        isSwitchOn = (param != 0);
        Serial.println("Smartfan set switch:" + BooleanToString(isSwitchOn));
      }
      
      //reset code buffer
      ptr = 0;
      for(int i=0; i < MAX; i++){
        str[i] = '\0';
      }
    }
  }
  
  mes = "V|";
  mes += DoubleToString(temperature) + "," + DoubleToString(humidity) + ",";
  mes += BooleanToString(isSwitchOn) + "," + DoubleToString(power) + ",";
  mes += BooleanToString(isSwingOn)  + "," + DoubleToString(temperatureSetting) + ",";
  
  //Send to RaspberryPi
  Serial1.println(mes);
}

//0->00.0
String DoubleToString(double number){
  String result = String((int)number) + '.' + String(((int)(abs(number)*10))%10);
  return result;
}

//true->"On" false->"Off"
String BooleanToString(boolean isOn){
  String result = isOn ? "On" : "Off";
  return result;
}

//true->"1" false->"0"
String BooleanToNumberString(boolean isOn){
  String result = isOn ? "1" : "0";
  return result;
}
