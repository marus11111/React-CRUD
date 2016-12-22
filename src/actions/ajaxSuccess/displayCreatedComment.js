export default (author, timestamp, body, id) => {
    return {
        type: 'DISPLAY_CREATED_COMMENT',
        author,
        timestamp,
        body,
        id
    }
}