import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import ajaxRequest from '../actions/ajaxRequest';

class SignInUp extends Component {
    
    submitHandler(event){
        event.preventDefault();
        let {formType, login, password} = this.props;
        ajaxRequest(formType, login, password);
    }
    
    render(){
        return (
            <form onSubmit={this.submitHandler.bind(this)}>
                <Field component='input' name={`${this.props.formType}Login`} type='text' normalize={(value) => value.toUpperCase()}/>
                <Field component='input' name={`${this.props.formType}Password`} type='text'/>
                <input type='submit' value='Submit' />
            </form>
            )
    }
}


SignInUp = reduxForm({ form: 'signInUp' })(SignInUp);

const selector = formValueSelector('signInUp');
const mapStateToProps = (state, ownProps) => { 
    
    let login = selector(state, `${ownProps.formType}Login`);
    let password = selector(state, `${ownProps.formType}Password`);
        
    return { 
        login,
        password
    } 
}
SignInUp = connect(mapStateToProps)(SignInUp);

export default SignInUp;