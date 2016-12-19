import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import ajaxRequest from '../actions/ajaxRequest';
import createPost from '../actions/createPost';
import errorHandler from '../actions/errorHandler';
import protect from '../HOC/protectedComponent.jsx';

class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.submitHandler = this.submitHandler.bind(this);
    }
    
    submitHandler(event){
        event.preventDefault();
        let {title, body, ajaxRequest, createPost, errorHandler, router, params: {user}} = this.props;
        ajaxRequest('post', `createPost`, {title, body})
        .then(res => {
            createPost({title, body, id: res.postId});
            router.push(`/${user}`);
        })
        .catch(res => errorHandler(res.error));
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

CreatePost = reduxForm({ form: 'createPost' })(CreatePost);

const selector = formValueSelector('createPost');
const mapStateToProps = (state) => {
    return {
        title: selector(state, 'title'),
        body: selector(state, 'body')
    }
}

CreatePost = connect(mapStateToProps, {ajaxRequest, createPost, errorHandler})(CreatePost);

export default protect(withRouter(CreatePost));