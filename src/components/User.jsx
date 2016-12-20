import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import ajaxRequest from '../actions/ajaxRequest';
import setLinkUser from '../actions/setLinkUser';
import fetchUserData from '../actions/fetchUserData';
import fetchingUserError from '../actions/fetchingUserError';
import loadImage from '../actions/loadImage';
import errorHandler from '../actions/errorHandler';
import closeError from '../actions/closeError';
import removeImage from '../actions/removeImage';
import removePostAction from '../actions/removePostAction';
import Menu from './Menu.jsx';
import Dropzone from 'react-dropzone';

class User extends Component { 
    constructor(props){
        super(props);
        
        this.fetchDataFromLink = (currentProps, nextProps) => {
            let {user} = nextProps ? nextProps.params : currentProps.params;
            currentProps.setLinkUser(user);
            currentProps.ajaxRequest('post', 'fetchUserData', {user})
            .then(res => currentProps.fetchUserData(res.userData))
            .catch(res => currentProps.fetchingUserError(res.error));
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
        if (this.props.linkUser != nextProps.params.user.toLowerCase()) {
            this.fetchDataFromLink(this.props, nextProps);
        }
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
        .then(res => this.props.loadImage(res.imageUrl))
        .catch(res => this.props.errorHandler(res.error));
    }
    
    removeImage(e) {
        e.stopPropagation();
        this.props.ajaxRequest('post', 'removeImage')
        .then(() => this.props.removeImage())
        .catch(res => this.props.errorHandler(res.error));
    }
    
    removePost(postId) {
        this.props.ajaxRequest('post', 'removePost', {postId})
        .then(() => this.props.removePostAction(postId))
        .catch(res => this.props.errorHandler(res.error));
    }
    
    render() {
        let {imageUrl, userError, error, authorizedUser, linkUser} = this.props;
        
        let eventHandlers = {};
        if (imageUrl && linkUser == authorizedUser) {
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
        
        console.log(this.props);
        return (
            <div>
                { (imageUrl || linkUser == authorizedUser) &&
                    <div className='jumbotron' {...eventHandlers}>
                        {imageUrl && 
                            <div>
                                <img src={imageUrl}></img>
                                { linkUser == authorizedUser &&
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
                {userError && 
                    <p>{userError}</p>
                }
                {error && 
                    <div>
                        <p>{error}</p>
                        <button className='close' onClick={this.props.closeError}><span className='glyphicon glyphicon-remove'></span></button>
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
        userError: state.userData.userError,
        error: state.userData.error,
        authorizedUser: state.auth.authorizedUser,
        linkUser: state.auth.linkUser
    }
}

export default connect(mapStateToProps, {ajaxRequest, setLinkUser, fetchUserData, fetchingUserError, loadImage, errorHandler, closeError, removeImage, removePostAction})(User);