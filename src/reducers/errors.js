export default (state = {}, action) => {
    switch (action.type){
        case 'SIGN_IN_ERROR':
            return {...state, signInError: action.message};
        case 'SIGN_UP_ERROR':
            return {...state, signUpError: action.message};
        case 'USER_NOT_FOUND':
            return {...state, userError: action.error};
        case 'COMMENT_CREATION_ERROR':
            return {...state, commentCreationError: action.error};
        case 'FETCHING_POSTS_ERROR':
            return {...state, fetchingPostsError: action.error};
        case 'VARIOUS_ERRORS':
            return {...state, error: action.error};
        case 'CLEAR_ERRORS':
            return {};
    }
    
    return state;
}