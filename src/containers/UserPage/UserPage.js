import React, { Component } from 'react';

import LessonLink from '../../components/LessonLink/LessonLink';
import { Link, withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import './UserPage.css';

const USER_LESSONS = gql`
  query UserLessons( $authorID: String! ){
    userLessons( authorID: $authorID ) {
      id
      title
      author
      authorID
    }
  }
`;

const USER_COMP_QUERY = gql`
	query UserCompLessons( $authorID: String! ){
		userCompLessons( authorID: $authorID ) {
			id
			title
			author
			authorID
		}
	}
`;

const USER_OMISSION_QUERY = gql`
	query UserOmissionLessons( $authorID: String! ){
		userOmissionLessons( authorID: $authorID ) {
			id
			title
			author
			authorID
		}
	}
`;

class CreateGame extends Component {
	constructor(props){
		super(props)
		this.state = {
			activeQuery: 'userLessons',
			activeURL: 'lessons',
		}
	}

	lessonQuery() {
		this.setState({
			activeQuery: 'userLessons',
			activeURL: 'lessons'
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
		let authorID = this.props.match.params.user || this.props.user.userID;
		console.log(authorID);
		let USER_LESSONS_QUERY;
    if (this.state.activeQuery === 'userLessons') {
      USER_LESSONS_QUERY = USER_LESSONS;
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
									{ this.state.activeQuery === 'userLessons' ? <h1>My Quizzes</h1> : null}
            			{ this.state.activeQuery === 'userOmissionLessons' ? <h1>Gap Reading</h1> : null}
            			{ this.state.activeQuery === 'userCompLessons' ? <h1>Reading Comprehension</h1> : null}
            			{data[this.state.activeQuery].map( (lesson, index) => (<Link key={index} to={`${this.state.activeURL}/${lesson.id}`}>
              			<LessonLink 
              			id={lesson.id}  
                    delete={() => this.delete()}
              			title={lesson.title} 
              			author={lesson.author}
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

export default withRouter(CreateGame);