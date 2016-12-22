import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router';
import ajaxRequest from '../helpers/ajaxRequest';
import ciCompare from '../helpers/ciCompare';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.signOut = this.signOut.bind(this);
    }
    
    signOut() {
        this.props.ajaxRequest('post', 'signOut');
    }
    
    render() {
        let {authorizedUser, removePost, params: {user, titleLink, postId}} = this.props;
        let usersEqual = ciCompare(authorizedUser, user);
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
        usersEqual ? 
            menuItems.push(
                <li key='create' className='nav-item col-xs-2 col-sm-2 col-md-2 col-lg-2'>
                    <Link className='nav-link' to={`${user}/create`}>Create post</Link>
                </li>
            ) : null;
        (route == 'postView' && usersEqual) ? 
            menuItems.push(
                <li key='edit' className='nav-item col-xs-2 col-sm-2 col-md-2 col-lg-2'>
                    <Link className='nav-link' to={`${user}/${postId}/${titleLink}/edit`}>Edit post</Link>
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
                    <Link className='nav-link' to='/'>Sign in/SignUp</Link>
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
        authorizedUser: state.auth.authorizedUser
    }
}

export default connect(mapStateToProps, {ajaxRequest})(withRouter(Menu));