import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import ajaxRequest from '../helpers/ajaxRequest';
import createPost from '../actions/ajaxSuccess/createPost';
import variousErrors from '../actions/ajaxErrors/variousErrors';
import protect from '../HOC/protectedComponent.jsx';
import RichTextMarkdown from './RichTextMarkdown';

class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.submitHandler = this.submitHandler.bind(this);
    }
 
    submitHandler(event){
        event.preventDefault();
        let {title, body, ajaxRequest, createPost, variousErrors, router, params: {user}} = this.props;
        let titleText, bodyText;
        
        //strip html tegs and spaces from string to see if there is any text
        if (title && body){
            titleText = title.replace(/((<\/?[^>]+(>|$))|(&nbsp;))/g, "");
            bodyText = body.replace(/((<\/?[^>]+(>|$))|(&nbsp;))/g, ""); 
        }
        
        if(!titleText || !bodyText) {
            variousErrors('Post must contain title and body.');
        }
        else {
            ajaxRequest('post', `createPost`, {title, body})
            .then(res => {
                let {snippet, timestamp, postId} = res;
                snippet = snippet.replace(/(\r\n)/g, '<br />');
                createPost({title, body, snippet, timestamp, id: postId});
                router.push(`/${user}`);
            })
            .catch(res => variousErrors(res.error));
        }
    }
    
    render() {
        return ( 
            <div>
                <form onSubmit={this.submitHandler}>
                    <Field component={RichTextMarkdown} name='title'/>
                    <Field component={RichTextMarkdown} name='body'/>
                    <button type='submit'>Create post</button>
                </form>
            </div>
        )
    }
}

CreatePost = reduxForm({form: 'createPost'})(CreatePost);

const selector = formValueSelector('createPost');
const mapStateToProps = (state) => {
    return {
        title: selector(state, 'title'),
        body: selector(state, 'body')
    }
}

CreatePost = connect(mapStateToProps, {ajaxRequest, createPost, variousErrors})(CreatePost);

export default protect(withRouter(CreatePost));