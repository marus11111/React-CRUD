export default (state = {
    imageUrl: null,
    imageId: null,
    posts: null
}, action) => {
    switch (action.type){
        case 'LOAD_IMAGE':
            return {...state, imageUrl: action.imageUrl};
        case 'REMOVE_IMAGE':
            return {...state, imageUrl: null};
        case 'FETCH_USER_DATA':
            return {...state, 
                    imageUrl: action.imageUrl,
                    posts: action.posts
                   };
    }
    
    return state;
}