import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field, formValueSelector} from 'redux-form'
import ajaxRequest from '../helpers/ajaxRequest';
import commentErrorAction from '../actions/ajaxErrors/commentErrorAction';
import displayCreatedComment from '../actions/ajaxSuccess/displayCreatedComment';

class Comments extends Component {

    submitHandler = (event) => {
        event.preventDefault();
        let {body, postId, authorizedUser, ajaxRequest, displayCreatedComment, commentErrorAction} = this.props;
        let author = authorizedUser ? authorizedUser : 'Anonymous';
        if(!body) {
            commentErrorAction('Comment must contain some text.');
        }
        else {
            ajaxRequest('post', `createComment`, {body, postId, author})
            .then(res => displayCreatedComment({body, author, date, commentId}))
            .catch(res => commentErrorAction(res.error));
        }
    }
    
    render() {
        return (
            <div>
                {this.props.commentError &&
                    <p>{this.props.commentError}</p>
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
        commentError: state.userData.commentError
    }
}

Comments = connect(mapStateToProps, {ajaxRequest, commentErrorAction, displayCreatedComment})(Comments);
Comments = reduxForm ({form: 'addComment'})(Comments);

export default Comments;