//clears user data (image and posts) so that there is no flash of
//previous user profile after navigating to another user

export default () => {
    return {
        type: 'CLEAR_USER_DATA'
    }
}