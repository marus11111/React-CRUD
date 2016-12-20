export default (id, title, body) => {
    return {
        type: 'UPDATE_POST',
        id,
        title,
        body
    }
}