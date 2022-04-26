<?php
require __DIR__ . '/JwtHandler.php';
require_once ("mongoconn.php");


class Auth extends JwtHandler
{
    protected $headers;
    protected $token;

    public function __construct($headers)
    {
        include_once('mongoconn.php');
        parent::__construct();
        $this->headers = $headers;
    }

    /** 
     * Get hearder Authorization
     * */
    function getAuthorizationHeader(){
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER["Authorization"]);
        }
        else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { //Nginx or fast CGI
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            // Server-side fix for bug in old Android versions (a nice side-effect of this fix means we don't care about capitalization for Authorization)
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            //print_r($requestHeaders);
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }
        return $headers;
    }
    /**
    * get access token from header
    * */
    function getBearerToken() {
    $headers = $this->getAuthorizationHeader();
    // HEADER: Get the access token from the header
    if (!empty($headers)) {
        if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            return $matches[1];
        }
    }
    return null;
    }

    public function isValid(){
        $token = $this->getBearerToken();
        if ($token) {
            $tokenData = (array) $this->jwtDecodeData($token);

            if ($user = $this->fetchUser($tokenData['data']->email)):
                return [
                    "success" => 1,
                    "user" => $user
                ];
            else :
                return [
                    "success" => 0,
                    "message" => $tokenData['message'],
                ];
            endif;
        } else {
            return [
                "success" => 0,
                "message" => "Token not found in request"
            ];
        }
    }

    function fetchUser($email){
        $mongo = new MongoDB\Client(MONGO_URI);
        $db = $mongo->ecommerceDB;
        $collection = $db->users;
        try {
            $result = $collection->findOne( 
                [
                    'email' => $email
                ]
            );
            if ($result) :
                return $result;
            else :
                return false;
            endif;
        } catch (PDOException $e) {
            return null;
        }
    }
}