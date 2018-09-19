import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { Link,Router, Route } from 'react-router';
import $ from 'jquery';


export default class InnerHeader extends React.Component {

  constructor(props) {
    super(props);


    // console.log(this.props.router);

    this.state = { hits: null,sessionStatus:false , unreadmsgcount: 0 , notificationArr: [] };

    this.st  = false;   

     if(sessionStorage.getItem('session_tokenid'))
      {
        this.st = true;
      }       

      this.handleCommunitySearch = this.handleCommunitySearch.bind(this);
      this.handleImgError        = this.handleImgError.bind(this);
  }
  
  handleImgError(event){

  //console.log(event.target.src);

  return event.target.src = '/uploads/users/default.jpg';

  }


  handleCommunitySearch(event) {

        const data = new FormData(event.target);
        var searchstr =  data.get("searchstr");


        document.location.href = '/search/'+searchstr;
        
     
       //this.props.router.push('/search/'+searchstr);     
  }

  

  triggerFunHead()
  {
    if(sessionStorage.getItem('session_tokenid') && !sessionStorage.getItem('asession_tokenid'))
    {
      var fromid = sessionStorage.getItem('session_tokenid');
     //      this.abc1();
          
    }
    else
    {
      console.log("iTribe");
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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

 /* onSearch = (e) => {
    e.preventDefault();

    const { value } = this.input;

    if (value === '') {
      return;
    }

    const cachedHits = localStorage.getItem(value);
    if (cachedHits) {
      this.setState({ hits: JSON.parse(cachedHits) });
      return;
    }

    fetch('https://hn.algolia.com/api/v1/search?query=' + value)
      .then(response => response.json())
      .then(result => this.onSetResult(result, value));
  }

  onSetResult = (result, key) => {
    localStorage.setItem(key, JSON.stringify(result.hits));
    this.setState({ hits: result.hits });
  }*/



  renderMobileLoginSignupNavigations() {
        return (

          <div id="mySidenav" className="sidenav">
            <a href="javascript:void(0)" className="closebtn closenavediv" >×</a>
            <div className="padding">
              <div id="custom-search-input">
                <div className="input-group col-md-12">
                {/*  <input type="text" className="  search-query form-control" placeholder="search for communities" />
                  <span className="input-group-btn">
                    <button className="btn btn-danger" type="button">
                      <span className="fa fa-search"></span>
                     </button>
                  </span>*/}

                  <form onSubmit={this.handleCommunitySearch} >
              <input type="search" className="  search-query form-control" name="searchstr" placeholder="Community Search here" required />
             <span className="input-group-btn"> <button type="submit" className="btn btn-danger"><span className="fa fa-search"></span>  </button> </span>
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
                      <li><a href="/pending-communities">Approval Pending Communities</a></li>
                      <li><a href="/addcommunity">Add Community</a></li>                      
                      <li><a href="/invite-newmember">Invite New Members</a></li>
                      <li><a href="/pending-request">Pending Join Requests</a></li>
                      
                     
              </ul>
            </li>
            <li className="furtherlinks"><a href="/community-display">Other Communities</a></li> 
            <li className="furtherlinks"><a href="/help">Help</a></li>        
          </ul>      
           :
              <ul className="nav navbar-nav navbar-right" id="left-menu">                
              </ul> 
          }

          { this.st ? 
            <div id="footer-bottom-holepunch-mobile" className="bottom">
            <a className="register la-fragment-mobile_footer" id="side-nav-register" href="/logout">Logout</a>  
            </div>
            :
            <div id="footer-bottom-holepunch-mobile" className="bottom">  
            <a className="sign-in la-fragment-mobile_footer" id="side-nav-signin" href="/login">Log In</a>
            <a className="register la-fragment-mobile_footer" id="side-nav-register" href="/signup">Sign Up</a>
            <img id="imageprol" width="30" alt="" />
            </div>
          } 
          
          </div>
          
          </div>

          )
  }

  renderLoginSignupNavigations() {




        return (
              
            <ul className="nav navbar-nav navbar-right" id="left-menu">
                <li className="search"><a href="#search"> <i className="icon Serarch"></i></a></li>              
                <li className="log"><a href="/login"> <i className="icon login"></i> Log in</a></li>
                <li className="signup"><a href="/signup"> <i className="icon sign"></i>Sign Up</a></li>  
                <li> <img id="imageprol" width="30" alt="" />     </li>
            </ul>
          )
       }


  profilePicWithFb() {

    var user_pic = sessionStorage.getItem('session_tokenid')+"_userpic.jpg"; 

    return(

         sessionStorage.getItem('session_fbid') ?                     
        <img width="30" alt="" src={"http://graph.facebook.com/"+sessionStorage.getItem('session_fbid')+"/picture?type=small"} />
              :                    
        <img id="imageprol" alt="" onError={this.handleImgError} width="30" src={"/uploads/users/"+user_pic} />
    )
  }

  
  profilePic() {

    var user_pic = sessionStorage.getItem('session_tokenid')+"_userpic.jpg"; 

    return(
      <div className="header_profile_pic">              
        <img id="imageprol" alt="" onError={this.handleImgError} width="30" src={"/uploads/users/"+user_pic} />
      </div>
    )
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

     renderNavigations() {
        return (
              
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

                <li className="signup dropdown userpic">             

                  <a href="#iq-home" className="dropdown-toggle" data-toggle="dropdown">
                    {this.profilePic()}                 
                    {sessionStorage.getItem('session_username')} <i aria-hidden="true" className="fa fa-angle-down downarrow"></i>
                  </a>
                  <ul className="dropdown-menu user-account-menu simple pull-right">   
                    { this.st ?
 
                    <li>
                      <a className="inline-option" href="/edit-profile">Edit Profile</a>
                    </li>
                        
                      :

                      ''
                    }

                      
                      { this.st ?
                         
                        <li>
                          <a className="inline-option" href="/logout">Logout</a>
                        </li>
                      :                        
                        <li>
                          <a className="inline-option" href="/login">Login</a>
                        </li>
                      }

                  </ul>
                </li>
  
  {/*<li className="inboxs"><a href="/message"><i className="icon inbox"></i> {this.displayMessageCounts(this.state.unreadmsgcount)} </a></li>*/}
      
  <li className="inboxs furtherlinks show-on-hover ">
    <a href="#iq-home" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ><i className="icon inbox"></i> {this.displayMessageCounts(this.state.unreadmsgcount)} </a>
     
     {this.notifications()}    

  </li>        
              </ul>
          )
       }


  render() {

     const { className, ...props } = this.props;
  var currentLocation = this.props.pathn;

      var  st  = true;   

     if(sessionStorage.getItem('session_tokenid'))
      {
        st = false;
      }
      else
      {
        if (currentLocation == '/signup' || currentLocation == '/login' || currentLocation == '/apanel' || currentLocation == '/verifyemail' || currentLocation == '/about' || currentLocation == '/help' || currentLocation == '/terms-and-conditions' || currentLocation == '/privacy-policy' || currentLocation == '/contact' ) {
              
              st = true;

           } else {

              st = false;       
          }
      }      
       

      return (
          <header id="header-wrap" className="inner-header" {...props}>
              
              
        <div className="container">
          <nav className="navbar navbar-default hidden-xs hidden-sm">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="/">
                  {/*<i className="fa fa-bars hidden-xs" aria-hidden="true"></i>*/ } 
                  <img src="/images/logo.png" className="white-logo" alt="logo" />
                  <img src="/images/color-logo.jpg" className="black-logo" alt="logo" />
                </a>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

              { st ? this.renderLoginSignupNavigations() : this.renderNavigations() }             
             
            </div>
          </nav>
          <div id="search">
            <button type="button" className="close"></button>
            <form onSubmit={this.handleCommunitySearch} >
              <input type="search" name="searchstr" placeholder="Community Search here" required />
              <button type="submit" className="btn button--primary">Search <i className="fa fa-angle-right" aria-hidden="true"></i> </button>
            </form>
          </div>       
        
         {/* mobile */}

          <a className="navbar-brand visible-xs visible-sm" >
            <span className="side-bar opennavediv"  ><i className="fa fa-bars"></i></span>
            <a href="/">
            <img src="/images/logo.png" className="white-logo" alt="logo" />
            <img src="/images/color-logo.jpg" className="black-logo" alt="logo" />
            </a>
          </a>
          { st ?
            ''
            :

          <div className="mobileaccount visible-xs visible-sm">
            <li className="signup dropdown userpic">
              <a href="#iq-home" className="dropdown-toggle" data-toggle="dropdown"> {this.profilePic()}  <i aria-hidden="true" className="fa fa-angle-down downarrow"></i></a>
                <ul className="dropdown-menu user-account-menu simple pull-right">   
                  <li><a className="inline-option" href="/edit-profile">Edit Profile</a></li>                  
                  <li><a className="inline-option" href="/logout">Logout</a></li>
                </ul>
            </li>
            {/*<li className="inboxs"><a href="/message"><i className="icon inbox"></i> {this.displayMessageCounts(this.state.unreadmsgcount)} </a></li>*/}
          
    <li className="inboxs show-on-hover ">
    <a href="#iq-home" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ><i className="icon inbox"></i> {this.displayMessageCounts(this.state.unreadmsgcount)} </a>
     
     <ul className="dropdown-menu user-account-menu simple pull-right">                   
        
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
        ''
      }                              
     </ul>

   </li>  


          </div>
        }
            {this.renderMobileLoginSignupNavigations()}
            
            {/* end mobile */}

        </div>
    </header>
      );
  }
}


$(document).ready(function(){

 /*if(sessionStorage.getItem('asession_username') != 'admin')
  {
      var im = document.getElementById('imageprol');  
      
      im.onerror = function(){ 
      im.src = '/uploads/users/default.jpg';};
  }*/

});