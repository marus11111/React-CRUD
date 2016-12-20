export default (author, title, body) => {
    return {
        type: 'CREATE_COMMENT',
        author,
        title,
        body
    }
}