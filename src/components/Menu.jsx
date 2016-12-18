import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import ajaxRequest from '../actions/ajaxRequest';
import protect from '../HOC/protectedComponent.jsx';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
    }
    
    clickHandler() {
        this.props.ajaxRequest('post', 'signOut');
    }
    
    render() {
        let {user} = this.props;
        
        return (
            <nav className='navbar navbar-default container'>
                <div className='row'>
                    <ul className='navbar-nav nav nav-centered'>
                        <li className='nav-item col-xs-2 col-sm-2 col-md-2 col-lg-2'>
                            <Link className='nav-link' to={`${user.toLowerCase()}`}>Home</Link>
                        </li>
                        <li className='nav-item col-xs-2 col-sm-2 col-md-2 col-lg-2'>
                            <Link className='nav-link' to={`${user.toLowerCase()}/create`}>Create post</Link>
                        </li>
                        <li className='nav-item col-xs-2 col-sm-2 col-md-2 col-lg-2'>
                            <Link className='nav-link' to='#' onClick={this.clickHandler}>Sign out</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

Menu = protect(Menu);

export default connect(null, {ajaxRequest})(Menu);