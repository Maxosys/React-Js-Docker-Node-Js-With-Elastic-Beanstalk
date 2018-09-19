// src/components/Addmycommunity/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import Header from '../Header/Header.js';
import { Link } from 'react-router';
import $ from 'jquery';

class Login extends Component {


constructor(props) {

    super(props);

    this.state = {
      username:'',
      password:'',
      session_username:'',
      session_tokenid:'',
      ses_user_email:'',    
      members: [],
      userdata: [],
      successmsg:"",
      errormsg:"",
      showResults: false
    }
 
    this.handleChange = this.handleChange.bind(this);
 }

  /*state = {
   
  }; */

 /*  getInitialState() {
    return {
      members: []
    };
  }*/

  handleChange(event) {   

    //console.log(event);
    //this.setState({username: event.target.username,password:event.target.password});    

  }

   handleSubmit(event) {

      var apiBaseUrl = "/api/login";
      var self = this;
     
       var payload={
       "email":this.state.username,
       "password":this.state.password
       }        
        
       const data = new FormData(event.target);

        var email     = data.get('username');
        var password  = data.get('password');

        var userdata = {email:email,inckey:password};
        
      var respdata =  fetch(apiBaseUrl, {
          method: 'POST',
          body: JSON.stringify({
          task: userdata
           }),
          headers: {"Content-Type": "application/json"}
        }) .then( (response) => {
                  return response.json()    
           })
           .then( (json) => {  

              if(json != "")
              {
                this.setState({ userdata: json[0],showResults:false })                
              }
              else
              {
                this.setState({ successmsg: 'Email or Password is wrong',showResults:true })
              }
              
              this.onSetResult(json)
             // console.log('parsed json', json)
             // console.log('State Data ',this.state)
              this.props.router.push('/')
           })
           .catch( (ex) => {
              console.log('parsing failed', ex)
          });
  }

   onSetResult = (result) => {
   
    sessionStorage.setItem("session_tokenid", result[0].id);
    sessionStorage.setItem("ses_user_email", result[0].email);
    sessionStorage.setItem("session_username", result[0].name);
    sessionStorage.setItem("session_usertype", result[0].user_type);
    
    this.setState({ session_tokenid: result[0].id });
    this.setState({ ses_user_email: result[0].email });
    this.setState({ session_username: result[0].email });
  }



  componentWillMount() {
    
    this.handleSubmit = this.handleSubmit.bind(this);

    //this.fblogin =  this.fblogin.bind(this);
  }




  componentDidMount() {
      
      document.title = this.props.route.title;

       if(sessionStorage.getItem('session_tokenid'))
          {
            this.props.router.push('/');
          }


      this.callApi()      
      //.then(res => res.json())
      .then(members => this.setState({ members: members }));
  }
  
  callApi = async () => {
     
    const response = await fetch('/api/users',{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
    });

     const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
  }

  render() {
    const { className, ...props } = this.props;

    var currentLocation = this.props.location.pathname;

   

    return (
      <div> <Header pathn={currentLocation} displaymessage={this.state.successmsg} showResults={this.state.showResults} />      
	   
	  <div className="modal fade" id="basicModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
    <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
      </div>
      <div className="modal-body">
        <div className="contain">
          <div>
            <div className="reset-password-modal--info">
              <div className="reset-password-modal--header">Forgot Password  </div>
    
    <div className="reset-password-modal--description">			  
	  
      Please provide the email address you used when you signed up for your itribe account. 
      
      <br />
  		<br /> We will send you an email with a link to resetyour password.

    </div>
            </div>
            
            <form className="reset__form" id="reset-form" >
              <div className="input-wrap login-section">
                <div className="input-container PosR">
                  <div className="input-group">
                    <span className="input-group-addon"><i className="fa fa-envelope"></i></span>
                    <input id="login-username" type="text" className="form-control" name="email" value="" placeholder="Email" />
                  </div>
                  <input type="submit"  value="Send Email" id="submitReset" className="btn btn-block btn-primary btn-login center-block" />
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    <div className="login-section bg-ribbins">
      <div className="container">
        <div className="tab-wrap">
          <h2 className="head-title">Log Into Your Account {sessionStorage.getItem('ses_user_email')} {this.state.ses_user_email} </h2>
          <form role="form" onSubmit={this.handleSubmit} >
            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-user"></i></span>
              <input id="login-username" onChange = {(event,newValue) => this.setState({username:newValue})} type="text" className="form-control" name="username" placeholder="Email" />                                        
            </div>           
            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-lock"></i></span>
              <input id="login-password" type="password" onChange = {(event,newValue) => this.setState({password:newValue})} className="form-control" name="password" placeholder="Password" />
            </div>
            <a className="lostLink" href="#" data-toggle="modal" data-target="#basicModal">Forget password?</a>
            <button className="btn button--primary" type="submit">Log in <i aria-hidden="true" className="fa fa-angle-right"></i> </button>

            <div className="chat-box-single-line">
              <abbr className="timestamp">or</abbr>
            </div>

            <a className="btn btn-block btn-social btn-facebook" href="javascript:;"  >
              <span className="fa fa-facebook"></span> login with facebook
            </a>


            <div className="form-group">                 
              <div><Link to="/signup" >Create my iTribe account</Link></div>
              <h1>Users</h1>
          {this.state.members.map(member =>
            <div key={member.id}> {member.id} {member.name} - {member.email}</div>
          )}
            </div> 
          </form>        
        </div>
      </div>
    </div>

	
      </div>
    );
  }
}



export default Login;