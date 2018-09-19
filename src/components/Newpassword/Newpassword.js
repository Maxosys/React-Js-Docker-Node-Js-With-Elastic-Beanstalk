// src/components/Addmycommunity/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import Header from '../Header/Header.js';
import { Link } from 'react-router';
import $ from 'jquery';
import SHA256 from 'crypto-js/sha256';

class Newpassword extends Component {


constructor(props) {

    super(props);

    this.state = {
      username:'',
      usernameemail:'',
      password:'',
      session_username:'',
      session_tokenid:'',
      ses_user_email:'',    
      members: [],
      userdata: [],
      successmsg:"",
      errormsg:"",
      showResults: false,
      uid: "",
      hashkey: ""
    }
 
    this.handleChange   = this.handleChange.bind(this);
    this.handleSubmit   = this.handleSubmit.bind(this);
    

 }  

handleChange(event) {   

    //console.log(event);
    //this.setState({username: event.target.username,password:event.target.password});    

  }


   handleSubmit(event) {

      var apiBaseUrl = "/api/newpasswordreq";
      var self = this;
     
       var payload={      
       "password":this.state.password
       }        
        
       const data = new FormData(event.target);

        var password     = $("#password").val();  //data.get('password');
        var cpassword    = $("#cpassword").val(); //data.get('cpassword');
        var uid          = $("#uid").val();       //data.get('uid');
        var hashkey      = $("#hashkey").val();   //data.get('hashkey');


          if(password !== cpassword)
          {
            this.setState({ successmsg: " Password and Confirme Password Not Matched ",showResults:true})
            
            alert("Password and Confirme Password Not Matched");

            return;
          }

      var bytes       = SHA256(password);
      var plaintext   = bytes.toString();
      var inckey      = plaintext;

        var userdata     = {inckey:inckey,uid:uid,hashkey:hashkey};

        
      var respdata =  fetch(apiBaseUrl,{
          method: 'POST',
          body: JSON.stringify({
          task: userdata
           }),
          headers: {"Content-Type": "application/json"}
        }).then( (response) => {return response.json() }).then( (json) => {
              if(json !== "")
              {
                this.setState({ successmsg: json.msg,showResults:false })

                 //this.setState({ successmsg: json.msg })

                 alert(json.msg);      
              }
              else
              {
                this.setState({ successmsg: 'Invalid Request',showResults:true })
              }
              
              //alert("Successfully changed password");
              //this.onSetResult(json)
             // console.log('parsed json', json)
             // console.log('State Data ',this.state)
             // this.props.router.push('/login')
           })
           .catch( (ex) => {
              console.log('parsing failed', ex)
          });
  }
   

  componentWillMount() {   
    

  
  }




  componentDidMount() {
      
      document.title = this.props.route.title;

       if(sessionStorage.getItem('session_tokenid'))
          {
            this.props.router.push('/');
          }

          var uid     = this.props.params.uid;
          var hashkey = this.props.params.hashkey;

          this.setState({ uid: this.props.params.uid,hashkey:this.props.params.hashkey })

    
  }
  


  render() {
    const { className, ...props } = this.props;

    var currentLocation = this.props.location.pathname;

   

    return (
      <div> <Header pathn={currentLocation} displaymessage={this.state.successmsg} showResults={this.state.showResults} />      
	   


    <div className="login-section bg-ribbins">
      <div className="container">
        <div className="tab-wrap">
          <h2 className="head-title"> Enter new password </h2>
          <form onSubmit={this.handleSubmit} >
            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-user"></i></span>
              <input id="password" required type="password" className="form-control" name="password" placeholder="Enter New Password" />                                        
            
                <input type="hidden" id="uid" name="uid" value={this.state.uid} />
                <input type="hidden" id="hashkey" name="hashkey" value={this.state.hashkey} />

            </div>           
            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-lock"></i></span>
              <input id="cpassword" required type="password" className="form-control" name="cpassword" placeholder="Confirme Password" />
            </div>
            
            <button className="btn button--primary" type="submit"> Change <i aria-hidden="true" className="fa fa-angle-right"></i> </button>

            
            <div className="form-group">                           
              
          
                {/*{this.state.members.map(member =>
                  <div key={member.id}> {member.id} {member.name} - {member.email}</div>
                )}*/}

            </div> 
          </form>        
        </div>
      </div>
    </div>

	
      </div>
    );
  }
}



export default Newpassword;