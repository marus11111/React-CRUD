//displays list of posts written by the user

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import makeLink from '../helpers/titleLink';
import formatDate from '../helpers/formatDate';
import remove from '../actions/ajax/remove';
import {showControls, hideControls, toggleControls} from '../helpers/hiddenControls';

class BlogList extends Component {   
    
    render() {
        let {posts, postsLoading, remove, usersEqual, imageUrl, fetchingPostsError, blogListRemoveError, params: {user}} = this.props;
        let children;

        if (posts.length === 0) {
            if (postsLoading) {
                children = null;
            }
            else if (fetchingPostsError) {
                children = <li>{fetchingPostsError}</li>;
            }
            else if (usersEqual) {
                children = <li>You haven't written any posts yet.</li>;
            }
            else  {
                children = <li>No posts found.</li>;
            }
        }
        else if(posts.length > 0) {
            children = posts.map((post) => {

                let titleLink = makeLink(post.title);
                let isRemoveError = blogListRemoveError.ids.some((errorId) => errorId === post.id);
                let date = formatDate(post.timestamp, 'post');
                let hiddenControls;
                
                return (
                    <li 
                        className='blog-list__item' 
                        key={post.id} 
                        onMouseEnter={() => usersEqual && showControls(hiddenControls)}
                        onMouseLeave={() => usersEqual && hideControls(hiddenControls)}
                        onClick={() => usersEqual && toggleControls(hiddenControls)}
                        >
                        {isRemoveError &&
                            <p>{blogListRemoveError.error}</p>
                        }
                        <time className='blog-list__item__date' dateTime={date.iso}>{date.display}</time>
                        <Link className='nav-link blog-list__item__title' 
                              to={`/${user}/${post.id}/${titleLink}`} 
                              onClick={(e) => e.stopPropagation()} 
                              dangerouslySetInnerHTML={{__html: post.title}}/>
                        {usersEqual &&
                            <div className='blog-list__controls hidden-controls' onClick={(e) => e.stopPropagation()} ref={div => hiddenControls = div}>  
                                <Link className='btn btn-sm blog-list__single-button' to={`/${user}/${post.id}/${titleLink}/edit`}>
                                    <span className='glyphicon glyphicon-edit'></span>
                                </Link>
                                <button className='btn btn-sm blog-list__single-button' onClick={() => remove('removePost', {id: post.id, from: 'list'})}>
                                    <span className='glyphicon glyphicon-trash'></span>
                                </button>
                            </div>
                        }
                        <p className='blog-list__item__snippet' dangerouslySetInnerHTML={{__html: post.snippet}}/>
                    </li>
                )
            });
            children = children.reverse();
        }
        
        return (
            <div className={`container-fluid blog-list ${!usersEqual && !imageUrl && 'blog-list--no-image'}`}>
                <div className='row-center'>
                    <div className='col-xs-12'>
                        <ul className='nav col-xs-12 col-sm-9 col-md-6 col-centered'>
                            {children}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        posts: state.posts.posts,
        postsLoading: state.posts.loading,
        fetchingPostsError: state.errors.fetchingPostsError,
        blogListRemoveError: state.errors.blogListRemoveError,
    }
}

export default connect(mapStateToProps, {remove})(BlogList);