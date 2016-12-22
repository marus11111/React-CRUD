//sets errors to be displayed in sign up form

export default (message) => {
    return {
        type: 'SIGN_UP_ERROR',
        message
    }
}