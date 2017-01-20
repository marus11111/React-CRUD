import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import createOrUpdate from '../actions/ajax/createOrUpdate';
import variousErrors from '../actions/variousErrors';
import validatePurifyPost from '../helpers/validatePurifyPost';
import protect from '../HOC/protectedComponent.jsx';
import RichTextMarkdown from '../HOC/RichTextMarkdown';
import rteTitleConfig from '../options/rteTitleConfig';

class CreatePost extends Component {
     
    submitHandler = (event) => {
        event.preventDefault();
        let {title, body, createOrUpdate, variousErrors, params: {user}} = this.props;
        let validPost = validatePurifyPost(title, body);
        validPost ? 
            createOrUpdate('createPost', {title: validPost.title, body: validPost.body, user}) : 
            variousErrors('Post must contain title and body.');
    }
    
    render() {        
        return ( 
            <div className='rich-text row row-center'>
                <form 
                    className='col-xs-12 col=sm-9 col-md-7 col-centered'
                    onSubmit={this.submitHandler}>
                    <Field 
                        placeholder='Title'
                        component={RichTextMarkdown} 
                        toolbarConfig={rteTitleConfig} 
                        name='title'/>
                    <Field 
                        placeholder='Body'
                        className='rich-text__body'
                        component={RichTextMarkdown} 
                        name='body'/>
                    <button 
                        className='btn'
                        type='submit'>
                        Create post
                    </button>
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