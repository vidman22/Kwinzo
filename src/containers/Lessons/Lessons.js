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
      termNumber
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
      termNumber
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
      termNumber
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
    activeURL: 'reading-lesson'
  });
}

omissionLessonQuery() {
  this.setState({
    activeQuery: 'readingOmissionLessons',
    activeURL: 'reading-lesson'
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
      <div>
      <button onClick={() => this.compLessonQuery()} className="ChangeQueryButton">Comprehension Lesson Button</button>
      <button onClick={() => this.omissionLessonQuery()} className="ChangeQueryButton">Omission Lesson Button</button>
      <button onClick={() => this.lessonQuery()} className="ChangeQueryButton">Lesson Button</button>
       <Query query={LESSON_QUERY}>
  
        {({ loading, error, data}) => {
          if (loading) return <div className="spinner spinner-1"></div>;
          if (error) return `Error! ${error.message}`;
          console.log('data', data)
          return (
            <div className="LessonLinks">
              {data[this.state.activeQuery].map( (lesson, index) => (<Link key={index} to={`${this.state.activeURL}/${lesson.id}`}>
                <LessonLink 
                id={lesson.id}  
                title={lesson.title}
                created={lesson.created} 
                author={lesson.author}
                terms={lesson.termNumber}
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