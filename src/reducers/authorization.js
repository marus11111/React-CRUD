export default function(state = {activeForm: 'signIn'}, action) {
    switch (action.type) {
        case 'ONGOING_COOKIE_AUTH':
            return {...state, 
                    ongoingCookieAuth: action.ongoingCookieAuth
                   };
        case 'AUTHORIZE':
            return {...state, 
                    authorizedUser: action.authorizedUser,
                    signInError: null,
                    signUpError: null,
                   };
        case 'DEAUTHORIZE':
            return {...state, 
                    authorizedUser: null
                   };
        case 'ACTIVATE_SIGN_IN':
            return {...state, 
                    activeForm: 'signIn'
                   };
        case 'ACTIVATE_SIGN_UP':
            return {...state, 
                    activeForm: 'signUp'
                   };
    }
    return state;
}