import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import ajaxRequest from '../actions/ajaxRequest';
import protect from '../HOC/protectedComponent.jsx';

class CreateUpdatePost extends Component {
    constructor(props) {
        super(props);
        this.submitHandler = this.submitHandler.bind(this);
    }
    
    submitHandler(event){
        event.preventDefault();
        let {title, body, ajaxRequest} = this.props;
        let {type} = this.props.route;
        ajaxRequest('post', `${type}Post`, {title, body});
    }
    
    render(){
        let {type} = this.props.route;
        return ( 
            <div>
                <form onSubmit={this.submitHandler}>
                    <Field component='input' type='text' name='title'/>
                    <Field component='textarea' name='body'/>
                    <button type='submit'>{type} Post</button>
                </form>
            </div>
        )
    }
}

CreateUpdatePost = reduxForm({ form: 'createUpdatePost' })(CreateUpdatePost);

const selector = formValueSelector('createUpdatePost');
const mapStateToProps = (state) => {
    return {
        title: selector(state, 'title'),
        body: selector(state, 'body')
    }
}

CreateUpdatePost = connect(mapStateToProps, {ajaxRequest})(CreateUpdatePost);

export default protect(CreateUpdatePost);