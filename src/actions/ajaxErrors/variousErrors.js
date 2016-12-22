//sets errors to be displayed by User component
//types of errors:
//- post not found
//- error while trying to create/edit/remove post

export default (error) => {
    return {
        type: 'VARIOUS_ERRORS',
        error
    }
}