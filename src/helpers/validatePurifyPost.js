export default (title, body) => {
    
    title = DOMPurify.sanitize(title);
    body = DOMPurify.sanitize(body);
    
    //strip html tegs and spaces from string to see if there is any text
    let titleText, bodyText;
    if (title && body){
        titleText = title.replace(/((<\/?[^>]+(>|$))|(&nbsp;))/g, "");
        bodyText = body.replace(/((<\/?[^>]+(>|$))|(&nbsp;))/g, ""); 
    }
    
    return titleText && bodyText && {title, body};             
}