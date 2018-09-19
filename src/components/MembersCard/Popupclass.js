import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import Header from '../Header/Header.js';
import { Link } from 'react-router';
class Popupclass extends Component {  

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

   
  render() {
    const { className, ...props } = this.props;
    return (
     
	   
     

              <div className="modal fade" id={'basicModal'+this.props.memberid} tabindex="-1" role="dialog" aria-labelledby={'basicModal'+this.props.memberid} aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
      </div>
      <div className="modal-body">
        <div className="contain">
          <div>
            <div className="meberimage">
              <div className="card-img"><i className="fa fa-user-circle" aria-hidden="true"></i></div>
              <div className="memberinfo">
                <span className="members-name">{this.props.membername}</span>
                <span className="location"><i className="fa fa-location-arrow"></i> {this.props.memberlocation} </span>
              </div>
              <div className="memberfurtherdetails">
                <ul>
                  <li><span>Email :</span> {this.props.memberemail} </li>                 
                  <li><span>Bio:</span>{this.props.memberabout_you}</li>
                </ul>
              </div>
            </div>

            <div className="reset__form">
              <div className="contactbtn">
                <a href={"/message/"+sessionStorage.getItem('session_tokenid')+"/"+this.props.memberid+"/"+this.props.community_id} className="btn button--primary">contact <i className="fa fa-angle-right" aria-hidden="true"></i> </a>
              </div>

              {/*<div className="remove">
                <a href="javascript:;">Block</a>
                <a href="javascript:;">Remove</a>
              </div>*/}

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
     
    );
  }
}



export default Popupclass;