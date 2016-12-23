<?php
require_once('CryptoLib.php');
require_once('tokens.php');
require_once('link.php');
require_once('cloudinary/Cloudinary.php');
require_once('cloudinary/Uploader.php');
require_once('cloudinary/Api.php');

if (mysqli_connect_error()) {
    echo json_encode(array(error => 'Could not connect to database'));
    exit();
}

if (!mysqli_set_charset($link, 'utf8')) {
    echo json_encode(array(error => 'Could not load character set utf8'));
    exit();
} 

//Get request type - sign in, sign up, cookie authorization, 
//add post, edit post, remove post, load picture, add comment 
$reqType = $_POST['requestType'];

//create array, that will contain response
$msg = array();


/////////////////
//AUTHORIZATION//
/////////////////

//Authorize with cookie
if ($reqType == 'cookieAuth') {
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
            authorize => 'Token is valid.',
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
    $msg['deauthorize'] = 'Cookies unset.';
}

//Sign up or sign in attempt
else {
    
    //Get username and password from request
    $providedUsername = mysqli_real_escape_string($link, $_POST['username']);
    $providedPassword = mysqli_real_escape_string($link, $_POST['password']);
    
    //Sign up attempt    
    if ($reqType == 'signUp') {
        
        //When signing up, perform case insesitive search. 
        $query = "SELECT username FROM users WHERE username COLLATE utf8_polish_ci ='$providedUsername' LIMIT 1";
        $result = mysqli_query($link, $query);
        
        //If user exists, echo error, else hash password and create user
        if(mysqli_num_rows($result)>0){
            $msg['error'] = 'User already exist. Did you want to sign in?';            
        }
        else {
            
            $hashedPassword = CryptoLib::hash($providedPassword);

            $query = "INSERT INTO users (username, password) VALUES ('$providedUsername', '$hashedPassword')";
            $insert = mysqli_query($link, $query);
            
            //Check if user created, if not echo error, if yes generate token and send success msg
            if(!$insert){
                $msg['error'] = 'Could not create accunt. Please try again.';
            }
            else {
                //Get id of new user - required to set cookie for user
                $id = mysqli_insert_id($link);
                                
                //Generates token and creates cookie
                generateToken($link, $id);
                
                $msg = array(
                    authorize => 'Account successfully created.',
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
            $msg['error'] = 'Incorrect username or password.';
        }
        else {
            
            //generates new token and sets cookie everytime user logins
            generateToken($link, $userData['id']);
            
            $msg = array(
                authorize => 'You are now signed in.',
                user => $providedUsername
            );
        }
    } 
}


///////////////////////////////////////
////CREATE, EDIT AND REMOVE POSTS////
///////////////////////////////////////

if ($reqType == 'createPost') {
    
    //get necessary data
    $authorId = $_COOKIE['id'];
    $title = mysqli_real_escape_string($link, $_POST['title']);
    $body = mysqli_real_escape_string($link, $_POST['body']);
    
    //insert post to database
    $query = "INSERT INTO posts (author_id, title, body) VALUES ('$authorId','$title','$body')";
    $insert = mysqli_query($link, $query);
    
    //set msg depending on whether post was successfully inserted or not
    if($insert) {
        //get id of inserted post
        $postId = mysqli_insert_id($link);
        
        //set response
        $msg = array(
            success => 'Post created.',
            postId => $postId
        );
    }
    else {
        $msg['error'] = 'An error occured. Please try again.';
    }
}
else if ($reqType == 'editPost') {
    
    //get necessary data from request
    $postId = $_POST['postId'];
    $title = mysqli_real_escape_string($link, $_POST['title']);
    $body = mysqli_real_escape_string($link, $_POST['body']);
    
    //edit post
    $query = "UPDATE posts SET title = '$title', body = '$body' WHERE id = '$postId' LIMIT 1";
    $result = mysqli_query($link, $query);
    
    //set msg depending on whether post was successfully updated in DB or not
    if ($result) {
        $msg['success'] = 'Post edited successfully.';
    }
    else {
        $msg['error'] = 'An error occured. Please try again.';
    }
}
else if ($reqType == 'removePost') {
    
    //get id from request
    $postId = $_POST['postId'];

    //remove post
    $query = "DELETE FROM posts WHERE id = '$postId' LIMIT 1";
    $result = mysqli_query($link, $query);
    
    //set msg depending on whether post was successfully deleted
    if ($result) {
        $msg['success'] = 'Post removed.';
    }
    else {
        $msg['error'] = 'An error occured. Please try again.';
    }
}


///////////////////////////////////////
///CREATE, FETCH AND REMOVE COMMENTS///
///////////////////////////////////////

if ($reqType == 'createComment') {
    $postId = $_POST['postId'];
    $author = $_POST['author'];
    $time = time();
    $body = mysqli_real_escape_string($link, $_POST['body']);
    
    $query = "INSERT INTO comments (post_id, comment_author, timestamp, body) VALUES ('$postId','$author','$time', '$body')";
    $result = mysqli_query($link, $query);
    
    if ($result) {
        $commentId = mysqli_insert_id($link);
        
        $msg = array(
            success => 'Comment successfully added.',
            timestamp => $time,
            id => $commentId
        );
    }
    else {
        $msg['error'] = 'An error occured. Please try again.';
    }
}
else if ($reqType == 'fetchComments') {
    $postId = $_POST['postId'];
    
    $query = "SELECT comment_author AS author, timestamp, body, id FROM comments WHERE post_id = '$postId'";
    $result = mysqli_query($link, $query);
    
    if (gettype($result) != object) {
        $msg['error'] = 'Error while trying to retrieve comments from database.';
    }
    else {
        $msg['success'] = 'Comments successfully fetched.';
        while ($row = mysqli_fetch_assoc($result)) {
            $msg['comments'][] = $row;
        }
    }
}
else if ($reqType == 'removeComment') {
    $commentId = $_POST['commentId'];
    
    $query = "DELETE FROM comments WHERE id = '$commentId' LIMIT 1";
    $result = mysqli_query($link, $query);
    
    if ($result) {
        $msg['success'] = 'Comment successfully removed.';
    }
    else {
        $msg['error'] = 'An error occured while trying to remove comment. Please try again.';
    }
}


/////////////////////////////
///UPLOAD AND REMOVE IMAGE///
/////////////////////////////

if ($reqType == 'removeImage' || $reqType == 'imageUpload') {
    
    //get id of user
    $userId = $_COOKIE['id'];
    
    //set cloudinary config
    \Cloudinary::config(array( 
    ***REMOVED***
    ***REMOVED***
    ***REMOVED***
    ));
    
    //create function that will remove image from cloudinary database
    function removeCloudinaryImage($args) {
        
        //use data given as arguments to try to retrieve public id of image (stored in mysql), 
        //which is necessary to remove it from cloudinary database 
        $idOfUser = $args['idOfUser'];
        $linkToDB = $args['linkToDB'];
        $query = "SELECT img_public_id FROM users WHERE id = '$idOfUser' LIMIT 1";
        $result = mysqli_fetch_assoc(mysqli_query($linkToDB, $query));
        
        //value that will indicate whether image was removed successfully
        //if something goes wrong, will be changed to false
        $success = true;
        
        //Function will also be called when user uploads image (to remove the old one if exists),
        //so first it has to check, whether query gave image public id (whether there already is an image for this user),
        //and only if query gave result, try to remove image from cloudinary
        if ($imageToRemove = $result['img_public_id']) {
            $cloudinaryRemove = \Cloudinary\Uploader::destroy($imageToRemove, array(invalidate => true));
            if ($cloudinaryRemove['result'] != 'ok'){
                $success = false;
            }
        }
        
        //If user uploads new image, image url and public id will be updated wth the new values, but if he only 
        //wants to remove an image, it is necessary to remove url and id from mysql database.
        //Here the function checks whether an argument 'removeFromDB' exists, which is passed if request is only about 
        //removing old image and not uploading a new one. If the argument exists, function sets appropriate fields in 
        //mysql database to null
        if($args['removeFromDB']) {
            $query = "UPDATE users SET img_url = NULL, img_public_id = NULL WHERE id = '$idOfUser' LIMIT 1";
            $mysqlRemove = mysqli_query($linkToDB, $query);
            if(!mysqlRemove) {
                $success = false;
            }
        }
        
        return $success;
    }
    
    if ($reqType == 'imageUpload') {
        
        //upload image to cloudinary
        $response = \Cloudinary\Uploader::upload($_FILES['file']['tmp_name'], array(
            "upload_preset" => $_POST['upload_preset']
        ));
        
        //get url and public id from response - url is necessary to display image, 
        //public id to remove it from cloudinary
        $imageUrl = $response['secure_url']; 
        $imageId = $response['public_id'];
        
        //if necessary data wasnt retrieved, send error, else remove old image from cloudinary,
        //update mysql data and send url to display image
        if(!$imageUrl || !$imageId){
            $msg['error'] = 'Could not upload image. Please try again.';
        }
        else {
            
            //remove old image from cloudinary (function checks if it exists)
            removeCloudinaryImage(array(
                idOfUser => $userId,
                linkToDB => $link
            ));
            
            //update mysql database
            $query = "UPDATE users SET img_url = '$imageUrl', img_public_id = '$imageId' WHERE id = '$userId' LIMIT 1";
            $updateMysql = mysqli_query($link, $query);
            
            if($updateMysql) {
                $msg = array(
                    success => true,
                    imageUrl => $imageUrl
                );  
            } 
            else {
                $msg['error'] = 'Could not upload image. Please try again.'; 
            }
        } 
    }
    else if ($reqType == 'removeImage') {
        $success = removeCloudinaryImage(array(
            idOfUser => $userId,
            linkToDB => $link,
            removeFromDB => true    
        ));
        if ($success) {
            $msg['success'] = 'Image successfully removed.';
        }
        else {
            $msg['error'] = 'An error occured when trying to remove image from database.';
        }
    }
}

/////////////////////////////
////FETCH IMAGE AND POSTS////
/////////////////////////////

if ($reqType == 'fetchUserData') {
    $user = mysqli_real_escape_string($link, $_POST['user']);
        
    $query = "SELECT username, id, img_url FROM users WHERE username COLLATE utf8_polish_ci = '$user' LIMIT 1";
    $result = mysqli_fetch_array(mysqli_query($link, $query));
    if (!$result) {
        $msg['error'] = "Could not retrieve data for user '$user'.";
    }
    else {
        $msg = array(
            success => true,
            userData => array()
        );
        
        $imageUrl = $result['img_url'];
        $msg['userData']['imageUrl'] = $imageUrl;
        
        $userId = $result['id'];
        $query = "SELECT title, body, id FROM posts WHERE author_id = '$userId'";
        $result = mysqli_query($link, $query);
        
        if (gettype($result) != object) {
            $msg['postsError'] = 'Error occured while trying to retrieve posts from database.';
        }
        else {
            while ($row = mysqli_fetch_assoc($result)) {
                $msg['userData']['posts'][] = $row;
            } 
        }   
    }
}

echo json_encode($msg, JSON_UNESCAPED_UNICODE);

?>