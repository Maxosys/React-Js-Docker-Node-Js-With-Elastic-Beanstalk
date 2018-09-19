import React, { Component } from 'react';
import Adminheader from '../Header/Adminheader.js';
import './style.css';


class ContactRequest extends Component {
  
  constructor(props) {
    super(props);    

    this.state = {
      value: "",     
      elements: [],
      contactdata: [],
      userdata: [],
      successmsg:"",
      statusupdatemsg:"",
      errormsg:"",
      showResults: false,
      showedit: false,
      currentLocation:""
    };

  }


  componentWillMount() {
      
      document.title = this.props.route.title;
      document.getElementById("footerid").style.display='none';
    

      this.callApiGetAllCommunity()
      //.then(res => res.json())
      .then((contactdata) => {this.setState({ contactdata: contactdata })

      console.log(this.state.contactdata);   
          
      });
  }

  callApiGetAllCommunity = async () => {

      const response = await fetch('/api/allcontactsadmin',{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
      });

      const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
  }

  render() {
  
    return (
    <div id="wrapper" >  
        <Adminheader />
          <div id="page-wrapper">
    <div className="container-fluid">
      <div id="main" >
        <div className="col-sm-12 col-md-12" id="content">
          <div className="title"><h3>Community Management</h3><div className="sep"><img src="/images/sep.jpg" alt="" /></div></div>          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>                  
                  <th>Message</th>                                    
                  <th>Date</th>
                  
                </tr>
              </thead>
              <tbody>

              {this.state.contactdata.map(member =>

                <tr tabindex="1">
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.subject}</td>
                  <td>{member.message}</td>
                  <td>{member.created_at}</td>                 
                </tr>
              )}

                
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
      </div>

    );
  }
}

export default ContactRequest;