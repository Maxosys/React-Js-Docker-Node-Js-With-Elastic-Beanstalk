import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
export default class Adminheader extends React.Component {
  
    constructor(props){

    super(props);
  }


 
  render() {
  	 
  	   const { className, ...props } = this.props;

       var currentLocation = this.props.pathn;  
       var displaymessage = this.props.displaymessage;  
	     var showResults = this.props.showResults;	

      	var  st  = true;

  		if (currentLocation == '/signup' ) {
        		st = true;
  		  } else {
  			   st = false; 
  		  }
		

      return (
      	
          <nav className="navbar navbar-inverse navbar-fixed-top dashboard" >
    <div className="navbar-header">
      <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
        <span className="sr-only">Toggle navigation</span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
      </button>
      <a className="navbar-brand" href=""><img src="/images/color-logo.jpg" alt="LOGO" /></a>
    </div>
    <ul className="nav navbar-right top-nav">
      <li><a href="/dashboard/logout"><i className="fa fa-fw fa-power-off"></i> Logout</a></li>         
    </ul>
    <div className="collapse navbar-collapse navbar-ex1-collapse">
      <ul className="nav navbar-nav side-navsss">
        <li>
          <a href="#" data-toggle="collapse" data-target="#submenu-1">User Managment <i className="fa fa-fw fa-angle-down pull-right"></i></a>
          <ul id="submenu-1" className="collapse">
            <li><a href="/dashboard/all-users"> All Users </a></li>
          </ul>
        </li>
        <li>
          <a href="javascript:;" data-toggle="collapse" data-target="#submenu-2">Community Managment <i className="fa fa-fw fa-angle-down pull-right"></i></a>
          <ul id="submenu-2" className="collapse">
            <li><a href="/dashboard/all-community">All Community</a></li>            
          </ul>
        </li>
        <li><a href="/dashboard/all-contacts">Contact Records</a> </li>
        
        {/*<li><a href="">MENU 3</a></li>
        <li><a href="">MENU 4</a></li>
        <li><a href="">MENU 5</a></li>*/}

      </ul>
    </div>
  </nav>
      );
  }
}

