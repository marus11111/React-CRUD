import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import update from '../actions/ajax/update';
import variousErrors from '../actions/ajax/variousErrors';
import setEditedPost from '../actions/setEditedPost';
import makeLink from '../helpers/titleLink';
import protect from '../HOC/protectedComponent.jsx';
import RichTextMarkdown from './RichTextMarkdown';

class EditPost extends Component {
        
    componentDidMount() {
        let {setEditedPost, params: {postId}} = this.props;
        setEditedPost(postId);
    }
    
    componentWillReceiveProps(nextProps){
        let {posts, postBeingEdited, setEditedPost, params: {postId}} = nextProps;
        if ((!this.props.postBeingEdited.id || this.props.postBeingEdited.id !== postId) && posts.length > 0){
            setEditedPost(postId);
        }
    }
    
    submitHandler = (event) => {
        event.preventDefault();
        let {title, body, update, postBeingEdited: {timestamp}, variousErrors, params: {user, postId}} = this.props;
        
        if(!title || !body) {
            variousErrors('Post must contain title and body.');
        }
        else {
            update('post', `editPost`, {postId, title, body, user});
        }
    }
    
    render(){
        let {title, body} = this.props.postBeingEdited;
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
        postBeingEdited: state.posts.postBeingEdited,
        initialValues: {...state.posts.postBeingEdited},
        enableReinitialize: true,
        posts: state.posts.posts
    }
}

EditPost = connect(mapStateToProps, {update, variousErrors, setEditedPost})(EditPost);

export default protect(EditPost);