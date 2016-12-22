//sets errors to be displayed in sign in form

export default (error) => {
    return {
        type: 'SIGN_IN_ERROR',
        error
    }
}