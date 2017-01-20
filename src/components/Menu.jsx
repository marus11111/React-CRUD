import React, {
  Component
} from 'react';
import {
  connect
} from 'react-redux';
import {
  Link,
  withRouter
} from 'react-router';
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
    let {
      width,
      authorizedUser,
      usersEqual,
      remove,
      route,
      params: {
        user,
        titleLink,
        postId
      }
    } = this.props;

    let menuItems = []
    let menuItemClass = 'nav-item';
    let menuItemLinkClass = 'menu__link nav-link'

    if (route !== 'home') {
      menuItems.push(
        <li 
          className={`${menuItemClass}`}
          key='home' >
          <Link 
            className={`${menuItemLinkClass}`} 
            to={`${user}`}>
            Home
          </Link>
        </li>
      );
    }
    if (usersEqual && route !== 'create') {
      menuItems.push(
        <li 
          className={`${menuItemClass}`}
          key='create' >
          <Link 
            className={`${menuItemLinkClass}`} 
            to={`${user}/create`}>
            Create post
          </Link>
        </li>
      );
    }
    if (route === ':postId/:titleLink' && usersEqual) {
      menuItems.push(
        <li 
          className={`${menuItemClass}`}
          key='edit'> 
          <Link 
            className={`${menuItemLinkClass}`} 
            to={`${user}/${postId}/${titleLink}/edit`}>
            Edit post
          </Link>
        </li>,
        <li 
          className={`${menuItemClass}`}
          key='remove'> 
          <Link 
            className={`${menuItemLinkClass}`} 
            to='#' 
            onClick={(e) => {e.preventDefault(); remove('removePost', {id: postId, from: 'menu'});}}>
            Remove post
          </Link>
        </li>
      );
    }
    if (authorizedUser) {
      menuItems.push(
        <li 
          className={`${menuItemClass}`}
          key='sign-out'> 
          <Link 
            className={`${menuItemLinkClass}`} to='#' 
            onClick={(e) => {
              this.signOut(e);
              this.menuClose();
            }}>
            Sign out
          </Link>
        </li>
      );
    } else {
      menuItems.push(
        <li 
          className={`${menuItemClass}`}
          key='sign-in'> 
          <Link 
            className={`${menuItemLinkClass}`} 
            to='/'>
            Sign in/Sign up
          </Link>
        </li>
      );
    }

    return (
      <nav 
        className='menu'
        key='menu' 
        ref={nav => this.menu = nav}> 
        <ul className='nav'>
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

export default connect(null, {
  authorization,
  remove
})(withRouter(Menu));
