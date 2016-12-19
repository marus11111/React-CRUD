import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import ajaxRequest from '../actions/ajaxRequest';
import fetchUserData from '../actions/fetchUserData';
import fetchingUserError from '../actions/fetchingUserError';
import loadImage from '../actions/loadImage';
import errorHandler from '../actions/errorHandler';
import closeError from '../actions/closeError';
import removeImage from '../actions/removeImage';
import Menu from './Menu.jsx';
import Dropzone from 'react-dropzone';

class User extends Component { 
    constructor(props){
        super(props);
        
        props.ajaxRequest('post', 'fetchUserData', {user: this.props.params.user})
        .then(res => this.props.fetchUserData(res.userData))
        .catch(res => this.props.fetchingUserError(res.error));  
        
        this.showControls = this.showControls.bind(this);
        this.hideControls = this.hideControls.bind(this);
        this.toggleControls = this.toggleControls.bind(this);
        this.controlsTimeout;
        this.uploadImage = this.uploadImage.bind(this);
        this.removeImage = this.removeImage.bind(this);
    }
    
    componentWillReceiveProps(nextProps) {
        if (this.props.params.user != nextProps.params.user) {
            this.props.ajaxRequest('post', 'fetchUserData', {user: nextProps.params.user})
            .then(res => this.props.fetchUserData(res.userData))
            .catch(res => this.props.fetchingUserError(res.error));
        }
    }
    
    showControls() {
        if (this.props.imageUrl) {
            clearTimeout(this.controlsTimeout);
            this.imageControls.style.visibility = 'visible';
            this.imageControls.style.opacity = 1;
        }
    }
    
    hideControls() {
        if (this.props.imageUrl) {
            this.imageControls.style.opacity = 0;
            this.controlsTimeout = setTimeout(() => {
                this.imageControls.style.visibility = 'hidden';
            }, 1000)
        }
    }
    
    toggleControls() {
        if (this.props.imageUrl) {
            this.imageControls.style.visibility == 'hidden' ? this.showControls() : this.hideControls();
        }
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
    
    render() {
        let {imageUrl, userError, error, authorizedUser, params: {user}} = this.props;
        return (
            <div>
                { (imageUrl || user == authorizedUser) &&
                    <div className='jumbotron' onMouseEnter={this.showControls} onMouseLeave={this.hideControls} onClick={this.toggleControls}>
                        {imageUrl && 
                            <div>
                                <img src={imageUrl}></img>
                                <div className='jumbotron__image-controls' ref={div => this.imageControls = div}>
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
                <Menu user={user} protection='hide'/>
                {userError && 
                    <p>{userError}</p>
                }
                {error && 
                    <div>
                        <p>{error}</p>
                        <button className='close' onClick={this.props.closeError}><span className='glyphicon glyphicon-remove'></span></button>
                    </div>
                }
                {this.props.children}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        imageUrl: state.userData.imageUrl,
        userError: state.userData.userError,
        error: state.userData.error,
        authorizedUser: state.auth.authorizedUser
    }
}

export default connect(mapStateToProps, {ajaxRequest, fetchUserData, fetchingUserError, loadImage, errorHandler, closeError, removeImage})(User);