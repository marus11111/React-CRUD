//removes post on client side so that effec is immediate

export default (id) => {
    return {
        type: 'REMOVE_POST',
        id
    }
}