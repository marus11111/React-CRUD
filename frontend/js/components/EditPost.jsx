//editing existing posts

import React, {
  Component
} from 'react';
import {
  Field,
  reduxForm,
  formValueSelector
} from 'redux-form';
import {
  connect
} from 'react-redux';
import createOrUpdate from '../actions/ajax/createOrUpdate';
import variousErrors from '../actions/variousErrors';
import setEditedPost from '../actions/setEditedPost';
import makeLink from '../helpers/titleLink';
import validatePurifyPost from '../helpers/validatePurifyPost';
import protect from '../HOC/protectedComponent.jsx';
import RichTextMarkdown from '../HOC/RichTextMarkdown';
import rteTitleConfig from '../options/rteTitleConfig';

class EditPost extends Component {

  //inform app which post is edited so it can set initial values for text editor
  //necessary both on componentDidMount (if posts have already been fetched) and on 
  //componentWillReceiveProps (to fire after posts have been fetched if someone navigated directly
  //to edit page)
  componentDidMount() {
    let {
      setEditedPost,
      params: {
        postId
      }
    } = this.props;
    setEditedPost(postId);
  }

  componentWillReceiveProps(nextProps) {
    let {
      posts,
      postBeingEdited,
      setEditedPost,
      params: {
        postId
      }
    } = nextProps;
    let post = postBeingEdited ? postBeingEdited : {};
    if (post.id !== postId && posts.length > 0) {
      setEditedPost(postId);
    }
  }

  //submit edited post
  submitHandler = (event) => {
    event.preventDefault();
    let {
      title,
      body,
      createOrUpdate,
      postBeingEdited: {
        timestamp
      },
      variousErrors,
      params: {
        user,
        postId
      }
    } = this.props;
    let validPost = validatePurifyPost(title, body);
    validPost ?
      createOrUpdate('editPost', {
        postId,
        title: validPost.title,
        body: validPost.body,
        timestamp,
        user
      }) :
      variousErrors('Post must contain title and body.');
  }

  render() {
    let post = this.props.postBeingEdited;
    let {
      title,
      body
    } = post ? post : {};
    
    return (
      <div className='row row-center rich-text'>
        <form 
          className='col-xs-12 col=sm-9 col-md-7 col-centered'
          onSubmit={this.submitHandler}>
          <Field 
            component={RichTextMarkdown} 
            toolbarConfig={rteTitleConfig} 
            initialVal={title} 
            name='title'/>
          <Field 
            className='rich-text__body'
            component={RichTextMarkdown} 
            initialVal={body} 
            name='body'/> 
          <button 
            className='btn'
            type='submit'>
            Edit Post
          </button>
        </form>
      </div>
    )
  }
}

EditPost = reduxForm({
  form: 'editPost'
})(EditPost);

//initialValues and enable reinitialize are necessary for redux form to set initial 
//values on form reducer
const selector = formValueSelector('editPost');
const mapStateToProps = (state, ownProps) => {
  return {
    title: selector(state, 'title'),
    body: selector(state, 'body'),
    postBeingEdited: state.posts.postBeingEdited,
    initialValues: {...state.posts.postBeingEdited
    },
    enableReinitialize: true,
    posts: state.posts.posts
  }
}

EditPost = connect(mapStateToProps, {
  createOrUpdate,
  variousErrors,
  setEditedPost
})(EditPost);

export default protect(EditPost);
