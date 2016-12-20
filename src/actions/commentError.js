export default (error) => {
    return {
        type: 'COMMENT_ERROR',
        error
    }
}