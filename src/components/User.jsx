import React, {Component} from 'react';
import {connect} from 'react-redux';
import Dropzone from 'react-dropzone';
import variousErrors from '../actions/variousErrors';
import clearUserData from '../actions/clearUserData';
import fetchData from '../actions/ajax/fetchData';
import createOrUpdate from '../actions/ajax/createOrUpdate';
import Menu from './Menu.jsx';
import ImageDisplay from './ImageDisplay.jsx';
import ciCompare from '../helpers/ciCompare';

class User extends Component { 
    constructor(props){
        super(props);
        
        this.fetchDataFromLink = (currentProps, nextProps) => {
            let {user} = nextProps ? nextProps.params : currentProps.params;
            currentProps.fetchData('user', user);
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
    
    render() {
        let {imageUrl, imageUploading, userError, error, authorizedUser, params: {user}} = this.props;
        let usersEqual = ciCompare(authorizedUser, user);
        
        let children = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {
                authorizedUser,
                usersEqual,
                imageUrl
            });
        });
        
        console.log(userError);
        
        return (
            <div>
                {userError &&
                    <p>{userError}</p>
                }
                {!userError &&  
                    <div className='parallax--null'>
                        <Menu 
                            authorizedUser={authorizedUser}
                            usersEqual={usersEqual}/>
                        <div className='parallax'>    
                        { (imageUrl || usersEqual) &&
                            <div className='jumbotron'>
                                {imageUrl && 
                                    <ImageDisplay 
                                        uploadImage={this.uploadImage} 
                                        imageUrl={imageUrl}
                                        usersEqual={usersEqual}/>
                                }
                                {!imageUrl && !imageUploading &&
                                    <div>
                                        <Dropzone 
                                            multiple={false} 
                                            accept='image/*' 
                                            onDrop={this.uploadImage}/>
                                        <p>Drop an image or click to select a file from your computer.<br/>Maximum file size is 500 kB.</p>
                                    </div>
                                }
                                {imageUploading &&
                                    <div>
                                        <div className='dot'></div>
                                        <div className='pacman'></div>
                                    </div>
                                }
                            </div>
                        }
                        {error && 
                            <div>
                                <p>{error}</p>
                            </div>
                        }
                        {children}
                        </div>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        imageUrl: state.image.url,
        imageUploading: state.image.uploading,
        userError: state.errors.userError,
        error: state.errors.error,
        authorizedUser: state.auth.authorizedUser
    }
}

export default connect(mapStateToProps, {fetchData, createOrUpdate, variousErrors, clearUserData})(User);