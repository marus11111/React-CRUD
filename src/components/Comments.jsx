import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field, formValueSelector} from 'redux-form'
import ajaxRequest from '../actions/ajaxRequest';
import commentError from '../actions/commentError';
import createComment from '../actions/createComment';

class Comments extends Component {
    constructor(props) {
        super(props);
        this.submitHandler = this.submitHandler.bind(this);
    }
    
    
    submitHandler(event){
        event.preventDefault();
        let {title, body, author, ajaxRequest, createComment, commentError, params: {postId}} = this.props;
        
        if(!title || !body) {
            errorHandler('Comment must contain title and body.');
        }
        else {
            ajaxRequest('post', `createComment`, {title, body, postId, authorId})
            .then(res => createComment({title, body, id: res.postId}))
            .catch(res => commentError(res.error));
        }
    }
    
    render() {
        return (
            <div>
                <form onSubmit={this.submitHandler}>
                    <Field component='input' type='text' name='title'/>
                    <Field component='textarea' name='body'/>
                    <button type='submit'>Create post</button>
                </form>
            </div>
        )
    }
}

let selector = formValueSelector('addComment');
let mapStateToProps = (state) => {
    return {
        title: selector(state, 'title'),
        body: selector(state, 'body'),
    }
}

Comments = connect(mapStateToProps, {ajaxRequest, commentError, createComment})(Comments);
Comments = reduxForm ({form: 'addComment'})(Comments);

export default Comments;