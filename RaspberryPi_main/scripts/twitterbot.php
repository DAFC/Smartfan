<?php
	if(!array_key_exists("tweet", $_GET)){
		die('error');
	}
	$tweet = $_GET["tweet"];
	
	require_once 'twitteroauth.php';
	
	$consumer_key		="6Iicikyow7SzhkVXFNtGmg";
	$consumer_secret	="xtxzi0hWDwIxYUXkFFIUIYMxB9MbFcCid28DNUM8";
	$oauth_token		="1612639716-bL0Vhd5CYGL0FyTVbMBCLa6LXT8WZqOli2b2Hfc";
	$oauth_token_secret	="eMPAt1alUFVW1So7kOB4AOCQa2f12neJ4R7OJqKvzg";
	$oauth = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_token, $oauth_token_secret);
	
	$reaponse = $oauth->post('statuses/update', array("status" => $tweet));
	
	$httpCode = $oauth->http_info["http_code"];
	
	if($httpCode == "200"){
		print "ok<br />";
		print 'tweet : ' . $tweet;
	}else {
		print 'NG<br />';
		print 'httpcode = ' . $httpCode;
	}
?>