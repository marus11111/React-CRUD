export default (author, date, body, commentId) => {
    return {
        type: 'DISPLAY_COMMENT',
        author,
        date,
        body,
        commentId
    }
}