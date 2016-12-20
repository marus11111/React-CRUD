export default (user) => {
    return {
        type: 'SET_LINK_USER',
        linkUser: user.toLowerCase()
    }
}