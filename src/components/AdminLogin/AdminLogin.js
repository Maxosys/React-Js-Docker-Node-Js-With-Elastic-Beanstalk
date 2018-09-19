// src/components/Addmycommunity/index.js
import React, { Component } from 'react';
import Header from '../Header/Header.js';
import { Link } from 'react-router';
import $ from 'jquery';

class AdminLogin extends Component { 


constructor(props){

    super(props);

    this.state={
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
     this.handleSubmit = this.handleSubmit.bind(this);

 }

  /*state = {
   
  }; */

 /*  getInitialState() {
    return {
      members: []
    };
  }*/

  handleChange(event) {

    console.log(event);
    //this.setState({username: event.target.username,password:event.target.password});    

  }

   handleSubmit(event) {

      var apiBaseUrl = "/api/alogin";
      var self = this;
     
       var payload={
       "email":this.state.username,
       "password":this.state.password
       }        
        
       const data = new FormData(event.target);

        var email     = $("#login-username").val(); //data.get('username');
        var password  = $("#login-password").val(); //data.get('password');

        var userdata = {email:email,inckey:password};
        
      var respdata =  fetch(apiBaseUrl,{
          method: 'POST',
          body: JSON.stringify({
          task: userdata
           }),
          headers: {"Content-Type": "application/json"}
        }).then( (response) => { return response.json()
           }).then( (json) => {  

            if(json !== "")
              {
                this.setState({ userdata: json[0],showResults:false }) 
                this.onSetResult(json)
                console.log('parsed json', json)
                console.log('State Data ',this.state)
                this.props.router.push('/admin-dashboard')               
              }
              else
              {

                alert("Information not Correct");
                this.setState({ successmsg: 'Email or Password is wrong',showResults:true })
              }

              //this.setState({ userdata: json[0],showResults:true })
              
              
           })
           .catch( (ex) => {
              console.log('parsing failed', ex)
          });
  }

   onSetResult = (result) => {
    
    sessionStorage.setItem("asession_tokenid", result[0].id);
    sessionStorage.setItem("ases_user_email", result[0].email);
    sessionStorage.setItem("asession_username", result[0].name);

    sessionStorage.setItem("session_tokenid", result[0].id);
    sessionStorage.setItem("ses_user_email", result[0].email);
    sessionStorage.setItem("session_username", result[0].name);
    
    this.setState({ session_tokenid: result[0].id });
    this.setState({ ses_user_email: result[0].email });
    this.setState({ session_username: result[0].email });
  
  }



  componentDidMount() {
      
      document.title = this.props.route.title;

       if(sessionStorage.getItem('session_tokenid'))
          {
            this.props.router.push('/admin-dashboard');
          }


  }
  


  render() {

    var currentLocation = this.props.location.pathname;

   

    return (
      <div> <Header pathn={currentLocation} />      
	   
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
              <div className="reset-password-modal--header">  </div>
    
    <div className="reset-password-modal--description">			  
	  
      Please provide the email address you used when you signed up for your itribe account. 
      
      <br />
  		<br /> We will send you an email with a link to resetyour password.

    </div>
            </div>
            
            <form className="reset__form" id="reset-form" onSubmit={this.handleSubmit} >
              <div className="input-wrap login-section">
                <div className="input-container PosR">
                  <div className="input-group">
                    <span className="input-group-addon"><i className="fa fa-envelope"></i></span>
                    <input id="login-username-email" type="text" className="form-control" name="email"  placeholder="Email" />
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
          <h2 className="head-title"> Admin Panel </h2>
          <form onSubmit={this.handleSubmit} method="post">
            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-user"></i></span>
              <input id="login-username" onChange = {(event,newValue) => this.setState({username:newValue})} type="text" className="form-control" name="username" placeholder="Email" />                                        
            </div>           
            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-lock"></i></span>
              <input id="login-password" type="password" onChange = {(event,newValue) => this.setState({password:newValue})} className="form-control" name="password" placeholder="Password" />
            </div>
            {/*<a className="lostLink" href="javascript:;" data-toggle="modal" data-target="#basicModal"></a>*/}
            <button className="btn button--primary" type="submit">Log in <i aria-hidden="true" className="fa fa-angle-right"></i> </button>           

          </form>        
        </div>
      </div>
    </div>

	
      </div>
    );
  }
}



export default AdminLogin;