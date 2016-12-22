import React, {Component} from 'react';
import {connect} from 'react-redux';
import Comments from './Comments.jsx';
import ajaxRequest from '../helpers/ajaxRequest';
import loadComments from '../actions/ajaxSuccess/loadComments';
import fetchingCommentsError from '../actions/ajaxErrors/fetchingCommentsError';

class PostView extends Component {
    
    componentDidMount() {
        let {ajaxRequest, loadComments, fetchingCommentsError, params: {postId}} = this.props;
        ajaxRequest('post', 'fetchComments', {postId})
        .then(res => loadComments(res.comments))
        .catch(res => {
            fetchingCommentsError(res.error);
            loadComments(res.comments); //undefined - in order to chane pending status and inform app that it' not pending anymore
        });
    }
    
    render() {
        let post;
        let {posts, params: {postId}} = this.props;
        
        if (Array.isArray(posts)) {
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].id == postId) {
                    post = posts[i];
                    break;
                }
            }  
        }
        
        return (
            <div>
                {post &&
                    <div>
                        <h1>{post.title}</h1>
                        <p>{post.body}</p>
                        <Comments postId={post.id}/>
                    </div>
                }
                {!post &&
                    <div>
                        <h1>Post not found</h1>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        posts: state.userData.posts
    }
}

export default connect(mapStateToProps, {ajaxRequest, loadComments, fetchingCommentsError})(PostView);