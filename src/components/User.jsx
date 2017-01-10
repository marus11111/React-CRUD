import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import clearUserData from '../actions/clearUserData';
import variousErrors from '../actions/ajax/variousErrors';
import fetchData from '../actions/ajax/fetchData';
import createOrUpdate from '../actions/ajax/createOrUpdate';
import remove from '../actions/ajax/remove';
import Menu from './Menu.jsx';
import Dropzone from 'react-dropzone';
import ciCompare from '../helpers/ciCompare';

class User extends Component { 
    constructor(props){
        super(props);
        this.controlsTimeout;
        
        this.fetchDataFromLink = (currentProps, nextProps) => {
            let {user} = nextProps ? nextProps.params : currentProps.params;
            currentProps.fetchData({user});
        }      
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
    
    showControls = () => {
        clearTimeout(this.controlsTimeout);
        this.imageControls.style.visibility = 'visible';
        this.imageControls.style.opacity = 1;
    }
    
    hideControls = () => {
        this.imageControls.style.opacity = 0;
        this.controlsTimeout = setTimeout(() => {
            this.imageControls.style.visibility = 'hidden';
        }, 1000)
    }
    
    toggleControls = () => {
        this.imageControls.style.visibility == 'hidden' ? this.showControls() : this.hideControls();
    }
    
    uploadImage = (images) => {
        let {createOrUpdate, variousErrors} = this.props;
        const upload_preset = 'jyju7fnq';
        let file = images[0];
        
        if (file.size > 512000) {
            variousErrors('Maximum file size is 500 kB.');
        }
        else {
            createOrUpdate('imageUpload', {upload_preset, file});
        }
    }
    
    removeImage = (e) => {
        e.stopPropagation();
        this.props.remove('removeImage');
    }
    
    removePost = (id, from) => {
        this.props.remove('removePost', {id, from});
    }
    
    render() {
        let {imageUrl, imageLoading, userError, error, authorizedUser, params: {user}} = this.props;
        
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
                        {!imageUrl && !imageLoading &&
                            <div>
                                <Dropzone multiple={false} accept='image/*' onDrop={this.uploadImage}/>
                                <p>Drop an image or click to select a file from your computer.<br/>Maximum file size is 500 kB.</p>
                            </div>
                        }
                        {imageLoading &&
                            <div>
                                <div className='dot'></div>
                                <div className='pacman'></div>
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
        imageUrl: state.image.url,
        imageLoading: state.image.imageLoading,
        userError: state.errors.userError,
        error: state.errors.error,
        authorizedUser: state.auth.authorizedUser
    }
}

export default connect(mapStateToProps, {fetchData, createOrUpdate, remove, clearUserData, variousErrors})(User);