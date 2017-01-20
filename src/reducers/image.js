export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_IMAGE':
      return {...state,
        url: action.url
      };
    case 'IMAGE_UPLOADING':
      return {...state,
        uploading: action.imageUploading
      };
  }

  return state;
}
