// src/components/Addmycommunity/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import Header from '../Header/Header.js';

class PendingRequest extends Component { 

   constructor(props) {
  
    super(props);    

    this.state = {
      value: "",     
      elements: [],
      requestdata: [],
      userdata: [],
      successmsg:"",
      errormsg:"",
      showResults: false,
      currentLocation:""
    };
         //this.setState({ communitydata: communitydata }        
    
    this.onClick = this.onClick.bind(this);

  }

    onClick(event,commun_rel_id,user_id,commun_id) {

      this.onApproveJoinCommunity(event,commun_rel_id,user_id,commun_id)
      .then((joinresp) => {console.log(joinresp) }); 
      this.delete_join_request(event,commun_rel_id,user_id,commun_id)
      .then((joinresp) => {console.log(joinresp) }); 

  }

    delete_join_request(event,commun_rel_id,user_id,commun_id) {

           //console.log(commun_rel_id);

        const response =  fetch('/api/delete_join_request?commun_rel_id='+commun_rel_id+'&user_id='+user_id+'&commun_id='+commun_id,{
        method: 'GET',         
        headers: {"pragma": "no-cache","cache-control" : "no-cache"}
        }).then( (response) => {
        return response.json()
        })
        .then( (json) => {

          console.log('parsed json', json);      
          alert(json.msg);                    

        })
        .catch( (ex) => {
        console.log('parsing failed', ex)
        });


     this.callApiGetInvitationByUid(sessionStorage.getItem('session_tokenid'))                     
          .then((requestdata) => {this.setState({ requestdata: requestdata })

            //console.log(this.state.requestdata);   
          }); 

  }

  onApproveJoinCommunity(event,commun_rel_id,user_id,commun_id) {

           //console.log(commun_rel_id);

        const response =  fetch('/api/approve_join_request?commun_rel_id='+commun_rel_id+'&user_id='+user_id+'&commun_id='+commun_id,{
        method: 'GET',         
        headers: {"pragma": "no-cache","cache-control" : "no-cache"}
        }).then( (response) => {
        return response.json()
        })
        .then( (json) => {

          console.log('parsed json', json);      
          alert(json.msg);                    

        })
        .catch( (ex) => {
        console.log('parsing failed', ex)
        });


     this.callApiGetInvitationByUid(sessionStorage.getItem('session_tokenid'))                     
          .then((requestdata) => {this.setState({ requestdata: requestdata })

            //console.log(this.state.requestdata);   
          }); 

  }

   componentWillMount() {
        
        // set title 
          document.title = this.props.route.title;

          if(!sessionStorage.getItem('session_tokenid'))
          {
            this.props.router.push('/login');
          }

          this.callApiGetInvitationByUid(sessionStorage.getItem('session_tokenid'))                     
          .then((requestdata) => {this.setState({ requestdata: requestdata })

            //console.log(this.state.requestdata);   
          }); 
    }

    callApiGetInvitationByUid = async (uid) => {

      const response = await fetch('/api/getpendingjoins?uid='+uid,{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
      });

      const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

    return body;
    }

  render() {
    const { className, ...props } = this.props;


    var datast = true;

    if(this.state.requestdata == "")
    {
      datast =  false;      
    }

    return (
	
      <div>
	     
		 <Header />
	  
      <div className="communtiy-section">
      <div className="container">


      <div className="title"><h3>My Community Invitations </h3><div className="sep"><img alt="" src="/images/sep.jpg"/></div></div>
      
      { datast? 

          this.state.requestdata.map(member =>

      <div className="col-xs-12 col-md-6" style={{ minHeight: '40vh' }} key={member.commun_rel_id} >
      <div className="req-listing">
      <div className="user-img">
        <img alt="" src="images/card.png" />
      </div>
      <div className="info">
      <div className="name" title={member.email} >{member.name} </div>
        <div className="email"> {member.community_name} </div>
      </div>
      <div className="pending-req">
        <a href="javascript:;"  onClick={(event) => { this.delete_join_request(event,member.commun_rel_id,member.user_id,member.commun_id) }} ><i className="fa fa-times-circle" aria-hidden="true"></i></a>
        <a href="javascript:;" className="approve" onClick={(event) => { this.onApproveJoinCommunity(event,member.commun_rel_id,member.user_id,member.commun_id) }}>Approve</a>
      </div>
      </div>
      </div>
          )
      :
      <div className="col-xs-12 col-md-12" style={{ minHeight: '40vh' }} > 
       <p> No pending join requests </p> 
      </div>
    }

      {/*<div className="col-xs-12 col-md-6">
      <div className="req-listing">
      <div className="user-img">
        <img src="images/card.png"/>
      </div>

      <div className="info">
      <div className="name">Name</div>
      <div className="email">info123@gmail.com</div>
      </div>
      <div className="pending-req">
        <a href="javascript:;"><i className="fa fa-times-circle" aria-hidden="true"></i></a>
        <a href="javascript" className="approve">Approve</a>
      </div>
      </div>
      </div>*/}


      </div>
    </div>
      </div>
    );
  }
}



export default PendingRequest;