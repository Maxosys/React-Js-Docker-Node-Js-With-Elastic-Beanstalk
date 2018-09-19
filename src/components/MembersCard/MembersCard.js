import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import Header from '../Header/Header.js';
import Popupclass from './Popupclass.js';


class MembersCard extends Component {  

   constructor(props) {
    super(props);
    

    this.state = {
      value: "",     
      elements: [],
      communitydata: [],
      userdata: [],
      memberdata: [],
      successmsg:"",
      errormsg:"",
      showResults: false
    };
  }

      componentDidMount() {
        
          document.title = this.props.route.title;

          if(!sessionStorage.getItem('session_tokenid'))
          {
            this.props.router.push('/login');
          }
          else
          {
    // get selected comunity data 

      var elements = [];  
      var obj      = {};

      this.callApiGetAllCommunity(this.props.params.cid)
      //.then(res => res.json())
      .then((communitydata) => {this.setState({ communitydata: communitydata })

          //console.log(this.state.communitydata);
        const array = communitydata.map(function(x,i){
                      
          elements.push({"latlong" : x.community_lat_long, "community_name" : x.community_name , "community_id" : x.community_id , "community_tagline" : x.community_tagline , "name" :x.name })
          //elements.push(x)         
        
        })
           window.initialize(elements);

        });

      // end

      // get Community members

                this.callApiGetMembers(this.props.params.cid)
      //.then(res => res.json())
      .then((memberdata) => {this.setState({ memberdata: memberdata })

                        //console.log(this.state.memberdata);                      

        });

      // end 

        }

    }

      // call rerence function for get members

               callApiGetMembers = async (cid) => {
     
    const response = await fetch('/api/comm_mem_by_cid?cid='+cid,{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
    });

     const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
    }


      // end 

    callApiGetAllCommunity = async (cid) => {
     
    const response = await fetch('/api/communitybyid?cid='+cid,{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
      });

     const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
    }



  setLibraryLink()  {

        if(this.state.communitydata[0])
        {
            var newObj =  this.state.communitydata[0];
            if(newObj.community_owner_id == sessionStorage.getItem('session_tokenid'))
            {
                  return(

              <a href={"/library/"+this.props.params.cid}> | Add documents to the community library </a>
                    )
            }
            else
            {
                  return(
                   <a href={"/library/"+this.props.params.cid}> | View Documents </a>
                  )  
            }
        }
  }

    render() {

      const { className, ...props } = this.props;
    
    return (
      <div>

	  <Header /> 

    <div className="communtiy-section login-section">
    <div className="container">
    <div className="title">

    <h3> <a className="linkclass" href={"/members-card/"+this.props.params.cid}  > Community members </a>  {this.setLibraryLink()}   </h3>
    <div className="sep"><img src="/images/sep.jpg" /></div></div>
        
        <div className="col-sm-7 pull-right">
        <div className="right-section">
        <div className="globe-bg">
          <div className="globemapcss" id="earth_div"></div>
        </div>
        </div>
        </div>

      <div className="col-sm-5 pull-left">
      <div className="left-section">
      <div className="inner-tilte"><h3>Members Cards</h3><div className="sep"><img src="/images/sep.jpg" /></div></div>

      <ul className="members-name">           

      {this.state.memberdata == "" ? <p className="simplecase"> Please check back soon for more details on this community </p> : "" }

      {this.state.memberdata.map(member =>
        
        <li key={member.id}>
          <div className="membercard"><img src="/images/card.png" /></div>
          <div className="memberinfo">
            <span className="members-name">{member.name}</span>
            <span className="location"><i className="fa fa-location-arrow"></i> {member.location}</span>
            

            <div className="communitybuttons">
              <a href="javascript:;"  data-toggle="modal" data-target={'#basicModal'+member.id} className="view-detail" > View details </a>
            
              <a href={"/message/"+sessionStorage.getItem('session_tokenid')+"/"+member.id+"/"+member.community_id} className="view-detail"> Message </a>
            </div>

          </div>
          
          <Popupclass community_id={member.community_id} memberid={member.id} memberlocation={member.location}  memberemail={member.email} membername={member.name} memberabout_you={member.about_you}  />

        </li>

       )}

    {/* 
        <li>
            <div className="membercard"><img src="/images/card.png" /></div>
            <div className="memberinfo">
              <span className="members-name">Member Name</span>
              <span className="location"><i className="fa fa-location-arrow"></i> USA</span>
              <a href="javascript:;" className="view-detail" data-toggle="modal" data-target="#basicModal1">View details</a>
            </div>
        </li>
    */}             
            </ul>
        </div>
        </div>
        </div>
        </div>
        </div>
    );
  }
}



export default MembersCard;