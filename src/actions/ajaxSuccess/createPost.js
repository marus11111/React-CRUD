export default (postObject) => {
    return {
        type: 'CREATE_POST',
        postObject
    }
}