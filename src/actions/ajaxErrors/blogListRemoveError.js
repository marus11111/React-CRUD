export default (error, id) => {
    return {
        type: 'BLOG_LIST_REMOVE_ERROR',
        error,
        id
    }
}