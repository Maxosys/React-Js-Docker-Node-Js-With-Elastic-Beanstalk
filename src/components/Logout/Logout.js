import React, { Component, PropTypes } from 'react';

class Logout extends Component {

  constructor(props){

    super(props);
  }

  componentDidMount(){
    //auth.deleteToken();

    sessionStorage.setItem("session_tokenid", '');
    sessionStorage.setItem("ses_user_email", '');
    sessionStorage.setItem("session_username", '');
    sessionStorage.setItem("session_fbid", '');

    localStorage.removeItem('session_tokenid');
    localStorage.removeItem('ses_user_email');
    localStorage.removeItem('session_username');
    localStorage.removeItem('session_fbid');

    this.props.router.push('/login');
  }

  render() {
    
    const { className, ...props } = this.props;

    return (
      <h1 className="loading-text">
        Logging out...
      </h1>
    );
  }
}



export default Logout;