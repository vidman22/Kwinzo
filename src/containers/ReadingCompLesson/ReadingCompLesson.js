import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ReadingCompLesson.css';
import ReadingCompQuestion from '../../components/ReadingCompQuestion/ReadingCompQuestion';
import StyledWord from '../../components/StyledWord/StyledWord';
import { Query, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import * as actionTypes from '../../store/actionTypes';
import XMarkSVG from '../../components/SVG/XMarkSVG';

const LESSON_SET = gql`
  query LessonSet($uniqid: String!){
    readingCompLesson(uniqid: $uniqid ) {
      title
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
        highlightShown: false,
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

  showHighlight(index, highlight) {
    
    const updatedQuestions = [...this.state.questions];


    let updatedTextArray = [...this.state.textArray];
    highlight = highlight.split(' ');
    updatedTextArray.map((element) => {
      for( let i = 0; i < highlight.length; i++) {
        if (element.word.toLowerCase() === highlight[i]) {
            element.style = !element.style;
        } 
      }
      return element;   
    });
    updatedQuestions[index].highlightShown = !updatedQuestions[index].highlightShown;
    this.setState({
      textArray: updatedTextArray,
      questions: updatedQuestions
    });

  }

  render() {

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
      variables={{uniqid: this.props.match.params.id}}
      fetchPolicy='network-only'
      onCompleted={data => this.completed(data)}>
      {({ loading, error, data}) => {
        if (loading)  return <div className="spinner spinner-1"></div>;
        if (error) return `Error!: ${error}`;
        
        // eslint-disable-next-line
        let userCanDelete;
        if (this.props.user){
          userCanDelete = this.props.user.id === data.readingCompLesson.authorID;
        }
        
        return (
          <div className="LessonSentencesWrapper">
           <button className="BackButtonLesson" onClick={() => this.back()}>{"<"} Back</button>
           { userCanDelete ? <XMarkSVG onclick={() => this._deleteLesson()} /> : null}
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
                {formArray.map( (question) => {
                  return (
                    <ReadingCompQuestion
                      key={question.id}
                      index={Number(question.id)} 
                      question={question.config.question}
                      options={question.config.options}
                      highlight={question.config.highlight}
                      changed={this.onOptionCheck}
                      checked={question.config.checkedOption}
                      msg={question.config.msg}
                      showhighlight={()=> this.showHighlight(question.id, question.config.highlight)}
                      highlightshown={question.config.highlightShown}
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
