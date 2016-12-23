export default (error) => {
    return {
        type: 'COMMENT_REMOVE_ERROR',
        error
    }
}