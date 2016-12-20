export default (error) => {
    return {
        type: 'VARIOUS_ERRORS',
        error
    }
}