import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import Header from '../Header/Header.js';
import $ from 'jquery';
class EditCommunityDetails extends Component {  


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
      community_visibility:true
     
    };  

    this.handleChange = this.handleChange.bind(this);

    this.handleCommunityUpdate = this.handleCommunityUpdate.bind(this);

  }


  handleCommunityUpdate(event) {

          const data = new FormData(event.target);        

          var community_id          = $("#community_id").val();       //data.get('community_id');
          var community_owner_id    = $("#community_owner_id").val(); //data.get('community_owner_id');
          var community_name        = $("#community_name").val();     //data.get('community_name');
          var community_size        = $("#community_size").val();     //data.get('community_size');
          var community_religion    = $("#community_religion").val(); //data.get('community_religion');
          var community_spoken      = $("#community_religion").val(); //data.get('community_spoken');
          var community_tagline     = $("#community_tagline").val();  //data.get('community_tagline');
          var comminty_desc         = $("#comminty_desc").val();      //data.get('comminty_desc');

          if(this.refs.community_visibility.checked)
          {
            var community_visibility  = 'on';
          }
          else
          {
           var community_visibility  = 'off'; 
          }          
          

          var community_status      = 1;
          var community_location    = ""; //data.get('community_location');
          var community_lat_long    = ""; //data.get('community_lat_long');       

         
           
           var userdata = {
            community_id:community_id,
            community_owner_id:community_owner_id,
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

            fetch('/api/updatecommunity', {
          method: 'POST',
          body: JSON.stringify({
          task: userdata
           }),
          headers: {"Content-Type": "application/json"}
          }).then( (response) => {
                  return response.json()    
               })
               .then( (json) => {   this.setState({ successmsg: "Community successfully Updated.",showResults:true })           
                  
                    //this.onSetResult(json)
                  console.log('parsed json', json)
               })
               .catch( (ex) => {
                  console.log('parsing failed', ex)
              });
    }


   handleChange(event) {
    
    let statecoloumn = event.target.name;
          

     this.setState({

      community_name:this.refs.community_name.value,
      community_size:this.refs.community_size.value,
      community_religion:this.refs.community_religion.value,
      community_spoken:this.refs.community_spoken.value,
      community_tagline:this.refs.community_tagline.value,
      comminty_desc:this.refs.comminty_desc.value,
      community_visibility:this.refs.community_visibility.checked
      
      });
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

               
              this.callApiGetAllCommunity(this.props.params.cid)              
                    .then((communitydata) => {this.setState({ communitydata: communitydata })          
   

        if(communitydata[0]['community_visibility'] == 'on')    
          {
            var community_visibility_st  = true;
            this.refs.community_visibility.checked = true;
          }
          else
          {
           var community_visibility_st  = false; 
           this.refs.community_visibility.checked = false;
          }
                                this.setState({
                                    community_id:communitydata[0]['community_id'],
                                    community_name:communitydata[0]['community_name'],
                                    community_size:communitydata[0]['community_size'],
                                    community_religion:communitydata[0]['community_religion'],
                                    community_spoken:communitydata[0]['community_spoken'],
                                    community_tagline:communitydata[0]['community_tagline'],
                                    comminty_desc:communitydata[0]['comminty_desc'],
                                    community_visibility:community_visibility_st
                                })
                       

              }); // close then 
                    

         } // componentWillMount

       callApiGetAllCommunity = async (cid) => {
     
    const response = await fetch('/api/communitybyid?cid='+cid,{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
    });

     const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
  }

   renderCommunitySizeDrop(selectedval) {
      
      let optionsval = [];
      
      let selectedst = false;
      
      

      console.log(selectedval);

        for(var i=1; i<=5 ;i++)
          {
             let opt;
             var selectedText = '';

             if(i==1)
             {
                
                if(i==selectedval) { selectedText = 'selected' }

              opt = <option selected={selectedText} key={i} value={i}   > 1-10 </option>;
             }
             else if(i==2)
             {
              if(i==selectedval) { selectedText = 'selected' }

              opt = <option selected={selectedText}  key={i} value={i}   > 10-100 </option>;

             }
             else if(i==3)
             {              

              if(i==selectedval) { selectedText = 'selected'; }
              opt = <option selected={selectedText} key={i} value={i} selectedText > 100-1000 </option>;
             }
             else if(i==4)
             {
              if(i==selectedval) { selectedText = 'selected' }
              opt = <option selected={selectedText} key={i} value={i}> 1000-10000 </option>;
             }
             else
             {
              if(i==selectedval) { selectedText = 'selected' }
               opt = <option selected={selectedText} key={i} value={i}>10000+ </option>;
             }                      
                      

           /* if(i==selectedval) {          

             opt = <option key={i} selected value={i}>{i}</option>;

            }
            else
            {
              opt = <option key={i} value="{i}">{i}</option>;
            }*/

            optionsval.push(opt);
          }

        return (
              <div className="input-group">
                <select id="community_size" name="community_size" ref="community_size" onChange={this.handleChange} className="js-example-basic-hide-search">
               <option value="">Community Size</option>
                    {optionsval}
                </select>
              </div> 
          );
    }


  render() {
    const { className, ...props } = this.props;


    return (
      <div className={classnames('About', className)} {...props}>
        <Header displaymessage={this.state.successmsg} showResults={this.state.showResults} />
    <div className="login-section bg-ribbins">
      <div className="container">
        <div className="tab-wrap">
          <h2 className="head-title">Edit Community Details</h2>
          <form onSubmit={this.handleCommunityUpdate} >

            <div className="edit-details">
              <div className="input-group">
              
          <input id="community_name"  type="text" required className="form-control" name="community_name" placeholder="Community Name" value={this.state.community_name} ref="community_name" onChange={this.handleChange}  />
          <input type="hidden" name="community_owner_id" id="community_owner_id" value={sessionStorage.getItem('session_tokenid')}/>
          <input type="hidden" name="community_id" id="community_id" value={this.state.community_id}/>
              
              </div>

              {this.renderCommunitySizeDrop(this.state.community_size)}
              

              <div className="input-group">
                <input id="community_religion" required value={this.state.community_religion} ref="community_religion" onChange={this.handleChange} type="text" className="form-control" name="community_religion" placeholder="Community Religion"/>
              </div>

              <div className="input-group">
                <input id="community_spoken" type="text" required value={this.state.community_spoken} ref="community_spoken" onChange={this.handleChange} className="form-control" name="community_spoken" placeholder="Languages Spoken"/>
              </div>

              <div className="input-group">
                <input id="community_tagline" required type="text" value={this.state.community_tagline}  ref="community_tagline" onChange={this.handleChange} className="form-control" name="community_tagline" placeholder="Community Tagline (what you want others to see)" />
              </div>

              <div className="input-group">
                <textarea id="comminty_desc" className="form-control" name="comminty_desc" ref="comminty_desc" onChange={this.handleChange} placeholder="Community details...anything you  want others to know about your community">{this.state.comminty_desc}</textarea>
              </div>

              <label className="switch">
                <input id="community_visibility" name="community_visibility" defaultChecked={this.state.community_visibility} ref="community_visibility" onChange={this.handleChange}  className="" type="checkbox" />
                <span className="slider round" ></span>
               
              </label>
               <span class="vis">Community visibility</span>
              <button className="btn button--primary" type="submit">Save <i aria-hidden="true" className="fa fa-angle-right"></i> </button>
            </div>
          
          </form>        
        </div>
      </div>
    </div>
      </div>
    );
  }
}



export default EditCommunityDetails;