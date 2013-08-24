#!/usr/bin/env python
import serial
import time
import csv
import os
import os.path


print "Start Program"
count = 0

f = open('../var/www/data.csv','r')
data = f.readlines()
f.close()

ser=serial.Serial('/dev/ttyAMA0',9600,timeout=1)
ser.open()
print "connected Arduino"

try:
	while 1:
		response = ser.readline()
		if(count == 0):
			if(os.path.isdir("../var/www/task")):
				task = open('../var/www/task/task.txt','r+')
				taskline = task.readlines();
				print "Send to Arduino : " + taskline[0]
				ser.write(taskline[0])
				task.close()
				os.remove('../var/www/task/task.txt');
				os.rmdir("../var/www/task")
			mes = response.split('|')
			if(mes[0] == 'V'):
				print mes[1]
				if(len(data)>=50):
					del data[0]
				data.append(mes[1])
				f = open('../var/www/data.csv','w')
				for line in data:
					f.write(line)
				f.close()
		count += 1
		count = count % 100
except KeyboardInterrupt:
	ser.close()
	f.close()