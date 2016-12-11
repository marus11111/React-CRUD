import axios from 'axios';
import reqwest from 'reqwest';

const URL = '/project2/server.php';

const request = (requestType, login, password) =>{
   // return dispatch => {
        console.log(requestType, login, password);
    
        let data = {
            requestType,
            login,
            password
        }
    
        reqwest({
          method: 'post',
          url: URL,
          data
        }).then(res => {
            console.log(JSON.parse(res));
        })
        
   // }
}

export default request;