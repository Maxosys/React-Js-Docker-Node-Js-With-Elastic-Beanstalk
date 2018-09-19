// src/components/Addmycommunity/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import Header from '../Header/Header.js';
import $ from 'jquery';

class JoinedCommunity extends Component {  

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
      currentLocation:"",
      member_status:0
    };
         //this.setState({ communitydata: communitydata }                  
  
    this.onClick = this.onClick.bind(this);


  }

// join community function

  onClick(event,cid,uid) {

      this.leaveCommunity(cid,uid)
      .then((joinresp) => {console.log(joinresp) });     
  }
  
  leaveCommunity(event,cid,uid) {
    
        var userdata = {cid:cid,uid:uid};
        alert(uid);
        const response =  fetch('/api/leave_community?commun_id='+cid+'&user_id='+uid,{
        method: 'GET',         
        headers: {"pragma": "no-cache","cache-control" : "no-cache"}
        }).then( (response) => {
        return response.json()
        })
        .then( (json) => {
          
               this.setState({ successmsg: "Successfully left",showResults:true });        
               
               //alert("Successfully left");
        })
        .catch( (ex) => {
          
          console.log('parsing failed', ex)
        
        });

        // call
          var elements = [];  
          var obj = {};

          var currentLocation = this.props.location.pathname;

               
          this.callApiGetCommunityByUid(sessionStorage.getItem('session_tokenid'))                     
          .then((communitydata) => {this.setState({ communitydata: communitydata })

          //console.log(this.state.communitydata);
          const array = communitydata.map(function(x,i){      
                      
          elements.push({"latlong" : x.community_lat_long, "community_name" : x.community_name , "community_id" : x.community_id , "community_tagline" : x.community_tagline , "name" :x.name })
          //elements.push(x)         
        
        })
           window.initialize(elements);

        });

        // end
  }

// end 
 

  componentWillMount() {
        
        // set title 
          document.title = this.props.route.title;

          if(!sessionStorage.getItem('session_tokenid'))
          {
            this.props.router.push('/login');
          }

          var elements = [];  
          var obj = {};

          var currentLocation = this.props.location.pathname;

               
          this.callApiGetCommunityByUid(sessionStorage.getItem('session_tokenid'))                     
          .then((communitydata) => {this.setState({ communitydata: communitydata })

          //console.log(this.state.communitydata);
          const array = communitydata.map(function(x,i){      
                      
          elements.push({"latlong" : x.community_lat_long, "community_name" : x.community_name , "community_id" : x.community_id , "community_tagline" : x.community_tagline , "name" :x.name })
          //elements.push(x)         
        
        })
           window.initialize(elements);

        });     
    
    }  

    callApiGetCommunityByUid = async (uid) => {

      const response = await fetch('/api/joinedcommunitybyuid?uid='+uid,{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
      });

      const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

    return body;
    }


 


  render() {
    const { className, ...props } = this.props;

    let session_uid = sessionStorage.getItem('session_tokenid');

    var st = false;

    if(this.state.communitydata[0])
    {
      st = true;
    }


    return (
      <div >
	    
		<Header displaymessage={this.state.successmsg} showResults={this.state.showResults} />
	   
       <div className="communtiy-section login-section">
    <div className="container">
      <div className="title"><h3> Joined iTribe Communities  </h3><div className="sep"><img alt="" src="images/sep.jpg" /></div></div>
      <div className="breadcrums-search communtiesitribe">
        <div className="searchfaq">         
         
        </div>
        <div className="links">
          <a href="/addcommunity">Add my community</a>
          <a href="/community-display">Join existing community</a>
        </div>
      </div>

       <div className="col-sm-7 pull-right">
        <div className="right-section">
          <div className="globe-bg"  >
            <div className="globemapcss" id="earth_div"></div>          
          </div>
        </div>
      </div>

      <div className="col-sm-5 pull-left">
        <div className="left-section">
          <div alt="" className="inner-tilte"><h3>community Cards</h3><div className="sep"><img alt="" src="images/sep.jpg" /></div></div>
          <ul className="members-name cumnnity-list">

          { st ? 
            
           

          this.state.communitydata.map(member =>
            
             <li key={member.community_id}>        
             <div className="membercard"><img alt="" src="images/community-card.png" /></div>
              <div className="memberinfo">
                <span className="members-name"> {member.community_name} </span>
                <div className="totalmember"> {member.community_tagline} </div>
                <div className="totalmember">Owner Name : <span className="m-number">{member.name} </span></div>
                <div className="communitybuttons">

               <a href={'members-card/'+member.community_id} className="view-detail">View details</a> 
               
               <a href="javascript:;" onClick={(event) => { this.leaveCommunity(event,member.community_id,session_uid) }}  className="view-detail">Leave Community  </a> 
                                
                
                </div>
              </div>
             </li>
          )

           : "you're not a member of any communities"
          
          }

          </ul>
          
        </div>
      </div>

   
    </div>
  </div>
      </div>
    );
  }
}



export default JoinedCommunity;


