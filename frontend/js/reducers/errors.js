export default (state = {
    commentRemoveError: {
      ids: []
    },
    blogListRemoveError: {
      ids: []
    }
  },
  action) => {
  let {
    error
  } = action;
  switch (action.type) {
    case 'SIGN_IN_ERROR':
      return {...state,
        signInError: error
      };
    case 'SIGN_UP_ERROR':
      return {...state,
        signUpError: error
      };
    case 'NO_USER_DATA':
      return {...state,
        userError: error
      };
    case 'COMMENT_CREATION_ERROR':
      return {...state,
        commentCreationError: error
      };
    case 'COMMENT_REMOVE_ERROR':
      return {...state,
        commentRemoveError: {
          error,
          ids: [...state.commentRemoveError.ids, action.id]
        }
      };
    case 'FETCHING_COMMENTS_ERROR':
      return {...state,
        fetchingCommentsError: error
      }
    case 'FETCHING_POSTS_ERROR':
      return {...state,
        fetchingPostsError: error
      };
    case 'BLOG_LIST_REMOVE_ERROR':
      return {...state,
        blogListRemoveError: {
          error,
          ids: [...state.blogListRemoveError.ids, action.id]
        }
      }
    case 'VARIOUS_ERRORS':
      return {...state,
        error
      };
    case 'CLEAR_ERRORS':
      return {
        commentRemoveError: {
          ids: []
        },
        blogListRemoveError: {
          ids: []
        }
      }
  }
  return state;
}
