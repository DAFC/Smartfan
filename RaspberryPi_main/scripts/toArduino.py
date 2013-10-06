#!/usr/bin/env python
import serial
import time
import csv
import os
import os.path
import re


print "Start Program"
is0 = False

#温湿度データ読み込み
f = open('../var/www/data.csv','r')
data = f.readlines()
f.close()

#シリアルポート準備
ser=serial.Serial('/dev/ttyAMA0',9600,timeout=1)
ser.open()
print "connected Arduino"

try:
	while 1:
		response = ser.readline()#データ取得
		
		#タスクがあれば実行する
		if(os.path.isdir("../var/www/task") and os.path.exists("../var/www/task/task.t")):		#ロック用フォルダの有無を確認
			task = open("../var/www/task/task.t",'r+')
			taskline = task.readlines()				#使うのは1行目のみ
			task.close()
			if(len(taskline) > 0 and taskline[0] != None):
				print "Send to Arduino : " + taskline[0]
				ser.write(taskline[0])				#Arduinoにタスクを転送
			os.remove("../var/www/task/task.t")
			os.rmdir("../var/www/task")				#ロック用フォルダ削除
		#プログラムがあれば確認する
		elif(os.path.isdir("../var/www/timerTask") and (len(os.listdir("../var/www/timerTask")))==1):
			timerTaskName = os.listdir("../var/www/timerTask")[0]		#同時に実行するプログラムは1つ
			unixTime = re.sub(r"(\d+)_.*\.t", r"\1", timerTaskName)	#プログラムの送信時間を取得
			timerTaskName = "../var/www/timerTask/" + timerTaskName
			programFile = open(timerTaskName, 'r')
			timerTasks = programFile.readlines()
			programFile.close();
			bufArray = timerTasks[0].split("|");						#[0]:時間 [1]:命令 が入る
			nowTime = time.time()											#現在の時刻を取得
			taskTime = int(unixTime)+int(bufArray[0])*60
			#print "task:" + str(taskTime) + "\tnow:" + str(int(nowTime)) + "\t" + str(taskTime<int(nowTime))
			if(taskTime < int(nowTime)):					#時間が過ぎていたら
				print "Send to Arduino(TimerTask): " + bufArray[1]
				ser.write(bufArray[1]);										#Arduinoに当該タスクを転送
				del timerTasks[0]											#転送済みタスクを削除
				programFile = open(timerTaskName, 'w')
				for line in timerTasks:
					programFile.write(line)
				programFile.close()
			if(len(timerTasks) <= 0):									#残りタスクがなければプログラムを削除
				print "end of timerTask"
				os.remove(timerTaskName)
				os.rmdir("../var/www/timerTask")
		
		if(is0 and ((int(time.time())%60)==0)):
			mes = response.split('|')
			
			#送られてきたデータの保存/更新
			if(mes[0] == 'V' and len(mes[1].split(',')) >= 6):#先頭がVで要素数が6以上なら有効パケット
				print mes[1]
				if(len(data)>=100):
					del data[0]
				data.append(mes[1])
				
				f = open('../var/www/data.csv','w')		#データファイルに書き込み
				for line in data:
					f.write(line)
				f.close()
			is0 = False
		
		is0 = (int(time.time())%60 != 0)
except KeyboardInterrupt:
	ser.close()