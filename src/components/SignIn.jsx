import React, {
  Component
} from 'react';
import {
  Field,
  reduxForm,
  formValueSelector
} from 'redux-form';
import {
  connect
} from 'react-redux';
import authorization from '../actions/ajax/authorization';


class SignIn extends Component {

  submitHandler = (event) => {
    event.preventDefault();
    let {
      username,
      password,
      authorization
    } = this.props;
    authorization('signIn', {
      username,
      password
    });
  }

  render() {
    let {
      signInError
    } = this.props;

    return (
      <div>
        {signInError &&
        <p className='col-xs-12 col-sm-9 col-lg-7 col-centered error'>{signInError}</p>
        }
        <form onSubmit={this.submitHandler}> 
          <div className='col-xs-12 col-sm-9 col-lg-7 col-centered'>
            <Field 
              className='authorization__input'
              component='input' 
              name='username' 
              type='text' 
              placeholder='Username'/> 
            <Field 
              className='authorization__input'
              component='input' 
              name='password' 
              type='password' 
              placeholder='Password'/> 
            <button 
              className='btn authorization__button'
              type='submit'> 
              Sign In
            </button>
          </div>
        </form>
      </div>
    )
  }
}

SignIn = reduxForm({
  form: 'signIn'
})(SignIn);

const selector = formValueSelector('signIn');
const mapStateToProps = (state) => {
  return {
    username: selector(state, `username`),
    password: selector(state, `password`),
    signInError: state.errors.signInError
  }
}
SignIn = connect(mapStateToProps, {
  authorization
})(SignIn);

export default SignIn;
