import React, {Component} from 'react';
import {Link, withRouter} from 'react-router';
import {connect} from 'react-redux';
import ajaxRequest from '../helpers/ajaxRequest';
import loadUserData from '../actions/ajaxSuccess/loadUserData';
import clearUserData from '../actions/clearUserData';
import userNotFound from '../actions/ajaxErrors/userNotFound';
import variousErrors from '../actions/ajaxErrors/variousErrors';
import fetchingPostsError from '../actions/ajaxErrors/fetchingPostsError';
import displayImage from '../actions/ajaxSuccess/displayImage';
import removeImageAction from '../actions/ajaxSuccess/removeImage';
import removePostAction from '../actions/ajaxSuccess/removePost';
import Menu from './Menu.jsx';
import Dropzone from 'react-dropzone';
import ciCompare from '../helpers/ciCompare';

class User extends Component { 
    constructor(props){
        super(props);
        
        this.fetchDataFromLink = (currentProps, nextProps) => {
            let {user} = nextProps ? nextProps.params : currentProps.params;
            let {ajaxRequest, loadUserData, fetchingPostsError, userNotFound} = currentProps;
            ajaxRequest('post', 'fetchUserData', {user})
            .then(res => {
                loadUserData(res.userData);
                res.postsError ? fetchingPostsError(res.postsError) : null;
            })
            .catch(res => currentProps.userNotFound(res.error));
        }      
        this.showControls = this.showControls.bind(this);
        this.hideControls = this.hideControls.bind(this);
        this.toggleControls = this.toggleControls.bind(this);
        this.controlsTimeout;
        this.uploadImage = this.uploadImage.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.removePost = this.removePost.bind(this);
        
        this.fetchDataFromLink(props);
    }
    
    componentWillReceiveProps(nextProps) {
        if (!ciCompare(this.props.params.user, nextProps.params.user)) {
            this.fetchDataFromLink(this.props, nextProps);
        }
    }
    
    componentWillUnmount() {
        this.props.clearUserData();
    }
    
    showControls() {
        clearTimeout(this.controlsTimeout);
        this.imageControls.style.visibility = 'visible';
        this.imageControls.style.opacity = 1;
    }
    
    hideControls() {
        this.imageControls.style.opacity = 0;
        this.controlsTimeout = setTimeout(() => {
            this.imageControls.style.visibility = 'hidden';
        }, 1000)
    }
    
    toggleControls() {
        this.imageControls.style.visibility == 'hidden' ? this.showControls() : this.hideControls();
    }
    
    uploadImage(images) {
        const upload_preset = 'jyju7fnq';
        let file = images[0];
        
        this.props.ajaxRequest('post', 'imageUpload', {upload_preset, file})
        .then(res => this.props.displayImage(res.imageUrl))
        .catch(res => this.props.variousErrors(res.error));
    }
    
    removeImage(e) {
        e.stopPropagation();
        this.props.ajaxRequest('post', 'removeImage')
        .then(() => this.props.removeImageAction())
        .catch(res => this.props.variousErrors(res.error));
    }
    
    removePost(postId) {
        this.props.ajaxRequest('post', 'removePost', {postId})
        .then(() => this.props.removePostAction(postId))
        .catch(res => this.props.variousErrors(res.error));
    }
    
    render() {
        let {imageUrl, userError, error, authorizedUser, params: {user}} = this.props;
        
        if (userError) return <p>{userError}</p>;
        
        let usersEqual = ciCompare(authorizedUser, user);
        
        let eventHandlers = {};
        if (imageUrl && usersEqual) {
            eventHandlers = {
                onMouseEnter: this.showControls,
                onMouseLeave: this.hideControls,
                onClick: this.toggleControls
            }
        }
        
        let children = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {
                removePost: this.removePost
            });
        });
        
        return (
            <div>
                { (imageUrl || usersEqual) &&
                    <div className='jumbotron' {...eventHandlers}>
                        {imageUrl && 
                            <div>
                                <img src={imageUrl}></img>
                                { usersEqual &&
                                    <div className='hidden-controls' ref={div => this.imageControls = div}>
                                        <form>
                                            <label htmlFor='imageUpload' className='btn btn-primary btn-sm' onClick={e => e.stopPropagation()}>
                                                <span className='glyphicon glyphicon-edit'></span> Change
                                            </label>
                                            <input id='imageUpload' type='file' onChange={() => this.uploadImage(this.imageInput.files)} ref={input => this.imageInput = input}></input>
                                        </form>
                                        <button className='btn btn-danger btn-sm' onClick={this.removeImage}>
                                            <span className='glyphicon glyphicon-trash'></span> Remove
                                        </button>
                                    </div>
                                }
                            </div>
                        }
                        {!imageUrl && 
                            <div>
                                <Dropzone multiple={false} accept='image/*' onDrop={this.uploadImage}/>
                                <p>Drop an image or click to select a file from your computer.</p>
                            </div>
                        }
                    </div>
                }
                <Menu removePost={this.removePost}/>
                {error && 
                    <div>
                        <p>{error}</p>
                    </div>
                }
                {children}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        imageUrl: state.userData.imageUrl,
        userError: state.errors.userError,
        error: state.errors.error,
        authorizedUser: state.auth.authorizedUser
    }
}

User = withRouter(User);

export default connect(mapStateToProps, {ajaxRequest, loadUserData, clearUserData, userNotFound, fetchingPostsError, displayImage, variousErrors, removeImageAction, removePostAction})(User);