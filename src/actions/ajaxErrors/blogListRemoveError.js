//sets error that occured while trying to remove post from the view that lists all posts

export default (error, id) => {
    return {
        type: 'BLOG_LIST_REMOVE_ERROR',
        error,
        id
    }
}