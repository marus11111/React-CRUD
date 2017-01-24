//higher order component to protect some other components from unauthorized users

import React, {
  Component
} from 'react';
import {
  connect
} from 'react-redux';
import {
  withRouter
} from 'react-router';
import ciCompare from '../helpers/ciCompare';


export default function (WrappedComp) {
  class Protect extends Component {
    constructor(props) {
      super(props);

      let {
        protection
      } = props.route ? props.route : props;

      if (protection == 'redirect') {
        this.protect = (props) => {
          let {
            authorizedUser,
            router,
            params: {
              user
            }
          } = props;
          ciCompare(authorizedUser, user) ? null : router.push('/');
        }
      } else if (protection == 'hide') {
        this.protect = (props) => {
          let {
            authorizedUser,
            router,
            params: {
              user
            }
          } = props;
          this.hide = ciCompare(authorizedUser, user) ? null : true;
        }
      }
    }

    componentWillMount() {
      this.protect(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this.protect(nextProps);
    }

    render() {
      if (this.hide) {
        return false;
      }
      return <WrappedComp {...this.props}/>;
    }
  }

  let mapStateToProps = (state) => {
    return {
      authorizedUser: state.auth.authorizedUser
    }
  }

  Protect = connect(mapStateToProps)(Protect);

  return withRouter(Protect);
}
