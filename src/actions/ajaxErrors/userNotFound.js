//sets error that informs user that data for the user he's trying to access couldn't be found

export default (error) => {
    return {
        type: 'USER_NOT_FOUND',
        error
    }
}