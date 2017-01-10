<?php
require_once('link.php');
require_once('Cloudinary/Cloudinary.php');
require_once('Cloudinary/Uploader.php');
require_once('Cloudinary/Api.php');
require_once('Cloudinary/config.php');
require_once('composer/vendor/autoload.php');

require_once('RequestHandlers/Authorization.php');
require_once('RequestHandlers/FetchData.php');
require_once('RequestHandlers/CreateOrUpdate.php');
require_once('RequestHandlers/Remove.php');

//check for errors with connection and character set and don't proceed if errors occur
if (mysqli_connect_error()) {
    echo json_encode(array(error => 'Could not connect to database'));
    exit();
}

if (!mysqli_set_charset($link, 'utf8')) {
    echo json_encode(array(error => 'Could not load character set utf8'));
    exit();
} 


$dispatcher = \FastRoute\simpleDispatcher(function(\FastRoute\RouteCollector $r) {
    $r->addRoute('GET', '{user}', ['FetchData', 'userData']);
    $r->addRoute('GET', 'comments/{postId}', ['FetchData', 'comments']);
    $r->addRoute('POST', 'cookie', ['Authorization', 'cookieAuth']);
    $r->addRoute('POST', 'signIn', ['Authorization', 'signIn']);
    $r->addRoute('POST', 'signOut', ['Authorization', 'signOut']);
    $r->addRoute('POST', 'signUp', ['CreateOrUpdate', 'signUp']);
    $r->addRoute('POST', 'createPost', ['CreateOrUpdate', 'createPost']);
    $r->addRoute('POST', 'editPost', ['CreateOrUpdate', 'editPost']);
    $r->addRoute('POST', 'createComment', ['CreateOrUpdate', 'createComment']);
    $r->addRoute('POST', 'imageUpload', ['CreateOrUpdate', 'imageUpload']);
    $r->addRoute('DELETE', 'removePost/{postId}', ['Remove', 'removePost']);
    $r->addRoute('DELETE', 'removeComment/{commentId}', ['Remove', 'removeComment']);
    $r->addRoute('DELETE', 'removeImage', ['Remove', 'removeImage']);
});


$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$base = '/project2/server/';
$uri = str_replace($base, '', $uri);

//create array, that will contain response
$msg = array();

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


echo json_encode($msg, JSON_UNESCAPED_UNICODE);

?>