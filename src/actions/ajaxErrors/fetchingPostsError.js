export default (error) => {
    return {
        type: 'FETCHING_POSTS_ERROR',
        error
    }
}