export default (state = {}, action) => {
    switch (action.type) {
        case 'SET_WIDTH':
            return {...state, width: action.width};
        case 'IS_MENU_OPEN':
            return {...state, isMenuOpen: action.isMenuOpen};
    }
    return state;
}