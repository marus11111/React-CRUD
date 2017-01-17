import axios from 'axios';


//Action creator to authorize user.
const authorize = (authorizedUser) => {
    return {
        type: 'AUTHORIZE',
        authorizedUser
    }
}

//Action creator to deauthorize user.
const deauthorize = () => {
    return {
        type: 'DEAUTHORIZE',
    }
}

//Action to inform app that credentials are being checked with cookies.
//Necessary so that we can prevent authorization component showing 
//for fraction of a second before redirecting if user is logged in
const ongoingCookieAuth = (bool) => {
    return {
        type: 'ONGOING_COOKIE_AUTH',
        ongoingCookieAuth: bool
    }
}


//sets errors to be displayed in sign in form
const signInError = (error) => {
    return {
        type: 'SIGN_IN_ERROR',
        error
    }
}

export {authorize};

export default (type, data) => {
    return dispatch => {
        
        type === 'cookie' ? dispatch(ongoingCookieAuth(true)) : null;
        
        let url = `/project2/server/${type}`;
        let formData;
        
        if (type === 'signIn') {
            formData = new FormData();
            for (let key in data) {
                if (data.hasOwnProperty(key)){
                    formData.append(key, data[key]);
                }
            }
        }
        
        axios.post(url, formData)
        .then(res => {
            res = res.data;
            if (res.authorize) {
                dispatch(authorize(res.authorize));
            }
            else if (res.deauthorize) {
                dispatch(deauthorize());
            }
            else if (res.error) {
                dispatch(signInError(res.error));
            }
            type === 'cookie' ? dispatch(ongoingCookieAuth(false)) : null;
        })
        .catch((error) => {
            throw new Error(`ajax authorization: ${error}`);
        })
    }
}