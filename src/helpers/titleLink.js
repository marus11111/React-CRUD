import removeMarkdown from 'remove-markdown';

export default (title) => {
    let linkString = removeMarkdown(title, {
        stripListLeaders: false,
        gfm: false})
    .toLowerCase()
    .replace(/\s/g, '_');
    console.log(linkString);
    return linkString;
}