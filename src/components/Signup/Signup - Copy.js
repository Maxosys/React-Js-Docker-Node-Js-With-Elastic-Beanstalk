// src/components/Addmycommunity/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import Header from '../Header/Header.js';

class Signup extends Component {

    constructor(props) {
    super(props);
    
    this.state = {
      value: "", 
      name: "",
      email: "",
      password:"",
      cpassword:"",
      confirmPassword:""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(event) {    

    this.setState({value: event.target.value});    

  }

   componentDidMount() {

    console.log("Call Service");
   
  }

   handlePasswordInput(event) {
    if(this.state.confirmPassword != ""){
      this.refs.passwordConfirm.isValid();
    }
    this.refs.passwordConfirm.hideError();
    this.setState({
      password: event.target.value
    });
  }

  handleConfirmPasswordInput(event) {
    this.setState({
      confirmPassword: event.target.value
    });
  }

  handleSubmit(event) {        

   var canProceed = this.validateEmail(this.state.email)         
        && this.refs.password.isValid()
        && this.refs.cpassword.isValid();
        //alert('A name was submitted: ' + this.state.value);

         const data = new FormData(event.target);

         //data.append('client_id', config.APP_KEY);

         console.log(data.get('name'));

    /*     const [month, day, year] = data.get('birthdate').split('/');
    const serverDate = `${year}-${month}-${day}`;
    data.set('birthdate', serverDate);
    data.set('username', data.get('username').toUpperCase());*/
       
   

      var username = data.get('name');
      var email    = data.get('email');
      var password = data.get('password');
    //var username = data.get('cpassword');

      var inckey   = password;
      var userdata = {username:username,email:email,inckey:inckey};
        
        fetch('/api/register', {
          method: 'POST',
          body: JSON.stringify({
          task: userdata
           }),
          headers: {"Content-Type": "application/json"}
        });


    /*    fetch('http://localhost:9000/api/register',{
    method: 'POST',
    body: JSON.stringify(items),
    headers: {"Content-Type": "application/json"}
  })
  .then(function(response){
    return response.json()
  }).then(function(body){
    
    console.log(body);
    
  });*/

       

  }  

  isConfirmedPassword(event) {
    return (event == this.state.password)
  }

  validateEmail(event) {
    // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(event);
  }  

   handleEmailInput(event){
    this.setState({
      email: event.target.value
    });
  }

  render() {
    const { className, ...props } = this.props;
    
    var currentLocation = this.props.location.pathname;

   // console.log(currentLocation);

    return (
      <div className={classnames('About', className)} {...props}>

      <Header pathn={currentLocation} />

      <div className="login-section bg-ribbins">
      <div className="container">
        <div className="tab-wrap">
          <h2 className="head-title">Create Your itribe Account</h2>
          <form role="form" onSubmit={this.handleSubmit}>
            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-user"></i></span>
              <input 
              id="login-username" 
              ref="email"
              type="text" 
              className="form-control" 
              name="name" 
              placeholder="Name"
              validate={this.validateEmail}
              value={this.state.email}
              onChange={this.handleEmailInput}
              errorMessage="Email is invalid"
              emptyMessage="Email can't be empty"
              errorVisible={this.state.showEmailError}

              />
            </div>

            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-envelope"></i></span>
        <input id="login-email" type="text" className="form-control" name="email"  value="abc@gmail.com" placeholder="Email"/>
            </div>   

            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-lock"></i></span>
              <input id="login-password" type="password" className="form-control" name="password" placeholder="Password"/>
            </div>

            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-lock"></i></span>
              <input id="login-cpassword" type="password" className="form-control" name="cpassword" placeholder="Confirm Password"/>
            </div>
              <div className="checkbox">
                <label>
                  <input type="checkbox" value="1" name="remember" id="login-remember"/> I agree to the Terms of Use and  Privacy Policy
                </label>
              </div>
            <button className="btn button--primary" type="submit">Sign UP <i aria-hidden="true" className="fa fa-angle-right"></i> </button>

            <div className="chat-box-single-line">
              <abbr className="timestamp">or</abbr>
            </div>

            <a className="btn btn-block btn-social btn-facebook">
              <span className="fa fa-facebook"></span> login with facebook
            </a>


            <div className="form-group">                 
              <div>
                <a href="#">Reset Password </a>
                <a href="#" className="learn">Learn More</a>
              </div>
            </div> 
          </form>        
        </div>
      </div>
    </div>
      </div>
    );
  }
}

export default Signup;