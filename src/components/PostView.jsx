import React, {Component} from 'react';
import {connect} from 'react-redux';

class PostView extends Component {
    
    render() {
        let post;
        let {posts, params: {postId}} = this.props;
        
        if (posts && posts != 'pending') {
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
                    </div>
                }
                {posts != 'pending' && !post &&
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

export default connect(mapStateToProps)(PostView);