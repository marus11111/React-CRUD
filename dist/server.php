<?php
require_once('CryptoLib.php');
require_once('salt.php');

$link = mysqli_connect(***REMOVED***);

if (mysqli_connect_error()) {
    echo 'błąd: nie udało się nawiązać połączenia z bazą danych';
    exit();
}

if (!mysqli_set_charset($link, "utf8")) {
    printf('Error loading character set utf8');
} 

$login = mysqli_real_escape_string($link, $_POST["login"]);
$password = mysqli_real_escape_string($link, $_POST["password"]);

$query = "SELECT * FROM Users WHERE Login='$login'";
$result = mysqli_query($link, $query);

if ($_POST['requestType'] == 'signUp') {
    
    if(mysqli_num_rows($result)>0){
        $error = array(
            error => 'User already exist. Did you want to sign in?'
        );
        echo json_encode($error);            
    }
    else {
        
        $hashedPassword = CryptoLib::hash($password, $salt);
        
        $query = "INSERT INTO Users (Login, Password) VALUES ('$login', '$hashedPassword')";
        $insert = mysqli_query($link, $query);
        
        if(!$insert){
            $error = array(
                error => 'Error occured while trying to create accunt. Please try again.'
            );
            echo json_encode($error);
        }
        else {
            $success = array(
                success => 'Account successfully created'
            );
            echo json_encode($success);
        }
    }
}
else if ($_POST['requestType'] == 'signIn') {
    
    $user = mysqli_fetch_assoc($result);
    $storedHash = $user['Password'];
    
    $isPasswordCorrect = CryptoLib::validateHash($storedHash, $password);
    
    if(!mysqli_num_rows($result) || !$isPasswordCorrect) {
        $error = array(
            error => 'Incorrect login or password'
        );
        echo json_encode($error);
    }
    else {
        $success = array(
            success => 'You are now signed in'
        );
        echo json_encode($success);
    }
}

?>