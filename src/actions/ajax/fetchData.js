import axios from 'axios';

//sets fetched posts for user that is currently being displayed 
const loadPosts = (posts) => {
    return {
        type: 'LOAD_POSTS',
        posts
    }
}

//sets url of image to be diplayed 
const image = (url) => {
    return {
        type: 'IMAGE',
        url
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

export default (options) => {
    return dispatch => {
        
        let base = '/project2/server/';
        let url = options.user ? 
            `${base}${options.user}` :
            `${base}comments/${options.postId}`;

        axios.get(url)
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
                options.user ? 
                    dispatch(noUserData(res.error)) :
                    dispatch(fetchingCommentsError(res.error));
            }
        })
    }
}