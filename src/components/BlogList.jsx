import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

class BlogList extends Component {
    constructor(props) {
        super(props);
        this.showControls = this.showControls.bind(this);
        this.hideControls = this.hideControls.bind(this);
        this.toggleControls = this.toggleControls.bind(this);
        this.controlsTimeout;
    }
    
    
    showControls(element) {
        clearTimeout(this.controlsTimeout);
        element.style.visibility = 'visible';
        element.style.opacity = 1;
    }
    
    hideControls(element) {
        element.style.opacity = 0;
        this.controlsTimeout = setTimeout(() => {
            element.style.visibility = 'hidden';
        }, 1000)
    }
    
    toggleControls(element) {
        element.style.visibility == 'hidden' ? this.showControls() : this.hideControls();
    }
    
    render() {
        let {posts, removePost, authorizedUser, linkUser, params: {user}} = this.props;
        let children;
        if(posts.length > 0) {
            children = posts.map((post) => {
                let titleLink = post.title.toLowerCase().replace(/\s/g, '_');
                let postControls;
                return (
                    <li className='list-group-item' 
                        key={post.id} 
                        onMouseEnter={() => {
                            linkUser == authorizedUser ? this.showControls(postControls) : null;    
                        }}
                        onMouseLeave={() => {
                            linkUser == authorizedUser ? this.hideControls(postControls) : null;    
                        }}
                        onClick={() => {
                            linkUser == authorizedUser ? this.toggleControls(postControls) : null;    
                        }}>
                        <Link className='nav-link' to={`/${user}/${post.id}/${titleLink}`} onClick={(e) => e.stopPropagation()}>{post.title}</Link>
                        {linkUser == authorizedUser &&
                            <div className='hidden-controls' ref={div => postControls = div} onClick={(e) => e.stopPropagation()}>
                                <Link className='btn btn-primary btn-sm' to={`/${user}/${post.id}/${titleLink}/update`}>
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
        authorizedUser: state.auth.authorizedUser,
        linkUser: state.auth.linkUser
    }
}

export default connect(mapStateToProps)(BlogList);