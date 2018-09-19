// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router';

import App from './components/App';
import About from './components/About';

import Help from './components/Help';
import AddMyCommunity from './components/AddMyCommunity/AddMyCommunity.js';
import CommunityDisplay from './components/CommunityDisplay/CommunityDisplay.js';
import Contact from './components/Contact/Contact.js';
import EditCommunityDetails from './components/EditCommunityDetails/EditCommunityDetails.js';
import InviteNewMembers from './components/InviteNewMembers/InviteNewMembers.js';
import Library from './components/Library/Library.js';
import Login from './components/Login/Login.js';
import Logout from './components/Logout/Logout.js';
import Signup from './components/Signup/Signup.js';
import MembersCard from './components/MembersCard/MembersCard.js';
import Message from './components/Message/Message.js';
import PendingRequest from './components/PendingRequest/PendingRequest.js';
import NotFound from './components/NotFound';
import Verifyemail from './components/Verifyemail/Verifyemail.js';
import EditProfile from './components/EditProfile/EditProfile.js';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy.js';
import Termandconditions from './components/Termandconditions/Termandconditions.js';
import JoinedCommunity from './components/JoinedCommunity/JoinedCommunity.js';
import PendingCommunity from './components/PendingCommunity/PendingCommunity.js';
import AdminLogin from './components/AdminLogin/AdminLogin.js';
import AdminDashboard from './components/AdminDashboard/AdminDashboard.js';
import AllUsers from './components/AdminDashboard/AllUsers.js';
import AllCommunity from './components/AdminDashboard/AllCommunity.js';
import ContactRequest from './components/AdminDashboard/ContactRequest.js';
import AdminLogout from './components/AdminLogin/AdminLogout.js';
import JoinRefrenceCommunity from './components/JoinRefrenceCommunity/JoinRefrenceCommunity.js';
import Newpassword from './components/Newpassword/Newpassword.js';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" title="Home | iTribe" component={App} />
    <Route path="/about" title="About | iTribe" component={About} />
    <Route path="/help" title="Help | iTribe" component={Contact} />
    <Route path="/addcommunity" title="Add Community | iTribe" component={AddMyCommunity} />
    <Route path="/community-display" title="Community Display | iTribe" component={CommunityDisplay} />   
    <Route path="/search/:cstr" title="Search | iTribe" component={CommunityDisplay} />
    <Route path="/my-community" title="My Community Display | iTribe" component={CommunityDisplay} />   
    <Route path="/joined-communities" title="List Of Joined Community Display | iTribe" component={JoinedCommunity} />   
    <Route path="/pending-communities" title="List Of Unapproved Community Display | iTribe" component={PendingCommunity} />   
    <Route path="/contact" title="Contact | iTribe" component={Contact} />
    <Route path="/edit-community-details/:cid" title="Edit Community Details | iTribe" component={EditCommunityDetails} />
    <Route path="/library/:cid" title="Library | iTribe" component={Library} />
    <Route path="/library/:cid/:libid" title="Library | iTribe" component={Library} />
    <Route path="/login" title="Login | iTribe" component={Login} />   
    <Route path="/newpassword/:uid/:hashkey" title="Change Password | iTribe" component={Newpassword} />   
    <Route path="/logout" title="Logout | iTribe" component={Logout} />
    <Route path="/signup" title="Signup | iTribe" component={Signup} />
    <Route path="/verifyemail/:uid/:hashkey" title="Verifyemail | iTribe" component={Verifyemail} />
    <Route path="/members-card/:cid" title="Members Cards | iTribe" component={MembersCard} />
    <Route path="/message" title="Messages | iTribe" component={Message} />
    <Route path="/message/:fromid/:toid/:cid" title="Messages Process | iTribe" component={Message} />
    <Route path="/pending-request" title="Pending Requests | iTribe" component={PendingRequest} />
    <Route path="/invite-newmember" title="Invite New Members | iTribe" component={InviteNewMembers} />
    <Route path="/joincommunity/:inviteid/:cid" title="Invite Members Welcome | iTribe" component={JoinRefrenceCommunity} />
    <Route path="/edit-profile" title="EditProfile | iTribe" component={EditProfile} />
    <Route path="/privacy-policy" title="Privacy Policy | iTribe" component={PrivacyPolicy} />
    <Route path="/terms-and-conditions" title="Term And Conditions | iTribe" component={Termandconditions} />    
    <Route path="/apanel" title="Admin Login | iTribe" component={AdminLogin} />
    <Route path="/admin-dashboard" title="Admin Dashboard | iTribe" component={AdminDashboard} />
    <Route path="/dashboard/all-users" title="All Users Admin Dashboard | iTribe" component={AllUsers} />
    <Route path="/dashboard/all-community" title="All Community Admin Dashboard | iTribe" component={AllCommunity} />
    <Route path="/dashboard/all-contacts" title="All Contact Admin Dashboard | iTribe" component={ContactRequest} />
    <Route path="/dashboard/logout" title="Logout | iTribe" component={AdminLogout} />

    <Route path="*" title="Page Not Found | iTribe" component={NotFound} />


  </Router>
);

export default Routes;