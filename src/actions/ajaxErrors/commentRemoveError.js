export default (error, id) => {
    return {
        type: 'COMMENT_REMOVE_ERROR',
        error,
        id
    }
}