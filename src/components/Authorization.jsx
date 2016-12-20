import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import SignIn from './SignIn.jsx';
import SignUp from './SignUp.jsx';
import activateSignIn from '../actions/activateSignIn';
import activateSignUp from '../actions/activateSignUp';


class Authorization extends React.Component { 
    
    componentDidMount(){        
        let {authorizedUser, router} = this.props;
        authorizedUser ? router.push(`${authorizedUser}`) : null;
    }
    
    componentWillUpdate(nextProps){
        let {authorizedUser, router} = nextProps;
        authorizedUser ? router.push(`${authorizedUser}`) : null;
    }
    
    render (){ 
        let {activeForm, activateSignIn, activateSignUp} = this.props;
        return (
            <div className='container'>
                <div className='row row-center'>
                    <button onClick={activateSignIn} className='btn btn-default col-xs-2 col-centered'>Sign In</button>
                    <button onClick={activateSignUp} className='btn btn-default col-xs-2 col-centered'>Sign Up</button>
                </div>
                {activeForm == 'signIn' && <SignIn/>} 
                {activeForm == 'signUp' && <SignUp/>}
            </div>
        )
    }
} 

Authorization = withRouter(Authorization);

const mapStateToProps = (state) => {
    return {
        authorizedUser: state.auth.authorizedUser,
        activeForm: state.auth.activeForm
    }
}

export default connect(mapStateToProps, {activateSignIn, activateSignUp})(Authorization);