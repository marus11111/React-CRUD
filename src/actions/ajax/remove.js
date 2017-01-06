import axios from 'axios';
import variousErrors from './variousErrors';
import {push} from 'react-router-redux';


//removes post on client side so that effec is immediate
const removePost = (id) => {
    return {
        type: 'REMOVE_POST',
        id
    }
}

//removes image on client side so that effec is immediate
const removeImage = () => {
    return {
        type: 'REMOVE_IMAGE'
    }
}

//removes comment on client side so that effect is immediate
const removeComment = (id) => {
    return {
        type: 'REMOVE_COMMENT',
        id
    }
}

//set error that occured while trying to remove comment
const commentRemoveError = (error, id) => {
    return {
        type: 'COMMENT_REMOVE_ERROR',
        error,
        id
    }
}

//sets error that occured while trying to remove post from the view that lists all posts
const blogListRemoveError = (error, id) => {
    return {
        type: 'BLOG_LIST_REMOVE_ERROR',
        error,
        id
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
            if (res.success) {
                switch (requestType) {
                    case 'removePost':
                        let {postId, from} = optionalData;
                        dispatch(removePost(postId));
                        from === 'menu' ? dispatch(push('/')) : null;
                    case 'removeImage':                
                        dispatch(removeImage());
                    case 'removeComment':
                        let {commentId} = optionalData;
                        dispatch(removeComment(commentId));
                }
            }
            else if (res.error) {
                switch (requestType) {
                    case 'removePost':
                        let {postId, from} = optionalData;
                        from === 'list' ? 
                            dispatch(blogListRemoveError(res.error, postId)) : 
                            dispatch(variousErrors(res.error));
                    case 'removeImage':
                        dispatch(variousErrors(res.error));
                    case 'removeComment':
                        let {commentId} = optionalData;
                        dispatch(commentRemoveError(res.error, commentId));
                }
            }
        })
    }
}