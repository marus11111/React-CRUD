//set error that occured while trying to remove comment

export default (error, id) => {
    return {
        type: 'COMMENT_REMOVE_ERROR',
        error,
        id
    }
}