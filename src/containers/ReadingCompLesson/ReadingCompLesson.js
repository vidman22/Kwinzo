import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ReadingCompLesson.css';
import ReadingCompQuestion from '../../components/ReadingCompQuestion/ReadingCompQuestion';
import StyledWord from '../../components/StyledWord/StyledWord';
import { Query, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import * as actionTypes from '../../store/actionTypes';

const LESSON_SET = gql`
  query LessonSet($id: String!){
    readingCompLesson(id: $id ) {
      id
      title
      author
      authorID
      text
      questions{
        checkedOption
        correctOption
        question
        options
        highlight
      }
    }
  }
`;



class Lesson extends Component {
  constructor(props) {
    super(props)
    this.state = {
      textArray: [],
      values: {},
      checkedAnswers: {},
      questions: [],
      activeValue: false,
      readingSpeeds: [75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 400, 450, 500],
      readingSpeedValue: 75,
      readingSpeedRunning: false,
      readingTimerMinuteValue: '',
      readingTimerSecondValue: '',
      readingStyles: [{type: 'underline', checked: false}, {type: 'color', checked: true }, {type:'highlight', checked: false}],
      speedReadingIndex: 0,
      checkDisabled: true,

    }
    // eslint-disable-next-line
    var timerVar;
    this.onOptionCheck = this.onOptionCheck.bind(this)
    
  }

 componentDidMount() {
        window.scrollTo(0, 0);
}

componentWillUnmount() {
  clearInterval(this.timerVar);
}


  // inputChangedHandler(e, index) {
  //   const values = {...this.state.values};
  //   let value = ''

  //   if (values[`value${index}`] || values[`value${index}`] === "" ) {
      
  //     values[`value${index}`] = e.target.value;

  //     this.setState({
  //       values
  //     })

  //   } else {

  //       const key = `value${index}`;
  //       value = e.target.value;
  //       let obj = {[key]: value};
  //       const newObj = Object.assign(obj, values);
  //       this.setState({
  //         activeValue: true,
  //         values: newObj
  //   })
  //  }
  // }

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
    
    const textArray = data.readingCompLesson.text.split(' ').map( word => {
      let obj = {
        word: word,
        style: false
      }
      return obj;
    });
    
    const questions = data.readingCompLesson.questions.map( element => {
      let obj = {
        question: element.question,
        checkedOption: element.checkedOption,
        correctOption: element.correctOption,
        options: element.options,
        highlight: element.highlight,
        correct: false,
        msg:'',
      }
      return obj;
    });

    this.setState({
      textArray,
      questions
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
        }else this.restartReading();
    
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

        checkDisabled = true;
      } else checkDisabled = false;
    }

    this.setState({
      checkDisabled
    })
  }

  checkLesson(){
    const questions = [...this.state.questions];

    for ( let i = 0; i< questions.length; i++) {
      // eslint-disable-next-line
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

  back() {
    this.props.history.push('/lessons');
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
        let userCanDelete;
        if (this.props.user){
          userCanDelete = this.props.user.userID === data.readingCompLesson.authorID;
        }
        
        return (
          <div className="LessonSentencesWrapper">
           <button className="BackButtonLesson" onClick={() => this.back()}>{"<"} Back</button>
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
              <h1>{data.readingCompLesson.title}</h1>
            </div>
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
                     return<label className="StyleCheckLabel" key={index}>{style.type}
                        <input 
                          type="checkbox"
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
            <div className="ReadingPassage">{this.state.textArray.map( (element, index) => {
              return <StyledWord key={index} word={element.word} shouldStyle={element.style} styles={this.state.readingStyles} styletype={'color'} />
            })}</div>
              
              <div className="ReadingCompQuestionsWrapper">
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
              </div>
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
    this.props.history.push('/lessons');
  };
};

const DELETE_LESSON = gql`
  mutation ($id: String!){
      deleteCompLesson( id: $id )
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
