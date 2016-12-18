import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import ajaxRequest from '../actions/ajaxRequest';

class BlogList extends Component {
    render() {
        let {posts, params: {user}} = this.props;
        let children;
        if(posts && posts != 'pending'){
            children = posts.map((post) => {
                let titleLink = post.title.toLowerCase().replace(/\s/g, '_');
                return <li className='list-group-item' key={post.id}><Link className='nav-link' to={`/${user}/${post.id}/${titleLink}`}>{post.title}</Link></li>
            });
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
        posts: state.userData.posts
    }
}

export default connect(mapStateToProps, {ajaxRequest})(BlogList);