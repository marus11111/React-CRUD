<?php
require_once('cloudinaryRemove.php');

class Remove
{
  use cloudinaryRemove;
  
  //remove post
  public function removePost(&$msg, $link, $params)
  {
    
    //get id from request
    $postId = $params['postId'];
    
    //remove post
    $query  = "DELETE FROM posts WHERE id = '$postId' LIMIT 1";
    $result = mysqli_query($link, $query);
    if ($result) {
      //remove associated comments
      $query  = "DELETE FROM comments WHERE post_id = '$postId'";
      $result = mysqli_query($link, $query);
    }
    
    //set msg depending on whether post was successfully deleted
    if ($result) {
      $msg['success'] = 'Post removed.';
    } else {
      $msg['error'] = 'An error occured. Please try again.';
    }
  }
  
  //remove comment
  public function removeComment(&$msg, $link, $params)
  {
    
    //get id of comment
    $commentId = $params['commentId'];
    
    //remove comment
    $query  = "DELETE FROM comments WHERE id = '$commentId' LIMIT 1";
    $result = mysqli_query($link, $query);
    
    //notify whether comment was removed successfully
    if ($result) {
      $msg['success'] = 'Comment successfully removed.';
    } else {
      $msg['error'] = 'An error occured while trying to remove comment. Please try again.';
    }
  }
  
  //remove image
  public function removeImage(&$msg, $link)
  {
    
    //get id of user
    $userId = $_COOKIE['id'];
    
    //remove image from db
    $remove = $this->removeCloudinaryImage(array(
      idOfUser => $userId,
      linkToDB => $link,
      removeFromSQL => true
    ));
    if ($remove) {
      $msg['success'] = 'Image successfully removed.';
    } else {
      $msg['error'] = 'An error occured when trying to remove image from database.';
    }
  }
  
}

?>