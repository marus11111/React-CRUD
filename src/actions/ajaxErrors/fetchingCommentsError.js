export default (error) => {
    return {
        type: 'FETCHING_COMMENTS_ERROR',
        error
    }
}