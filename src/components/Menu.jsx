import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router';
import authorization from '../actions/ajax/authorization';
import ciCompare from '../helpers/ciCompare';
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
        this.menu.style.bottom = null;
    }
    
    menuToggle = () => {
        let {style, offsetTop, clientHeight} = this.menu;
        offsetTop < 0 ? style.bottom = `calc(100vh - ${clientHeight}px)` : this.menuClose();
    }
    
    render() {
        let {width, authorizedUser, remove, params: {user, titleLink, postId}} = this.props;
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
                    <Link 
                        className='nav-link' to='#' 
                        onClick={(e) => {
                            this.signOut(e);
                            this.menuClose();
                        }}>
                        Sign out
                    </Link>
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
        authorizedUser: state.auth.authorizedUser
    }
}

export default connect(mapStateToProps, {authorization, remove})(withRouter(Menu));