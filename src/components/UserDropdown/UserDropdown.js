import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import "./UserDropdown.css";

class UserDropdown extends Component {
	
render() {
  let icon;
  if (this.props.picture !== 'false'){
    icon = (
       <img
        className="UserPicture"
        src={this.props.picture}
        width="35px"
        height="35px"
        alt="Logged In" /> 
      );
  } else icon = (
          <svg
            className="UserPicture" 
            id="last"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 300 300" 
            x="0" 
            y="0" 
            height="35" 
            width="35"
            >
              <path d="M149.996 0C67.157 0 .001 67.158.001 149.997c0 82.837 67.156 150 
              149.995 150s150-67.163 150-150C299.996 67.156 232.835 0 149.996 0zm.457 
              220.763v-.002H85.465c0-46.856 41.152-46.845 50.284-59.097l1.045-5.587c-12.83-6.502-21.887-22.178-21.887-40.512 
              0-24.154 15.712-43.738 35.089-43.738s35.089 19.584 35.089 43.738c0 18.178-8.896 33.756-21.555 40.361l1.19 
              6.349c10.019 11.658 49.802 12.418 49.802 58.488h-64.069z"/></svg> 
    );
 
	return (
		<div>
			<div className="UserDropDown">
   				{icon}
   			<div className="LoggedUserName">{this.props.user.name}</div>
			  <div className="DropDownContent">
			  		<div onClick={this.props.logout}>Log-Out</div>
			  		<Link className="DropDownLink" to={`/user/${this.props.user.userID}`}><div>My Lessons</div></Link>
			  		<div>Settings</div>
			  </div>
      </div>
		</div>
	);
  };
};
export default withRouter(UserDropdown);