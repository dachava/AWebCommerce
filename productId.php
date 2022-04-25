<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    const MONGO_URI = 'mongodb://dbAdmin:eCommercesitePW123@localhost:27017';

    require_once('vendor/autoload.php');
    $mongo = new MongoDB\Client(MONGO_URI);
    $db = $mongo->ecommerceDB;
    $collection = $db->products;
    $prod_id= $_GET['_id']; 

    //Usa findOne por que el iterador no permite cargar un solo elemento
    //Necesita json_encode directo.
    $result = $collection->findOne( 
        ['_id' => new MongoDB\BSON\ObjectID( $prod_id )]
    );

    echo json_encode($result, true);
    
?>
