//sets errors to be displayed in sign in form

export default (message) => {
    return {
        type: 'SIGN_IN_ERROR',
        message
    }
}