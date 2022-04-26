<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    require_once('mongoconn.php'); 

    $collection = $db->orders;
    $orderId= $_GET['orderId']; 
    //Usa findOne por que el iterador no permite cargar un solo elemento
    //Necesita json_encode directo.
    $result = $collection->findOne( 
        ['_id' => new MongoDB\BSON\ObjectID( $orderId )]
    );

    echo json_encode($result, true);
    
?>
