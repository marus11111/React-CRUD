import findIndex from 'core-js/fn/array/find-index';

export default (state = {
  comments: []
}, action) => {
  let {
    posts
  } = state;
  switch (action.type) {
    case 'LOAD_COMMENTS':
      return {...state,
        comments: Array.isArray(action.comments) ? action.comments : []
      }
    case 'ADD_COMMENT':
      {
        return {...state,
          comments: state.comments.concat([action.comment])
        }
      }
    case 'REMOVE_COMMENT':
      {
        let {
          comments
        } = state;
        let removeIndex = comments.findIndex((comment) => {
          return action.id === comment.id;
        });
        if (removeIndex >= 0) {
          let before = comments.slice(0, removeIndex);
          let after = comments.slice(removeIndex + 1);
          return {...state,
            comments: before.concat(after)
          };
        }
        break;
      }
    case 'COMMENTS_LOADING':
      return {...state,
        loading: action.commentsLoading
      };
  }

  return state;
}
