<?php
    header('Access-Control-Allow-Origin: http://localhost:3000', false);
    const MONGO_URI = 'mongodb://dbAdmin:eCommercesitePW123@localhost:27017';

    require_once('vendor/autoload.php');
    $mongo = new MongoDB\Client(MONGO_URI);
    $db = $mongo->ecommerceDB;
    $collection = $db->products;

    $result = $collection->find();
    echo json_encode(iterator_to_array($result, false), true);

?>
