import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import create from '../actions/ajax/create';
import variousErrors from '../actions/ajax/variousErrors';
import protect from '../HOC/protectedComponent.jsx';
import RichTextMarkdown from './RichTextMarkdown';

class CreatePost extends Component {
     
    submitHandler = (event) => {
        event.preventDefault();
        let {title, body, create, variousErrors, params: {user}} = this.props;
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
            create('post', `createPost`, {title, body, user});
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

CreatePost = connect(mapStateToProps, {create, variousErrors})(CreatePost);

export default protect(CreatePost);