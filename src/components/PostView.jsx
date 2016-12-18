import React, {Component} from 'react';
import {connect} from 'react-redux';

export default class PostView extends Component {
    render() {
        return (
            <div></div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        posts: state.userData.posts
    }
}

export default connect(mapStateToProps)(PostView);