import axios from 'axios';
import {authorize} from './authorization';
import variousErrors from './variousErrors';
import {push} from 'react-router-redux';


//adds created post to posts on client side so that it's immediately available
const addPost = (postObject) => {
    return {
        type: 'ADD_POST',
        postObject
    }
}

//adds created comment to array on client side so that it's immidiately displayed
const addComment = (comment) => {
    return {
        type: 'ADD_COMMENT',
        comment
    }
}

//sets errors to be displayed by Comments component
const commentCreationError = (error) => {
    return {
        type: 'COMMENT_CREATION_ERROR',
        error
    }
}

//sets errors to be displayed in sign up form
const signUpError = (error) => {
    return {
        type: 'SIGN_UP_ERROR',
        error
    }
}


export {commentCreationError};

export default (type, data) => {
    return dispatch => {
        
        let url = `/project2/server/${type}`;
    
        let formData = new FormData();
        for (let key in data) {
            if (data.hasOwnProperty(key)){
                formData.append(key, data[key]);
            }
        }

        axios.post(url,formData)
        .then(res => {
            res = res.data;
            if (res.success) {
                switch (type) {
                    case 'signUp':
                        dispatch(authorize(res.authorize));
                        break;
                    case 'createPost': {
                        let {title, body, user} = data;
                        let {snippet, timestamp, postId} = res;
                        snippet = snippet.replace(/(\r\n)/g, '<br />');
                        let newPost = {title, body, snippet, timestamp, id: postId};
                        dispatch(addPost(newPost));
                        dispatch(push(`/${user}`));
                        break;
                    }               
                    case 'createComment': {
                        let {author, body} = data;
                        let {timestamp, id} = res;
                        let newComment = {author, timestamp, body, id};
                        dispatch(addComment(newComment));
                    }
                }
            }
            else if (res.error) {
                switch (type) {
                    case 'signUp':
                        dispatch(signUpError(res.error));
                        break;
                    case 'createPost':
                        dispatch(variousErrors(res.error));
                        break;
                    case 'createComment':
                        dispatch(commentCreationError(res.error));
                }
            }
        })
    }
}