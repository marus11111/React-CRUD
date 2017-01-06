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

export default (type, data) => {
    return dispatch => {
        
        let base = '/project2/server/';
        let url;
        let formData;
        
        switch (type) {
            case 'cookie':
                url = `${base}cookie`;
                break;
            case 'signIn':
                url = `${base}sign-in`;
                formData = new FormData();
                for (let key in data) {
                    if (data.hasOwnProperty(key)){
                        formData.append(key, data[key]);
                    }
                }
                break;
            case 'signOut':
                url = `${base}sign-out`;
        }

        axios.post(url, formData)
        .then(res => {
            res = res.data;
            if (res.authorize) {
                dispatch(authorize(res.user));
            }
            else if (res.deauthorize) {
                dispatch(deauthorize());
            }
            else if (res.error) {
                dispatch(signInError(res.error));
            }
        })
    }
}