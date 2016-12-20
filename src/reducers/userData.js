export default (state = {posts: [], updatedPost: {}, comments: []}, action) => {
    let {posts} = state;
    switch (action.type){
        case 'LOAD_IMAGE':
            return {...state, imageUrl: action.imageUrl, userError: null};
        case 'REMOVE_IMAGE':
            return {...state, imageUrl: null};
        case 'FETCH_USER_DATA':
            return {...state, 
                    imageUrl: action.imageUrl,
                    posts: action.posts ? action.posts : posts,
                    userError: null
                   };
        case 'CREATE_POST': 
            return {...state, posts: posts.concat([action.postObject])};    
        case 'SET_UPDATED_POST': {
            for (let i=0; i<posts.length; i++) {
                let {title, body, id} = posts[i];
                if (action.id == id){
                    return {...state, updatedPost: {title, body}};
                }
            }
        } 
        case 'UPDATE_POST': {
            let {id, title, body} = action;
            let updateIndex = (() => {
                for (let i=0; i<posts.length; i++){
                    if (id == posts[i].id){
                        return i; 
                    }
                }
            })();
            let before = posts.slice(0, updateIndex);
            let updatedPost = [{id, title, body}];
            let after = posts.slice(updateIndex+1);
            let newPosts = before.concat(updatedPost.concat(after));
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
        case 'CREATE_COMMENT': {
            let {author, title, body} = action;
            return {...state, comments: state.comments.concat([{author, title, body}])};
        }
        case 'USER_ERROR':
            return {userError: action.error};
        case 'COMMENT_ERROR':
            return {...state, commentError: action.error};
        case 'ERROR':
            return {...state, error: action.error};
        case 'CLOSE_ERROR':
            return {...state, error: null};
    }
    
    return state;
}