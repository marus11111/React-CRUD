//sets state to inform app that image is loading and loading animation should be displayed

export default (imageLoading) => {
    return {
        type: 'IMAGE_LOADING',
        imageLoading
    }
}