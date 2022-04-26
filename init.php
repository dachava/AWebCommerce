<?php
use MongoDB\Operation\InsertOne;
const MONGO_URI = "mongodb://dbAdmin:eCommercesitePW123@localhost:27017";

    require_once ("vendor/autoload.php");

    $mongo = new MongoDB\Client(MONGO_URI);
    $db = $mongo->ecommerceDB;
//     $collection = $db->users;

//     $email = $collection->findOne( 
//             [
//                 'email' => "jdoe@mail.com"
//             ]
//         );
//         var_dump($email);
        

        // if($email):
        //     $email[2];
        //     if(password_verify("secure", $email[2])){}
        // else:
        //     return "false";
        // endif; 
    


    // $collection->InsertOne([
    //     'name'=>"John Doe",
    //     'email'=>"jdoe@mail.com",
    //     'password'=>password_hash("secure", PASSWORD_DEFAULT),
    //     'isAdmin'=>false
    // ]);
    // var_dump($collection);

    $collection = $db->products;

    $date = new DateTime();
    $timestamp = $date->getTimestamp();    

    $collection->InsertMany([
        [
            'name'=>"Stadium Arcadium",
            'slug'=>"stadium-arcadium",
            'image'=>"/images/p5.jpg",
            'brand'=>"Amoeba Music",
            'category'=>"CD",
            'description'=>"Red Hot Chili Peppers",
            'price'=>130,
            'stockCount'=>8,
            'rating'=>5,
            'numReviews'=>20,
            'createdAt'=>$timestamp,
            'updatedAt'=>$timestamp
        ],

        [
            'name'=>"A Beautiful Lie",
            'slug'=>"a-beautiful-lie",
            'image'=>"/images/p6.jpg",
            'brand'=>"30 Seconds To Mars",
            'category'=>"CD",
            'description'=>"30 Seconds to Mars",
            'price'=>80,
            'stockCount'=>0,
            'rating'=>4,
            'numReviews'=>1,
            'createdAt'=>$timestamp,
            'updatedAt'=>$timestamp
        ],

        [
            'name'=>"Breeding the Spawn",
            'slug'=>"suffocation-breeding",
            'image'=>"/images/p7.jpg",
            'brand'=>"Suffocation",
            'category'=>"Vinyl",
            'description'=>"Suffocation - Breeding the Spawn Gatefold",
            'price'=>200,
            'stockCount'=>5,
            'rating'=>4.8,
            'numReviews'=>6,
            'createdAt'=>$timestamp,
            'updatedAt'=>$timestamp
        ],

        [
            'name'=>"Maiden Japan",
            'slug'=>"maiden-japan",
            'image'=>"/images/p8.jpg",
            'brand'=>"Iron Maiden",
            'category'=>"Boxset",
            'description'=>"Iron Maiden - Maiden Japan",
            'price'=>666,
            'stockCount'=>5,
            'rating'=>5,
            'numReviews'=>666,
            'createdAt'=>$timestamp,
            'updatedAt'=>$timestamp
        ]   
    ]);
    echo var_dump($collection)

?>