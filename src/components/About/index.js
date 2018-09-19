import React, { Component } from 'react';
import Header from '../Header/Header.js';
import './style.css';

class About extends Component {
  render() {
     var currentLocation = this.props.location.pathname;
    return (
      <div >
        <Header pathn={currentLocation} />
        <div className="communtiy-section privacyterms" style={{ minHeight: '77vh' }}>
          <div className="container">
            <div className="title">
              <h3>About Us</h3>
              <div className="sep"><img src="/images/sep.jpg" alt="border" /></div>
            </div>
            <p>Inspired by Biblical prophecy, we first created iTribe in 2010 as a project to map and connect with the greater Israelite diaspora. So far, we've connected communities descended from converted Jews and the Lost Tribes of Israel living all over the world, from Nigeria to Afghanistan and Pakistan to India. We're happy to have you with us and hope you'll enjoy your time on our new site. </p>
          </div>
        </div>

      </div>
    );
  }
}



export default About;