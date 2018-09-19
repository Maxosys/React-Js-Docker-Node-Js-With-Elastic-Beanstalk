import React, { Component, PropTypes } from 'react';

class AdminLogout extends Component {

  constructor(props){

    super(props);
  }

  componentDidMount(){
    //auth.deleteToken();

    sessionStorage.setItem("session_tokenid", '');
    sessionStorage.setItem("ses_user_email", '');
    sessionStorage.setItem("session_username", '');

    localStorage.removeItem('session_tokenid');
    localStorage.removeItem('ses_user_email');
    localStorage.removeItem('session_username');

    sessionStorage.setItem("asession_tokenid", '');
    sessionStorage.setItem("ases_user_email", '');
    sessionStorage.setItem("asession_username", '');

    localStorage.removeItem('asession_tokenid');
    localStorage.removeItem('ases_user_email');
    localStorage.removeItem('asession_username');

    this.props.router.push('/apanel');
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



export default AdminLogout;