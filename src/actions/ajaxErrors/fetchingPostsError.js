//set error that occured while trying to fetch posts

export default (error) => {
    return {
        type: 'FETCHING_POSTS_ERROR',
        error
    }
}