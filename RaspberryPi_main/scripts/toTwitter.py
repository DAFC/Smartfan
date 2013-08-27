#!/usr/bin/env python
import os.path
import http.client

argvs = sys.argv
argc = len(argvs)
if(argc != 2):
	print 'Usage: # python toTwitter.py message'
	quit()

if(!os.path.exists("isBot"))
	print "User won't tweet"
	quit()

conn = htto.client.HTTPConnection('localhost/twitter.php?tweet=' + argv[1])
conn.request("GET", "/")
res = conn.getresponse()
if(res.status == "200")
	print "Success tweet: " + argv[1]
else
	print "Fail tweet: " + argv[1]
conn.close()