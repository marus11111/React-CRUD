export default (authorizedUser) => {
    return {
        type: 'AUTHORIZE',
        authorizedUser: authorizedUser.toLowerCase()
    }
}