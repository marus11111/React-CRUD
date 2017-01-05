//adds created comment to array on client side so that it's immidiately displayed

export default (comment) => {
    return {
        type: 'DISPLAY_CREATED_COMMENT',
        comment
    }
}