export default ({imageUrl, posts}) => {
    return {
        type: 'LOAD_USER_DATA',
        imageUrl,
        posts
    }
}