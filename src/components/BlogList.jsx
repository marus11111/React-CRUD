import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import ciCompare from '../helpers/ciCompare';

class BlogList extends Component {
    constructor(props) {
        super(props);
        this.controlsTimeout;
    }
    
    
    showControls = (element) => {
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
        let {posts, removePost, authorizedUser, params: {user}} = this.props;
        let usersEqual = ciCompare(authorizedUser, user);
        let children;
        if(posts.length > 0) {
            children = posts.map((post) => {
                let titleLink = post.title.toLowerCase().replace(/\s/g, '_');
                let postControls;
                return (
                    <li className='list-group-item' 
                        key={post.id} 
                        onMouseEnter={() => usersEqual ? this.showControls(postControls) : null}
                        onMouseLeave={() => usersEqual ? this.hideControls(postControls) : null}
                        onClick={() => usersEqual ? this.toggleControls(postControls) : null} 
                        >
                        <Link className='nav-link' to={`/${user}/${post.id}/${titleLink}`} onClick={this.stopPropagation}>{post.title}</Link>
                        {usersEqual &&
                            <div className='hidden-controls' ref={div => postControls = div} onClick={this.stopPropagation}>
                                <Link className='btn btn-primary btn-sm' to={`/${user}/${post.id}/${titleLink}/edit`}>
                                    <span className='glyphicon glyphicon-edit'></span>
                                </Link>
                                <button className='btn btn-danger btn-sm' onClick={() => removePost(post.id)}>
                                    <span className='glyphicon glyphicon-trash'></span>
                                </button>
                            </div>
                        }
                    </li>
                )
            });
            children = children.reverse();
        }
        
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

const mapStateToProps = (state) => {
    return {
        posts: state.userData.posts,
        authorizedUser: state.auth.authorizedUser
    }
}

export default connect(mapStateToProps)(BlogList);