//sets errors to be displayed in sign up form

export default (error) => {
    return {
        type: 'SIGN_UP_ERROR',
        error
    }
}