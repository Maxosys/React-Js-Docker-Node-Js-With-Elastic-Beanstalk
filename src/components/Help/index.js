"use strict";
// src/components/Help/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import Header from '../Header/Header.js';
import { Link } from 'react-router';
import './style.css';

export default class Help extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

 state = {
   rows :[],
    response: ''
  };  


  componentDidMount() {

    console.log("Call Service");

   /* this.callApi()
      .then(res => this.setState({ rows: res }))
      .catch(err => console.log(err));*/
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };
  

  render() {
    const { className, ...props } = this.props;

   

    return (
      <div className={classnames('Help', className)} >
      <Header />
          <div className="communtiy-section">
      <div className="container">
        <div className="title"><h3>Get Help</h3><div className="sep"><img src="/images/sep.jpg" /> </div></div>
        <div className="breadcrums-search">
          <nav className="breadcrumbs">
            <ul>
              <li><a href="" id="ga">Home</a></li>
              <li>Help</li>
            </ul>
          </nav>
          <div className="searchfaq">
            <div id="imaginary_container"> 
              <div className="input-group stylish-input-group input-append">
               {/* <input type="text" className="form-control"  placeholder="Search FAQs" />
                <span className="input-group-addon">
                  <button type="submit">
                    <span className="fa fa-search"></span>
                  </button>  
                </span>*/}
              </div>
            </div>

            <div className="contact-btn">
              <a href="/contact">Contact US</a>
            </div>

          </div>
        </div>

        <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
          <div className="panel panel-default">
            <div className="panel-heading" role="tab" id="headingOne">
              <h4 className="panel-title"><a className="" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Lorem ipsum dolor sit amet</a></h4>
            </div>
            <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
              <div className="panel-body">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </div>
          </div>

          <div className="panel panel-default">
            <div className="panel-heading" role="tab" id="headingTwo">
             <h4 className="panel-title"><a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">Lorem ipsum dolor sit amet</a></h4>
            </div>
            <div id="collapseTwo" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
              <div className="panel-body">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </div>
          </div>

          <div className="panel panel-default">
            <div className="panel-heading" role="tab" id="headingThree">
              <h4 className="panel-title"><a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">Lorem ipsum dolor sit amet </a>
             </h4>
            </div>
            <div id="collapseThree" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
              <div className="panel-body">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </div>
          </div>

          <div className="panel panel-default">
            <div className="panel-heading" role="tab" id="headingfour">
             <h4 className="panel-title"><a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapsefour" aria-expanded="false" aria-controls="collapsefour">Lorem ipsum dolor sit amet</a></h4>
            </div>
            <div id="collapsefour" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingfour">
              <div className="panel-body">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </div>
          </div>

          <div className="panel panel-default">
            <div className="panel-heading" role="tab" id="headingfive">
              <h4 className="panel-title"><a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapsefive" aria-expanded="false" aria-controls="collapsefive">Lorem ipsum dolor sit amet </a>
             </h4>
            </div>
            <div id="collapsefive" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingfive">
              <div className="panel-body">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </div>
          </div>

        </div>
      </div>
    </div>

      </div>
    );
  }
}