import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field, formValueSelector} from 'redux-form';
import {Link} from 'react-router';
import ajaxRequest from '../helpers/ajaxRequest';
import formatDate from '../helpers/formatDate';
import commentCreationErrorAction from '../actions/ajaxErrors/commentCreationError';
import commentRemoveErrorAction from '../actions/ajaxErrors/commentRemoveError';
import displayCreatedComment from '../actions/ajaxSuccess/displayCreatedComment';
import removeCommentAction from '../actions/ajaxSuccess/removeComment';
import ciCompare from '../helpers/ciCompare';

class Comments extends Component {

    submitHandler = (event) => {
        event.preventDefault();
        let {body, postId, authorizedUser, ajaxRequest, displayCreatedComment, commentCreationErrorAction} = this.props;
        let author = authorizedUser ? authorizedUser : '';
        if(!body) {
            commentCreationErrorAction('Comment must contain some text.');
        }
        else {
            ajaxRequest('post', `createComment`, {body, postId, author})
            .then(res => displayCreatedComment(author, res.timestamp, body, res.id))
            .catch(res => commentCreationErrorAction(res.error)); // opisać że catch w react 'połyka' błędy 
        }
    }
    
    removeComment = (commentId) => {
        this.props.ajaxRequest('post', 'removeComment', {commentId})
        .then(() => this.props.removeCommentAction(commentId))
        .catch(res => this.props.commentRemoveErrorAction(res.error, commentId));
    }
    
    render() {
        let {comments, authorizedUser, linkUser, commentCreationError, fetchingCommentsError, commentRemoveError} = this.props;
        let usersEqual = ciCompare(authorizedUser,linkUser);
        let children;
        
        if (!Array.isArray(comments)){
            if (comments === 'pending') {
                children = null;
            }
            else if (fetchingCommentsError) {
                children = <li>{fetchingCommentsError}</li>;
            }
            else if (!comments) {
                children = <li>No comments yet.</li>;
            } 
        }
        else {
            children = comments.map(comment => {
                let {author, timestamp, body, id} = comment;
                let date = formatDate(timestamp, 'comment');
                let isRemoveError = commentRemoveError.ids.some((errorId) => errorId === id);
                
                return (
                    <li key={id}>
                        {isRemoveError &&
                            <p>{commentRemoveError.error}</p>
                        }
                        <time dateTime={date.iso}>{date.display}</time>
                        {author &&
                            <Link to={`/${author}`}>{author}</Link>
                        }
                        {!author &&
                            <span>Anonymous</span>
                        }
                        {(authorizedUser === author || usersEqual) &&
                            <button className='btn btn-sm btn-danger' onClick={() => this.removeComment(id)}><span className='glyphicon glyphicon-trash'></span></button>
                        }
                        <p>{body}</p>
                    </li>
                )
            });
        }

        return (
            <div>
                {commentCreationError &&
                    <p>{commentCreationError}</p>
                }
                <form onSubmit={this.submitHandler}>
                    <Field component='textarea' name='body'/>
                    <button type='submit'>Create comment</button>
                </form>
                <ul>
                    {children}
                </ul>
            </div>
        )
    }
}

let selector = formValueSelector('addComment');
let mapStateToProps = (state) => {
    return {
        body: selector(state, 'body'),
        commentCreationError: state.errors.commentCreationError,
        commentRemoveError: state.errors.commentRemoveError,
        fetchingCommentsError: state.errors.fetchingCommentsError,
        comments: state.userData.comments,
        authorizedUser: state.auth.authorizedUser
    }
}

Comments = connect(mapStateToProps, {ajaxRequest, commentCreationErrorAction, displayCreatedComment, removeCommentAction, commentRemoveErrorAction})(Comments);
Comments = reduxForm ({form: 'addComment'})(Comments);

export default Comments;