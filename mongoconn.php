<?php

const MONGO_URI = "mongodb://dbAdmin:eCommercesitePW123@localhost:27017";

    require_once ("vendor/autoload.php");

    $mongo = new MongoDB\Client(MONGO_URI);
    $db = $mongo->ecommerceDB;

?>    