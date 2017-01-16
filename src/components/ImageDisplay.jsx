import React, {Component} from 'react';
import {connect} from 'react-redux';
import remove from '../actions/ajax/remove';
import ciCompare from '../helpers/ciCompare';

class ImageDisplay extends Component { 
    constructor(props){
        super(props);
        this.controlsTimeout;
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
        this.imageControls.style.visibility === 'hidden' ? 
            this.showControls() : 
            this.hideControls();
    }
    
    removeImage = (e) => {
        e.stopPropagation();
        clearTimeout(this.controlsTimeout);
        this.props.remove('removeImage');
    }
    
    render() {
        let {imageUrl, usersEqual, uploadImage} = this.props;
        let eventHandlers = {};
        if (usersEqual) {
            eventHandlers = {
                onMouseEnter: this.showControls,
                onMouseLeave: this.hideControls,
                onClick: this.toggleControls
            }
        }
        
        return (
            <div {...eventHandlers}>
                <img src={imageUrl} className='jumbotron__image'></img>
                { usersEqual &&
                    <div className='jumbotron__image__controls' ref={div => this.imageControls = div}>
                        <form className='jumbotron__image__single-button'>
                            <label htmlFor='imageUpload' className='btn btn-primary' onClick={e => e.stopPropagation()}>
                                <span className='glyphicon glyphicon-edit'></span> Change
                            </label>
                            <input id='imageUpload' type='file' onChange={() => uploadImage(this.imageInput.files)} ref={input => this.imageInput = input}></input>
                        </form>
                        <button className='btn btn-danger jumbotron__image__single-button' onClick={this.removeImage}>
                            <span className='glyphicon glyphicon-trash'></span> Remove
                        </button>
                    </div>
                }
            </div>         
        )
    }
}

export default connect(null, {remove})(ImageDisplay);