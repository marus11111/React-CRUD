//informs app which post is being edited so that forms can be initialized with its values

export default (id) => {
    return {
        type: 'SET_EDITED_POST',
        id
    }
}