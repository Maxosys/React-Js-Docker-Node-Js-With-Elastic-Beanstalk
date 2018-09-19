// src/components/Addmycommunity/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import Header from '../Header/Header.js';
import $ from 'jquery';

class AddMyCommunity extends Component { 

    constructor(props) {
    super(props);
    
    this.state = {
      value: "",
      name: "",
      email: "",
      password:"",
      cpassword:"",
      successmsg:"",
      errormsg:"",
      chkbox:true,
      community_name:"",
      showResults: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCommunitySubmit = this.handleCommunitySubmit.bind(this);
    this.handleChangeChk = this.handleChangeChk.bind(this);
  } 

    handleChangeChk(event) {

      //alert(2);
      console.log(event.target.checked);
      this.setState({chkbox: event.target.checked}); 
     
    }

    handleChange(event) {
    
    //event.target.value;

    this.setState({community_name: this.refs.community_name.value});    

  }

    handleCommunitySubmit(event) { 
       
          

          const data = new FormData(event.target);        

          var community_owner_id    = $("#community_owner_id").val();//data.get('community_owner_id');
          var community_name        = $("#community_name").val();//data.get('community_name');
          var community_size        = $("#community_size").val();//data.get('community_size');
          var community_religion    = $("#community_religion").val();//data.get('community_religion');
          var community_spoken      = $("#community_spoken").val();//data.get('community_spoken');
          var community_tagline     = $("#community_tagline").val();//data.get('community_tagline');
          var comminty_desc         = $("#comminty_desc").val();//data.get('comminty_desc');
          var community_visibility  = $("#community_visibility").is(":checked");//data.get('community_visibility');
          var community_status      = 0;
          var community_location    = $("#community_location").val();//data.get('community_location');
          var community_lat_long    = $("#community_lat_long").val();//data.get('community_lat_long');


          if(community_visibility)
          {
            var community_visibility  = 'on';
          }
          else
          {
            var community_visibility  = 'off'; 
          }         

          if(community_lat_long == "")
          {
            //this.setState({ successmsg: " Click on map and add community position on map ",showResults:true})
            
            alert("Please click on the map to place your community");

            return;
          }
          $("#loadingDiv").show();
           var userdata = {community_owner_id:community_owner_id,
            community_name:community_name,
            community_size:community_size,
            community_religion:community_religion,
            community_spoken:community_spoken,
            community_tagline:community_tagline,
            comminty_desc:comminty_desc,
            community_visibility:community_visibility,
            community_status:community_status,
            community_location:community_location,
            community_lat_long:community_lat_long
          };

            fetch('/api/addcommunity', {
          method: 'POST',
          body: JSON.stringify({
          task: userdata
           }),
          headers: {"Content-Type": "application/json"}
          }).then( (response) => {
                  return response.json()    
               })
               .then( (json) => {   this.setState({ successmsg: "Community successfully created.Wait for admin approval",showResults:true,community_name:"" })           
                   $("#loadingDiv").hide();
                    this.onSetResult(json);
                  console.log('parsed json', json);
                  //alert("Community successfully created..Wait for admin approval");
                  
               })
               .catch( (ex) => {
                  console.log('parsing failed', ex)
              });
    }

       onSetResult = (result) => {
        
        if(result.community_id)
        {
          this.setState({ successmsg: " Community successfully created. Wait for admin approval ",showResults:true})


        }
        else
        {
          this.setState({ successmsg: " Community Not Created ",showResults:true})
        }
  
    }


    componentDidMount() {
        
          document.title = this.props.route.title;

          if(!sessionStorage.getItem('session_tokenid'))
          {
            this.props.router.push('/login');
          }

          var elements = []; 
  
  elements.push({"latlong" : "", "community_name" : "Add New Community" , "community_id" : 0 , "community_tagline" : "Default Community Please Add Your Marker" , "name" : "iTribe" });
       
        window.initialize(elements);
    }

  componentWillMount() {

  
  }



  render() {
    const { className, ...props } = this.props;

    var currentLocation = this.props.location.pathname;

    return (
      <div >
         <Header pathn={currentLocation} displaymessage={this.state.successmsg} showResults={this.state.showResults} />
         
         <div className="communtiy-section login-section">
      <div className="container">
        <div className="title"><h3>Add My Community</h3>
        <p>Please click on the map to place your community, and fill out your details below</p>
        <div className="sep"><img alt="" src="images/sep.jpg" /></div></div>

        <div className="col-sm-7 pull-right">
          <div className="right-section">
            <div className="globe-bg">
             <div id="earth_div" className="globemapcss"></div>
            </div>
          </div>
        </div>
        
        <div className="col-sm-5 pull-left">
          <div className="left-section">
          <div className="inner-tilte"><h3>Community Details</h3><div className="sep"><img alt="" src="images/sep.jpg" /></div></div>
            <form onSubmit={this.handleCommunitySubmit}>
              <div className="edit-details">
                  <div className="input-group">
                    <input id="community_name" type="text" required className="form-control" name="community_name" ref="community_name" onChange={this.handleChange} value={this.state.community_name}  placeholder="Community Name" />
                    
                    <input type="hidden" name="community_owner_id" id="community_owner_id" value={sessionStorage.getItem('session_tokenid')}/>
                    <input type="hidden" name="community_lat_long" id="community_lat_long" />
                    <input type="hidden" name="community_location" id="community_location" />
                    
                  </div>
                  

                  <div className="input-group" >
                    <select id="community_size" name="community_size" className="js-example-basic-hide-search" required>
                      <option value="">Community Size</option>
                      <option value="1">1-10</option>
                      <option value="2">10-100</option>
                      <option value="3">100-1000</option>
                      <option value="4">1000-10000</option>
                      <option value="5">10000+</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <input id="community_religion" required type="text" className="form-control" name="community_religion" placeholder="Community Religion" />
                  </div>

                  <div className="input-group">
                    <input id="community_spoken" required type="text" className="form-control" name="community_spoken" placeholder="Languages Spoken" />
                  </div>

                  <div className="input-group">
                    <input id="community_tagline" required type="text" className="form-control" name="community_tagline" placeholder="Short community description" />
                  </div>

                  <div className="input-group">
                    <textarea id="comminty_desc" className="form-control" name="comminty_desc" placeholder="Other details we should know"></textarea>
                  </div>

                  <label className="switch">
                    <input id="community_visibility" name="community_visibility" defaultChecked={this.state.chkbox} onChange={this.handleChangeChk}  type="checkbox"  />
                    <span className="slider round" ></span>
                    
                  </label> <span className="vis">Make community visible to all?</span>
                  <button className="btn button--primary" type="submit">Submit <i aria-hidden="true" className="fa fa-angle-right"></i> </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
      </div>
    );
  }
}



export default AddMyCommunity;