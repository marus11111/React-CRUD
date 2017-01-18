//component that displays sign in and sign up forms

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import SignIn from './SignIn.jsx';
import SignUp from './SignUp.jsx';
import activateSignIn from '../actions/activateSignIn';
import activateSignUp from '../actions/activateSignUp';


class Authorization extends React.Component { 
    
    //if user is logged in, redirect him to his page
    componentDidMount(){        
        let {authorizedUser, router} = this.props;
        authorizedUser && router.push(`${authorizedUser}`);
    }
    
    //after user signs in/up, redirect him to his page
    componentWillReceiveProps(nextProps){
        let {authorizedUser, router} = nextProps;
        authorizedUser && router.push(`${authorizedUser}`);
    }
    
    render (){ 
        let {activeForm, activateSignIn, activateSignUp, ongoingCookieAuth} = this.props;

        //prevent component showing for fraction of a second before redirecting if user is logged in
        if(ongoingCookieAuth) {
            return null;
        }
        
        return (
            <div className='container'>
                <div className='row row-center'>
                    <button 
                        className={`btn col-xs-2 col-centered${activeForm === 'signIn' ? ' active' : ''}`}
                        onClick={activateSignIn}>
                        Sign In
                    </button>
                    <button 
                        className={`btn col-xs-2 col-centered${activeForm === 'signUp' ? ' active' : ''}`}
                        onClick={activateSignUp}>
                        Sign Up
                    </button>
                </div>
                {activeForm === 'signIn' && <SignIn/>} 
                {activeForm === 'signUp' && <SignUp/>}
                <p>This website uses cookies. By signing up or signing in you are agreeing to receive our cookies.</p>
            </div>
        )
    }
} 

//makes router available in component's props
Authorization = withRouter(Authorization);

const mapStateToProps = (state) => {
    return {
        authorizedUser: state.auth.authorizedUser,
        activeForm: state.auth.activeForm,
        ongoingCookieAuth: state.auth.ongoingCookieAuth
    }
}

export default connect(mapStateToProps, {activateSignIn, activateSignUp})(Authorization);