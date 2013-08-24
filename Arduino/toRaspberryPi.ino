#include <string.h>
#include <stdlib.h>

const int MAX = 20;
const char POWER[] = "Power";
const char TEMPERATURE[] = "Temperature";
const char DEGREE[] = "Degree";

double temperature;
double humidity;
String mes;

double t;

char str[MAX];
int ptr;

void setup(){
  Serial.begin(9600);
  ptr = 0;
  
  Serial1.begin(9600);
  temperature = 0.0;
  humidity = 00.0;
  t=0.0;
}

void loop(){
  //read hardware devices value
  temperature += 0.1;
  humidity += 0.2;
  t += 0.001;
  
  
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
        Serial.println("Smartfan set power:" + DoubleToString(param) + "%");
      }else if(strcmp(code, TEMPERATURE) == 0){
        Serial.println("Smartfan set temperature:" + DoubleToString(param) + "C");
      }else if(strcmp(code, DEGREE) == 0){
        Serial.println("Smartfan set degree:" + DoubleToString(param) + "deg"); 
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
  mes += DoubleToString(sin(t)) + "," + DoubleToString(cos(t)) + ",";
  Serial1.println(mes);
}

String DoubleToString(double number){
  String result = String((int)number) + '.' + String(((int)(abs(number)*10))%10);
  return result;
}
