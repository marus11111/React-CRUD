//formats title to display it in url

export default (title) => {
  title = title
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s|\.|,|!|\?|&|;|:|@/g, '-')
    .toLowerCase();

  return title;
}
