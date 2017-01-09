//displays list of posts written by the user

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import marked from 'marked';
import ciCompare from '../helpers/ciCompare';
import makeLink from '../helpers/titleLink';
import formatDate from '../helpers/formatDate';

class BlogList extends Component {
    constructor(props) {
        super(props);
        
        //variable that will store timeout for hiding edit and remove buttons
        this.controlsTimeout;
    }
    
    //show edit and remove buttons
    showControls = (element) => {
        
        //clear timeout so that buttons arent hidden if less than
        //one second ago function hideContols was called
        clearTimeout(this.controlsTimeout);
        element.style.visibility = 'visible';
        element.style.opacity = 1;
    }
    
    hideControls = (element) => {
        element.style.opacity = 0;
        this.controlsTimeout = setTimeout(() => {
            element.style.visibility = 'hidden';
        }, 1000)
    }
    
    toggleControls = (element) => {
        element.style.visibility == 'hidden' ? this.showControls() : this.hideControls();
    }
    
    stopPropagation = (e) => {
        e.stopPropagation();
    }
    
    render() {
        let {posts, removePost, authorizedUser, fetchingPostsError, blogListRemoveError, params: {user}} = this.props;
        let usersEqual = ciCompare(authorizedUser, user);

        if (posts.length === 0) {
            if (posts === 'pending') {
                return null;
            }
            else if (fetchingPostsError) {
                return <p>{fetchingPostsError}</p>
            }
            else if (!posts && usersEqual) {
                return <p>You haven't written any posts yet.</p>;
            }
            else  {
                return <p>No posts found.</p>;
            }
        }
        else if(posts.length > 0) {
            let children = posts.map((post) => {
                
                let cleanTitle = DOMPurify.sanitize(post.title);
                let cleanSnippet = DOMPurify.sanitize(post.snippet);
                let titleLink = makeLink(post.title);
                let isRemoveError = blogListRemoveError.ids.some((errorId) => errorId === post.id);
                let date = formatDate(post.timestamp, 'post');
                let postControls;
                
                return (
                    <li className='list-group-item' 
                        key={post.id} 
                        onMouseEnter={() => usersEqual ? this.showControls(postControls) : null}
                        onMouseLeave={() => usersEqual ? this.hideControls(postControls) : null}
                        onClick={() => usersEqual ? this.toggleControls(postControls) : null} 
                        >
                        {isRemoveError &&
                            <p>{blogListRemoveError.error}</p>
                        }
                        <time dateTime={date.iso}>{date.display}</time>
                        <Link className='nav-link' 
                              to={`/${user}/${post.id}/${titleLink}`} 
                              onClick={this.stopPropagation} 
                              dangerouslySetInnerHTML={{__html: cleanTitle}}/>
                        {usersEqual &&
                            <div className='hidden-controls' ref={div => postControls = div} onClick={this.stopPropagation}>  
                                <Link className='btn btn-primary btn-sm' to={`/${user}/${post.id}/${titleLink}/edit`}>
                                    <span className='glyphicon glyphicon-edit'></span>
                                </Link>
                                <button className='btn btn-danger btn-sm' onClick={() => removePost(post.id, 'list')}>
                                    <span className='glyphicon glyphicon-trash'></span>
                                </button>
                            </div>
                        }
                        <p dangerouslySetInnerHTML={{__html: cleanSnippet}}/>
                    </li>
                )
            });
            children = children.reverse();
            
            return (
                <div className='container'>
                    <div className='row'>
                        <ul className='list-group nav col-xs-9 col-sm-9 col-md-9 col-lg-9 col-centered'>
                            {children}
                        </ul>
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        posts: state.posts.posts,
        fetchingPostsError: state.errors.fetchingPostsError,
        blogListRemoveError: state.errors.blogListRemoveError,
        authorizedUser: state.auth.authorizedUser
    }
}

export default connect(mapStateToProps)(BlogList);