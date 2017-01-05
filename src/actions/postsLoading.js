//sets state to inform app that posts are being loaded

export default (postsLoading) => {
    return {
        type: 'POSTS_LOADING',
        postsLoading
    }
}