// src/components/Addmycommunity/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import Header from '../Header/Header.js';
import $ from 'jquery';
import SHA256 from 'crypto-js/sha256';

class JoinRefrenceCommunity extends Component {  

  constructor(props) {
  
    super(props);    

   this.state = {
      value: "",     
      elements: [],
      communitydata: [],
      userdata: [],
      successmsg:"",
      errormsg:"",
      showResults: false,
      showedit: false,
      currentLocation:"",
      community_id:"",
      community_name:"",
      community_size:"",
      community_religion:"",
      community_spoken:"",
      community_tagline:"",
      comminty_desc:"",
      community_visibility:"",
      owner_name:"",
      user_emailid:"",
      user_id:"",
      invitation_id:""
     
    }; 
         //this.setState({ communitydata: communitydata }  

    this.handleSubmit = this.handleJoin.bind(this);          
  }


  validateEmail(event) {
    // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(event);
  } 


  handleJoin(event) {

   
        //alert('A name was submitted: ' + this.state.value);

         const data = new FormData(event.target);

         //data.append('client_id', config.APP_KEY);

      /*
      const [month, day, year] = data.get('birthdate').split('/');
      const serverDate = `${year}-${month}-${day}`;
      data.set('birthdate', serverDate);
      data.set('username', data.get('username').toUpperCase());
      */       
   

      var username  = $("#name").val(); //data.get('name');
      var email     = $("#email").val(); //data.get('email');
      var password  = $("#password").val(); //data.get('password');
      var cpassword = $("#cpassword").val(); //data.get('cpassword');
      var remember  = $("#remember").val(); //data.get('remember');
      var invitation_id  = $("#invitation_id").val(); //data.get('invitation_id');
      var owner_user_id  = $("#owner_user_id").val(); //data.get('owner_user_id');
      var community_id   = $("#community_id").val(); //data.get('community_id');

      if(!remember)
      {
        alert("Agree Term and Conditions");
        return ;
      }
      
       if(password != cpassword)
      {
          alert("Password Not Matched");
          return;
      }

      var bytes     = SHA256(password);
      var plaintext   = bytes.toString();
      var inckey      = plaintext;
      var userdata    = {community_id:community_id,invitation_id:invitation_id,owner_user_id:owner_user_id,username:username,email:email,inckey:inckey};   

      
      var canProceed = true;

      if(canProceed)
      {
            fetch('/api/registerjoin', {
          method: 'POST',
          body: JSON.stringify({
          task: userdata
           }),
          headers: {"Content-Type": "application/json"}
          }).then( (response) => {
                  return response.json()
               })
               .then( (json) => {   

                alert(json.msg);
                  //this.setState({ successmsg: "You have successfully Joined.",showResults:true })           
                  

                 // this.onSetResult(json);
                  console.log('parsed json', json)
               })
               .catch( (ex) => {
                  console.log('parsing failed', ex)
              });
      }
      else
      {        
        
        alert("Please enter valid email id");
        return;
      }       

  }  

   onSetResult = (result) => {

        if(result.commun_rel_id)
        {
          this.setState({ successmsg: " You have successfully Joined.",showResults:true})
        }
        else
        {
          this.setState({ successmsg: " Already Joined ",showResults:true})
        }
    }

   

// Get community and invitation record

  componentWillMount() {
        
        // set title 
          document.title = this.props.route.title;

       
          var elements = [];  
          var obj = {};

          var currentLocation = this.props.location.pathname;

          var inviteid = this.props.params.inviteid;
          var cid      = this.props.params.cid;


               
         this.callApiGetCommunityInvitation(cid,inviteid)              
                    .then((communitydata) => {this.setState({ communitydata: communitydata })
  
                                this.setState({
                                    community_id:communitydata[0]['community_id'],
                                    community_name:communitydata[0]['community_name'],
                                    community_size:communitydata[0]['community_size'],
                                    community_religion:communitydata[0]['community_religion'],
                                    community_spoken:communitydata[0]['community_spoken'],
                                    community_tagline:communitydata[0]['community_tagline'],
                                    comminty_desc:communitydata[0]['comminty_desc'],
                                    community_visibility:communitydata[0]['community_visibility'],
                                    owner_name:communitydata[0]['name'],
                                    user_emailid:communitydata[0]['user_emailid'],                                   
                                    user_id:communitydata[0]['user_id'],
                                    invitation_id:communitydata[0]['invitation_id']
                                })

              }); // close then    
    
    }  

    
    callApiGetCommunityInvitation = async (cid,inviteid) => {
     
    const response = await fetch('/api/communitybycidinviteid?cid='+cid+'&inviteid='+inviteid,{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
    });

     const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
  }


 joininvitationhtml() {

 let loginornot = ""
  
  if(!sessionStorage.getItem('session_tokenid'))    
    {

    let loginornot = (<button class="btn button--primary" type="submit">Join Now <i aria-hidden="true" class="fa fa-angle-right"></i> </button> );

    }
    else
    {

  let loginornot = (<button class="btn button--primary" type="submit">Join Now <i aria-hidden="true" class="fa fa-angle-right"></i> </button> );

    }


    return (

            <div className="login-section bg-ribbins">
      <div className="container">
        <div className="tab-wrap">
          <h2 className="head-title">Join Community</h2>
          <div className="card">
            <div className="joincard-img"><img alt="" src="/images/big-community-card.png" /></div>
            <div className="memberinfo">
              <span className="members-name">{this.state.community_name}</span>
              <div className="totalmember">Owner Name : <span className="m-number">{this.state.owner_name}</span></div>
            </div>

            
            
            {loginornot}
            
          </div>
        

        <form onSubmit={this.handleJoin}>
            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-user"></i></span>
              <input type="hidden" value={this.state.user_id} name="owner_user_id" id="owner_user_id" />
              <input type="hidden" value={this.state.invitation_id} name="invitation_id" id="invitation_id" />             
              <input type="hidden" value={this.state.community_id} name="community_id"  id="community_id"/>             
              <input type="text" required className="form-control" name="name" id="name"  placeholder="Name"/>
            </div>

            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-envelope"></i></span>
        <input id="email" type="text" readonly className="form-control" name="email" value={this.state.user_emailid}   placeholder="Email"/>
            </div>   

            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-lock"></i></span>
              <input id="password" type="password" required className="form-control" name="password" placeholder="Password"/>
            </div>

            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-lock"></i></span>
              <input id="cpassword" type="password" required className="form-control" name="cpassword" placeholder="Confirm Password"/>
            </div>
              <div className="checkbox">
                <label>
                  <input type="checkbox" value="1" name="remember" id="remember"/> I agree to the Terms of Use and  Privacy Policy
                </label>
              </div>
            <button className="btn button--primary" type="submit">Join  <i aria-hidden="true" className="fa fa-angle-right"></i> </button>

          </form>

        </div>


      </div>
    </div>

      );


  };



  render() {
    const { className, ...props } = this.props;
    return (
      <div {...props}>
	    
		      <Header displaymessage={this.state.successmsg} showResults={this.state.showResults} />
	   
          {this.joininvitationhtml()}


    

      </div>
    );
  }
}



export default JoinRefrenceCommunity;


