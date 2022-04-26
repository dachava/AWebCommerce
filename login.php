<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: *");

require __DIR__.'/JwtHandler.php';

function msg($success,$status,$message,$extra = []){
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message
    ],$extra);
}

const MONGO_URI = 'mongodb://dbAdmin:eCommercesitePW123@localhost:27017';

require_once('vendor/autoload.php');
$mongo = new MongoDB\Client(MONGO_URI);
$db = $mongo->ecommerceDB;
$collection = $db->users;

$data = json_decode(file_get_contents("php://input"));
$returnData = [];

// IF REQUEST METHOD IS NOT EQUAL TO POST
if($_SERVER["REQUEST_METHOD"] != "POST"):
    $returnData = msg(0,404,'Page Not Found!');                    


// CHECKING EMPTY FIELDS
elseif(!isset($data->email) 
    || !isset($data->password)
    || empty(trim($data->email))
    || empty(trim($data->password))
    ):

    $fields = ['fields' => ['email','password']];
    $returnData = msg(0,422,'Please Fill in all Required Fields!',$fields);

// IF THERE ARE NO EMPTY FIELDS THEN-
else:
    $email = trim($data->email);
    $password = trim($data->password);

    // CHECKING THE EMAIL FORMAT (IF INVALID FORMAT)
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)):
        $returnData = msg(0,422,'Invalid Email Address!');
    
    // IF PASSWORD IS LESS THAN 8 THE SHOW THE ERROR
    elseif(strlen($password) < 0):
        $returnData = msg(0,422,'Document is null.');

    // THE USER IS ABLE TO PERFORM THE LOGIN ACTION
    else:
        try{
            $result = $collection->findOne( 
                [
                    'email' => $email
                ]
            );
            if($result):
                if(password_verify($password, $result['password'])):
                    $jwt = new JwtHandler();
                    $token = $jwt->jwtEncodeData(
                        'http://localhost/', $result);
                        
                    $returnData = [
                        'success' => 1,
                        'message' => 'You have successfully logged in.',
                        'token' => $token,
                        'email' => $result['email'],
                        'name' => $result['name'],
                        'isAdmin' => $result['isAdmin']
                    ];
                else:
                    $returnData = msg(0,422,'Password verification failed.');
                    http_response_code(422);                    
                endif;
            else:
                $returnData = msg(0,422,'Document is null.');
                http_response_code(422);                    

            endif;    
        } catch(PDOException $e){
            $returnData = msg(0,500,$e->getMessage());
        }

    endif;

endif;

echo json_encode($returnData);