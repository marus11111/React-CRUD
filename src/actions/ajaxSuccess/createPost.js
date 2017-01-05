//adds created post to posts on client side so that it's immediately available

export default (postObject) => {
    return {
        type: 'CREATE_POST',
        postObject
    }
}