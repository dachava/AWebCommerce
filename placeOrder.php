<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__.'/AuthMiddleware.php';

require_once('mongoconn.php'); 
$collection = $db->orders;


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

else :  
    $orderItems = $data->orderItems;
    $shippingAddress = $data->shippingAddress;
    $paymentMethod = $data->paymentMethod;
    $itemsPrice = $data->itemsPrice;
    $shippingPrice = $data->shippingPrice;
    $taxPrice = $data->taxPrice;
    $totalPrice = $data->totalPrice;

    $returnData = $data;
    try {
        $authentication = new Auth($headers = getallheaders());
        $authResponse =  $authentication->isValid();
        $storeUser = $authResponse['user'];
        if (!($authResponse)):
            $returnData = msg(0, 401, 'Unauthorized');                
            http_response_code(401);
        else :
            $returnData = msg(0, 200, 'Authentication Complete');     
            $insertedOrder = $collection->InsertOne([
                'orderItems' =>  $orderItems,
                'shippingAddress' => $shippingAddress,
                'paymentMethod' => $paymentMethod,
                'itemsPrice' => $itemsPrice,
                'shippingPrice' => $shippingPrice,
                'taxPrice' => $taxPrice,
                'totalPrice' => $totalPrice,
                'user' => $storeUser['_id']
            ]);
            $orderId = (string)$insertedOrder-> getInsertedId();

           // $var = json_decode(json_encode($orderId->toArray(),true), true);
                $returnData = [
                    'success' => 1,
                    'message' => 'You have placed order successfully.',
                    'order' =>  $orderId

                ];

        endif;
    } catch (PDOException $e) {
        $returnData = msg(0, 500, $e->getMessage());
        http_response_code(500);                    
    }
endif;

echo json_encode($returnData);