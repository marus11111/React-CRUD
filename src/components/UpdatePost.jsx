import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import ajaxRequest from '../actions/ajaxRequest';
import setUpdatedPost from '../actions/setUpdatedPost';
import updatePost from '../actions/ajaxSuccess/updatePost';
import variousErrors from '../actions/ajaxErrors/variousErrors';
import protect from '../HOC/protectedComponent.jsx';

class UpdatePost extends Component {
    constructor(props) {
        super(props);
        this.submitHandler = this.submitHandler.bind(this);
    }
        
    componentWillReceiveProps(nextProps){
        let {posts, setUpdatedPost, params: {postId}} = nextProps;
        if (posts.length > 0){
            setUpdatedPost(postId);
        }
    }
    
    submitHandler(event){
        event.preventDefault();
        let {title, body, ajaxRequest, updatePost, variousErrors, router, params: {user, postId}} = this.props;
        
        if(!title || !body) {
            variousErrors('Post must contain title and body.');
        }
        else {
            ajaxRequest('post', `updatePost`, {postId, title, body})
            .then(() => {
                updatePost(postId, title, body);
                let titleLink = title.toLowerCase().replace(/\s/g, '_');
                router.push(`/${user}/${postId}/${titleLink}`);
            })
            .catch((res) => variousErrors(res.error));
        }
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

UpdatePost = connect(mapStateToProps, {ajaxRequest, setUpdatedPost, updatePost, variousErrors})(withRouter(UpdatePost));

export default protect(UpdatePost);