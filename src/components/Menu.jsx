import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router';
import ajaxRequest from '../actions/ajaxRequest';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.signOut = this.signOut.bind(this);
    }
    
    signOut() {
        this.props.ajaxRequest('post', 'signOut');
    }
    
    render() {
        let {authorizedUser, linkUser, removePost, params: {user, titleLink, postId}} = this.props;
        let route;
        
        let activeChildRoute = this.props.routes[1];
        if(!activeChildRoute.path) {
            route = 'home';
        }
        else {
            route = activeChildRoute.path == ':postId/:titleLink' ? 'postView' : null;
        }
        
        let menuItems = []
        route != 'home' ? 
            menuItems.push(
                <li key='home' className='nav-item col-xs-2 col-sm-2 col-md-2 col-lg-2'>
                    <Link className='nav-link' to={`${user}`}>Home</Link>
                </li>
            ) : null;
        authorizedUser == linkUser ? 
            menuItems.push(
                <li key='create' className='nav-item col-xs-2 col-sm-2 col-md-2 col-lg-2'>
                    <Link className='nav-link' to={`${user}/create`}>Create post</Link>
                </li>
            ) : null;
        (route == 'postView' && authorizedUser == linkUser) ? 
            menuItems.push(
                <li key='update' className='nav-item col-xs-2 col-sm-2 col-md-2 col-lg-2'>
                    <Link className='nav-link' to={`${user}/${postId}/${titleLink}/update`}>Update post</Link>
                </li>,
                <li key='remove' className='nav-item col-xs-2 col-sm-2 col-md-2 col-lg-2'>
                    <Link className='nav-link' to={`${user}`} onClick={() => removePost(postId)}>Remove post</Link>
                </li>
            ) : null;
        authorizedUser ? 
            menuItems.push(
                <li key='sign-out' className='nav-item col-xs-2 col-sm-2 col-md-2 col-lg-2'>
                    <Link className='nav-link' to='#' onClick={this.signOut}>Sign out</Link>
                </li>
            ) : 
            menuItems.push(
                <li key='sign-in' className='nav-item col-xs-2 col-sm-2 col-md-2 col-lg-2'>
                    <Link className='nav-link' to='/'>Sign in</Link>
                </li>
            );
        
        return (
            <nav className='navbar navbar-default container'>
                <div className='row'>
                    <ul className='navbar-nav nav nav-centered'>
                        {menuItems}
                    </ul>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authorizedUser: state.auth.authorizedUser,
        linkUser: state.auth.linkUser
    }
}

export default connect(mapStateToProps, {ajaxRequest})(withRouter(Menu));