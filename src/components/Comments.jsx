import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field, formValueSelector} from 'redux-form';
import {Link} from 'react-router';
import ajaxRequest from '../helpers/ajaxRequest';
import commentCreationErrorAction from '../actions/ajaxErrors/commentCreationError';
import displayCreatedComment from '../actions/ajaxSuccess/displayCreatedComment';

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
            .catch(res => commentCreationErrorAction(res.error));
        }
    }
    
    render() {
        let {comments, authorizedUser, commentCreationError, fetchingCommentsError} = this.props;
        let children;
        
        console.log(fetchingCommentsError);
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
                let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                let date = new Date(timestamp * 1000);
                let minutes = `0${date.getMinutes()}`
                date = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${date.getHours()}:${minutes.substr(-2)}`;

                return (
                    <li key={id}>
                        <time>{date}</time>
                        {author &&
                            <Link to={`/${author}`}>{author}</Link>
                        }
                        {!author &&
                            <span>Anonymous</span>
                        }
                        <p>{body}</p>
                    </li>
                )
            });
        }
        console.log(comments);
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
        fetchingCommentsError: state.errors.fetchingCommentsError,
        comments: state.userData.comments,
        authorizedUser: state.auth.authorizedUser
    }
}

Comments = connect(mapStateToProps, {ajaxRequest, commentCreationErrorAction, displayCreatedComment})(Comments);
Comments = reduxForm ({form: 'addComment'})(Comments);

export default Comments;