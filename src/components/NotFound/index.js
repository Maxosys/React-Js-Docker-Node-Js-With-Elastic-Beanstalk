import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import Header from '../Header/Header.js';
import './style.css';

export default class NotFound extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    const { className, ...props } = this.props;    
    var currentLocation   = this.props.location.pathname;
     //const { location }   = this.router;
    //console.log(location);

    //var currentRoutes = this.context.router.getCurrentRoutes();
//alert(currentRoutes);
    return (
      <div className={classnames('NotFound', className)} >
        <Header pathn={currentLocation} />

        <div className="login-section">
          <div className="container">
            <div className="containss"> 
              <div className="col-sm-6">
                <img src="/images/error.png" className="errorimag"/>
              </div>

              <div className="col-sm-6">
                <div className="error-content">
                   <h1>404</h1>
                  <h3>Sorry, we can't seem to find the page you are looking for</h3>
                  <a className="btn button--primary" href="/"> itribe home <i aria-hidden="true" className="fa fa-angle-right"></i> </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    );
  }
}