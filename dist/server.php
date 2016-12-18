<?php
require_once('CryptoLib.php');
require_once('tokens.php');
require_once('cloudinary/Cloudinary.php');
require_once('cloudinary/Uploader.php');
require_once('cloudinary/Api.php');


$link = mysqli_connect(***REMOVED***);

if (mysqli_connect_error()) {
    $msg = array(
        error => 'Could not connect to database'
    );
}

if (!mysqli_set_charset($link, 'utf8')) {
    $msg = array(
        error => 'Could no load character set utf8'
    );
} 

if($msg){
    echo json_encode($msg);
    exit();
}

//Get request type - sign in, sign up, cookie authorization, 
//add post, update post, remove post, load picture, add comment 
$reqType = $_POST['requestType'] ? $_POST['requestType'] : $_GET['requestType'];

/////////////////
//AUTHORIZATION//
/////////////////

//Authorize with cookie
if ($reqType == 'cookieAuth') {
    $id = $_COOKIE['id'];
    $token = $_COOKIE['token'];
    
    if (!$id || !$token) {
        $msg = array(
            deauthorize => 'Invalid cookie or no cookie provided'
        );
    }
    else if(!isTokenValid($link, $id, $token)){
        $msg = array(
            deauthorize => 'Invalid token provided'
        );
    }
    else {
        $query = "SELECT username FROM users WHERE id = '$id' LIMIT 1";
        $resultArray = mysqli_fetch_assoc(mysqli_query($link, $query));
        $user = $resultArray['username'];
        
        $msg = array(
            authorize => 'Token is valid',
            user => $user
        );
    }
}

//Sign out
else if ($reqType == 'signOut') {
    
    //delete cookies
    setcookie('id', '', 1);
    setcookie('token', '', 1);
    
    //information to send to client
    $msg = array(
        deauthorize => 'Cookies unset'
    );
}

//Sign up or sign in attempt
else {
    
    //Get username and password from request
    $providedUsername = mysqli_real_escape_string($link, $_POST['username']);
    $providedPassword = mysqli_real_escape_string($link, $_POST['password']);
    
    //Sign up attempt    
    if ($reqType == 'signUp') {
        
        //When signing up, perform case insesitive search. 
        $query = "SELECT username, password, id FROM users WHERE username COLLATE utf8_polish_ci ='$providedUsername' LIMIT 1";
        $result = mysqli_query($link, $query);
        
        //If user exists, echo error, else hash password and create user
        if(mysqli_num_rows($result)>0){
            $msg = array(
                signUpError => 'User already exist. Did you want to sign in?'
            );            
        }
        else {
            
            $hashedPassword = CryptoLib::hash($providedPassword);

            $query = "INSERT INTO users (username, password) VALUES ('$providedUsername', '$hashedPassword')";
            $insert = mysqli_query($link, $query);
            
            //Check if user created, if not echo error, if yes generate token and send success msg
            if(!$insert){
                $msg = array(
                    signUpError => 'Could not create accunt. Please try again.'
                );
            }
            else {
                //Get id of new user - required to generate token for user
                $query = "SELECT id FROM users WHERE username='$providedUsername' LIMIT 1";
                $idArray = mysqli_fetch_assoc(mysqli_query($link, $query));
                $id = $idArray['id'];
                
                generateToken($link, $id);
                
                $msg = array(
                    authorize => 'Account successfully created',
                    user => $providedUsername
                );
            }
        }
    }

    else if ($reqType == 'signIn') {
        
        //When signing in, perform default (case sesitive) search. 
        $query = "SELECT username, password, id FROM users WHERE username = '$providedUsername' LIMIT 1";
        $result = mysqli_query($link, $query);

        //Get password stored in DB and compare with provided
        $userData = mysqli_fetch_assoc($result);
        $isPasswordCorrect = CryptoLib::validateHash($userData['password'], $providedPassword);
        
        //Error if no user or password incorrect, else generate token and send success msg
        if(!mysqli_num_rows($result) || !$isPasswordCorrect) {
            $msg = array(
                signInError => 'Incorrect username or password'
            );
        }
        else {
            
            generateToken($link, $userData['id']);
            
            $msg = array(
                authorize => 'You are now signed in',
                user => $providedUsername
            );
        }
    } 
}


///////////////////////////////
////CREATE AND UPDATE POSTS////
///////////////////////////////

if ($reqType == 'CreatePost') {
    
    $authorId = $_COOKIE['id'];
    $title = $_POST['title'];
    $body = $_POST['body'];
    
    $query = "INSERT INTO posts (author_id, title, body) VALUES ('$authorId','$title','$body')";
    $insert = mysqli_query($link, $query);
    
    if($insert) {
        $msg = array(
            success => 'Post created'
        );
    }
    else {
        $msg = array(
            error => 'Error while trying to create post'
        );
    }
}



/////////////////////////////
///UPLOAD AND REMOVE IMAGE///
/////////////////////////////

if ($reqType == 'removeImage' || $reqType == 'imageUpload') {
    
    $userId = $_COOKIE['id'];
        
    \Cloudinary::config(array( 
    ***REMOVED***
    ***REMOVED***
    ***REMOVED***
    ));
    
    function removeCloudinaryImage($array) {
        $idOfUser = $array['idOfUser'];
        $linkToDB = $array['linkToDB'];
        
        $query = "SELECT img_public_id FROM users WHERE id = '$idOfUser'";
        $result = mysqli_fetch_assoc(mysqli_query($linkToDB, $query));
        
        if ($imageToRemove = $result['img_public_id']) {
            \Cloudinary\Uploader::destroy($imageToRemove, array(invalidate => true));
        }
        
        if($array) {
            $query = "UPDATE users SET img_url = NULL, img_public_id = NULL WHERE id = '$idOfUser'";
            mysqli_query($linkToDB, $query);
        }
        
        return array(
            success => 'Image removed'
        );
    }
    
    if ($reqType == 'imageUpload') {
        $response = \Cloudinary\Uploader::upload($_FILES['file']['tmp_name'], array(
            "upload_preset" => $_POST['upload_preset']
        ));

        $imageUrl = $response['secure_url']; 
        $imageId = $response['public_id'];

        if(!$imageUrl || !$imageId){
            $msg = array(
                error => 'Could not upload image. Please try again'
            );
        }
        else {
            removeCloudinaryImage(array(
                idOfUser => $userId,
                linkToDB => $link
            ));
            
            $msg = array(
                imageUrl => $imageUrl,
            );
            
            $query = "UPDATE users SET img_url = '$imageUrl', img_public_id = '$imageId' WHERE id = '$userId'";
            mysqli_query($link, $query);
        } 
    }
    else if ($reqType == 'removeImage') {
        $msg = removeCloudinaryImage(array(
            idOfUser => $userId,
            linkToDB => $link,
            removeFromDB => true    
        ));
    }
}

/////////////////////////////
////FETCH IMAGE AND POSTS////
/////////////////////////////

if ($reqType == 'fetchUserData') {
    $user = mysqli_real_escape_string($link, $_POST['user']);
        
    $query = "SELECT id, img_url FROM users WHERE username COLLATE utf8_polish_ci = '$user' LIMIT 1";
    $result = mysqli_fetch_array(mysqli_query($link, $query));
    if (!$result) {
        $msg = array(
            paramUserError => "Could not retrieve data for user '$user'"
        );
    }
    else {
        $msg = array(
            userData => array()
        );
        
        $imageUrl = $result['img_url'];
        $msg['userData']['imageUrl'] = $imageUrl;
        
        $userId = $result['id'];
        $query = "SELECT title, body, id FROM posts WHERE author_id = '$userId'";
        $posts = mysqli_query($link, $query);
        while ($row = mysqli_fetch_assoc($posts)) {
            $msg['userData']['posts'][] = $row;
        }   
    }
}

echo json_encode($msg, JSON_UNESCAPED_UNICODE);

?>