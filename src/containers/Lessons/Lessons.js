import React from 'react';
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

const Lessons = (props) => (
  <div>

     <Query query={LESSON_SETS}>

      {({ loading, error, data}) => {
        if (loading) return <div className="spinner spinner-1"></div>;
        if (error) return `Error! ${error.message}`;
        return (
          <div className="LessonLinks">
            {data.lessonSets.map( (lesson, index) => (<Link key={index} to={`${props.match.url}/${lesson.id}`}>
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
);


export default Lessons;