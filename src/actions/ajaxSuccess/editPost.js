//modifies edited post on client side so that the changes are immediatelly visible

export default (post) => {
    return {
        type: 'EDIT_POST',
        post
    }
}