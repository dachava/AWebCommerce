<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__.'/JwtHandler.php';

require_once('mongoconn.php'); 
$collection = $db->users;


function msg($success, $status, $message, $extra = [])
{
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message
    ], $extra);
}

// DATA FORM REQUEST
$data = json_decode(file_get_contents("php://input"));
$returnData = [];

if ($_SERVER["REQUEST_METHOD"] != "POST") :
    $returnData = msg(0, 404, 'Page Not Found!');

elseif (
    !isset($data->name)
    || !isset($data->email)
    || !isset($data->password)
    || empty(trim($data->name))
    || empty(trim($data->email))
    || empty(trim($data->password))
) :

    $fields = ['fields' => ['name', 'email', 'password']];
    $returnData = msg(0, 422, 'Please Fill in all Required Fields!', $fields);


// IF THERE ARE NO EMPTY FIELDS THEN-
else :

    $name = trim($data->name);
    $email = trim($data->email);
    $password = trim($data->password);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) :
        $returnData = msg(0, 422, '¡La dirección de correo es inválida!');
        http_response_code(500);

    elseif (strlen($password) < 8) :
        $returnData = msg(0, 422, '¡La contraseña debe tener al menos 8 caracteres!');
        http_response_code(500);

    elseif (strlen($name) < 3) :
        $returnData = msg(0, 422, 'Su nombre tiene más de 3 caracteres, ¿verdad?');
        http_response_code(500);

    else :
        try {
            $checkEmail = $collection->findOne( 
                [
                    'email' => $email
                ]
            );

            if ($checkEmail):
                $returnData = msg(0, 422, 'This E-mail already in use!');
                http_response_code(500);
            else :
                $collection->InsertOne([
                    'name'=>$name,
                    'email'=>$email,
                    'password'=>password_hash($password, PASSWORD_DEFAULT),
                    'isAdmin'=>false
                ]);
                $token = $jwt->jwtEncodeData(
                    'http://localhost/', $result);

                    $returnData = [
                        'success' => 1,
                        'message' => 'You have successfully signed up.',
                        'token' => $token,
                        'email' => $result['email'],
                        'name' => $result['name'],
                        'isAdmin' => $result['isAdmin']
                    ];

            endif;
        } catch (PDOException $e) {
            $returnData = msg(0, 500, $e->getMessage());
            http_response_code(500);                    

        }
    endif;
endif;

echo json_encode($returnData);