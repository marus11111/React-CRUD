export default (title, body) => {

    let post = null;
    
    //strip html tegs and spaces from string to see if there is any text
    let titleText, bodyText;
    if (title && body){
        titleText = title.replace(/((<\/?[^>]+(>|$))|(&nbsp;))/g, "");
        bodyText = body.replace(/((<\/?[^>]+(>|$))|(&nbsp;))/g, ""); 
    }
    
    //purify title and body and strip <p> tag from title
    if (titleText && bodyText) {
        title = DOMPurify.sanitize(title);
        title = title.replace(/^<p>/,'').replace(/<\/p>$/,'');
        body = DOMPurify.sanitize(body);
        post = {title, body};
    }
    
    return post;             
}