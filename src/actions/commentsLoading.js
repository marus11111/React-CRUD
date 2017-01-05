//sets state to inform app that comments are being loaded

export default (commentsLoading) => {
    return {
        type: 'COMMENTS_LOADING',
        commentsLoading
    }
}