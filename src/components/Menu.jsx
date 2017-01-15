import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router';
import authorization from '../actions/ajax/authorization';
import ciCompare from '../helpers/ciCompare';
import isMenuOpenAction from '../actions/isMenuOpen';
import remove from '../actions/ajax/remove';

class Menu extends Component {
           
    signOut = (e) => {
        e.preventDefault();
        this.props.authorization('signOut');
    }
    
    menuToggle = () => {
        let {style, offsetTop, clientHeight} = this.menu;
        offsetTop < 0 ? style.bottom = `calc(100vh - ${clientHeight}px)` : style.bottom = null;
    }
    
    render() {
        let {width, isMenuOpen, authorizedUser, remove, params: {user, titleLink, postId}} = this.props;
        let usersEqual = ciCompare(authorizedUser, user);
                
        let activeChildRoute = this.props.routes[1];
        let route = activeChildRoute.path || 'home';            
        let menuItems = []
        let menuItemClass = 'menu__item';
        
        route !== 'home' && menuItems.push(
            <li key='home' className={`${menuItemClass}`}>
                <Link className='nav-link' to={`${user}`}>Home</Link>
            </li>
        );
        usersEqual && route !== 'create' && menuItems.push(
            <li key='create' className={`${menuItemClass}`}>
                <Link className='nav-link' to={`${user}/create`}>Create post</Link>
            </li>
        );
        route === ':postId/:titleLink' && usersEqual && menuItems.push(
            <li key='edit' className={`${menuItemClass}`}>
                <Link className='nav-link' to={`${user}/${postId}/${titleLink}/edit`}>Edit post</Link>
            </li>,
            <li key='remove' className={`${menuItemClass}`}>
                <Link className='nav-link' to='#' onClick={(e) => {e.preventDefault(); remove('removePost', {id: postId, from: 'menu'});}}>Remove post</Link>
            </li>
        );
        authorizedUser ? 
            menuItems.push(
                <li key='sign-out' className={`${menuItemClass}`}>
                    <Link className='nav-link' to='#' onClick={this.signOut}>Sign out</Link>
                </li>
            ) : 
            menuItems.push(
                <li key='sign-in' className={`${menuItemClass}`}>
                    <Link className='nav-link' to='/'>Sign in/Sign up</Link>
                </li>
            );
        
        return (
            <nav key='menu' ref={nav => this.menu = nav} className='menu'>
                <ul className='menu__list'>
                    {menuItems}
                </ul>
                <button className='menu__button' onClick={this.menuToggle}>
                    <span className='glyphicon glyphicon-chevron-down'></span>
                </button>    
            </nav>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authorizedUser: state.auth.authorizedUser,
        isMenuOpen: state.menu.isMenuOpen
    }
}

export default connect(mapStateToProps, {authorization, remove, isMenuOpenAction})(withRouter(Menu));