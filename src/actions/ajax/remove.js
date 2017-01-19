import axios from 'axios';
import {push} from 'react-router-redux';
import variousErrors from '../variousErrors';
import setImage from '../setImage';


//removes post on client side so that effec is immediate
const removePost = (id) => {
    return {
        type: 'REMOVE_POST',
        id
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


export default (type, options) => {
    return dispatch => {
    
        const base = '/project2/server';
        let url = options ? 
            `${base}/${type}/${options.id}` :
            `${base}/${type}`;

        axios.delete(url)
        .then(res => {
            res = res.data;
            if (res.success) {
                switch (type) {
                    case 'removePost': {
                        let {id, from} = options;
                        dispatch(removePost(id));
                        from === 'menu' ? dispatch(push('/')) : null;
                        break;
                    }
                    case 'removeImage':                
                        dispatch(setImage(null));
                        break;
                    case 'removeComment': {
                        let {id} = options;
                        dispatch(removeComment(id));
                    }
                }
                dispatch(variousErrors(null));
            }
            else if (res.error) {
                switch (type) {
                    case 'removePost': {
                        let {id, from} = options;
                        from === 'list' ? 
                            dispatch(blogListRemoveError(res.error, id)) : 
                            dispatch(variousErrors(res.error));
                        break;
                    }
                    case 'removeImage':
                        dispatch(variousErrors(res.error));
                        break;
                    case 'removeComment': {
                        let {id} = options;
                        dispatch(commentRemoveError(res.error, id));
                    }
                }
            }
        })
        .catch((error) => {
            throw new Error(`ajax remove: ${error}`);
        })
    }
}