//adds url to added image so that it's immediately displayed

export default (imageUrl) => {
    return {
        type: 'DISPLAY_IMAGE',
        imageUrl
    }
}