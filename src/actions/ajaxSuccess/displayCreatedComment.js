export default (author, date, body, commentId) => {
    return {
        type: 'DISPLAY_CREATED_COMMENT',
        author,
        date,
        body,
        commentId
    }
}