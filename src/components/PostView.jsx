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
        let {posts, postsLoading, params: {user, postId}} = this.props;
        let title, body, date;
        
        let post = posts.find((post) => {
            return `${post.id}` === postId;
        });
        if (post) {
            title = post.title;
            body = post.body;
            date = formatDate(post.timestamp, 'post');      
        }

        return (
            <div className='postview'>
                {post &&
                    <div>
                        <time dateTime={date.iso} className='postview__date'>{date.display}</time>
                        <h1 dangerouslySetInnerHTML={{__html: title}} className='postview__title'/>
                        <p dangerouslySetInnerHTML={{__html: body}} className='postview__body'/>
                        <Comments postId={post.id} linkUser={user}/>
                    </div>
                }
                {!post && !postsLoading &&
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
        posts: state.posts.posts,
        postsLoading: state.posts.loading
    }
}

export default connect(mapStateToProps, {fetchData})(PostView);