export default (state = {posts: 'pending', updatedPost: {}}, action) => {
    switch (action.type){
        case 'LOAD_IMAGE':
            return {...state, imageUrl: action.imageUrl, userError: null};
        case 'REMOVE_IMAGE':
            return {...state, imageUrl: null};
        case 'FETCH_USER_DATA':
            return {...state, 
                    imageUrl: action.imageUrl,
                    posts: action.posts,
                    userError: null
                   };
        case 'CREATE_POST':
            return {...state, posts: state.posts.concat([action.postObject])};
        case 'SET_UPDATED_POST':
            let {posts} = state;
            for (let i=0; i<posts.length; i++) {
                let {title, body, id} = posts[i];
                if (action.id == id){
                    return {...state, updatedPost: {title, body}};
                }
            } 
        case 'USER_ERROR':
            return {userError: action.error};
        case 'ERROR':
            return {...state, error: action.error};
        case 'CLOSE_ERROR':
            return {...state, error: null};
    }
    
    return state;
}