import removeMarkdown from 'remove-markdown';

export default (title) => {
    console.log(title);
    let linkString = removeMarkdown(title, {
        stripListLeaders: true,
        gfm: true})
    .toLowerCase()
    .replace(/\s/g, '_');

    return linkString;
}