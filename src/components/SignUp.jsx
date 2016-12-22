import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import ajaxRequest from '../helpers/ajaxRequest';
import signUpErrorAction from '../actions/ajaxErrors/signUpErrorAction';

const validateUsername = value => {
    let errors = []
    
    if (!value) {
        errors.push('Required');
    }
    else if (value.length < 8) {
        errors.push('Must have at least 8 characters');
    }
    if (/[^\00-\255]/g.test(value)) {
        errors.push('Invalid character(s)');
    }
    if (/\s/g.test(value)){
        errors.push('No whitespace allowed');
    }
    
    return errors.length > 0 ? errors : undefined;
}

const validatePassword = value => {
    let errors = [];
    
    if (!value) {
        errors.push('Required');
    }
    else if (value.length < 8) {
        errors.push('Must have at least 8 characters');
    }
    if (/[^\00-\255]/g.test(value)) {
        errors.push('Invalid character(s)');
    }
    if (/\s/g.test(value)) {
        errors.push('No whitespace allowed');
    }
    if (!/\d/g.test(value)) {
        errors.push('Must contain at least one digit');
    }
    if (!/[A-Z]/g.test(value)) {
        errors.push('Must contain at least one capital letter');
    }
    
    return errors.length > 0 ? errors : undefined;
}
 
const validateConfirmation = (value, allValues) => {
    let errors = [];
    
    if (!(value == allValues.password)) {
        errors.push('Passwords don\'t match');
    }
    
    return errors.length > 0 ? errors : undefined;
}

const customInput = ({input, meta: {touched, error}, type, placeholder, className }) => {
    
    let errorList;
    if (error) {
        errorList = error.map(singleError => {
            return <li key={singleError}>{singleError}</li>;
        }); 
    }
    
    return (
        <div>
            <input {...input} type={type} placeholder={placeholder} className={className}></input>
            {touched && error && <ul>{errorList}</ul>}
        </div>
    )
}

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.createUser = this.createUser.bind(this);
    }
    
    createUser(event){
        let {username, password, ajaxRequest} = this.props;
        ajaxRequest('post', 'signUp', {username, password})
        .catch(res => this.props.signUpErrorAction(res.error));
    }
    
    render(){
        return (
            <div>
                <div className='row row-center'>
                    <p className='col-centered'>{this.props.signUpError}</p>
                </div>
                <form onSubmit={this.props.handleSubmit(this.createUser)} className='form-group'>
                    <div className='row row-center'>
                        <div className='col-xs-12 col-sm-6 col-md-5 col-lg-4 col-centered'>
                            <Field component={customInput} name='username' type='text' placeholder='Username' className='form-control' validate={[validateUsername]}/>
                            <Field component={customInput} name='password' type='password' placeholder='Password' className='form-control' validate={[validatePassword]}/>
                            <Field component={customInput} name='confirmation' type='password' placeholder='Confirm password' className='form-control' validate={[validateConfirmation]}/>
                            <button type='submit' className='btn btn-primary'>Sign Up</button>
                        </div>
                    </div>
                </form>
            </div>
            )
    }
}

SignUp = reduxForm({ form: 'signUp' })(SignUp);

const selector = formValueSelector('signUp');
const mapStateToProps = (state) => { 
    return { 
        username: selector(state, `username`),
        password: selector(state, `password`),
        signUpError: state.auth.signUpError
    } 
}
SignUp = connect(mapStateToProps, {ajaxRequest, signUpErrorAction})(SignUp);

export default SignUp;