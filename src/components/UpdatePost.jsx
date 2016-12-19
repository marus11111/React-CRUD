import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import ajaxRequest from '../actions/ajaxRequest';
import setUpdatedPost from '../actions/setUpdatedPost';
import updatePost from '../actions/updatePost';
import errorHandler from '../actions/errorHandler';
import protect from '../HOC/protectedComponent.jsx';

class UpdatePost extends Component {
    constructor(props) {
        super(props);
        this.submitHandler = this.submitHandler.bind(this);
    }
        
    componentWillReceiveProps(nextProps){
        let {posts, setUpdatedPost, params: {postId}} = nextProps;
        if (posts != 'pending'){
            setUpdatedPost(postId);
        }
    }
    
    submitHandler(event){
        event.preventDefault();
        let {title, body, ajaxRequest, updatePost, errorHandler, router, params: {user, postId}} = this.props;
        ajaxRequest('post', `updatePost`, {postId, title, body})
        .then(() => {
            updatePost(postId, title, body);
            let titleLink = title.toLowerCase().replace(/\s/g, '_');
            router.push(`/${user}/${postId}/${titleLink}`);
        })
        .catch((res) => errorHandler(res.error));
    }
    
    render(){
        return ( 
            <div>
                <form onSubmit={this.submitHandler}>
                    <Field component='input' type='text' name='title'/>
                    <Field component='textarea' name='body'/>
                    <button type='submit'>Update Post</button>
                </form>
            </div>
        )
    }
}

UpdatePost = reduxForm({ form: 'updatePost' })(UpdatePost);

const selector = formValueSelector('updatePost');
const mapStateToProps = (state, ownProps) => {
    return {
        title: selector(state, 'title'),
        body: selector(state, 'body'),
        initialValues: {...state.userData.updatedPost},
        enableReinitialize: true,
        posts: state.userData.posts
    }
}

UpdatePost = connect(mapStateToProps, {ajaxRequest, setUpdatedPost, updatePost, errorHandler})(withRouter(UpdatePost));

export default protect(UpdatePost);