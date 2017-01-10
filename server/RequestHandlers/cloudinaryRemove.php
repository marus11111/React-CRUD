<?php 

//method to be shared by 2 classes
trait cloudinaryRemove {
     
    //function that will remove image from cloudinary database
    public function removeCloudinaryImage($args) {
        
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
        //Here the function checks whether an argument 'removeFromSQL' exists, which is passed if request is only about 
        //removing old image and not uploading a new one. If the argument exists, function sets appropriate fields in 
        //mysql database to null
        if($args['removeFromSQL']) {
            $query = "UPDATE users SET img_url = NULL, img_public_id = NULL WHERE id = '$idOfUser' LIMIT 1";
            $mysqlRemove = mysqli_query($linkToDB, $query);
            if(!mysqlRemove) {
                $success = false;
            }
        }
        
        return $success;
    }
}

?>