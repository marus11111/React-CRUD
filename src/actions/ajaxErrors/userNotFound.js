export default (error) => {
    return {
        type: 'USER_NOT_FOUND',
        error
    }
}