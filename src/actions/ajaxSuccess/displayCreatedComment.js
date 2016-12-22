export default (body, author, date, commentId) => {
    return {
        type: 'DISPLAY_COMMENT',
        body,
        author,
        date,
        commentId
    }
}