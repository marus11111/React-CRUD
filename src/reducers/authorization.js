export default function(state = { 
    authorizedUser: null,
    activeForm: 'signIn',
    signInError: null,
    signUpError: null
}, action) {
    switch (action.type) {
        case 'AUTHORIZE':
            return {...state, 
                    authorizedUser: action.authorizedUser,
                    signInError: null,
                    signUpError: null,
                   };
        case 'DEAUTHORIZE':
            return {...state, authorizedUser: null};
        case 'SIGN_IN_ERROR':
            return {...state, signInError: action.message}
        case 'SIGN_UP_ERROR':
            return {...state, signUpError: action.message}
        case 'ACTIVATE_SIGN_IN':
            return {...state, activeForm: 'signIn'};
        case 'ACTIVATE_SIGN_UP':
            return {...state, activeForm: 'signUp'};  
    }
    return state;
}