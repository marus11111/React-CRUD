//informs app about scree width so that it knows whether to display hamburger menu or full menu

export default (width) => {
    return {
        type: 'SET_WIDTH',
        width
    }
}