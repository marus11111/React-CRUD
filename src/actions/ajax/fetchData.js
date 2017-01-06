import axios from 'axios';

//sets fetched posts for user that is currently being displayed 
const loadPosts = (posts) => {
    return {
        type: 'LOAD_POSTS',
        posts
    }
}

//sets fetched posts for user that is currently being displayed 
const image = (imageUrl) => {
    return {
        type: 'IMAGE',
        imageUrl
    }
}


//sets comments for currently displayed post in app state
const loadComments = (comments) => {
    return {
        type: 'LOAD_COMMENTS',
        comments
    }
}

//set error that occured while trying to fetch posts
const fetchingPostsError = (error) => {
    return {
        type: 'FETCHING_POSTS_ERROR',
        error
    }
}

//set error that occured while trying to fetch comments
const fetchingCommentsError = (error) => {
    return {
        type: 'FETCHING_COMMENTS_ERROR',
        error
    }
}

//sets error that informs user that data for the user he's trying to access couldn't be found
const noUserData = (error) => {
    return {
        type: 'NO_USER_DATA',
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
            if (res.userData) {
                dispatch(loadPosts(res.userData.posts));
                dispatch(image(res.userData.imageUrl));
            }
            else if (res.comments) {
                dispatch(loadComments(res.comments));
            }
            else if (res.postsError) {
                dispatch(fetchingPostsError(res.postsError));
            }
            else if (res.error) {
                requestType === 'fetchComments' ? 
                    dispatch(fetchingCommentsError(res.error)) :
                    dispatch(noUserData(res.error));
            }
        })
    }
}



/* 
ostatecznie to bedzie po prostu get url
trudnością będzie tylko wyciągnięcie odpowiedniego url
export default (optionalData) => {
    return dispatch => {

        axios.get(url)
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
*/