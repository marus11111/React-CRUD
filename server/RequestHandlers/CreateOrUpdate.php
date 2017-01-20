<?php
require_once('cloudinaryRemove.php');

class CreateOrUpdate
{
  use cloudinaryRemove;
  
  //sign up attempt
  public function signUp(&$msg, $link)
  {
    
    //Get username and password from request
    $providedUsername = mysqli_real_escape_string($link, $_POST['username']);
    $providedPassword = mysqli_real_escape_string($link, $_POST['password']);
    
    //When signing up, perform case insensitive search. 
    $query  = "SELECT username FROM users WHERE username COLLATE utf8_polish_ci ='$providedUsername' LIMIT 1";
    $result = mysqli_query($link, $query);
    
    //If user exists, echo error, else hash password and create user
    if (mysqli_num_rows($result) > 0) {
      $msg['error'] = 'User already exist. Did you want to sign in?';
    } else {
      
      $hashedPassword = CryptoLib::hash($providedPassword);
      
      $query  = "INSERT INTO users (username, password) VALUES ('$providedUsername', '$hashedPassword')";
      $insert = mysqli_query($link, $query);
      
      //Check if user created, if not echo error, if yes generate token and send success msg
      if (!$insert) {
        $msg['error'] = 'Could not create accunt. Please try again.';
      } else {
        //Get id of new user - required to set cookie for user
        $id = mysqli_insert_id($link);
        
        //Generates token and creates cookie
        generateToken($link, $id);
        
        $msg = array(
          success => 'Account successfully created.',
          authorize => $providedUsername
        );
      }
    }
  }
  
  //create post
  public function createPost(&$msg, $link)
  {
    
    //get data from request
    $title = mysqli_real_escape_string($link, $_POST['title']);
    $body  = mysqli_real_escape_string($link, $_POST['body']);
    preg_match('/(([^\s]+\s*){1,50})/', $body, $snippet);
    $snippet = $snippet[0] . '...';
    
    //get author id and set timestamp
    $authorId = $_COOKIE['id'];
    $time     = time();
    
    //insert post to database
    $query  = "INSERT INTO posts (author_id, title, body, snippet, timestamp) VALUES ('$authorId','$title','$body', '$snippet', '$time')";
    $insert = mysqli_query($link, $query);
    
    //set msg depending on whether post was successfully inserted or not
    if ($insert) {
      //get id of inserted post
      $postId = mysqli_insert_id($link);
      
      //send id of post, snippet and timestamp
      $msg = array(
        success => 'Post created.',
        postId => $postId,
        snippet => $snippet,
        timestamp => $time
      );
    } else {
      $msg['error'] = 'An error occured. Please try again.';
    }
  }
  
  //edit post
  public function editPost(&$msg, $link)
  {
    
    //get data from request
    $title = mysqli_real_escape_string($link, $_POST['title']);
    $body  = mysqli_real_escape_string($link, $_POST['body']);
    preg_match('/(([^\s]+\s*){1,50})/', $body, $snippet);
    $snippet = $snippet[0] . '...';
    
    //get post id
    $postId = $_POST['postId'];
    
    //edit post
    $query  = "UPDATE posts SET title = '$title', body = '$body', snippet = '$snippet' WHERE id = '$postId' LIMIT 1";
    $result = mysqli_query($link, $query);
    
    //set msg depending on whether post was successfully updated in DB or not
    if ($result) {
      
      //send new snippet
      $msg = array(
        success => 'Post edited successfully.',
        snippet => $snippet
      );
    } else {
      $msg['error'] = 'An error occured. Please try again.';
    }
  }
  
  //create comment
  public function createComment(&$msg, $link)
  {
    
    //ge data from request and set time
    $postId = $_POST['postId'];
    $author = $_POST['author'];
    $time   = time();
    $body   = mysqli_real_escape_string($link, $_POST['body']);
    
    //insert comment into database
    $query  = "INSERT INTO comments (post_id, comment_author, timestamp, body) VALUES ('$postId','$author','$time', '$body')";
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
    } else {
      $msg['error'] = 'An error occured. Please try again.';
    }
  }
  
  //image upload
  public function imageUpload(&$msg, $link)
  {
    
    //get id of user
    $userId = $_COOKIE['id'];
    
    //upload image to cloudinary
    $response = \Cloudinary\Uploader::upload($_FILES['file']['tmp_name'], array(
      "upload_preset" => $_POST['upload_preset']
    ));
    
    //get url and public id from response - url is necessary to display image, 
    //public id to remove it from cloudinary
    $imageUrl = $response['secure_url'];
    $imageId  = $response['public_id'];
    
    //if necessary data wasnt retrieved, send error, else remove old image from cloudinary,
    //update mysql data and send url to display image
    if (!$imageUrl || !$imageId) {
      $msg['error'] = 'Could not upload image. Please try again.';
    } else {
      
      //remove old image from cloudinary (function checks if it exists)
      $this->removeCloudinaryImage(array(
        idOfUser => $userId,
        linkToDB => $link
      ));
      
      //update mysql database
      $query       = "UPDATE users SET img_url = '$imageUrl', img_public_id = '$imageId' WHERE id = '$userId' LIMIT 1";
      $updateMysql = mysqli_query($link, $query);
      
      if ($updateMysql) {
        $msg = array(
          success => true,
          imageUrl => $imageUrl
        );
      } else {
        $msg['error'] = 'Could not upload image. Please try again.';
      }
    }
  }
  
}

?>