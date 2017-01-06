<?php

class FetchData {
    
    //fetch image url and posts
    public function userData(&$msg, $link, $params) {
        //retrieve username from link
        $user = mysqli_real_escape_string($link, $params['user']);

        //check if user exists in database
        $query = "SELECT username, id, img_url FROM users WHERE username COLLATE utf8_polish_ci = '$user' LIMIT 1";
        $result = mysqli_fetch_array(mysqli_query($link, $query));

        //send error if no data found for provided user, else send data
        if (!$result) {
            $msg['error'] = "Could not retrieve data for user '$user'.";
        }
        else {
            $msg = array(
                success => true,
                userData => array()
            );

            //send image url
            $imageUrl = $result['img_url'];
            $msg['userData']['imageUrl'] = $imageUrl;

            //get posts written by the user
            $userId = $result['id'];
            $query = "SELECT title, body, snippet, timestamp, id FROM posts WHERE author_id = '$userId'";
            $result = mysqli_query($link, $query);
            
            //add posts to message or send error if they couldn't be retrieved
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
    
    //fetch comments
    public function comments(&$msg, $link, $params) {
        //get post id
        $postId = mysqli_real_escape_string($link, $params['postId']);

        //select comments for given post
        $query = "SELECT comment_author AS author, timestamp, body, id FROM comments WHERE post_id = '$postId'";
        $result = mysqli_query($link, $query);

        //set message
        if (gettype($result) != object) {
            $msg['error'] = 'Error while trying to retrieve comments from database.';
        }
        else {
            $msg['success'] = 'Comments successfully fetched.';

            //send comments
            while ($row = mysqli_fetch_assoc($result)) {
                $msg['comments'][] = $row;
            }
        }
    }
}


?>