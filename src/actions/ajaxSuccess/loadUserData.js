//sets fetched data (image and posts) for user that is currently being displayed 

export default ({imageUrl, posts}) => {
    return {
        type: 'LOAD_USER_DATA',
        imageUrl,
        posts
    }
}