import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import createOrUpdate from '../actions/ajax/createOrUpdate';

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

const customInput = ({input, meta: {dirty, touched, error}, type, placeholder, className, confirmPass}) => {
    
    let errorList;
    if (error) {
        errorList = error.map(singleError => {
            return <li key={singleError}>{singleError}</li>;
        }); 
    }
    
    return (
        <div>
            <input {...input} type={type} placeholder={placeholder} className={className}></input>
            {((dirty && !confirmPass) || touched) && error && <ul className='authorization__val-errors'>{errorList}</ul>}
        </div>
    )
}

class SignUp extends Component {
    
    signUp = (event) => {
        let {username, password, createOrUpdate} = this.props;
        createOrUpdate('signUp', {username, password});
    }
    
    render(){
        let {signUpError} = this.props;
        
        return (
            <div>
                {signUpError &&
                    <p className='col-xs-12 col-sm-9 col-lg-7 col-centered error'>{signUpError}</p>
                }
                <form onSubmit={this.props.handleSubmit(this.signUp)}> 
                    <div className='col-xs-12 col-sm-9 col-lg-7 col-centered'>
                        <Field 
                            className='authorization__input' 
                            component={customInput} 
                            name='username' 
                            type='text' 
                            placeholder='Username' 
                            validate={[validateUsername]}/>
                        <Field 
                            className='authorization__input' 
                            component={customInput} 
                            name='password' 
                            type='password' 
                            placeholder='Password' 
                            validate={[validatePassword]}/>
                        <Field 
                            className='authorization__input' 
                            component={customInput} 
                            name='confirmation' 
                            type='password' 
                            placeholder='Confirm password' 
                            validate={[validateConfirmation]}
                            confirmPass={true}/>
                        <button 
                            className='btn authorization__button'
                            type='submit'> 
                            Sign Up
                        </button>
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
        signUpError: state.errors.signUpError
    } 
}
SignUp = connect(mapStateToProps, {createOrUpdate})(SignUp);

export default SignUp;