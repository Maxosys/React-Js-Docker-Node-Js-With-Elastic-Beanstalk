// src/components/Addmycommunity/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import Header from '../Header/Header.js';
import $ from 'jquery';

class PendingCommunity extends Component {  

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
  }

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
          if(communitydata[0])
          {
          const array = communitydata.map(function(x,i){      
                      
          elements.push({"latlong" : x.community_lat_long, "community_name" : x.community_name , "community_id" : 0 , "community_tagline" : 'wait for admin approval' , "name" :x.name })
          //elements.push(x)         
        
        }) 
        }
           window.initialize(elements);


        });     
    
    }  

    callApiGetCommunityByUid = async (uid) => {

      const response = await fetch('/api/pendingcommunitybyuid?uid='+uid,{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
      });

      const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

    return body;
    }


 


  render() {
    const { className, ...props } = this.props;


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
      <div className="title"><h3> Approval is pending: iTribe Communities  </h3><div className="sep"><img alt="" src="images/sep.jpg" /></div></div>
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

               <span className="view-detail">Wait for approval</span> 
                                
                
                </div>
              </div>
             </li>
          )

           : "no approval pending"
          
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



export default PendingCommunity;


