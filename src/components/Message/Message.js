// src/components/Addmycommunity/index.js
import React, { Component } from 'react';
import Header from '../Header/Header.js';
import './style.css';
import $ from 'jquery';

class Message extends Component {


    constructor(props) {
      
      super(props);    

    this.state = {
      value: "",     
      elements: [],
      communitydata: [],
      userdata: [],
      userdatato: [],
      memberdata: [],
      userfrnddata: [],
      conversation: [],
      successmsg:"",
      errormsg:"",
      showResults: false,
      toid:"",
      fromid:"",
      toname:"",
      fromname:"",
    };


    this.handleChange = this.handleChange.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);

    this._changeEvent = this._changeEvent.bind(this);
    this.handleImgError = this.handleImgError.bind(this);
    this.searchFrnd = this.searchFrnd.bind(this);

  }

  handleChange(event) {

    this.setState({value: event.target.value});    

  }
  searchFrnd(event) {
    
     // Search text
    var text = event.target.value;
 
  // Hide all content class element
  $('.frndlistname').hide();

  // Search and show
  $('.frndlistname:contains("'+text+'")').show();


  }

handleImgError(event){

//console.log(event.target.src);

return event.target.src = '/uploads/users/default.jpg';

}

// Library

   _changeEvent(e) {

    e.preventDefault();
         
    let reader = new FileReader();
         
    let file = e.target.files[0];  
         
    this.uploadForm(e.target.files[0]);

    var _this = this;
         
    reader.onloadend = function() { 

      _this.refs.preview.innerHTML= '<img width="250px" src="'+reader.result+'" />';
    }
         
    reader.readAsDataURL(file);
  }


   uploadForm(file){
        let form = new FormData(this.refs.myForm);
        form.append('myImage', file);
        fetch('/api/upload-profile-image', {
          method: 'POST',
          body: form
        }).then(res => console.log('res of fetch', res));
    }

// end

profilePicUserByid(uid) {

    var user_pic = uid+"_userpic.jpg"; 

    return(
                        
        <img id={"imageprolfrnd"+uid} uid = {uid} onError={this.handleImgError} className="imageprol" src={"/uploads/users/"+user_pic} alt="userimage"  width="30"  />
    )
  }

  profilePicLeftUserByid(uid) {

    var user_pic = uid+"_userpic.jpg"; 

    return(
                        
        <img alt="" id="imageprolleft" src={"/uploads/users/"+user_pic} width="30"  />
    )
  }


  handleMessageSubmit(event) {
       

          const data = new FormData(event.target);   

          var sender_id    = $("#sender_id").val();    // data.get('sender_id');
          var reciver_id   = $("#reciver_id").val();   // data.get('reciver_id');
          var community_id = $("#community_id").val(); // data.get('community_id');
          var msg_text     = $("#msg_text").val();     // data.get('msg_text');

          if(msg_text === "")
          {
            this.setState({ successmsg: " Enter Message  ",showResults:true})
            
            alert("Please enter message");

            return;
          }

           var userdata = {sender_id:sender_id,
            reciver_id:reciver_id,
            community_id:community_id,
            msg_text:msg_text            
          };

            fetch('/api/addmessage', {
          method: 'POST',
          body: JSON.stringify({
          task: userdata
           }),
          headers: {"Content-Type": "application/json"}
          }).then( (response) => {
                  return response.json()    
               })
               .then( (json) => {

        this.setState({ successmsg: "Message successfully Sent",showResults:true,value:"" })
                  
        this.getConversation(sender_id,reciver_id).then((conversation) => {this.setState({ conversation: conversation })});
                
               })
               .catch( (ex) => {
                  console.log('parsing failed', ex)
              });   
 }

 componentDidMount() {

  document.title = this.props.route.title;

          if(!sessionStorage.getItem('session_tokenid'))
          {
            this.props.router.push('/login');
          }

        var fromid = sessionStorage.getItem('session_tokenid');

        this.setState({ fromid: fromid });

//1
         this.callApiGetFriendList(fromid)           
          .then((userfrnddata) => { this.setState({ userfrnddata: userfrnddata }) 
            
            //console.log("Friends ",userfrnddata);
        });


     /*   if(this.props.params.fromid)
        {
           fromid = this.props.params.fromid;
        }*/

//2
        this.callApiFromUser(fromid)           
          .then((userdata) => {this.setState({ userdata: userdata }) 
            
        });

        var toid   = "";

        if(this.props.params.toid)
        {
          toid   = this.props.params.toid; 
                
//3
       this.callApiToUser(toid)           
          .then((userdatato) => {this.setState({ userdatato: userdatato }) 
            
        });

//4        
	  this.getConversation(fromid,toid).then((conversation) => {this.setState({ conversation: conversation }) 
            
        });


     

        } // if to user end 

        this.setState({ toid: toid });
    }

    callApiFromUser = async (uid) => {
     
    const response = await fetch('/api/getUserByIdOne?uid='+uid,{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
    });

     const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
  }

  callApiToUser = async (toid) => {
     
    const response = await fetch('/api/getUserByIdOne?uid='+toid,{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
    });

     const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
  }

    getConversation = async (fromid,toid) => {
     
    const response = await fetch('/api/getConversationSR?sender_id='+fromid+'&reciver_id='+toid,{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
    });

     const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
  }

   callApiGetFriendList = async (fromid) => {
     
    const response = await fetch('/api/callApiGetFriendList?sender_id='+fromid,{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
    });

     const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
  }


// frineds list


friendslist() {

return (
<div className="user-list desktopview">

  {

 this.state.userfrnddata[0] ? 
   this.state.userfrnddata.map((data,key) =>

      <a key={key} className="frndlistname" id={key+"frndlist"} frndname={data.name}  href={"/message/"+sessionStorage.getItem('session_tokenid')+"/"+data.id+"/0"}> <div key={key} className="user-w" >
                <div className="avatar with-status status-green">

                  {this.profilePicUserByid(data.id)}              
                  
                </div>
                <div className="user-info">
                  
                  <div className="user-name">{data.name}</div>
                  <div className="last-message">{data.location}</div>
                </div>
              </div>

      </a>
  )

:

  <div className="mesFrndListEmpty"> <p> Hi,Your friend list is empty. To add users to your friend list, go to a <a href="/my-community"> community </a> and contact its members, or <a href="/community-display"> join a community </a> </p> </div>

}
                        
            </div>
  );



}

// frineds list for mobile

friendslistmobile() {

return ( 
         <div className="user-list">
			  { 

			    this.state.userfrnddata[0] ? 

			    this.state.userfrnddata.map((data,key) =>       
			                  
			                  <a key={key} className="frndlistname" id={key+"frndlist"} frndname={data.name}  href={"/message/"+sessionStorage.getItem('session_tokenid')+"/"+data.id+"/0"}>
			                  <div className="user-w mobileuser"  key={key}>
			                    <div className="avatar with-status status-green">
			                      {this.profilePicUserByid(data.id)} 
			                    </div>
			                    <div className="user-info">			                      
                              <div className="user-name">{data.name}</div>
                              <div className="last-message">{data.location}</div>
			                    </div>
			                  </div>

			                  </a>               
			  )
			  :
			  
			  <div className="mesFrndListEmpty"> <p> Hi,Your friend list is empty. To add users to your friend list, go to a <a href="/my-community"> community </a> and contact its members, or <a href="/community-display"> join a community </a> </p> </div>

			  }                        
      </div>
             
  );

}

formatAMPM(timestamp) {
    
    var d = new Date(timestamp),
    minutes = d.getMinutes().toString().length === 1 ? '0'+d.getMinutes() : d.getMinutes(),   
    hours = d.getHours(),
    ampm = d.getHours() >= 12 ? 'pm' : 'am',
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    

   
    return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+hours+':'+minutes+ampm;
   
      
   //return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+ampm;
   
}

messagetime(timestamp) {
	
  var today = new Date(timestamp);
  var day = today.getDay();
  var daylist = ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday","Saturday"];
  console.log("Today is : " + daylist[day] + ".");
  var hour = today.getHours();
  var minute = today.getMinutes();
  var second = today.getSeconds();
  var prepand = (hour >= 12)? " PM ":" AM ";
  hour = (hour >= 12)? hour - 12: hour;
  if (hour===0 && prepand===' PM ') 
  { 
  if (minute===0 && second===0)
  { 
  hour=12;
  prepand=' Noon';
  } 
  else
  { 
  hour=12;
  prepand=' PM';
  } 
  } 
  if (hour===0 && prepand===' AM ') 
  { 
  if (minute===0 && second===0)
  { 
  hour=12;
  prepand=' Midnight';
  } 
  else
  { 
  hour=12;
  prepand=' AM';
  } 
  } 
  console.log("Current Time : "+hour + prepand + " : " + minute + " : " + second);
}


getConversationRowTo()
{

  return (
    
     <div>
     { this.state.conversation.map((data,key) =>             


          this.state.fromid ==  data.sender_id ?
          
            <div className="chat-message self" key={key} >
                    <div className="chat-message-content-w">
                      <div className="chat-message-content">{data.msg_text}</div>
                    </div>
                    <div className="chat-message-date"> {this.formatAMPM(data.created_at)} </div>
                    <div className="chat-message-avatar">
                     {this.profilePicUserByid(this.state.fromid)}                      
                    </div>
                  </div> 

          :

              <div className="chat-message" key={key} >
                              <div className="chat-message-content-w">
                                <div className="chat-message-content">{data.msg_text}</div>
                              </div>
                              <div className="chat-message-avatar">
                               {this.profilePicUserByid(data.sender_id)} 
                              </div>
                              <div className="chat-message-date">{this.formatAMPM(data.created_at)}</div>
              </div>            

      )}
      
      </div>    
    );  

}



// send message form rturn

  sendmessage() {

    return (

       <form onSubmit={this.handleMessageSubmit}>
          <div className="message-input"> 
              <div className="wrap">
              
              <input type="hidden" id="sender_id" name="sender_id" value={this.props.params.fromid} />
              <input type="hidden" id="reciver_id" name="reciver_id" value={this.props.params.toid} />
              <input type="hidden" id="community_id" name="community_id" value={this.props.params.cid} />
            
              <input type="text" id="msg_text" autoComplete="off" onChange={this.handleChange} value={this.state.value} name="msg_text" className="messagetext" placeholder="Write your message..." />

              <div className="chat-btn"><button type="submit" className="button--primary">Send</button></div>
              </div>
            </div>
       </form>

      );
  }


  render() {

     
      var tostatus = true;

      if(this.state.toid == "") { tostatus = false; }

    return (
        <div >	  
		    
        <Header  />
	   
        <div className="serachbox chat">
        <div id="frame">
          <div id="sidepanel">
            <div className="user-intro">
              
              <div className="avatar">              
              
                 {this.profilePicLeftUserByid(this.state.userdata.id)}             
              </div>
              
              <div className="user-intro-info">
                  <h5 className="user-name">{this.state.userdata.name}</h5>
                  <div className="user-sub">{this.state.userdata.location}</div>
                </div>
              </div>
             
              <div className="chat-search">
                <div className="element-search">
                  <input type="text" placeholder="Search users by name..." onChange={this.searchFrnd} />
                </div>
              </div>
           
               {this.friendslist()}

               {/* mobile view frnd list */}
             
              <div className="sidelisting">
               
               {this.friendslistmobile()}

              </div>

  			       {/* end of mobileview */}

          </div>
            
            {
                tostatus ? 

            <div className="content desktopview">           
               <div className="contact-profile">
                 {this.profilePicUserByid(this.state.userdatato.id)} 
                  <p> {this.state.userdatato.name}</p>
               </div>            
               <div className="messages">
               <div className="chat-content-w ps ps--theme_default" data-ps-id="a557f4c5-2722-94a6-2327-cffba33d6a6c">
                <div className="chat-content">                  

                {this.getConversationRowTo()}

                  {/*

                  <div className="chat-message">
                  <div className="chat-message-content-w">
                  <div className="chat-message-content">Hi, my name is Mike, I will be happy to assist you</div>
                  </div>
                  <div className="chat-message-avatar">
                  <img src="/images/userpic.jpg" alt=""/>
                  </div>
                  <div className="chat-message-date">9:12am</div>
                  </div>

                  */}
                  
                {/* <div className="chat-date-separator"><span>Yesterday</span></div> */}


                {/* 

                    <div className="chat-message self">
                    <div className="chat-message-content-w">
                      <div className="chat-message-content">
                        That walls over which the drawers. Gone studies to titles have audiences of and concepts was motivator
                      </div>
                    </div>
                    <div className="chat-message-date">1:23pm</div>
                      <div className="chat-message-avatar">
                        <img src="/images/1.jpg" alt=""/>
                      </div>
                    </div>

                */}           

                  
                </div>
              </div>
            </div>

            {this.sendmessage()}

          </div>
            :
                <div className="content desktopview">
                <div className="contact-profile">
                <p> User not selected </p>
                </div>
                  
                  <div className="messages">
                  <div className="chat-content-w ps ps--theme_default" data-ps-id="a557f4c5-2722-94a6-2327-cffba33d6a6c">
                  <div className="chat-content">
                  <div className="chat-message">
                  <div className="chat-message-content-w">
                  <div className="chat-message-content">Hi, select user and start conversation </div>
                  </div>
                  </div>
                  </div>
                  </div>  
                  </div>
                  </div>
            }
      
	  {/* mobile view */}

          {
            tostatus ?
           

          <div id="myDiv" className="visible-xs" style={{ display: 'block' }}>
              <div className="content slide-in">
                <div className="contact-profile">
                  <a className="conversation-toggle slide-out slideoutscreen"  ><i className="fa fa-arrow-left"></i></a> 
                  {this.profilePicUserByid(this.state.userdatato.id)} 
                  <p>{this.state.userdatato.name}</p>
                </div>
                <div className="messages">
                  <div className="chat-content-w ps ps--theme_default" data-ps-id="a557f4c5-2722-94a6-2327-cffba33d6a6c">
                    <div className="chat-content">

                    {this.getConversationRowTo()}                      

                    </div>
                  </div>
                </div>
              </div>
             {this.sendmessage()}
          </div>
		      :

           ''
        }

		  {/* mobile view */}
		  
        </div>
    </div>
      </div>
    );
  }
}



export default Message;


