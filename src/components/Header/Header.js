import React, { PropTypes, Component } from 'react';
import HomeHeader from './HomeHeader.js';
import InnerHeader from './InnerHeader.js';
import { Link } from 'react-router';
import $ from 'jquery';
export default class Header extends React.Component {
  
    constructor(props){

    super(props);

    this.state = {
      showResults: false
    };
  }


 
  render() {
  	 
  	   const { className, ...props } = this.props;

       var currentLocation   = this.props.pathn;  
       var displaymessage    = this.props.displaymessage;  
	     var showResults       = this.props.showResults;	
       
       //this.setState({showResults:true});

           if(showResults)
           {             
             //this.state.showResults = true;

              //this.setState({showResults:true});
           }

        	var  st  = true;

      		if (currentLocation == '/signup' ) {
            	
              	st = true;
      		  
            } else {

      			   st = false; 

      		  }
		

      return (
      	<div>
      	  

          { showResults ? 

            <div id="errormsgdiv" className="alert alert-success errormsgdiv hideafter5sec" >
                <a href="" className="close" data-dismiss="alert" aria-label="close">&times;</a>              
                
                <div className="info_message"> {displaymessage} </div>
            </div> 
            : 

            ''
          }         

      		<InnerHeader pathn={currentLocation} pushobj="2" />

      		{/* st ?  <InnerHeader/> : <HomeHeader/> */}

     	</div>
      );
  }
}


$(document).ready(function(){
    setTimeout(function() {  $("#errormsgdiv").toggle("slow"); }, 5000);
});