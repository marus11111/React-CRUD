import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import ajaxRequest from '../helpers/ajaxRequest';
import makeLink from '../helpers/titleLink';
import setEditedPost from '../actions/setEditedPost';
import editPost from '../actions/ajaxSuccess/editPost';
import variousErrors from '../actions/ajaxErrors/variousErrors';
import protect from '../HOC/protectedComponent.jsx';
import RichTextMarkdown from './RichTextMarkdown';

class EditPost extends Component {
    constructor(props) {
        super(props);
        this.submitHandler = this.submitHandler.bind(this);
    }
        
    componentWillReceiveProps(nextProps){
        let {posts, editedPost, setEditedPost, params: {postId}} = nextProps;
        if ((!this.props.editedPost.id || this.props.editedPost.id !== postId) && posts.length > 0){
            setEditedPost(postId);
        }
    }
    
    submitHandler(event){
        event.preventDefault();
        let {title, body, ajaxRequest, editPost, setEditedPost, variousErrors, router, params: {user, postId}} = this.props;
        
        if(!title || !body) {
            variousErrors('Post must contain title and body.');
        }
        else {
            ajaxRequest('post', `editPost`, {postId, title, body})
            .then(() => {
                editPost(postId, title, body);
                setEditedPost(postId);
                let titleLink = makeLink(title);
                router.push(`/${user}/${postId}/${titleLink}`);
            })
            .catch((res) => variousErrors(res.error));
        }
    }
    
    render(){
        let {title, body} = this.props.editedPost;
        
        return ( 
            <div>
                <form onSubmit={this.submitHandler}>
                    <Field component={RichTextMarkdown} initialVal={title} name='title'/>
                    <Field component={RichTextMarkdown} initialVal={body} name='body'/>
                    <button type='submit'>Edit Post</button>
                </form>
            </div>
        )
    }
}

EditPost = reduxForm({ form: 'editPost' })(EditPost);

const selector = formValueSelector('editPost');
const mapStateToProps = (state, ownProps) => {
    return {
        title: selector(state, 'title'),
        body: selector(state, 'body'),
        editedPost: state.userData.editedPost,
        initialValues: {...state.userData.editedPost},
        enableReinitialize: true,
        posts: state.userData.posts
    }
}

EditPost = connect(mapStateToProps, {ajaxRequest, setEditedPost, editPost, variousErrors})(withRouter(EditPost));

export default protect(EditPost);