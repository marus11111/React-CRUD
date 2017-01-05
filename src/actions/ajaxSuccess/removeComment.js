//removes comment on client side so that effect is immediate

export default (id) => {
    return {
        type: 'REMOVE_COMMENT',
        id
    }
}