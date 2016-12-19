import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import ajaxRequest from '../actions/ajaxRequest';
import setUpdatedPost from '../actions/setUpdatedPost';
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
        let {title, body, ajaxRequest, params: {postId}} = this.props;
        ajaxRequest('post', `updatePost`, {postId, title, body});
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

UpdatePost = connect(mapStateToProps, {ajaxRequest, setUpdatedPost})(UpdatePost);

export default protect(UpdatePost);