#!/usr/bin/env python
import os
import os.path
import glob
import shutil

#Clean
for jpgFile in glob.glob("/scripts/pict/*.jpg"):
	if(not jpgFile.endswith("lastscan.jpg")):
		os.remove(jpgFile);

os.chdir("/scripts")
if(not os.path.exists("isCamera")):
	print "User won't take photo"
	quit()

os.chdir("./pict")
if(not os.path.exists("./lastscan.jpg")):
	print "no picture"
	quit()

time = srfptime("%Y%m%d%H%M", localtime())
os.rename("./lastscan.jpg", time + ".jpg")
shutil.move(time + ".jpg", "../../var/www/pict/")