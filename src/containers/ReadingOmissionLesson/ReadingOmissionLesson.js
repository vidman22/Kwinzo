import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ReadingOmissionLesson.css';
import Omission from '../../components/Omission/Omission';
import StyledWord from '../../components/StyledWord/StyledWord';
import { Query, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import * as actionTypes from '../../store/actionTypes';

const LESSON_SET = gql`
  query LessonSet($id: String!){
    readingOmissionLesson(id: $id ) {
      id
      created
      title
      author
      authorID
      text
      omissions {
        omission
        hint
      }
    }
  }
`;



class Lesson extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeValue: null,
      checkDisabled: true,
      checkedAnswers: {},
      questions: [],
      omittedWordsArray: [],
      readingSpeeds: [75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 400, 450, 500],
      readingSpeedValue: 75,
      readingSpeedRunning: false,
      readingTimerMinuteValue: '',
      readingTimerSecondValue: '',
      readingStyles: [{type: 'underline', checked: false}, {type: 'color', checked: true }, {type:'highlight', checked: false}],
      speedReadingIndex: 0,
      textArrays: [],
      values: {},
    }
    // eslint-disable-next-line
    var timerVar;
    this.onOptionCheck = this.onOptionCheck.bind(this)
    
  }

 componentDidMount() {
        window.scrollTo(0, 0);
}



  inputChangedHandler(index, e) {
    const values = {...this.state.values};
    let value = '';

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

  // handleCheck(index, answer, alts) {
  //   const values = {...this.state.values};
  //   const checkedInputs = {...this.state.checkedInputs};
  //   const key = `checked${index}`;
  //   let value = values[`value${index}`];
  //   value = value.toLowerCase().trim();
  //   answer = answer.toLowerCase().trim();
    
  //   if ( value === answer ) {
  //     const obj = {[key]: 'correct'};
  //     const newObj = Object.assign(checkedInputs, obj);
  //     this.setState({
  //       checkedInputs: newObj
  //     });
  //   } else if (alts.length !== 0 && alts !== undefined) {
  //       for (let i = 0; i < alts.length; i++) {
  //         if ( value === alts[i]) {
  //           const obj = {[key]: 'correct'};
  //           const newObj = Object.assign(checkedInputs, obj);
  //           this.setState({
  //             checkedInputs: newObj
  //           });
  //         } else {
  //           const obj = {[key]: 'incorrect'}
  //           const newObj = Object.assign(checkedInputs, obj);
  //           this.setState({
  //             checkedInputs: newObj
  //           });
  //         }
  //       }
  //     } else {
      
  //       const obj = {[key]: 'incorrect'}
  //       const newObj = Object.assign(checkedInputs, obj);
  //       this.setState({
  //         checkedInputs: newObj
  //       });
  //   }
  // } 

  // handleCheckOnEnter(index, answer, alts, e) {
  //   e.preventDefault();


  // }

  completed(data){
    let indices = [];
    const text = data.readingOmissionLesson.text;

    const omissions = [...data.readingOmissionLesson.omissions];
    
    for (let i = 0; i< omissions.length; i ++){
      let idx = {
        index: text.indexOf(omissions[i].omission),
        omission: omissions[i].omission
      }
      while (idx.index !== -1) {
        indices.push(idx);
        idx = {
          index: text.indexOf(omissions[i].omission, idx.index + 1),
          omission: omissions[i].omission
        }
      }

    }
    
    indices.sort((a,b)=> a.index - b.index);
    console.log('indices', indices);
    console.log('omissions', omissions);

    let arrayOfTextArrays = [];
    let firstIndex = 0;

    for (let i = 0; i < indices.length; i++){
      const array = text.slice(firstIndex, indices[i].index);
      firstIndex = (indices[i].index + indices[i].omission.length);
      arrayOfTextArrays.push(array);
    }

    arrayOfTextArrays = arrayOfTextArrays.map( array => {
     array = array.split(' ').map(word => {
        let obj = {
          word: word,
          style: false
        }
        return obj;
      });
      return array;
    });

    console.log('array of arrays', arrayOfTextArrays);
    
    this.setState({
      textArrays: arrayOfTextArrays,
      omittedWordsArray: indices
    });

  }

  handleSpeedChange(event) {
    this.setState({
      readingSpeedValue: event.target.value
    });
  }

  startReading(){
    const textArray = [...this.state.textArray];
    let i = this.state.speedReadingIndex;

      this.timerVar = setInterval(() => {
        if ( i < textArray.length) {
          textArray[i].style = true;
          if (i > 0) {
            textArray[i-1].style = false;
          }
          this.setState({
            textArray,
            speedReadingIndex: i++
          });
        }else return;
        ;
      }, 60000/this.state.readingSpeedValue);
  
      
      this.setState({
        readingSpeedRunning: true
      });
  }

  pauseReading(){

    clearInterval(this.timerVar);
    this.setState({
        readingSpeedRunning: false,
      });

  }

  restartReading(){
      const textArray = [...this.state.textArray];


    clearInterval(this.timerVar);
    this.timerVar = null;
    textArray[this.state.speedReadingIndex].style = false;
    this.setState({
        textArray,
        readingSpeedRunning: false,
        speedReadingIndex: 0
      });
         
      
  }


  onCheck(type){
    const readingStyles =[...this.state.readingStyles];
    if (type === 'underline'){
      readingStyles[0].checked = !readingStyles[0].checked;
    } if ( type === 'color') {
      readingStyles[1].checked = !readingStyles[1].checked;
    } if (type === 'highlight') {
      readingStyles[2].checked = !readingStyles[2].checked;
    } 
    this.setState({
      readingStyles
    })
  }

  onOptionCheck(option, questionIndex, optionIndex){

    const updatedQuestions = [...this.state.questions];

    const updatedQuestion = {
      ...updatedQuestions[questionIndex]
    };
    
    updatedQuestion.checkedOption = optionIndex;

    updatedQuestions[questionIndex] = updatedQuestion;
    

    this.setState({
      questions: updatedQuestions,
    }, () => {
      this.checkValidity();
    });


    
  };

  checkValidity() {
    const questions = [...this.state.questions];


    var checkDisabled = true;
    for ( let i = 0; i< questions.length; i++){

      if (questions[i].checkedOption === -1) {
        console.log('checked option triggered' + questions[i].checkedOption);
        checkDisabled = true;
      } else checkDisabled = false;
    }
    console.log('check disabled ' + checkDisabled );
    this.setState({
      checkDisabled
    })
  }

  checkLesson(){
    const questions = [...this.state.questions];

    for ( let i = 0; i< questions.length; i++) {
      if (questions[i].checkedOption == questions[i].correctOption) {
        questions[i].correct = true;
        questions[i].msg = 'correct';
      } else {
        questions[i].msg = 'incorrect';
      }
    }

    this.setState({
      questions
    });

  }


  render() {
    console.log('state', this.state);
    const formArray = [];
        for (let key in this.state.questions) {
          formArray.push({
              id: key,
              config: this.state.questions[key]
          });
        }

    return (
      <div>
       <Query 
      query={LESSON_SET}
      variables={{id: this.props.match.params.id}}
      fetchPolicy='network-only'
      onCompleted={data => this.completed(data)}>
      {({ loading, error, data}) => {
        if (loading)  return <div className="spinner spinner-1"></div>;
        if (error) return `Error!: ${error}`;
        // eslint-disable-next-line
        // let userCanDelete;
        // if (this.props.user){
        //   userCanDelete = this.props.user.userID === data.readingCompLesson.authorID;
        // }
        
        return (
          <div className="LessonSentencesWrapper">
            <div className="LessonTitle">
              <h1>{data.readingOmissionLesson.title}</h1>
            </div>
            <div className="ReadingPassage">{this.state.textArrays.map( (array, arrayIndex) => {
              array = array.map( (element, index) => {
                return <StyledWord 
                      key={index} 
                      word={element.word} 
                      shouldStyle={element.style} 
                      styles={this.state.readingStyles} 
                      styletype={'color'} 
                    />
              })
              return (
                <div>
                  {array}
                  <Omission 
                      value={this.state.values[`value${arrayIndex}`]}
                      placeholder={'hello'}
                      handlechange={(event)=> this.inputChangedHandler(arrayIndex, event)}
                    />
                </div>
                );
            })}</div>
              <div className="SpeedReadingWrapper">
                <button 
                  className="StartReadingButton" 
                  disabled={this.state.readingSpeedRunning}
                  onClick={()=> this.startReading()}>Start</button>
                <button 
                  className="StartReadingButton" 
                  disabled={!this.state.readingSpeedRunning}
                  onClick={()=> this.pauseReading()}>Pause</button>
                <button 
                  className="StartReadingButton" 
                  onClick={()=> this.restartReading()}>Reset</button>
                  
                  {this.state.readingStyles.map( (style, index ) => {
                     return<label className="StyleCheckLabel" key={index} >{style.type}
                        <input type="checkbox"
                          className="StyleCheckBox"
                          name={style.type} 
                          checked={style.checked}  
                          onChange={(type) => this.onCheck(style.type)}/></label>
                  })}
                  <div>reading speed (wpm)</div>
                  <select 
                   disabled={this.state.readingSpeedRunning}
                   className="custom-select"
                   style={{width: '100px'}}
                   value={this.state.readingSpeedValue} 
                   onChange={(event) => this.handleSpeedChange(event)}>
                   {this.state.readingSpeeds.map((speed, index) => (<option key={index} value={speed}>{speed}</option>))}
                  </select>
              </div>
              {/*<div className="ReadingCompQuestionsWrapper">
                {formArray.map( (question, index) => {
                  return (
                    <ReadingCompQuestion
                      key={question.id}
                      index={index} 
                      question={question.config.question}
                      options={question.config.options}
                      changed={this.onOptionCheck}
                      checked={question.config.checkedOption}
                      msg={question.config.msg}
                    />

                    )
                })}
              </div>*/}
              <button 
                  className="CheckLessonButton"
                  disabled={this.state.checkDisabled}
                  onClick={()=> this.checkLesson()}>Check
              </button>   
          </div>
        );
     }}
     </Query>
      
     </div>
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
