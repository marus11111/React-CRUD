export default (error) => {
    return {
        type: 'ERROR',
        error
    }
}