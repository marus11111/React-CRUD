//sets comments for currently displayed post in app state

export default (comments) => {
    return {
        type: 'LOAD_COMMENTS',
        comments
    }
}