export default (state = {posts: 'pending', editedPost: {}, comments: 'pending'}, action) => {
    let {posts} = state;
    switch (action.type){
        case 'DISPLAY_IMAGE':
            return {...state, 
                    imageUrl: action.imageUrl, 
                    userError: null,
                    imageLoading: false
                   };
        case 'REMOVE_IMAGE':
            return {...state, imageUrl: null};
        case 'LOAD_USER_DATA':
            console.log(action);
            return {...state, 
                    imageUrl: action.imageUrl,
                    posts: action.posts,
                    userError: null,
                    imageLoading: false
                   };
        case 'CLEAR_USER_DATA':
            return {posts: 'pending',
                    imageUrl: null
                   }
        case 'CREATE_POST': 
            return {...state, 
                    posts: Array.isArray(posts) ? 
                           posts.concat([action.postObject]) :
                           action.postObject
                   };    
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
        case 'LOAD_COMMENTS':
            return {...state, comments: action.comments}
        case 'DISPLAY_CREATED_COMMENT': {
            let {author, timestamp, body, id} = action;
            console.log(action);
            return {...state, 
                    comments: Array.isArray(state.comments) ? 
                              state.comments.concat([{author, timestamp, body, id}]) : 
                              [{author, timestamp, body, id}]
                   };
        }
        case 'REMOVE_COMMENT': {
            let {comments} = state;
            let removeIndex = (() => {
                for (let i=0; i<comments.length; i++){
                    if (action.id == comments[i].id){
                        return i; 
                    }
                }
            })();
            let before = comments.slice(0, removeIndex);
            let after = comments.slice(removeIndex + 1);
            let newComments = before.concat(after);
            return {...state, comments: newComments};
        }
        case 'IMAGE_LOADING':
            return {...state, imageLoading: true};
    }
    
    return state;
}