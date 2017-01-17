import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import createOrUpdate from '../actions/ajax/createOrUpdate';
import variousErrors from '../actions/variousErrors';
import validatePurifyPost from '../helpers/validatePurifyPost';
import protect from '../HOC/protectedComponent.jsx';
import RichTextMarkdown from './RichTextMarkdown';
import rteTitleConfig from '../options/rteTitleConfig';

class CreatePost extends Component {
     
    submitHandler = (event) => {
        event.preventDefault();
        let {title, body, createOrUpdate, variousErrors, params: {user}} = this.props;
        console.log(body);
        let validPost = validatePurifyPost(title, body);
        if (validPost) createOrUpdate('createPost', {title: validPost.title, body: validPost.body, user});
    }
    
    render() {        
        return ( 
            <div>
                <form onSubmit={this.submitHandler}>
                    <Field component={RichTextMarkdown} rteConfig={rteTitleConfig} name='title'/>
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

CreatePost = connect(mapStateToProps, {createOrUpdate, variousErrors})(CreatePost);

export default protect(CreatePost);