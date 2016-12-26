import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router';
import ajaxRequest from '../helpers/ajaxRequest';
import ciCompare from '../helpers/ciCompare';
import isMenuOpenAction from '../actions/isMenuOpen';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.signOut = this.signOut.bind(this);
    }
    
    signOut(e) {
        e.preventDefault();
        this.props.ajaxRequest('post', 'signOut');
    }
    
    hamburgerToggle = () => {
        let open = this.props.isMenuOpen; //true or false 
        this.props.isMenuOpenAction(!open);
    }
    
    render() {
        let {width, isMenuOpen, authorizedUser, removePost, params: {user, titleLink, postId}} = this.props;
        let usersEqual = ciCompare(authorizedUser, user);
        let route;
        
        let activeChildRoute = this.props.routes[1];
        if(!activeChildRoute.path) {
            route = 'home';
        }
        else {
            route = activeChildRoute.path;
            route === ':postId/:titleLink' ? route = 'postView' : null; 
        }
        
        let hamburger = route === 'postView' && width < 650;
        let showMenu =  !hamburger || isMenuOpen;
        let itemClassesSmall = hamburger ? 'col-xs-12 col-sm-12' : 
                               width < 650 ? 'col-xs-4 col-sm-3' : 'col-xs-2 col-sm-2'; 
            
        let menuItems = []
        route != 'home' ? 
            menuItems.push(
                <li key='home' className={`nav-item ${itemClassesSmall} col-md-2 col-lg-2`}>
                    <Link className='nav-link' to={`${user}`}>Home</Link>
                </li>
            ) : null;
        usersEqual && route !== 'create' ? 
            menuItems.push(
                <li key='create' className={`nav-item ${itemClassesSmall} col-md-2 col-lg-2`}>
                    <Link className='nav-link' to={`${user}/create`}>Create post</Link>
                </li>
            ) : null;
        (route == 'postView' && usersEqual) ? 
            menuItems.push(
                <li key='edit' className={`nav-item ${itemClassesSmall} col-md-2 col-lg-2`}>
                    <Link className='nav-link' to={`${user}/${postId}/${titleLink}/edit`}>Edit post</Link>
                </li>,
                <li key='remove' className={`nav-item ${itemClassesSmall} col-md-2 col-lg-2`}>
                    <Link className='nav-link' to='#' onClick={(e) => {e.preventDefault(); removePost(postId, 'menu');}}>Remove post</Link>
                </li>
            ) : null;
        authorizedUser ? 
            menuItems.push(
                <li key='sign-out' className={`nav-item ${itemClassesSmall} col-md-2 col-lg-2`}>
                    <Link className='nav-link' to='#' onClick={this.signOut}>Sign out</Link>
                </li>
            ) : 
            menuItems.push(
                <li key='sign-in' className={`nav-item ${itemClassesSmall} col-md-2 col-lg-2`}>
                    <Link className='nav-link' to='/'>Sign in/Sign up</Link>
                </li>
            );
        
        return (
            <nav className='navbar navbar-default container-fluid'>
                {hamburger &&
                    <button className='navbar-toggle' onClick={this.hamburgerToggle}>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>    
                }
                {showMenu &&
                    <div className='row'>
                        <ul className='navbar-nav nav nav-centered'>
                            {menuItems}
                        </ul>
                    </div>    
                }
            </nav>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authorizedUser: state.auth.authorizedUser,
        isMenuOpen: state.hamburgerMenu.isMenuOpen,
        width: state.hamburgerMenu.width
    }
}

export default connect(mapStateToProps, {ajaxRequest, isMenuOpenAction})(withRouter(Menu));