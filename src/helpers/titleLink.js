export default (title) => {
    title = title
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s|\.|,|!|\?|&|;|:|@/g, '-')
    .toLowerCase();

    return title;
}