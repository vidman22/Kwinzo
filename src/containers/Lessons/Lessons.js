import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import LessonLink from '../../components/LessonLink/LessonLink';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import './Lessons.css';


const LESSON_SETS = gql`
  query LessonSets{
    lessonSets {
      id
      created
      title
      author
    }
  }
`;

const LESSON_COMP_QUERY = gql`
  query LessonCompQuery{
    readingCompLessons {
      id
      created
      title
      author
    }
  }
`;

const LESSON_OMISSION_QUERY = gql`
  query LessonCompQuery{
    readingOmissionLessons {
      id
      created
      title
      author
    }
  }
`;

class Lessons extends Component  {
  constructor(props){
  super(props);
  this.state = {
    activeQuery: 'lessonSets',
    activeURL: 'lessons'
  }
}

lessonQuery() {
  this.setState({
    activeQuery: 'lessonSets',
    activeURL: 'lessons'
  })
}

compLessonQuery() {
  this.setState({
    activeQuery: 'readingCompLessons',
    activeURL: 'reading-comp-lesson'
  });
}

omissionLessonQuery() {
  this.setState({
    activeQuery: 'readingOmissionLessons',
    activeURL: 'reading-omission-lesson'
  });
}

  render() {
    let LESSON_QUERY;
    if (this.state.activeQuery === 'lessonSets') {
      LESSON_QUERY = LESSON_SETS;
    } else if ( this.state.activeQuery === 'readingCompLessons') {
      LESSON_QUERY = LESSON_COMP_QUERY;
    } else {
      LESSON_QUERY = LESSON_OMISSION_QUERY;
    }

    return (
     <div className="Lessons">
      <div className="QueryButtonWrapper">
        <button onClick={() => this.lessonQuery()} className="ChangeQueryButton">Quizzes</button>
        <button onClick={() => this.compLessonQuery()} className="ChangeQueryButton">Reading Comprehension</button>
        <button onClick={() => this.omissionLessonQuery()} className="ChangeQueryButton">Gap Reading</button>
        
        {this.props.user ? <Link className="UserLessonsLink" to={`/user/${this.props.user.userID}`}>My Lessons</Link> : null}
      </div>
       <Query 
        query={LESSON_QUERY}
        fetchPolicy='network-only'>
  
        {({ loading, error, data}) => {
          if (loading) return <div className="spinner spinner-1"></div>;
          if (error) return `Error! ${error.message}`;

          return (
            <div className="LessonLinks">
            { this.state.activeQuery === 'lessonSets' ? <h1>Quizzes</h1> : null}
            { this.state.activeQuery === 'readingOmissionLessons' ? <h1>Gap Reading</h1> : null}
            { this.state.activeQuery === 'readingCompLessons' ? <h1>Reading Comprehension</h1> : null}
              {data[this.state.activeQuery].map( (lesson, index) => (<Link key={index} to={`${this.state.activeURL}/${lesson.id}`}>
                <LessonLink 
                id={lesson.id}  
                title={lesson.title}
                created={lesson.created} 
                author={lesson.author}
                terms={3}
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



export default Lessons;