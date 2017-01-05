//set error that occured while trying to fetch comments

export default (error) => {
    return {
        type: 'FETCHING_COMMENTS_ERROR',
        error
    }
}