<link rel="icon" href="favicon.png" />
<?php
  $ua=$_SERVER['HTTP_USER_AGENT'];
  $browser = ((strpos($ua,'iPhone')!==false)||(strpos($ua,'iPad')!==false)||(strpos($ua,'iPod')!==false)||(strpos($ua,'Android')!==false)||(strpos($ua,(strpos($ua,'Windows Phone')!==false))));
    if ($browser == true){
    $browser = 'sp';
  }
?>
<?php //if(true){ ?>
<?php if($browser == 'sp'){ ?>
    <link rel="stylesheet" type="text/css" href="phone.css"/>
<?php }else{ ?>
    <link rel="stylesheet" type="text/css" href="pc.css" />
<?php } ?>