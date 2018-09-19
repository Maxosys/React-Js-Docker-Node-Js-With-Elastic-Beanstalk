import React, { Component } from 'react';
import Header from '../Header/Header.js';
import $ from 'jquery';

class Contact extends Component {  

    constructor(props) {

    super(props);    

    this.state = {
      value: "",     
      elements: [],
      communitydata: [],
      userdata: [],
      memberdata: [],
      librarydata: [],
      librarysingledata: [],
      successmsg:"",
      errormsg:"",
      showResults: false,
      community_name:"",
      community_id:"",
      community_tagline:"",
      uploadedfileextension:"",
      uploadedfile:""
    };
   
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
       

          const data = new FormData(event.target);        

          var name       = $("#name_con_id").val(); //data.get('name');
          var email      = $("#email_con_id").val(); //data.get('email');
          var subject    = $("#subject_con_id").val(); //data.get('subject');
          var message    = $("#message_con_id").val(); //data.get('message');
         
           var userdata = {name:name,
            email:email,
            subject:subject,
            message:message            
          };

            fetch('/api/addtocontact', {
          method: 'POST',
          body: JSON.stringify({
          task: userdata
           }),
          headers: {"Content-Type": "application/json"}
          }).then( (response) => {
                  return response.json()    
               })
               .then( (json) => {   this.setState({ successmsg: "Request Successfully Created..",showResults:true })           
                  
                    this.onSetResult(json)
                  console.log('parsed json', json)
               })
               .catch( (ex) => {
                  console.log('parsing failed', ex)
              });

      }

       onSetResult = (result) => {
        
        if(result.contact_id)
        {
          this.setState({ successmsg: " Successfully created. ",showResults:true})
        }
        else
        {
          this.setState({ successmsg: "  Not Created ",showResults:true})
        }
  
    }



  render() {
    const { className, ...props } = this.props;
    var currentLocation = this.props.location.pathname;
    return (
      <div >
       <Header displaymessage={this.state.successmsg} showResults={this.state.showResults} pathn={currentLocation} />
       <div className="login-section bg-ribbins">
       <div className="container">
        <div className="tab-wrap">
          <h2 className="head-title">Contact us</h2>

          <form onSubmit={this.handleSubmit}>
            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-user"></i></span>
              <input id="name_con_id" type="text" required className="form-control" name="name"  placeholder="Name" />
            </div>

            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-envelope"></i></span>
              <input id="email_con_id" type="text" required className="form-control" name="email"  placeholder="Email" />
            </div>   

            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-pencil"></i></span>
              <input id="subject_con_id" type="text" required className="form-control" name="subject" placeholder="Subject" />
            </div>

            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-comment"></i></span>
              <textarea id="message_con_id" placeholder="Message" name="message" required className="form-control"></textarea>
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



export default Contact;