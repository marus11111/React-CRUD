import React, {Component} from 'react';
import {connect} from 'react-redux';
import Comments from './Comments.jsx';
import fetchData from '../actions/ajax/fetchData';
import formatDate from '../helpers/formatDate';

class PostView extends Component {
    
    componentDidMount() {
        let {fetchData, params: {postId}} = this.props;
        fetchData('post', 'fetchComments', {postId});
    }
    
    render() {
        let post, cleanTitle, cleanBody, date;
        let {posts, params: {user, postId}} = this.props;
        
        
        if (Array.isArray(posts)) {
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].id == postId) {
                    post = posts[i];
                    let {title, body, timestamp} = post;
                    cleanTitle = DOMPurify.sanitize(title);
                    cleanBody = DOMPurify.sanitize(body);
                    date = formatDate(timestamp, 'post');
                    break;
                }
            }  
        }
        
        return (
            <div>
                {post &&
                    <div>
                        <time dateTime={date.iso}>{date.display}</time>
                        <h1 dangerouslySetInnerHTML={{__html: cleanTitle}}/>
                        <p dangerouslySetInnerHTML={{__html: cleanBody}}/>
                        <Comments postId={post.id} linkUser={user}/>
                    </div>
                }
                {Array.isArray(posts) && !post &&
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
        posts: state.posts.posts
    }
}

export default connect(mapStateToProps, {fetchData})(PostView);