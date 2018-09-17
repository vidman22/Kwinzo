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
      omissions: [],
      readingSpeeds: [75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 400, 450, 500],
      readingSpeedValue: 75,
      readingSpeedRunning: false,
      readingTimerMinuteValue: '',
      readingTimerSecondValue: '',
      readingStyles: [{type: 'underline', checked: false}, {type: 'color', checked: true }, {type:'highlight', checked: false}],
      speedReadingIndex: 0,
      speedReadingArrayIndex: 0,
      showWordBank: false,
      shuffledOmissions: [],
      textArrays: [],
      values: {},
    }
    // eslint-disable-next-line
    var timerVar; 
  }

 componentDidMount() {
        window.scrollTo(0, 0);
}



  inputChangedHandler(index, e) {
    const updatedOmissions = [...this.state.omissions];
    const updatedOmission = {
      ...updatedOmissions[index]
    };

    updatedOmission.value = e.target.value;

    updatedOmissions[index] = updatedOmission;
    this.setState({
      omissions: updatedOmissions
    });
  }

  handleCheck(index, e) {
    e.preventDefault();

    const updatedOmissions = [...this.state.omissions];
    const updatedOmission = {
      ...updatedOmissions[index]
    };

    if (updatedOmission.value === updatedOmission.omission) {
      updatedOmission.msg = 'correct';
      updatedOmission.used = true;
    } else if (updatedOmission.value == "") {
      updatedOmission.msg = '';
    }else {
      updatedOmission.msg = 'incorrect';
    }

    updatedOmissions[index] = updatedOmission;

    this.setState({
      omissions: updatedOmissions
    });
  } 

  handleLessonCheck(){
    const updatedOmissions = [...this.state.omissions];

    for (let i=0; i< updatedOmissions.length; i++) {
      const updatedOmission = {
        ...updatedOmissions[i]
      };
      if (updatedOmission.value === updatedOmission.omission) {
        updatedOmission.msg = 'correct';
        updatedOmission.used = true;
      } else if (updatedOmission.value == "") {
        updatedOmission.msg = '';
      } else {
        updatedOmission.msg = 'incorrect';
      }
      updatedOmissions[i] = updatedOmission;
    }

    this.setState({
      omissions: updatedOmissions
    });
  }

  completed(data){
    let indices = [];
    const text = data.readingOmissionLesson.text;

    const omissions = [...data.readingOmissionLesson.omissions];
    
    for (let i = 0; i< omissions.length; i ++){
      let idx = {
        index: text.indexOf(omissions[i].omission),
        omission: omissions[i].omission,
        value: '',
        hint: omissions[i].hint
      }
      while (idx.index !== -1) {
        indices.push(idx);
        idx = {
          index: text.indexOf(omissions[i].omission, idx.index + 1),
          omission: omissions[i].omission,
          value: '',
          msg:'',
          used: false,
          hint: omissions[i].hint
        }
      }
    }
    
    indices.sort((a,b)=> a.index - b.index);

    let arrayOfTextArrays = [];
    let firstIndex = 0;

    for (let i = 0; i < indices.length; i++){
      const array = text.slice(firstIndex, indices[i].index);
      firstIndex = (indices[i].index + indices[i].omission.length);
      arrayOfTextArrays.push(array);
    }

    arrayOfTextArrays = arrayOfTextArrays.map( array => {
     array = array.split(' ').map(word => {
        let obj;
        if (word !== '') {
          obj = {
            word: word,
            style: false
          }
        } else {
          obj = {
            word: word
          }
        }
        return obj;
      })
      return array
    });
    const tempIndices = [...indices];
    let shuffledOmissions = this.shuffle(tempIndices);
    this.setState({
      textArrays: arrayOfTextArrays,
      omissions: indices,
      shuffledOmissions
    });

  }

  shuffle(array) {
  let i = 0,
      j = 0,
      temp = null

  for ( i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
    return array;
  }

  handleSpeedChange(event) {
    this.setState({
      readingSpeedValue: event.target.value
    });
  }

  startReading(){
    const textArrays = [...this.state.textArrays];

    let i = this.state.speedReadingIndex;
    let j = textArrays.length;
    let k = this.state.speedReadingArrayIndex;
    
    this.timerVar = setInterval(() => {
      if ( k < j) {
        if ( i < textArrays[k].length) {
          textArrays[k][i].style = true;
          if (i > 0) {
            textArrays[k][i-1].style = false;
          }
          this.setState({
            textArrays,
            speedReadingIndex: i++
          });
        } else{
          k++;
          i=0;
          this.setState({
            speedReadingIndex: i,
            speedReadingArrayIndex: k
          });
        } 
      } else {
        this.restartReading();
      } 
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
    if (this.state.speedReadingArrayIndex < this.state.textArrays.length){
      const updatedTextArrays = [...this.state.textArrays];
      const updatedTextArray = [
        ...updatedTextArrays[this.state.speedReadingArrayIndex]
      ];
      updatedTextArray[this.state.speedReadingIndex].style = false;
      this.setState({
        textArrays: updatedTextArrays
      })
    }
  
    clearInterval(this.timerVar);
    this.timerVar = null;
    
    this.setState({
        
        readingSpeedRunning: false,
        speedReadingIndex: 0,
        speedReadingArrayIndex: 0
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

  showWordBank(){
    this.setState( prevState => {
     return ({showWordBank: !prevState.showWordBank})
    });
  }

  back() {
    this.props.history.push('/lessons');
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
      variables={{id: this.props.match.params.id}}
      fetchPolicy='network-only'
      onCompleted={data => this.completed(data)}>
      {({ loading, error, data}) => {
        if (loading)  return <div className="spinner spinner-1"></div>;
        if (error) return `Error!: ${error}`;
        //eslint-disable-next-line
        let userCanDelete = false;
        if (this.props.user){
          userCanDelete = this.props.user.userID === data.readingOmissionLesson.authorID;
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
                
                  <div key={arrayIndex} className="OmissionArray">{array}
                    <Omission 
                        value={this.state.omissions[arrayIndex].value}
                        placeholder={this.state.omissions[arrayIndex].hint}
                        message={this.state.omissions[arrayIndex].msg}
                        handlechange={(event)=> this.inputChangedHandler(arrayIndex, event)}
                        handlesubmit={(e) => this.handleCheck(arrayIndex, e)}
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
              {this.state.showWordBank ? (
                <div className="OmissionWordBank">
                  <h2>Word Bank</h2>
                  {this.state.shuffledOmissions.map((omission, index) => (
                    <div className="WordBankAnswer" key={index}>
                      {omission.used ? (
                        <div className="UsedWord"><p>{omission.omission}</p></div>
                        ) : (
                        <div className="UnusedWord"><p>{omission.omission}</p></div>
                        )}
                    </div>
                    ))}
                  </div>
                ) : null}
              <button className="WordBankButton" onClick={()=> this.showWordBank()}>{!this.state.showWordBank ? 'Show Word Bank' : 'Hide Word Bank'}</button>
              <button 
                  className="CheckLessonButton"
                  // disabled={this.state.checkDisabled}
                  onClick={()=> this.handleLessonCheck()}>Check
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
    console.log(this.props.history);
    this.props.history.push('/lessons');
  };
};

const DELETE_LESSON = gql`
  mutation ($id: String!){
    deleteOmissionLesson(id: $id)
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
