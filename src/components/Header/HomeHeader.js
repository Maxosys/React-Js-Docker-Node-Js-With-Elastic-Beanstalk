import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router'


export default class HomeHeader extends React.Component {

    constructor(props) {
    super(props);
    this.state = { hits: null,sessionStatus:false , unreadmsgcount: 0 , notificationArr: [] };

      this.st  = false;   

     if(sessionStorage.getItem('session_tokenid'))
      {
        this.st = true;
      }

       this.handleCommunitySearch = this.handleCommunitySearch.bind(this);
  }


   componentDidMount() {

    if(sessionStorage.getItem('session_tokenid') && !sessionStorage.getItem('asession_tokenid'))
    {      
      this.interval = setInterval(this.triggerFunHead, 5000);

      var fromid = sessionStorage.getItem('session_tokenid');


      this.callApiMsgTotalCount(fromid)      
      .then(result => this.setState({unreadmsgcount : result[0].unreadmsg}));
    

      this.callApiNotification(fromid)      
      .then(result => this.setState({notificationArr : result}));
    }

  }

   // notification
     callApiNotification = async (cstr) => {

      const response = await fetch('/api/getnotifications?userid='+cstr,{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
      });

      const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
  
  } 

    callApiMsgTotalCount = async (cstr) => {

      const response = await fetch('/api/msgtotalcount?userid='+cstr,{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
      });

      const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
  
  }

  displayMessageCounts(counts)
{
  if(counts==0)
  {
    return(
      <span></span>
    )  
  }
  else
  {
      return(
      <span className="count">{counts}</span>
    )
  }
  

}

notifications() {

 console.log(this.state.notificationArr);
 // sid: 2, rid: 19, countnotifiction: 1, sendername: "ABC", lastmsg: "Pending community join requests"

  return(

     <ul className="dropdown-menu notificationdiv" role="menu">  
     { this.state.notificationArr[0]?
    
      this.state.notificationArr.map(member =>                 
        
        <li class="dropdown-submenu" >

      { member.lastmsg == 'Pending community join requests' ?

         <a href="/pending-request"> <strong>{member.sendername}</strong>: Community join requests </a> 
      :
        <a href={"/message/"+member.rid+"/"+member.sid+"/0"}> <strong>{member.sendername}</strong>: {member.lastmsg} </a> 
      }
        
        </li>

        )

        :
        <li class="dropdown-submenu" > <a href="/message"> empty notification </a> </li>
    }
     </ul>
  )
}


    handleCommunitySearch(event) {

        const data              =  new FormData(event.target);
        var searchstr           =  data.get("searchstr");
        document.location.href  =  '/search/'+searchstr;
        
     
       //this.props.router.push('/search/'+searchstr);     
  }

   homeNavLoginSignup() {
        
        return(
          <ul className="nav navbar-nav navbar-right" id="left-menu">
            <li className="search"><a href="#search"> <i className="icon Serarch"></i></a></li>
            <li className="log" id="step2" ><a href="/login"> <i className="icon login"></i> Log in</a></li>
            <li className="signup" id="step1" ><a href="/signup"> <i className="icon sign"></i>Sign Up</a></li>
          </ul>
          );
  }

  profilePic() {

    var user_pic = sessionStorage.getItem('session_tokenid')+"_userpic.jpg"; 

    return(
      <div className="header_profile_pic">              
        <img id="imageprol" alt="" onError={this.handleImgError} width="30" src={"/uploads/users/"+user_pic} />
      </div>
    )
  }

   homeAfterLoginNav() {
        
        return(
          <ul className="nav navbar-nav navbar-right" id="left-menu">
                <li className="search"><a href="#search"> <i className="icon Serarch"></i></a></li>
                  <li className="furtherlinks show-on-hover">
                  <a href="#iq-home" className="dropdown-toggle" data-toggle="dropdown">My Community</a>
                  <ul className="dropdown-menu" role="menu">
                    <li><a href="/my-community">My Community</a></li>
                    <li><a href="/joined-communities">My Joined Communities</a></li>
                    <li><a href="/pending-communities">Approval Pending Communities</a></li>
                    <li><a href="/addcommunity">Add Community</a></li>                   
                    <li><a href="/invite-newmember">Invite New Members</a></li>
                    <li><a href="/pending-request">Pending Join Requests</a></li>
              
                  </ul>
                </li>
                <li className="furtherlinks"><a href="/community-display">Other Communities</a></li>

                <li className="furtherlinks"><a href="/help">Help</a></li>
  <li className="inboxs furtherlinks show-on-hover ">
  
    <a href="#iq-home" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ><i className="icon inbox"></i> {this.displayMessageCounts(this.state.unreadmsgcount)} </a>
     
     {this.notifications()}    

  </li>  
                <li className="signup"><a href="/logout"> <i className="icon logout"></i> </a></li>             
          </ul>          
          );
  }

  render() {
     
     const { className, ...props } = this.props;	

     var st = true;


     if(sessionStorage.getItem('session_tokenid'))
      {
        st = false;
      }


      return (
         <header id="header-wrap" >
        <div className="container" id="imageprol">
          <nav className="navbar navbar-default hidden-xs hidden-sm">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="/">
                  {/*<i className="fa fa-bars hidden-xs" aria-hidden="true"></i>*/}
                  <img src="/images/logo.png" alt="logo" />
                  <img src="/images/color-logo.jpg" className="black-logo" alt="logo" />
                </a>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

            {st ? this.homeNavLoginSignup() :  this.homeAfterLoginNav() }
              
            </div>
          </nav>
          <div id="search">
            <button type="button" className="close"></button>
            <form onSubmit={this.handleCommunitySearch} >
              <input type="search" name="searchstr" placeholder="search for communities" />
              <button type="submit" className="btn button--primary">Search <i className="fa fa-angle-right" aria-hidden="true"></i> </button>
            </form>
          </div>        
         
          <a className="navbar-brand visible-xs visible-sm">
            <span className="side-bar opennavediv"  ><i className="fa fa-bars"></i></span>
            <img src="/images/logo.png" className="white-logo" alt="logo" />
            <img src="/images/color-logo.jpg" className="black-logo" alt="logo" />
          </a>
          <div id="mySidenav" className="sidenav">
            <a href="javascript:void(0)" className="closebtn closenavediv" >×</a>
            <div className="padding">
              <div id="custom-search-input">
                <div className="input-group col-md-12">
                {/*  <input type="text" className="  search-query form-control" placeholder="Search" />
                  <span className="input-group-btn">
                    <button className="btn btn-danger" type="button">
                      <span className="fa fa-search"></span>
                     </button>
                  </span>*/}
    
      <form onSubmit={this.handleCommunitySearch} >
      <input type="search" name="searchstr" className="  search-query form-control" placeholder="search for communities" />
      <span className="input-group-btn"> <button type="submit" className="btn btn-danger" >  <span className="fa fa-search"></span> </button>  </span>
      </form>
                </div>
              </div>

              { this.st ?
          <ul className="nav navbar-nav navbar-right" id="left-menu">
             <li className="furtherlinks">
              <a href="#iq-home" className="dropdown-toggle" data-toggle="dropdown">My Community</a>
              <ul className="dropdown-menu" role="menu">
                      <li><a href="/my-community">My Community</a></li>
                      <li><a href="/joined-communities">My Joined Communities</a></li>
                      <li><a href="/addcommunity">Add Community</a></li>                     
                      <li><a href="/invite-newmember">Invite New Members</a></li>
                      <li><a href="/pending-request">Pending Join Requests</a></li>                     
              </ul>
            </li>
            <li className="furtherlinks"><a href="/community-display">Other Communities</a></li> 
            <li className="furtherlinks"><a href="/help">Help</a></li>      
            <li className="furtherlinks"><a href="/message">Message</a></li>      

          </ul>
            : ''
              }             
          
              { this.st ?

                 <div id="footer-bottom-holepunch-mobile" className="bottom">
                    <a className="register la-fragment-mobile_footer" id="side-nav-register" href="/logout">Logout </a>
                 </div>
                 
                 :

                 <div id="footer-bottom-holepunch-mobile" className="bottom">
                 <a className="sign-in la-fragment-mobile_footer" id="side-nav-signin" href="/login">Log In</a>
                 <a className="register la-fragment-mobile_footer" id="side-nav-register" href="/signup">Sign Up </a>
                 </div>
              }     

            </div>
          </div>
		  </div>
    </header>

      );
  }
}
