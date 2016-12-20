import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';


export default function(WrappedComp) {
    class Protect extends Component {
        constructor(props){
            super(props);
            
            let {protection} = props.route ? props.route : props;
            
            if (protection == 'redirect'){
                this.protect = (props) => {
                    let {authorizedUser, linkUser, router} = props;
                    authorizedUser == linkUser ? null : router.push('/');
                }
            }
            else if (protection == 'hide'){
                this.protect = (props) => {
                    let {authorizedUser, linkUser, router} = props;
                    this.hide = authorizedUser == linkUser ? null : true;
                }
            }
        }
        
        componentWillMount(){
            this.protect(this.props);
        }
        
        componentWillReceiveProps(nextProps){
            this.protect(nextProps);
        }
        
        render(){
            if (this.hide) {
                return false;
            }
            return <WrappedComp {...this.props}/>;
        }
    }
    
    let mapStateToProps = (state) => {
        return {
            authorizedUser: state.auth.authorizedUser,
            linkUser: state.auth.linkUser
        }
    } 
    
    Protect = connect(mapStateToProps)(Protect);
    
    return withRouter(Protect);
}