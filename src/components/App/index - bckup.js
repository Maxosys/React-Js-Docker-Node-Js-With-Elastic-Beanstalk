import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import HomeHeader from '../Header/HomeHeader.js';
import logo from './logo.svg';
import { Link } from 'react-router';
import './style.css';


class App extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  constructor(props){

    super(props);

    this.state = {         
      communitydata: [],
      userdata: [],
      successmsg:"",
      errormsg:"",
      showResults: false
    }
 }
  
  getInitialState() {
    
  }
  
  componentWillMount() {

      var elements = [];  

      var obj = {};

      this.callApiGetAllCommunity()
      //.then(res => res.json())
      .then((communitydata) => {this.setState({ communitydata: communitydata })

          //console.log(this.state.communitydata);
          const array = communitydata.map(function(x,i){      
            
          
          elements.push({"latlong" : x.community_lat_long, "community_name" : x.community_name , "community_id" : x.community_id , "community_tagline" : x.community_tagline })
         
        
        })
           window.initialize(elements);

    }).catch( (ex) => {
                  console.log('parsing failed', ex)
              });

    //console.log(elements);


  var items = [
  { lat: 20.5937, long: 78.9629, markermsg: '<b>Hello world!</b><br/>I am a popup.<br />' },
  { lat: 37.0902, long: 95.7129, markermsg: '<b>Red</b><br>I am a popup.<br />' },
  { lat: 35.7443087, long:  123.3792706, markermsg: '<b>South Korea</b><br> Community <br />' }, 
  { lat: 40.2218619, long:  122.9430685, markermsg: '<b>North Korea</b><br> Community <br />' }, 
  { lat: 34.4459277, long:  86.0146558, markermsg: '<b>China </b><br> Community <br />' }, 
  { lat: 36.241384, long:  -113.7547193, markermsg: '<b>United States </b><br><b> The U.S. is a country of 50 states covering a vast swath of North America </b> <br />' }
  ];
   

  }

   callApiGetAllCommunity = async () => {
     
    const response = await fetch('/api/allcommunities',{
      method: 'GET',   
      headers: {"pragma": "no-cache","cache-control" : "no-cache"}
    });

     const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
  }

  //componentWillMount() {
      
    //window.initialize();
    //return true;

  //}

  render() {
    const { className, ...props } = this.props;
    return (
    <div >    
    <HomeHeader />
    <section id="iq-home" className="banner iq-bg iq-bg-fixed iq-box-shadow iq-over-black-90">
      <div id="carousel-example-generic" className="carousel slide" data-ride="carousel">
        <div className="container">
          <div className="item active">
            <div className="banner-text">
              <div className="" id="step3">
                <h3>Connecting the whole family of Israel</h3>
                <p>Mapping communities of the Lost Tribes, conversos <br /> and Noahides, worldwide </p>
                <div className="col-sm-12 col-lg-12 col-md-12">
                    <div className="map" data-animation="animated fadeInRight">
                      <div className="globe">
                        <figure className="surface globemapcss" id="earth_div"  ></figure>
                      </div>                 
                    </div>
                </div> 
              </div>
            </div> 
           </div>
        </div>
      </div>
    </section>
   
    <section className="about" >
      <div className="container">
        <div className="title" id="aboutusstep"><h3>About Us</h3><div className="sep"><img alt="" src="/images/sep.jpg" /></div></div>
        <p>
        iTribe is a social network designed to map and connect the greater Israelite diaspora. <br/> Hundreds of millions of people across the globe identify as descendants of the ancient people of Israel. <br/> We connect them with the Jewish people. Welcome home! </p>

         <a className="btn button--primary" href="/about"> Read more <i aria-hidden="true" className="fa fa-angle-right"></i> </a>
      </div>
    </section>

    <section className="howitworks">
      <div className="container">
        <div className="title"><h3>How it works</h3><div className="sep"><img alt="" src="/images/sep.jpg" /></div></div>
          <div id="timeline">
            <div className="timeline-item" >
              <div className="timeline-icon">
              </div>
              <div className="timeline-content right" id="step5">
                <div className="cont">
                  <div className="number"  >01</div>
                  <h2>Create Account</h2>
                  <p>Join the family</p>
                </div>
                <div className="step"><img alt="" src="/images/step1.jpg" /></div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-icon"></div>
              <div className="timeline-content left"  id="step6">
                <div className="cont">
                  <div className="number"  >02</div>
                  <h2>Create Community </h2>
                  <p> Bring your community onboard </p>
                </div>
                <div className="step"><img alt="" src="/images/step2.jpg" /></div>
              </div>
            </div>
            <div className="timeline-item" >
              <div className="timeline-icon">
              </div>
              <div className="timeline-content right" id="step7">
                <div className="cont">
                  <div className="number"  >03</div>
                  <h2>Send Invitations to Others</h2>
                  <p> Bring on your family and friends </p>
                </div>
                <div className="step"><img alt="" src="/images/step3.jpg" /></div>
              </div>
            </div>
            <div className="timeline-item"  >
              <div className="timeline-icon">
              </div>
              <div className="timeline-content left" id="step8">
                <div className="cont">
                  <div className="number"  >04</div>
                  <h2>Join Community </h2>
                  <p> Your community is already mapped? Join them here </p>
                </div>
                <div className="step"><img alt="" src="/images/step4.jpg" /></div>
              </div>
            </div>
            <div className="timeline-item" >
              <div className="timeline-icon">
              </div>
              <div className="timeline-content right" id="step9" >
                <div className="cont">
                  <div className="number"  >05</div>
                  <h2>Connect With Members</h2>
                  <p> Meet other members of the global family </p>
                </div>
                <div className="step"><img alt="" src="/images/step5.jpg" /></div>
              </div>
            </div>
          </div>
      </div>
    </section>
    <div className="video">
      <div className="container">
        <div className="video-section">
          <iframe src="https://www.youtube.com/embed/YnHcvwOXQIo?rel=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe> 
        </div>
      </div>
    </div>
    </div>

    );
  }
}

export default App;