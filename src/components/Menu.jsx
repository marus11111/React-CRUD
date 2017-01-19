import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router';
import authorization from '../actions/ajax/authorization';
import remove from '../actions/ajax/remove';
import browserHistory from '../helpers/browserHistory';

class Menu extends Component {
    constructor(props) {
        super(props);
        
        browserHistory.listen = browserHistory.listen.bind(this);
        browserHistory.listen(() => {
            this.menu && this.menuClose();
        })
    }
           
    signOut = (e) => {
        e.preventDefault();
        this.props.authorization('signOut');
    }
    
    menuClose = () => {
        this.menu.className = this.menu.className.replace(' menu--open', '');
    }
    
    menuToggle = () => {
        /menu--open/.test(this.menu.className) ? 
            this.menuClose() : 
            this.menu.className += ' menu--open';
    }
    
    render() {
        let {width, authorizedUser, usersEqual, remove, route, params: {user, titleLink, postId}} = this.props;
                    
        let menuItems = []
        let menuItemClass = 'menu__item nav-item';
        
        route !== 'home' && menuItems.push(
            <li 
                className={`${menuItemClass}`}
                key='home' >
                <Link 
                    className='nav-link' 
                    to={`${user}`}>
                    Home
                </Link>
            </li>
        );
        usersEqual && route !== 'create' && menuItems.push(
            <li 
                className={`${menuItemClass}`}
                key='create' >
                <Link 
                    className='nav-link' 
                    to={`${user}/create`}>
                    Create post
                </Link>
            </li>
        );
        route === ':postId/:titleLink' && usersEqual && menuItems.push(
            <li 
                className={`${menuItemClass}`}
                key='edit'> 
                <Link 
                    className='nav-link' 
                    to={`${user}/${postId}/${titleLink}/edit`}>
                    Edit post
                </Link>
            </li>,
            <li 
                className={`${menuItemClass}`}
                key='remove'> 
                <Link 
                    className='nav-link' 
                    to='#' 
                    onClick={(e) => {e.preventDefault(); remove('removePost', {id: postId, from: 'menu'});}}>
                    Remove post
                </Link>
            </li>
        );
        authorizedUser ? 
            menuItems.push(
                <li 
                    className={`${menuItemClass}`}
                    key='sign-out'> 
                    <Link 
                        className='nav-link' to='#' 
                        onClick={(e) => {
                            this.signOut(e);
                            this.menuClose();
                        }}>
                        Sign out
                    </Link>
                </li>
            ) 
            : menuItems.push(
                <li 
                    className={`${menuItemClass}`}
                    key='sign-in'> 
                    <Link 
                        className='nav-link' 
                        to='/'>
                        Sign in/Sign up
                    </Link>
                </li>
            );
        
        return (
            <nav 
                className='menu'
                key='menu' 
                ref={nav => this.menu = nav}> 
                <ul className='menu__list nav'>
                    {menuItems}
                </ul>
                <button 
                    className='menu__button' 
                    onClick={this.menuToggle}>
                    <span className='glyphicon glyphicon-chevron-down'></span>
                </button>    
            </nav>
        )
    }
}

export default connect(null, {authorization, remove})(withRouter(Menu));