<?php

class Create {
    
    //sign up attempt
    public function signUp(&$msg, $link) {
        
        //Get username and password from request
        $providedUsername = mysqli_real_escape_string($link, $_POST['username']);
        $providedPassword = mysqli_real_escape_string($link, $_POST['password']);

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
                    success => 'Account successfully created.',
                    authorize => $providedUsername
                );
            }
        }
    }
    
    //create post
    public function createPost(&$msg, $link) {
        
        //get data from request
        $title = mysqli_real_escape_string($link, $_POST['title']);
        $body = mysqli_real_escape_string($link, $_POST['body']);
        preg_match('/(([^\s]+\s*){1,30})/', $body, $snippet);
        $snippet = $snippet[0];
        
        //get author id and set timestamp
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
    
    //create comment
    public function createComment(&$msg, $link) {
        
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
    
}


?>