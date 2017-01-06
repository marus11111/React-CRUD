<?php
require_once('link.php');
require_once('Cloudinary/Cloudinary.php');
require_once('Cloudinary/Uploader.php');
require_once('Cloudinary/Api.php');
require_once('composer/vendor/autoload.php');

require_once('RequestHandlers/Authorization.php');
require_once('RequestHandlers/FetchData.php');
//require_once('RequestHandlers/InsertData.php');
//require_once('RequestHandlers/DeleteData.php');
//require_once('RequestHandlers/UpdateData.php');

//check for errors with connection and character set and don't proceed if errors occur
if (mysqli_connect_error()) {
    echo json_encode(array(error => 'Could not connect to database'));
    exit();
}

if (!mysqli_set_charset($link, 'utf8')) {
    echo json_encode(array(error => 'Could not load character set utf8'));
    exit();
} 


//create array, that will contain response
$msg = array();

$dispatcher = \FastRoute\simpleDispatcher(function(\FastRoute\RouteCollector $r) {
    $r->addRoute('GET', '{user}', ['FetchData', 'userData']);
    $r->addRoute('GET', 'comments/{postId}', ['FetchData', 'comments']);
    $r->addRoute('POST', 'cookie', ['Authorization', 'cookieAuth']);
    $r->addRoute('POST', 'sign-in', ['Authorization', 'signIn']);
    $r->addRoute('POST', 'sign-out', ['Authorization', 'signOut']);
});


$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$base = '/project2/server/';
$uri = str_replace($base, '', $uri);

$routeInfo = $dispatcher->dispatch($method, $uri);

switch ($routeInfo[0]) {
    case \FastRoute\Dispatcher::NOT_FOUND:
        // ... 404 Not Found
    case \FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        $allowedMethods = $routeInfo[1];
    case \FastRoute\Dispatcher::FOUND:
        $className = $routeInfo[1][0];
        $handler = $routeInfo[1][1];
        $params = $routeInfo[2];
        
        $class = new $className;
        $class->$handler($msg, $link, $params);
}











//Get request type - sign in, sign up, cookie authorization, 
//add post, edit post, remove post, load picture, add comment etc. 
$reqType = $_POST['requestType'];




/////////////////
//AUTHORIZATION//
/////////////////



//Sign up or sign in attempt
if ($reqType == 'signUp' || $reqType == 'signIn') {
    
    
    //Sign up attempt    
    if ($reqType == 'signUp') {
        
        //When signing up, perform case insensitive search. 
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
}


///////////////////////////////////////
////CREATE, EDIT AND REMOVE POSTS////
///////////////////////////////////////

if ($reqType == 'createPost' || $reqType == 'editPost'){
    
    //get data from request
    $title = mysqli_real_escape_string($link, $_POST['title']);
    $body = mysqli_real_escape_string($link, $_POST['body']);
    preg_match('/(([^\s]+\s*){1,30})/', $body, $snippet);
    $snippet = $snippet[0];

    if ($reqType == 'createPost') {

        //get author id and set time
        $authorId = $_COOKIE['id'];
        $time = time();

        //insert post to database
        $query = "INSERT INTO posts (author_id, title, body, snippet, timestamp) VALUES ('$authorId','$title','$body', '$snippet', '$time')";
        $insert = mysqli_query($link, $query);

        //set msg depending on whether post was successfully inserted or not
        if($insert) {
            //get id of inserted post
            $postId = mysqli_insert_id($link);

            //send id of post, snippet and timestamp
            $msg = array(
                success => 'Post created.',
                postId => $postId,
                snippet => $snippet,
                timestamp => $time
            );
        }
        else {
            $msg['error'] = 'An error occured. Please try again.';
        }
    }
    else if ($reqType == 'editPost') {

        //get post id
        $postId = $_POST['postId'];

        //edit post
        $query = "UPDATE posts SET title = '$title', body = '$body', snippet = '$snippet' WHERE id = '$postId' LIMIT 1";
        $result = mysqli_query($link, $query);

        //set msg depending on whether post was successfully updated in DB or not
        if ($result) {
            
            //send new snippet
            $msg = array(
                success => 'Post edited successfully.',
                snippet => $snippet
            );
        }
        else {
            $msg['error'] = 'An error occured. Please try again.';
        }
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
    
    //ge data from request and set time
    $postId = $_POST['postId'];
    $author = $_POST['author'];
    $time = time();
    $body = mysqli_real_escape_string($link, $_POST['body']);
    
    //insert comment into database
    $query = "INSERT INTO comments (post_id, comment_author, timestamp, body) VALUES ('$postId','$author','$time', '$body')";
    $result = mysqli_query($link, $query);
    
    //set msg depending on whether comment successfully deleted
    if ($result) {
        
        //get id of newly created comment
        $commentId = mysqli_insert_id($link);
        
        //send id and timestamp
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

else if ($reqType == 'removeComment') {
    
    //get id of comment
    $commentId = $_POST['commentId'];
    
    //remove comment
    $query = "DELETE FROM comments WHERE id = '$commentId' LIMIT 1";
    $result = mysqli_query($link, $query);
    
    //notify whether comment was removed successfully
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


echo json_encode($msg, JSON_UNESCAPED_UNICODE);

?>