import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import Adminheader from '../Header/Adminheader.js';
import './style.css';
import { Link } from 'react-router';

class AdminDashboard extends Component {

  componentDidMount() {
      
      document.title = this.props.route.title;
      document.getElementById("footerid").style.display='none';

  }

  render() {
    const { className, ...props } = this.props;
    return (
    <div id="wrapper" {...props}>  
        <Adminheader />
          <div id="page-wrapper">
    <div className="container-fluid">
      <div id="main" >
        <div className="col-sm-12 col-md-12" id="content">
          <div className="title"><h3>Dashboard</h3><div className="sep"><img src="images/sep.jpg" /></div></div>
          <div className="table-responsive">
            <table className="table table-hover">
                <tbody>
                <tr tabindex="1">
                  <td><Link to="/dashboard/all-users"> User Managment </Link>      </td>
                  <td><Link to="/dashboard/all-community"> Community Managment </Link> </td>
                  <td></td>
                </tr>                
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



export default AdminDashboard;