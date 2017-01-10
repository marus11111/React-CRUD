export default (state = {}, action) => {
    switch (action.type){
        case 'SET_IMAGE':
            return {...state, 
                    url: action.url 
                   };
        case 'IMAGE_LOADING':
            return {...state, 
                    loading: action.loading
                   };
    }
    
    return state;
}