import React, { Component } from 'react';

import LessonLink from '../../components/LessonLink/LessonLink';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import './UserPage.css';

const USER_QUIZZES = gql`
  query ( $authorID: Int! ){
    userQuizzes( authorID: $authorID ) {
      title
      username
			authorID
			uniqid
			created_at
    }
  }
`;

const USER_COMP_QUERY = gql`
	query ( $authorID: Int! ){
		userCompLessons( authorID: $authorID ) {
			title
			username
			authorID
			uniqid
			created_at
		}
	}
`;

const USER_OMISSION_QUERY = gql`
	query ( $authorID: Int! ){
		userOmissionLessons( authorID: $authorID ) {
			title
			authorID
			username
			uniqid
			created_at
		}
	}
`;

class UserPage extends Component {
	constructor(props){
		super(props)
		this.state = {
			activeQuery: 'userQuizzes',
			activeURL: 'quiz',
		}
	}

	lessonQuery() {
		this.setState({
			activeQuery: 'userQuizzes',
			activeURL: 'quiz'
		})
	}
	
	compLessonQuery() {
		this.setState({
			activeQuery: 'userCompLessons',
			activeURL: 'reading-comp-lesson'
		});
	}
	
	omissionLessonQuery() {
		this.setState({
			activeQuery: 'userOmissionLessons',
			activeURL: 'reading-omission-lesson'
		});
	}

	render() {
	
		let authorID = this.props.user.id;
		console.log('authorID', authorID);

		let USER_LESSONS_QUERY;
    if (this.state.activeQuery === 'userQuizzes') {
      USER_LESSONS_QUERY = USER_QUIZZES;
    } else if ( this.state.activeQuery === 'userCompLessons') {
      USER_LESSONS_QUERY = USER_COMP_QUERY;
    } else {
      USER_LESSONS_QUERY = USER_OMISSION_QUERY;
    }
		return (
				<div className="UserPageWrapper">
          <div className="SideBar">
					<Link className="UserLessonsLink" to={'/lessons'}>All Lessons</Link>
            <div className="SideBarHeader">
              My Lessons
            </div>
						<div>
							<button onClick={() => this.lessonQuery()} className="ChangeQueryButton">Quizzes</button>
        			<button onClick={() => this.compLessonQuery()} className="ChangeQueryButton">Reading Comprehension</button>
        			<button onClick={() => this.omissionLessonQuery()} className="ChangeQueryButton">Gap Reading</button>
        			
							
						</div>
            <div className="SideBarHeader">
              My Classes
            </div>
          </div>
     			<Query 
     			  query={USER_LESSONS_QUERY}
     			  variables={{ authorID }}
						fetchPolicy='network-only'>

      			{({ loading, error, data }) => {

        			if (loading) return <div className="spinner spinner-1"></div>;
        			if (error) return `Error! ${error.message}`;

        			return (
          			<div className="LessonLinks">
									{ this.state.activeQuery === 'userQuizzes' ? <h1>My Quizzes</h1> : null}
            			{ this.state.activeQuery === 'userOmissionLessons' ? <h1>Gap Reading</h1> : null}
            			{ this.state.activeQuery === 'userCompLessons' ? <h1>Reading Comprehension</h1> : null}
            			{data[this.state.activeQuery].map( (lesson, index) => (<Link key={index} to={`${this.state.activeURL}/${lesson.uniqid}`}>
              			<LessonLink 
              			title={lesson.title} 
              			author={this.props.user.username}
              			/>
              			</Link>))}
            
            
          			</div>
          			);
      			 }}
      		</Query>      

        </div>
			)
	}

};

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default withRouter(connect(mapStateToProps)(UserPage));