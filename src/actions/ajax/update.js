import axios from 'axios';
import variousErrors from './variousErrors';
import setEditedPost from '../setEditedPost';
import makeLink from '../../helpers/titleLink';
import {push} from 'react-router-redux';

//modifies edited post on client side so that the changes are immediatelly visible

const editPost = (post) => {
    return {
        type: 'EDIT_POST',
        post
    }
}

//adds url to added image so that it's immediately displayed

const displayImage = (imageUrl) => {
    return {
        type: 'DISPLAY_IMAGE',
        imageUrl
    }
}



const url = '/project2/server.php';

export default (method, requestType, optionalData) => {
    return dispatch => {
    
            let formData = new FormData();
            let data = {requestType, ...optionalData};
            for (let key in data) {
                if (data.hasOwnProperty(key)){
                    formData.append(key, data[key]);
                }
            }

        axios({
            method,
            url, 
            data: formData 
        })
        .then(res => {
            res = res.data;
            if (res.imageUrl) {
                dispatch(displayImage(res.imageUrl));
            }
            else if (res.success) {
                let {title, body, postId, user} = optionalData;
                let {snippet, timestamp} = res;
                let modifiedPost = {title, body, snippet, timestamp, id: postId};
                dispatch(editPost(modifiedPost));
                dispatch(setEditedPost(postId));
                let titleLink = makeLink(title);
                router.push(`/${user}/${postId}/${titleLink}`);
            }
            else if (res.error) {
                dispatch(variousErrors(res.error));
            }
        })
    }
}