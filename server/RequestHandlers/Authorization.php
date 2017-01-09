<?php
require_once('CryptoLib.php');
require_once('tokens.php');

class Authorization {
    
    //authorize with cookie
    public function cookieAuth(&$msg, $link) {
        $id = $_COOKIE['id'];
        $token = $_COOKIE['token'];

        if (!$id || !$token) {
            $msg['deauthorize'] = 'Invalid cookie or no cookie provided.';
        }
        else if(!isTokenValid($link, $id, $token)){
            $msg['deauthorize'] = 'Invalid token provided.';
        }
        else {
            $query = "SELECT username FROM users WHERE id = '$id' LIMIT 1";
            $resultArray = mysqli_fetch_assoc(mysqli_query($link, $query));
            $user = $resultArray['username'];

            $msg = array(
                success => 'Token is valid.',
                authorize => $user
            );
        }   
    }
    
    //sign in attempt
    public function signIn(&$msg, $link) {
        
        //Get username and password from request
        $providedUsername = mysqli_real_escape_string($link, $_POST['username']);
        $providedPassword = mysqli_real_escape_string($link, $_POST['password']);
        
        //When signing in, perform default (case sensitive) search. 
        $query = "SELECT username, password, id FROM users WHERE username = '$providedUsername' LIMIT 1";
        $result = mysqli_query($link, $query);

        //Get password stored in DB and compare with provided
        $userData = mysqli_fetch_assoc($result);
        $isPasswordCorrect = CryptoLib::validateHash($userData['password'], $providedPassword);
        
        //Error if no user or password incorrect, else generate token and send success msg
        if(!mysqli_num_rows($result) || !$isPasswordCorrect) {
            $msg['error'] = 'Incorrect username or password.';
        }
        else {
            
            //generates new token and sets cookie everytime user logins
            generateToken($link, $userData['id']);
            
            $msg = array(
                success => 'You are now signed in.',
                authorize => $providedUsername
            );
        }
    }
    
    //sign out
    public function signOut(&$msg) {
        //delete cookies
        setcookie('id', '', 1);
        setcookie('token', '', 1);

        //information to send to client
        $msg['deauthorize'] = 'Cookies unset.';
    }
}


?>