export default (error) => {
    return {
        type: 'USER_ERROR',
        error
    }
}