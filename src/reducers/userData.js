export default (state = {posts: [], editedPost: {}, comments: []}, action) => {
    let {posts} = state;
    switch (action.type){
        case 'DISPLAY_IMAGE':
            return {...state, imageUrl: action.imageUrl, userError: null};
        case 'REMOVE_IMAGE':
            return {...state, imageUrl: null};
        case 'LOAD_USER_DATA':
            console.log(action);
            return {...state, 
                    imageUrl: action.imageUrl,
                    posts: action.posts ? action.posts : posts,
                    userError: null
                   };
        case 'CREATE_POST': 
            return {...state, posts: posts.concat([action.postObject])};    
        case 'SET_EDITED_POST': {
            for (let i=0; i<posts.length; i++) {
                let {title, body, id} = posts[i];
                if (action.id == id){
                    return {...state, editedPost: {title, body}};
                }
            }
        } 
        case 'EDIT_POST': {
            let {id, title, body} = action;
            let editIndex = (() => {
                for (let i=0; i<posts.length; i++){
                    if (id == posts[i].id){
                        return i; 
                    }
                }
            })();
            let before = posts.slice(0, editIndex);
            let editedPost = [{id, title, body}];
            let after = posts.slice(editIndex+1);
            let newPosts = before.concat(editedPost.concat(after));
            return {...state, posts: newPosts};
        }
        case 'REMOVE_POST': {
            let removeIndex = (() => {
                for (let i=0; i<posts.length; i++){
                    if (action.id == posts[i].id){
                        return i; 
                    }
                }
            })();
            let before = posts.slice(0, removeIndex);
            let after = posts.slice(removeIndex + 1);
            let newPosts = before.concat(after);
            return {...state, posts: newPosts};
        }
        case 'DISPLAY_CREATED_COMMENT': {
            let {body, author, date} = action;
            return {...state, comments: state.comments.concat([{body, author, date, commentId}])};
        }
        case 'USER_NOT_FOUND':
            return {userError: action.error};
        case 'COMMENT_ERROR':
            return {...state, commentError: action.error};
        case 'VARIOUS_ERRORS':
            return {...state, error: action.error};
        case 'CLOSE_ERROR_MESSAGE':
            return {...state, error: null};
    }
    
    return state;
}