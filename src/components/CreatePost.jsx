import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import ajaxRequest from '../helpers/ajaxRequest';
import createPost from '../actions/ajaxSuccess/createPost';
import variousErrors from '../actions/ajaxErrors/variousErrors';
import protect from '../HOC/protectedComponent.jsx';

class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.submitHandler = this.submitHandler.bind(this);
    }
    
    submitHandler(event){
        event.preventDefault();
        let {title, body, ajaxRequest, createPost, variousErrors, router, params: {user}} = this.props;
        
        if(!title || !body) {
            variousErrors('Post must contain title and body.');
        }
        else {
            ajaxRequest('post', `createPost`, {title, body})
            .then(res => {
                createPost({title, body, id: res.postId});
                router.push(`/${user}`);
            })
            .catch(res => variousErrors(res.error));
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