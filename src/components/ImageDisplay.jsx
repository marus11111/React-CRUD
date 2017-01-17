import React, {Component} from 'react';
import {connect} from 'react-redux';
import remove from '../actions/ajax/remove';
import ciCompare from '../helpers/ciCompare';
import {showControls, hideControls, toggleControls} from '../helpers/hiddenControls';

class ImageDisplay extends Component { 
    
    removeImage = (e) => {
        e.stopPropagation();
        this.props.remove('removeImage');
    }
    
    render() {
        let {imageUrl, usersEqual, uploadImage} = this.props;
        let imageControls;
        
        let imageStyle = {
            backgroundImage: `url(${imageUrl})`
        }
        
        return (
            <div 
                onMouseEnter={() => usersEqual && showControls(imageControls)}
                onMouseLeave={() => usersEqual && hideControls(imageControls)}
                onClick={() => usersEqual && toggleControls(imageControls)}
                >
                <div className='jumbotron__image' style={imageStyle}></div>
                { usersEqual &&
                    <div className='jumbotron__image__controls hidden-controls' ref={div => imageControls = div}>
                        <form>
                            <label htmlFor='imageUpload' className='btn jumbotron__image__single-button' onClick={e => e.stopPropagation()}>
                                <span className='glyphicon glyphicon-edit'></span> Change
                            </label>
                            <input id='imageUpload' type='file' onChange={() => uploadImage(this.imageInput.files)} ref={input => this.imageInput = input}></input>
                        </form>
                        <button className='btn jumbotron__image__single-button' onClick={this.removeImage}>
                            <span className='glyphicon glyphicon-trash'></span> Remove
                        </button>
                    </div>
                }
            </div>         
        )
    }
}

export default connect(null, {remove})(ImageDisplay);