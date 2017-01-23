import axios from 'axios';
import setImage from '../setImage';

//sets fetched posts for user that is currently being displayed 
const loadPosts = (posts) => {
  return {
    type: 'LOAD_POSTS',
    posts
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

//sets state to inform app that posts are being loaded
const postsLoading = (bool) => {
  return {
    type: 'POSTS_LOADING',
    postsLoading: bool
  }
}

//sets state to inform app that comments are being loaded
const commentsLoading = (bool) => {
  return {
    type: 'COMMENTS_LOADING',
    commentsLoading: bool
  }
}

export default (type, data) => {
  return dispatch => {

    let base = '/project2/server';
    let url;

    if (type === 'user') {
      url = `${base}/${data}`;
      dispatch(postsLoading(true));
    } else {
      url = `${base}/comments/${data}`;
      dispatch(commentsLoading(true));
    }

    axios.get(url)
      .then(res => {
        res = res.data;
        if (res.userData) {
          dispatch(setImage(res.userData.imageUrl));

          //userData may come with just image url and error when it comes to fetching posts
          if (res.postsError) {
            dispatch(fetchingPostsError(res.postsError))
          } else {
            dispatch(loadPosts(res.userData.posts));
            dispatch(fetchingPostsError(null));
          }
        } else if (res.comments) {
          dispatch(loadComments(res.comments));
          dispatch(fetchingCommentsError(null));
        } else if (res.error) {
          type === 'user' ?
            dispatch(noUserData(res.error)) :
            dispatch(fetchingCommentsError(res.error));
        }

        type === 'user' ?
          dispatch(postsLoading(false)) :
          dispatch(commentsLoading(false));
      })
      .catch((error) => {
        throw new Error(`ajax fetchData: ${error}`);
      })
  }
}
