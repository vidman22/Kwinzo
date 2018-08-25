import React, { Component } from 'react';
import Moment from 'react-moment';
import './LessonLink.css';

class LessonLink extends Component {
  render() {
    const dateToFormat = this.props.created;
    return (
      <div className="LessonLinkTab">
        <div className="CreatedDate">
          <Moment format="MMM Do" date={dateToFormat} />
        </div>
        <div className="LessonLinkTitle">
          <h1>{this.props.title}</h1>
        </div>
        <div className="LessonLinkAuthor">
          {this.props.author}
        </div>
        
      </div>
    )
  }


}

export default LessonLink;