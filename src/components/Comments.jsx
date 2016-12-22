import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field, formValueSelector} from 'redux-form'
import ajaxRequest from '../helpers/ajaxRequest';
import commentCreationErrorAction from '../actions/ajaxErrors/commentCreationError';
import displayCreatedComment from '../actions/ajaxSuccess/displayCreatedComment';

class Comments extends Component {

    submitHandler = (event) => {
        event.preventDefault();
        let {body, postId, authorizedUser, ajaxRequest, displayCreatedComment, commentCreationErrorAction} = this.props;
        let author = authorizedUser ? authorizedUser : 'Anonymous';
        if(!body) {
            commentCreationErrorAction('Comment must contain some text.');
        }
        else {
            ajaxRequest('post', `createComment`, {body, postId, author})
            .then(res => displayCreatedComment(author, res.date, body, res.commentId))
            .catch(res => commentCreationErrorAction(res.error));
        }
    }
    
    render() {
        return (
            <div>
                {this.props.commentCreationError &&
                    <p>{this.props.commentCreationError}</p>
                }
                <form onSubmit={this.submitHandler}>
                    <Field component='textarea' name='body'/>
                    <button type='submit'>Create comment</button>
                </form>
            </div>
        )
    }
}

let selector = formValueSelector('addComment');
let mapStateToProps = (state) => {
    return {
        body: selector(state, 'body'),
        commentCreationError: state.errors.commentCreationError
    }
}

Comments = connect(mapStateToProps, {ajaxRequest, commentCreationErrorAction, displayCreatedComment})(Comments);
Comments = reduxForm ({form: 'addComment'})(Comments);

export default Comments;