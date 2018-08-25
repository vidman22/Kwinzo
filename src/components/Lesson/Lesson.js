import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Lesson.css';
import Sentence from '../Sentence/Sentence';
import { Query, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import * as actionTypes from '../../store/actionTypes';

const LESSON_SET = gql`
  query LessonSet($id: String!){
    lessonSet(id: $id ) {
      id
      title
      author
      authorID
      sentences{
        alts
        answer
        hint
        sentence
      }
    }
  }
`;


class Lesson extends Component {
  constructor(props) {
    super(props)
    this.state = {
      working: true,
      values: {},
      checkedInputs: {},
      activeValue: false
    }
  }

 componentDidMount() {
        window.scrollTo(0, 0);
}

  inputChangedHandler(e, index) {
    const values = {...this.state.values};
    let value = ''

    if (values[`value${index}`] || values[`value${index}`] === "" ) {
      
      values[`value${index}`] = e.target.value;

      this.setState({
        values
      })

    } else {

        const key = `value${index}`;
        value = e.target.value;
        let obj = {[key]: value};
        const newObj = Object.assign(obj, values);
        this.setState({
          activeValue: true,
          values: newObj
    })
   }
  }

  handleCheck(index, answer, alts) {
    const values = {...this.state.values};
    const checkedInputs = {...this.state.checkedInputs};
    const key = `checked${index}`;
    if ( values[`value${index}`] === answer ) {
     
      
      const obj = {[key]: 'correct'}
      const newObj = Object.assign(checkedInputs, obj);
      this.setState({
        checkedInputs: newObj
      });
    } if (values[`value${index}`] !== answer) {
      
      const obj = {[key]: 'incorrect'}
      const newObj = Object.assign(checkedInputs, obj);
      this.setState({
        checkedInputs: newObj
      });
   }
  } 

  handleCheckOnEnter(index, answer, alts, e) {
    e.preventDefault();

    const values = {...this.state.values};
    const checkedInputs = {...this.state.checkedInputs};
    const key = `checked${index}`;
    if ( values[`value${index}`] === answer ) {
      const obj = {[key]: 'correct'};
      const newObj = Object.assign(checkedInputs, obj);
      this.setState({
        checkedInputs: newObj
      });
    } else if (alts.length !== 0) {
        for (let i = 0; i < alts.length; i++) {
          if ( values[`value${index}`] === alts[i]) {
            const obj = {[key]: 'correct'};
            const newObj = Object.assign(checkedInputs, obj);
            this.setState({
              checkedInputs: newObj
            });
          }
        }
      } else {
      
        const obj = {[key]: 'incorrect'}
        const newObj = Object.assign(checkedInputs, obj);
        this.setState({
          checkedInputs: newObj
        });
    }
  }



  render() {

    return (
       <Query 
      query={LESSON_SET}
      variables={{id: this.props.match.params.id}}>
      {({ loading, error, data}) => {
        if (loading)  return <div className="spinner spinner-1"></div>;
        if (error) return `Error!: ${error}`;
        let userCanDelete = false;
        if (this.props.user){
          userCanDelete = this.props.user.userID === data.lessonSet.authorID;
        }
        
        return (
           <div className="LessonSentencesWrapper">
            { userCanDelete ? <svg className="DeleteSentence" onClick={() => this._deleteLesson()} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="#ccc" 
                viewBox="0 0 510 510" 
                x="0px" 
                y="0px" 
                width="20px" 
                height="20px">
              <path d="M336.559 68.611L231.016 174.165l105.543 105.549c15.699 15.705 15.699 
                41.145 0 56.85-7.844 7.844-18.128 11.769-28.407 11.769-10.296 0-20.581-3.919-28.419-11.769L174.167 
                231.003 68.609 336.563c-7.843 7.844-18.128 11.769-28.416 11.769-10.285 0-20.563-3.919-28.413-11.769-15.699-15.698-15.699-41.139
                 0-56.85l105.54-105.549L11.774 68.611c-15.699-15.699-15.699-41.145 0-56.844 15.696-15.687 41.127-15.687 56.829 0l105.563 105.554L279.721 
                 11.767c15.705-15.687 41.139-15.687 56.832 0 15.705 15.699 15.705 41.145.006 56.844z"/>
            </svg> : null}
                  <div className="LessonTitle">
                    <h1>{data.lessonSet.title}</h1>
                  </div>
          <div className="LessonTab">
            
           <div className="LessonOptions">
            
                <div className="HomeFlex">
                  
                  <Link to={`/solo-play/${this.props.match.params.id}`} onClick={() => this.props.sendLesson(data.lessonSet)} style={{color: 'black', textDecoration: 'none' }}>
                    <div className="Solo">
                     <h2>Solo Play</h2>
                    </div>
                  </Link>
                 
                   <Link to={`/host-game/${this.props.match.params.id}`} onClick={() => this.props.sendLesson(data.lessonSet)} style={{color: 'black', textDecoration: 'none' }}>
                     <div className="PhoneBox">
                     <h2>Host Game</h2>
                    </div>
      
                 </Link>
                 <Link to={`/solo-play/${this.props.match.params.id}`}>
                  <div className="WordBankGame">
                    <h2>Word Bank</h2>
                      <p>Coming Soon</p>
                  </div>
                 </Link>
                 <Link to={`/solo-play/${this.props.match.params.id}`}>
                  <div className="Assign">
                    <h2>Assign Set</h2>
                      <p>Coming Soon</p>
                  </div>
                 </Link>
                </div>

                
                  {data.lessonSet.sentences.map((sentence, index) => (
                    <div className="LessonSentence" key={index}>
                      <p>{index + 1}</p>
                      <Sentence 
                        handlechange={(event) => this.inputChangedHandler(event, index)}
                        handlesubmit={(e) => this.handleCheckOnEnter(index, sentence.answer, sentence.alts, e)}
                        value={ this.state.values[`value${index}`] ? this.state.values[`value${index}`] : '' }
                        sentence={sentence.sentence} 
                        correct={sentence.answer}
                        message={ this.state.checkedInputs[`checked${index}`] ? this.state.checkedInputs[`checked${index}`] : ''}
                        exercise='true' 
                        placeholder={sentence.hint} />
                        <button className="ExerciseButton" onClick={()=>this.handleCheck(index, sentence.answer, sentence.alts)}>Check</button>
                    </div>))}

                </div>
           </div>
          </div>

        );
     }}
     </Query>

      )
  }

  _deleteLesson = async () => {
    await this.props.deleteLesson({
      variables: {
        id: this.props.match.params.id
      }
    });
  };
};

const DELETE_LESSON = gql`
  mutation DeleteLesson($id: String!){
    deleteLesson(id: $id)
  }
`

const mapDispatchToProps = dispatch => {
  return {
    sendLesson: (lesson) => dispatch({type: actionTypes.LESSON_SET, lesson:lesson })
  }
}

const mapStateToProps = state => {
  return {
    lesson: state.lessonSet,
    user: state.user
  }
}

const Container = graphql(DELETE_LESSON, { name: 'deleteLesson' })( Lesson);
export default connect( mapStateToProps, mapDispatchToProps )( Container );
