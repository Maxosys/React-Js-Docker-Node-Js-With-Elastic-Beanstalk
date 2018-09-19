// src/components/Addmycommunity/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import './EditProfile.css';
import ImageUploader from 'react-images-upload';
import Header from '../Header/Header.js';
import $ from 'jquery';
class EditProfile extends Component {  


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
      showResults: false,
      about_you: "",
    };      
      
      this.handleProfileUpdate = this.handleProfileUpdate.bind(this);
      this.handleChange        = this.handleChange.bind(this);
      this._changeEvent        = this._changeEvent.bind(this);
      this.handleImgError      = this.handleImgError.bind(this);
  }
  
  
  handleImgError(event){

  //console.log(event.target.src);

  return event.target.src = '/uploads/users/default.jpg';

  }
    handleChange(event) {
    
    let statecoloumn = event.target.name;
     
    this.setState({userdata: {"user_name":this.refs.user_name.value,"user_location":this.refs.user_location.value,"about_you":this.refs.about_you.value} });

  }

    handleProfileUpdate(event) {

          const data = new FormData(event.target); 

         
          var user_name       = $("#user_name").val();      //data.get('user_name');
          var user_location   = $("#user_location").val();  //data.get('user_location');   
          var about_you       = $("#about_you").val(); //data.get('about_you');   
         // var userpic         = data.get('userpic');
          var user_id         = $("#user_id").val(); //data.get('user_id');

        //  data.append('file', this.uploadInput.files[0]);
         
           
          var userdata = {
            user_id:user_id,
            user_name:user_name,
            user_location:user_location,
            about_you:about_you
           /* userpic:userpic*/
          
          };

  /*  const dataa = new FormData();
    dataa.append('file', this.uploadInput.files[0]);*/

     let imageFormData = new FormData();

   // imageFormData.append('imageFile', this.uploadInput.files[0]);
 
  //console.log(userdata);
 
            fetch('/api/updateprofile', {
          method: 'POST',
          body: JSON.stringify({task:userdata}),
          headers: {"Content-Type": "application/json"}
          }).then( (response) => {
                  return response.json()    
               })
               .then( (json) => {   this.setState({ successmsg: "Profile successfully Updated.",showResults:true })           
                  
                    //this.onSetResult(json)
                  //console.log('parsed json', json)
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
    }

    componentWillMount() {

          this.callApi(sessionStorage.getItem('session_tokenid'))           
          .then((userdata) => {

            this.setState({ userdata: userdata }) 

//            console.log(userdata);

        });
    }

    callApi = async (uid) => {
     
     const response = await fetch('/api/getUserByIdOne?uid='+uid,{ method: 'GET', headers: {"pragma": "no-cache","cache-control" : "no-cache"} });
   
     const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
    }


// for image preview

    _changeEvent(e) {

      $("#loadingDiv").show();

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
        }).then((res) => {

          //alert("Successfully uploaded");
        $("#loadingDiv").hide();
        document.location.reload();
          //console.log('res of fetch', res)
        }
          );
    }

// end 

 profilePic() {

    var user_pic = sessionStorage.getItem('session_tokenid')+"_userpic.jpg"; 

    return(
                        
        <img ref="preview" alt="User Pic"  className="img-circle img-responsive" onError={this.handleImgError} width="30" src={"/uploads/users/"+user_pic} />
    )
  }

  render() {
    const { className, ...props } = this.props;

    const existsst = true;
 
    var user_pic = sessionStorage.getItem('session_tokenid')+"_userpic.jpg";  

    const userimage = existsst ? 
    
    user_pic =  user_pic
    : 
    user_pic =  'default.jpg';


    return (
	
      <div>
	     
		 <Header displaymessage={this.state.successmsg} showResults={this.state.showResults} />
	  
                  <div className="login-section bg-ribbins">
                  <div className="container">
                  <div className="tab-wrap">
                  <h2 className="head-title">Edit Profile</h2>

      <form id="upload_form" ref="myForm"  encType="multipart/form-data" onSubmit={this.handleProfileUpdate}>

         <div className="profile-image1">             
              {/*<img ref="preview" src={"/uploads/users/"+user_pic} alt="User Pic"  className="img-circle img-responsive" /> */}
              {this.profilePic()}  
          </div>
          <div className="user-info">

<input ref={(ref) => { this.uploadInput = ref; }} type="file"  onChange={this._changeEvent} id="userprofilepic" className="userprofilepic"  />            

<div className="uploadprofile"> 

<button  className="btn button--primary userpicuploadbtn" id="userpicuploadbtn" type="button">
<i className="fa fa-upload" aria-hidden="true"></i>  
Upload 
</button>

</div>

            </div>

                  <div className="input-group">                  
                   
                    
                    {/*<div ref="preview" styleName="display:none;"></div> */}
        
                  </div>

                  <div className="input-group">
                  <span className="input-group-addon"><i className="fa fa-user"></i></span>
            
      <input type="hidden" value={sessionStorage.getItem('session_tokenid')} name="user_id" id="user_id"  />
      <input id="user_name" type="text" ref="user_name"  value={this.state.userdata.name} onChange={this.handleChange} className="form-control" name="user_name" placeholder="Name" />
      </div>           
      
                  <div className="input-group">
                  <span className="input-group-addon"><i className="fa fa-location-arrow"></i></span>
                  <input id="user_location" ref="user_location" value={this.state.userdata.location} onChange={this.handleChange} type="text" className="form-control" name="user_location" placeholder="Location" />
                  


                  </div>
 <div className="input-group">
                  <span className="input-group-addon">Bio</span>
                  <input id="about_you" ref="about_you" value={this.state.userdata.about_you} onChange={this.handleChange} type="text" className="form-control" name="about_you" placeholder="About You" />
                  
                  </div>

                  <button className="btn button--primary" type="submit">Submit <i aria-hidden="true" className="fa fa-angle-right"></i> </button>
                  </form>        
                  </div>
                  </div>
                </div>
      </div>
    );
  }
}



export default EditProfile;