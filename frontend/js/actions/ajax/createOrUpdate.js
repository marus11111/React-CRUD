import axios from 'axios';
import {
  push
} from 'react-router-redux';
import {
  authorize
} from './authorization';
import variousErrors from '../variousErrors';
import setEditedPost from '../setEditedPost';
import commentCreationError from '../commentCreationError';
import setImage from '../setImage';
import makeLink from '../../helpers/titleLink';


//adds created post to posts on client side so that it's immediately available
const addPost = (postObject) => {
  return {
    type: 'ADD_POST',
    postObject
  }
}

//modifies edited post on client side so that the changes are immediatelly visible
const editPost = (post) => {
  return {
    type: 'EDIT_POST',
    post
  }
}

//adds created comment to array on client side so that it's immidiately displayed
const addComment = (comment) => {
  return {
    type: 'ADD_COMMENT',
    comment
  }
}

//sets errors to be displayed in sign up form
const signUpError = (error) => {
  return {
    type: 'SIGN_UP_ERROR',
    error
  }
}

//informs app whether image is currently being uploaded
const imageUploading = (bool) => {
  return {
    type: 'IMAGE_UPLOADING',
    imageUploading: bool
  }
}

//variable that will be informing function whether post or comment creation is
//currently being processed so that it can prevent double insertion
let processingCreate = false;

export default (type, data) => {
  return dispatch => {

    //inform app that image is beaing processed so that it can show loading animation
    if (type === 'imageUpload') dispatch(imageUploading(true));

    //prevent double insertion of posts and comments
    if (type === 'createPost' || type === 'createComment') {
      if (processingCreate) return;
      processingCreate = true;
    }

    let url = `/project2/server/${type}`;

    let formData = new FormData();
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }

    //make request and then handle data appropriately dpending on request type and reponse
    axios.post(url, formData)
      .then(res => {
        res = res.data;
        if (res.success) {
          switch (type) {
            case 'signUp':
              dispatch(authorize(res.authorize));
              break;
            case 'createPost':
              {
                let {
                  title,
                  body,
                  user
                } = data;
                let {
                  snippet,
                  timestamp,
                  postId
                } = res;
                snippet = snippet.replace(/\\r\\n/g, '');
                let newPost = {
                  title,
                  body,
                  snippet,
                  timestamp,
                  id: `${postId}`
                };
                dispatch(addPost(newPost));
                dispatch(push(`/${user}`));
                break;
              }
            case 'editPost':
              {
                let {
                  title,
                  body,
                  postId,
                  timestamp,
                  user
                } = data;
                let {
                  snippet
                } = res;
                snippet = snippet.replace(/\\r\\n/g, '');
                let modifiedPost = {
                  title,
                  body,
                  snippet,
                  timestamp,
                  id: postId
                };
                dispatch(editPost(modifiedPost));
                dispatch(setEditedPost(postId));
                let titleLink = makeLink(title);
                dispatch(push(`/${user}/${postId}/${titleLink}`));
                break;
              }
            case 'createComment':
              {
                let {
                  author,
                  body
                } = data;
                let {
                  timestamp,
                  id
                } = res;
                let newComment = {
                  author,
                  timestamp,
                  body,
                  id
                };
                dispatch(addComment(newComment));
                dispatch(commentCreationError(null));
                break;
              }
            case 'imageUpload':
              dispatch(setImage(res.imageUrl));
          }
          dispatch(variousErrors(null));
        } else if (res.error) {
          switch (type) {
            case 'signUp':
              dispatch(signUpError(res.error));
              break;
            case 'createPost':
            case 'editPost':
            case 'uploadImage':
              dispatch(variousErrors(res.error));
              break;
            case 'createComment':
              dispatch(commentCreationError(res.error));
          }
        }
        if (type === 'imageUpload') dispatch(imageUploading(false));
        if (type === 'createPost' || type === 'createComment') processingCreate = false;
      })
      .catch((error) => {
        throw new Error(`ajax createOrUpdate: ${error}`);
      })
  }
}
