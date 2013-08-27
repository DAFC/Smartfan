#include <string.h>
#include <stdlib.h>

#include <SHT1x.h>
#define dataPin 50
#define clockPin 48
SHT1x sht1x(dataPin, clockPin);

const int MAX = 20;
const char POWER[] = "Power";
const char TEMPERATURE[] = "Temperature";
const char DEGREE[] = "Degree";
const char SWING[] = "Swing";
const char SWITCH[] = "Switch";

double temperature;
double humidity;
String mes;

//double t;  //test

char str[MAX];
int ptr;

void setup(){
  Serial.begin(9600);
  ptr = 0;
  
  Serial1.begin(9600);
  temperature = 0.0;
  humidity = 00.0;
  //t = 0.0;
}

void loop(){
  //read hardware devices value
  temperature = sht1x.readTemperatureC();
  humidity = sht1x.readHumidity();
  
  //t += 0.001;  //test
  
  
  if(Serial1.available() > 0){
    char c;
    char *code;
    double param;
    c = Serial1.read();
    //Serial.println(c);
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
      
      //from raspberry pi
      if(strcmp(code, POWER) == 0){
        if(param < 0){
          //rhythm
          Serial.println("Smartfan set rhythmical wind");
        }else{
          //0 - 100
          Serial.println("Smartfan set wind power:" + DoubleToString(param) + "%");
        }
      }else if(strcmp(code, TEMPERATURE) == 0){
        //to air conditioner
        Serial.println("Smartfan set temperature:" + DoubleToString(param) + "C");
      }else if(strcmp(code, DEGREE) == 0){
        Serial.println("Smartfan set degree:" + DoubleToString(param) + "deg"); 
      }else if(strcmp(code, SWING) == 0){
        //swing option
        boolean isSwingOn = (param != 0);
        Serial.println("Smartfan set swing:" + String((isSwingOn) ? "On" : "Off"));
      }else if(strcmp(code, SWITCH) == 0){
        //power on switch
        boolean isSwitchOn = (param != 0);
        Serial.println("Smartfan set switch:" + String((isSwitchOn) ? "On" : "Off"));
      }else if(strcmp(code, "test") == 0){
        Serial.println("test");
      }
      
      ptr = 0;
      for(int i=0; i < MAX; i++){
        str[i] = '\0';
      }
    }
  }
  
  mes = "V|";
  mes += DoubleToString(temperature) + "," + DoubleToString(humidity) + ",";
  Serial1.println(mes);
  //Serial.println(mes);
}

String DoubleToString(double number){
  String result = String((int)number) + '.' + String(((int)(abs(number)*10))%10);
  return result;
}
