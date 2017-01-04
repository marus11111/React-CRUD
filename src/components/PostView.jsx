import React, {Component} from 'react';
import {connect} from 'react-redux';
import marked from 'marked';
import Comments from './Comments.jsx';
import ajaxRequest from '../helpers/ajaxRequest';
import formatDate from '../helpers/formatDate';
import loadComments from '../actions/ajaxSuccess/loadComments';
import fetchingCommentsError from '../actions/ajaxErrors/fetchingCommentsError';

class PostView extends Component {
    constructor(props) {
        super(props);
        this.RichTextEditor = window.RichTextEditor;
    }
    
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
                        <h1 dangerouslySetInnerHTML={{__html: marked(cleanTitle, {sanitize: true})}}/>
                        <p dangerouslySetInnerHTML={{__html: marked(cleanBody, {sanitize: true})}}/>
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
        posts: state.userData.posts
    }
}

export default connect(mapStateToProps, {ajaxRequest, loadComments, fetchingCommentsError})(PostView);