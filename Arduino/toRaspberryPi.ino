#include <string.h>
#include <stdlib.h>

#include <SHT1x.h>
#define dataPin 50
#define clockPin 48

/*
#define FAN_D 2  //1
#define FAN_R 3  //1
#define YAW_D 5  //2
#define YAW_R 4  //2
#define PITCH_D 7//3
#define PITCH_R 6//3
*/
#define FAN_D 2
#define FAN_R 3
#define PITCH_D 5
#define PITCH_R 4
#define YAW_D 7
#define YAW_R 6

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
  
  pinMode(FAN_D, OUTPUT);
  pinMode(FAN_R, OUTPUT);
  pinMode(PITCH_D, OUTPUT);
  pinMode(PITCH_R, OUTPUT);
  pinMode(YAW_D, OUTPUT);
  pinMode(YAW_R, OUTPUT);
}

void loop(){
  //read hardware devices value
  if(0 == (millis()/1000)%60){
    Serial1.end();
    temperature = sht1x.readTemperatureC();
    humidity = sht1x.readHumidity();
    Serial1.begin(9600);
    Serial.println(temperature);
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
  
  if(power >= -0.1 && 100.1>=power){
    analogWrite(FAN_D, power*2.25);
  }else if(power == -1){
    float t = (float)millis();
    float value = 0.0;
    int div = 5;
    for(int i = 0; i < div; i++){
      value += sin(t * pow(2, i) / 20000.0) / pow(2,i);
    }
    analogWrite(FAN_D, ((value * value)*0.75 + 0.25) * 255);
    analogWrite(FAN_R, 0);
  }else{
    analogWrite(FAN_D, 0);
    analogWrite(FAN_R, 0);
  }
  
  /*
  if(isSwingOn == true){
    float a =sin((float)millis()/1000.0);
    analogWrite(PITCH_D, ((a * a > 0.6)?80:0));
    analogWrite(PITCH_R, ((a * a < 0.49)?80:0));
    //analogWrite(PITCH_R, 80);
  }else{
    analogWrite(PITCH_D, 0);
    analogWrite(PITCH_R, 0);
  }
  */
  
  
  if(isSwitchOn == true && isSwingOn == true){
    float t =sin((float)millis()/2000.0);
    analogWrite(YAW_D, ((t * t > 0.8)?255:0));
    analogWrite(YAW_R, ((t * t < 0.2)?255:0));
    analogWrite(PITCH_D, ((t * t > 0.8)?255:0));
    analogWrite(PITCH_R, ((t * t < 0.2)?255:0));
  }else{
    analogWrite(PITCH_D, 0);
    analogWrite(PITCH_R, 0);
    analogWrite(YAW_D, 0);
    analogWrite(YAW_R, 0);
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
