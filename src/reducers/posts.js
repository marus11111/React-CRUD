import findIndex from 'core-js/fn/array/find-index';
import find from 'core-js/fn/array/find';

export default (state = {posts: []}, action) => {
    let {posts} = state;
    switch (action.type){
        case 'LOAD_POSTS':
            return {...state,
                    posts: Array.isArray(action.posts) ? action.posts : []
                   };
        case 'ADD_POST': 
            return {...state, 
                    posts: posts.concat([action.postObject])
                   };    
        case 'EDIT_POST': {
            let editIndex = posts.findIndex((post) => {
                return action.post.id === post.id;
            });
            let before = posts.slice(0, editIndex);
            let editedPost = [post];
            let after = posts.slice(editIndex+1);
            return {...state,
                    posts: before.concat(editedPost.concat(after))
                   };
        }
        case 'REMOVE_POST': {
            let removeIndex = posts.findIndex((post) => {
                return action.id === post.id;
            });
            let before = posts.slice(0, removeIndex);
            let after = posts.slice(removeIndex + 1);
            return {...state,
                    posts: before.concat(after)
                   };
        }
        case 'POSTS_LOADING':
            return {...state, postsLoading: action.postsLoading};
        case 'SET_EDITED_POST': {
            let postBeingEdited = posts.find((post) => {
                return action.id === post.id;  
            })
            return {...state, postBeingEdited};
        } 
    }
    
    return state;
}