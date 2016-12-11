<?php
require_once('CryptoLib.php');

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

$query = "SELECT * FROM Users WHERE Password='$password'";
$result = mysqli_query($link, $query);

if ($_POST['requestType'] == 'signUp') {
    $rows = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
    }
    echo json_encode($rows);
}
else if ($_POST['requestType'] == 'signIn') {
    echo json_encode('ktoś się loguje');
}
else{
    echo json_encode($_POST);
}

?>