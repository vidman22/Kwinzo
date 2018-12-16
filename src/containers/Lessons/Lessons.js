import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import LessonLink from '../../components/LessonLink/LessonLink';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import './Lessons.css';


const QUIZZES = gql`
  query {
    quizzes {
      
      title
      username
			authorID
      uniqid
      created_at
    }
  }
`;

const LESSON_COMP_QUERY = gql`
  query {
    readingCompLessons {
      created_at
      title
      username
      uniqid
    }
  }
`;

const LESSON_OMISSION_QUERY = gql`
  query {
    readingOmissionLessons {
      created_at
      title
      username
      uniqid
    }
  }
`;

class Lessons extends Component  {
  constructor(props){
  super(props);
  this.state = {
    activeQuery: 'quizzes',
    activeURL: 'quiz'
  }
}

lessonQuery() {
  this.setState({
    activeQuery: 'quizzes',
    activeURL: 'quiz'
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
    if (this.state.activeQuery === 'quizzes') {
      LESSON_QUERY = QUIZZES;
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
        
        {this.props.user ? <Link className="UserLessonsLink" to={`/`}>My Lessons</Link> : null}
      </div>
       <Query 
        query={LESSON_QUERY}
        fetchPolicy='network-only'>
  
        {({ loading, error, data}) => {
          if (loading) return <div className="spinner spinner-1"></div>;
          if (error) return `Error! ${error.message}`;

          return (
            <div className="LessonLinks">
            { this.state.activeQuery === 'quizzes' ? <h1>Quizzes</h1> : null}
            { this.state.activeQuery === 'readingOmissionLessons' ? <h1>Gap Reading</h1> : null}
            { this.state.activeQuery === 'readingCompLessons' ? <h1>Reading Comprehension</h1> : null}
              {data[this.state.activeQuery].map( (lesson, index) => (<Link key={index} to={`${this.state.activeURL}/${lesson.uniqid}`}>
                <LessonLink
                title={lesson.title}
                created={lesson.created} 
                author={lesson.username}
                
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