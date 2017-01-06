import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import authorization from '../actions/ajax/authorization';


class SignIn extends Component {
    
    submitHandler = (event) => {
        event.preventDefault();
        let {username, password, authorization} = this.props;
        authorization('post', 'signIn', {username, password});
    }
    
    render(){
        return (
            <div>
                <div className='row row-center'>
                    <p className='col-centered'>{this.props.signInError}</p>
                </div>
                <form onSubmit={this.submitHandler} className='form-group'>
                    <div className='row row-center'>
                        <div className='col-xs-12 col-sm-6 col-md-5 col-lg-4 col-centered'>
                            <Field component='input' name='username' type='text' placeholder='Username' className='form-control'/>
                            <Field component='input' name='password' type='password' placeholder='Password' className='form-control'/>
                            <button type='submit' className='btn btn-primary'>Sign In</button>
                        </div>
                    </div>
                </form>
            </div>
            )
    }
}

SignIn = reduxForm({ form: 'signIn' })(SignIn);

const selector = formValueSelector('signIn');
const mapStateToProps = (state) => {         
    return { 
        username: selector(state, `username`),
        password: selector(state, `password`),
        signInError: state.errors.signInError
    } 
}
SignIn = connect(mapStateToProps, {authorization})(SignIn);

export default SignIn;