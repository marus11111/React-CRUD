import React, {Component} from 'react';
import {connect} from 'react-redux';
import Comments from './Comments.jsx';
import ajaxRequest from '../helpers/ajaxRequest';
import loadComments from '../actions/loadComments';

class PostView extends Component {
    
    componentDidMount() {
        let {ajaxRequest, params: {postId}} = this.props;
        ajaxRequest('post', 'fetchComments', {postId})
        .then(res => loadComments(res))
        .catch(res => {});
    }
    
    render() {
        let post;
        let {posts, params: {postId}} = this.props;
        
        if (posts.length > 0) {
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
                {posts.length > 0 && !post &&
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

export default connect(mapStateToProps, {ajaxRequest, loadComments})(PostView);