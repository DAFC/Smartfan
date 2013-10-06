#!/usr/bin/env python
import os
import os.path

os.chdir("/scripts")
if(not os.path.exists("isBot")):
	print "User won't tweet"
	quit()

f = open('../var/www/data/csv', 'r')
data = f.readlines()
f.close()
lastLine = data[-1]#インデックスが負だと後ろから数える
temp = lastLine.split(',')

temperature = temp[0]
humidity = temp[1]
message = "Smartfanが測定した温度は" + temperature +"度、湿度は" + humidity + "％です。"
	
from urllib import urlopen
src = urlopen('http://localhost/tweet.php?tweet=' + message).read()
print src 
