#!/usr/bin/env python
import serial
import time
import csv
import os
import os.path
import re


print "Start Program"
count = 0

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
		
		if(count == 0):
			#タスクがあれば実行する
			if(os.path.isdir("../var/www/task")):		#ロック用フォルダの有無を確認
				task = open('../var/www/task/task.t','r+')
				taskline = task.readlines();			#使うのは1行目のみ
				task.close()
				print "Send to Arduino : " + taskline[0]
				ser.write(taskline[0])					#Arduinoにタスクを転送
				os.remove('../var/www/task/task.txt')
				os.rmdir("../var/www/task")				#ロック用フォルダ削除
			#プログラムがあれば確認する
			else if(os.path.isdir("../var/www/timerTask")):
				timerTaskName = os.list("../var/www/timerTask")[0]			#同時に実行するプログラムは1つ
				unixTime = re.replace(r"(\d+)_.*\.t", r"\1", timerTaskName)	#プログラムの送信時間を取得
				programFile = open(timerTaskName, 'r')
				timerTasks = programFile.readlines()
				programFile.close();
				bufArray = timerTasks[0].split("|");						#[0]:時間 [1]:命令 が入る
				nowTime = time()											#現在の時刻を取得
				if((unixTime+int(bufArray[0])*60)>nowTime):					#時間が過ぎていたら
					print "Send to Arduino(TimerTask): " + bufArray[1]
					ser.write(bufArray[1]);										#Arduinoに当該タスクを転送
					del timerTasks[0]											#転送済みタスクを削除
					programFile = open(timerTaskName, 'w')
					for line in timerTasks:
						programFile.write(line)
					programFile.close()
				if(len(timerTasks) <= 0):									#残りタスクがなければプログラムを削除
					os.remove(timerTaskName)
					os.remove("../var/www/timerTask")
				
			mes = response.split('|')
			
			#送られてきたデータの保存/更新
			if(mes[0] == 'V'):#先頭がVなら有効パケット
				print mes[1]
				if(len(data)>=50):
					del data[0]
				data.append(mes[1])
				
				f = open('../var/www/data.csv','w')		#データファイルに書き込み
				for line in data:
					f.write(line)
				f.close()
		count += 1
		count = count % 100
except KeyboardInterrupt:
	ser.close()