export default (state = {}, action) => {
    switch (action.type) {
        case 'IS_MENU_OPEN':
            return {...state, isMenuOpen: action.isMenuOpen};
    }
    return state;
}