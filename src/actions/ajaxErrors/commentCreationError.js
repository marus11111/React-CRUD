//sets errors to be displayed by Comments component

export default (error) => {
    return {
        type: 'COMMENT_CREATION_ERROR',
        error
    }
}