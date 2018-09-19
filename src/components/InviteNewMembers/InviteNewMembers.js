import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import Header from '../Header/Header.js';
import { Link } from 'react-router';
import $ from 'jquery';

class InviteNewMembers extends Component {  

  constructor(props) {
  
    super(props);
    
    this.state = {
      value: [], 
      count: 1,
      communitydata: [],
      userdata: [],
      name: "",
      email: "",
      password:"",
      cpassword:"",
      successmsg:"",
      errormsg:"",
      showResults: false
    };
    
    this.handleInviteSubmit = this.handleInviteSubmit.bind(this);

    this.handleMannualChange = this.handleMannualChange.bind(this);
  }

   handleChange(i, event) {
     let value = this.state.value.slice();
     value[i] = event.target.value;
     this.setState({value});
  }

   handleMannualChange(event) {

    this.setState({
       user_id: this.refs.user_id.value,
       commu_id: this.refs.commu_id.value
    })
  }

  handleInviteSubmit(event) {
       
      
     var userdata = [];
     var valuearr = {};

          const data = new FormData(event.target); 

          var user_id  =  this.state.user_id; //data.get('user_id'); 
          var commu_id =  this.state.commu_id; //data.get('commu_id'); 


          userdata.push({user_id:user_id,commu_id:commu_id});
          //valuearr["commu_id"] = commu_id;

          valuearr["emailids"] = [];

          var stt =  true;       

        for(let i = 0; i < this.state.count; i++) {

          var addemail =  $('#email'+i).val();
          
            if(addemail && addemail !== "")
            {
                  //var addemail = data.get('email'+i);
                
                  var canProceed = this.validateEmail(addemail);
                
                  if(canProceed)
                  {
                     valuearr["emailids"].push(addemail);
                     stt = true;
                  }
                  else
                  {
                    alert("Please enter valid email id");

                    stt = false;
                  }
            }

          }

          if(stt)
          {
                userdata.push(valuearr);

                console.log(userdata);
                
                 fetch('/api/sendinvitaion', {
          method: 'POST',
          body: JSON.stringify({
          task: userdata
           }),
          headers: {"Content-Type": "application/json"}
          }).then( (response) => {
                  return response.json()    
               })
               .then( (json) => {   this.setState({ successmsg: "Invitation successfully Sent",showResults:true })           
                  
                    this.onSetResult(json)
                  console.log('parsed json', json)
               })
               .catch( (ex) => {
                  console.log('parsing failed', ex)
              }); 
          }
         
    }


    onSetResult = (result) => {
        
          this.setState({ successmsg: " Invitation successfully sent.. ",showResults:true})  
    }

  addClick(){

    this.setState({count: this.state.count+1})
    
  }
  
  removeClick(i){
     let value = this.state.value.slice();
     value.splice(i,1);
     this.setState({
        count: this.state.count - 1,
        value
     })
  }

     validateEmail(event) {
   
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(event);
  } 

    componentWillMount() {
        
        // set title 
          document.title = this.props.route.title;

          if(!sessionStorage.getItem('session_tokenid'))
          {
            this.props.router.push('/login');
          }

              /*  var elements = [];  
                var obj = {};*/
               
                 // var currentLocation = this.props.location.pathname;

               
                     this.callApiGetCommunityByUid(sessionStorage.getItem('session_tokenid'))
                      //.then(res => res.json())
                    .then((communitydata) => {this.setState({ communitydata: communitydata })       

        });
                     this.setState({ editSt:true });

                
      }


        callApiGetCommunityByUid = async (uid) => {

      const response = await fetch('/api/communitybyuid?uid='+uid,{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
      });

      const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

    return body;
    }


  renderCommunityDrop() {
  
    return (
              <div className="input-group-invite">                

                  <select name="commu_id" ref="commu_id" onChange={this.handleMannualChange} className="form-control" required >  
                  <option value=""> Select Community </option>  
                    
                    {this.state.communitydata.map(member =>           
                
                  <option value={member.community_id} key={member.community_id} > {member.community_name} </option>              

                  )};
                  </select>

               </div>
        );

  }

  createUI(){
     let uiItems = [];
     for(let i = 0; i < this.state.count; i++){
           uiItems.push(              

            <div className="input-group" key={i}>
              <span className="input-group-addon"><i className="fa fa-envelope"></i><a className="readmore" href="javascript:;" onClick={this.removeClick.bind(this,i)}>X</a>              </span>
              <input id={"email"+i} required type="text" className="form-control" name={"email"+i} value={this.state.value[i] || ''} onChange={this.handleChange.bind(this,i)} placeholder="Email"/>             
                   
            </div>

            )
     }
     return uiItems || null;
  }


  render() {
    const { className, ...props } = this.props;
    return (
      <div >
	   <Header displaymessage={this.state.successmsg} showResults={this.state.showResults} />
	   
        <div className="login-section bg-ribbins">
      <div className="container">
        <div className="tab-wrap">
          <h2 className="head-title">Invite New Members</h2>
          <form role="form" onSubmit={this.handleInviteSubmit} >

          {this.renderCommunityDrop()}
          {this.createUI()}
              
              <input type="hidden" value={sessionStorage.getItem('session_tokenid')} id="user_id" name="user_id" ref="user_id" onChange={this.handleMannualChange} />

          
          
          <p>
          <a className="readmore" href="javascript:;" onClick={this.addClick.bind(this)}><i className="fa fa-plus-circle"></i></a>
          </p>
             
            <button className="btn button--primary" type="submit">Send Invitations <i aria-hidden="true" className="fa fa-angle-right"></i> </button>
          </form>        
        </div>
      </div>
    </div>
      </div>
    );
  }
}



export default InviteNewMembers;