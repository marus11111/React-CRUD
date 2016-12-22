export default (id, title, body) => {
    return {
        type: 'EDIT_POST',
        id,
        title,
        body
    }
}