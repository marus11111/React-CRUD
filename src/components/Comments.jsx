import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field, formValueSelector} from 'redux-form';
import {Link} from 'react-router';
import createOrUpdate from '../actions/ajax/createOrUpdate';
import commentCreationErrorAction from '../actions/commentCreationError';
import remove from '../actions/ajax/remove';
import formatDate from '../helpers/formatDate';

class Comments extends Component {

    submitHandler = (event) => {
        event.preventDefault();
        let {body, postId, authorizedUser, createOrUpdate, commentCreationErrorAction} = this.props;
        let author = authorizedUser ? authorizedUser : '';
        if(!body) {
            commentCreationErrorAction('Comment must contain some text.');
        }
        else {
            createOrUpdate(`createComment`, {body, postId, author});
        }
    }
    
    render() {
        let {comments, commentsLoading, authorizedUser, usersEqual, linkUser, commentCreationError, fetchingCommentsError, commentRemoveError} = this.props;
        let children;
        
        if (comments.length === 0){
            if (commentsLoading) {
                children = null;
            }
            else if (fetchingCommentsError) {
                children = <li>{fetchingCommentsError}</li>;
            }
            else {
                children = <li>No comments yet.</li>;
            } 
        }
        else if (comments.length > 0) {
            children = comments.map(comment => {
                let {author, timestamp, body, id} = comment;
                let date = formatDate(timestamp, 'comment');
                let isRemoveError = commentRemoveError.ids.some((errorId) => errorId === id);
                
                return (
                    <li 
                        className='comments__item'
                        key={id}>
                        {isRemoveError &&
                            <p>{commentRemoveError.error}</p>
                        }
                        <time 
                            className='comments__item__date' 
                            dateTime={date.iso}>
                            {date.display}
                        </time>
                        {author &&
                            <div>
                                <Link 
                                    className='comments__item__author' 
                                    to={`/${author}`}>
                                    {author}
                                </Link><span> wrote:</span>
                            </div>
                        }
                        {!author &&
                            <span>Anonymous</span>
                        }
                        {(authorizedUser === author || usersEqual) &&
                            <button 
                                className='btn  comments__item__button' 
                                onClick={() => this.props.remove('removeComment', {id})}>
                                <span className='glyphicon glyphicon-trash'></span>
                            </button>
                        }
                        <p className='comments__item__body'>{body}</p>
                    </li>
                )
            });
        }

        return (
            <div className='comments col-xs-10 col-centered'>
                {commentCreationError &&
                    <p>{commentCreationError}</p>
                }
                <p>Leave a comment.</p>
                {!authorizedUser &&
                    <p>You're not signed in. Comment author will be shown as Anonymous.</p>
                }
                <form onSubmit={this.submitHandler}>
                    <Field 
                        className='comments__textarea' 
                        component='textarea' 
                        name='body'/>
                    <button 
                        className='btn'
                        type='submit'>
                        Comment
                    </button>
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
        comments: state.comments.comments,
        commentsLoading: state.comments.loading,
        commentCreationError: state.errors.commentCreationError,
        commentRemoveError: state.errors.commentRemoveError,
        fetchingCommentsError: state.errors.fetchingCommentsError
    }
}

Comments = connect(mapStateToProps, {createOrUpdate, commentCreationErrorAction, remove})(Comments);
Comments = reduxForm ({form: 'addComment'})(Comments);

export default Comments;