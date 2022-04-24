<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    const MONGO_URI = 'mongodb://dbAdmin:eCommercesitePW123@localhost:27017';

    require_once('vendor/autoload.php');
    $mongo = new MongoDB\Client(MONGO_URI);
    $db = $mongo->ecommerceDB;
    $collection = $db->products;
    $prod_slug= $_GET['slug']; 

    $result = $collection->find(
            [
               'slug' => $prod_slug
            ]
    );
    echo json_encode($result);

?>
