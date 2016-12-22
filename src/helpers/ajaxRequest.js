import authorize from '../actions/authorization/authorize';
import deauthorize from '../actions/authorization/deathorize';
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
                    resolve(res);
                }
                else {
                    reject(res);
                }
            })
       })  
    }
}

export default ajaxRequest;