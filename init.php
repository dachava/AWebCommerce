<?php
use MongoDB\Operation\InsertOne;
use \Sokil\Mongo\Client;
const MONGO_URI = "mongodb://dbAdmin:eCommercesitePW123@localhost:27017";

    function valida(){
    require_once ("vendor/autoload.php");

    $mongo = new MongoDB\Client(MONGO_URI);
    $db = $mongo->ecommerceDB;
    $collection = $db->users;

    $email = $collection->findOne( 
            [
                'email' => "jdoe@mail.com"
            ]
        );
    return $email['password'];

        // if($email):
        //     $email[2];
        //     if(password_verify("secure", $email[2])){}
        // else:
        //     return "false";
        // endif; 
    }


    // // $collection->InsertOne([
    // //     'name'=>"John Doe",
    // //     'email'=>"jdoe@mail.com",
    // //     'password'=>password_hash("secure", PASSWORD_DEFAULT),
    // //     'isAdmin'=>false
    // // ]);

    // $collection = $db->products;

    // $date = new DateTime();
    // $timestamp = $date->getTimestamp();    

    // $collection->InsertMany([
    //     [
    //         'name'=>"Scars on Broadway",
    //         'slug'=>"scars-on-broadway",
    //         'image'=>"/images/p1.jpg",
    //         'brand'=>"Amoeba Music",
    //         'category'=>"CD",
    //         'description'=>"Simple description",
    //         'price'=>120,
    //         'stockCount'=>10,
    //         'rating'=>5,
    //         'numReviews'=>10,
    //         'createdAt'=>$timestamp,
    //         'updatedAt'=>$timestamp
    //     ],

    //     [
    //         'name'=>"Start a War",
    //         'slug'=>"staticx-start-awar",
    //         'image'=>"/images/p2.jpg",
    //         'brand'=>"Static-X",
    //         'category'=>"CD",
    //         'description'=>"Un clasico del Metal Industrial y la nueva ola de Nu Metal",
    //         'price'=>100,
    //         'stockCount'=>8,
    //         'rating'=>4.4,
    //         'numReviews'=>10,
    //         'createdAt'=>$timestamp,
    //         'updatedAt'=>$timestamp
    //     ],

    //     [
    //         'name'=>"Coming Home",
    //         'slug'=>"pain-cominghome",
    //         'image'=>"/images/p3.jpg",
    //         'brand'=>"Pain",
    //         'category'=>"Vinyl",
    //         'description'=>"¡Peter Tagtgren vuelve con su proyecto solista Pain... y con melodías mas fuertes que nunca!",
    //         'price'=>150,
    //         'stockCount'=>5,
    //         'rating'=>4.8,
    //         'numReviews'=>10,
    //         'createdAt'=>$timestamp,
    //         'updatedAt'=>$timestamp
    //     ],

    //     [
    //         'name'=>"Worship",
    //         'slug'=>"hypocrisy-worship-box",
    //         'image'=>"/images/p4.jpg",
    //         'brand'=>"Hypocrisy",
    //         'category'=>"Boxset",
    //         'description'=>"Los maestros del death sueco vuelven con una invasión de metal que te transportará a otra galaxia.",
    //         'price'=>300,
    //         'stockCount'=>4,
    //         'rating'=>4.8,
    //         'numReviews'=>10,
    //         'createdAt'=>$timestamp,
    //         'updatedAt'=>$timestamp
    //     ]   
    // ]);

    echo valida();
    //  echo json_encode($result, true);


?>