import React, {Component} from 'react';
import {connect} from 'react-redux';
import find from 'core-js/fn/array/find';
import Comments from './Comments.jsx';
import fetchData from '../actions/ajax/fetchData';
import formatDate from '../helpers/formatDate';

class PostView extends Component {
    
    componentDidMount() {
        let {fetchData, params: {postId}} = this.props;
        fetchData('comments', postId);
    }
    
    render() {
        let {posts, params: {user, postId}} = this.props;
        let cleanTitle, cleanBody, date;
        
        let post = posts.find((post) => {
            return `${post.id}` === postId;
        });
        if (post) {
            let {title, body, timestamp} = post;
            cleanTitle = DOMPurify.sanitize(title);
            cleanBody = DOMPurify.sanitize(body);
            date = formatDate(timestamp, 'post');      
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
        posts: state.posts.posts
    }
}

export default connect(mapStateToProps, {fetchData})(PostView);