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




const url = '/project2/server.php';

export default (method, requestType, optionalData) => {
    return dispatch => {
    
            let formData = new FormData();
            let data = {requestType, ...optionalData};
            for (let key in data) {
                if (data.hasOwnProperty(key)){
                    formData.append(key, data[key]);
                }
            }

        axios({
            method,
            url, 
            data: formData 
        })
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
        
        /*
        docelowo tak ma wyglądać ta funkcja
        let formData;
        
        if(!optionalData) {
            dispatch(ongoingCookieAuth(true));
        }
        else {
            formData = new FormData();
            let data = optionalData;
            for (let key in data) {
                if (data.hasOwnProperty(key)){
                    formData.append(key, data[key]);
                }
            }
        }

        axios.post(url, formData ? formData : null)
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
            !optionalData ? dispatch(ongoingCookieAuth(false)) : null;
        }) */
    }
}