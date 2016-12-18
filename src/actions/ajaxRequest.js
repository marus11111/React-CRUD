import reqwest from 'reqwest';
import authorize from './authorize';
import deauthorize from './deathorize';
import fetchUserData from './fetchUserData';
import loadImage from './loadImage';
import signInError from './signInError';
import signUpError from './signUpError';
import axios from 'axios';

const url = '/project2/server.php';

const ajaxRequest = (method, requestType, optionalData) =>{
    return dispatch => {
       return new Promise((resolve, reject) => {
           
           let data = { requestType, ...optionalData};
           let formData = new FormData();
           for (let key in data) {
               if (data.hasOwnProperty(key)){
                   formData.append(key, data[key]);
               }
           }

            axios({
                method,
                url,
                data: formData
            }).then(res => {
                res = res.data;
                if (res.authorize) {
                    resolve(dispatch(authorize(res.user)));
                }
                else if (res.deauthorize) {
                    resolve(dispatch(deauthorize()));
                }
                else if (res.success) {
                    resolve(`Success: ${res.success}`);
                }
                else if (res.userData) {
                    resolve(dispatch(fetchUserData(res.userData)));
                }
                else if (res.imageUrl) {
                    resolve(dispatch(loadImage(res.imageUrl)));
                }
                else if (res.signInError) {
                    resolve(dispatch(signInError(res.signInError)));
                }
                else if (res.signUpError) {
                    resolve(dispatch(signUpError(res.signUpError)));
                }
                else if (res.error) {
                    reject(`Error occured: ${res.error}`);
                }
            })
       })  
    }
}

export default ajaxRequest;