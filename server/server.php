<?php
require_once('link.php');
require_once('Cloudinary/Cloudinary.php');
require_once('Cloudinary/Uploader.php');
require_once('Cloudinary/Api.php');
require_once('composer/vendor/autoload.php');

require_once('RequestHandlers/Authorization.php');
require_once('RequestHandlers/FetchData.php');
require_once('RequestHandlers/Create.php');
require_once('RequestHandlers/Remove.php');
//require_once('RequestHandlers/Update.php');

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
    $r->addRoute('POST', 'signIn', ['Authorization', 'signIn']);
    $r->addRoute('POST', 'signOut', ['Authorization', 'signOut']);
    $r->addRoute('POST', 'signUp', ['Create', 'signUp']);
    $r->addRoute('POST', 'createPost', ['Create', 'createPost']);
    $r->addRoute('POST', 'createComment', ['Create', 'createComment']);
    $r->addRoute('DELETE', 'removePost/{postId}', ['Remove', 'removePost']);
    $r->addRoute('DELETE', 'removeComment/{commentId}', ['Remove', 'removeComment']);
    $r->addRoute('DELETE', 'removeImage', ['Remove', 'removeImage']);
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






///////////////////////////////////////
////CREATE, EDIT AND REMOVE POSTS////
///////////////////////////////////////

if ($reqType == 'editPost'){
    
    //get data from request
    $title = mysqli_real_escape_string($link, $_POST['title']);
    $body = mysqli_real_escape_string($link, $_POST['body']);
    preg_match('/(([^\s]+\s*){1,30})/', $body, $snippet);
    $snippet = $snippet[0];
    
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
    
    //function that will remove image from cloudinary database
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
        
    }
}


echo json_encode($msg, JSON_UNESCAPED_UNICODE);

?>