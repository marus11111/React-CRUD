//informs app whether hamburger menu is open 

export default (isMenuOpen) => {
    return {
        type: 'IS_MENU_OPEN',
        isMenuOpen
    }
}