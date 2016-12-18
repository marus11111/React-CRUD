export default ({imageUrl, posts}) => {
    return {
        type: 'FETCH_USER_DATA',
        imageUrl,
        posts
    }
}