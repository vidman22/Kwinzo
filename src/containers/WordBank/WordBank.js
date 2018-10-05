import React, { Component } from 'react';
import { connect } from 'react-redux';
import './WordBank.css';
import { withRouter } from 'react-router-dom';
import Sentence from '../../components/Sentence/Sentence';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import XMarkSVG from '../../components/SVG/XMarkSVG';

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


class WordBank extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {},
      checkedInputs: {},
      answers: [],
      activeValue: false
    }
  }

 componentDidMount() {
        window.scrollTo(0, 0);
        if (this.props.lesson.sentences) {
          this.completed(this.props.lesson.sentences);
        }
    
}

  back() {
    this.props.history.push(`/lessons/${this.props.lesson.id}`);
  }

  completed(sentences) {
    const title = this.props.lesson.title;
    
    let answers = [];
    sentences = sentences.map((sentence) => {
      let rObj = {
        alts : sentence.alts,
        answer : sentence.answer,
        hint : sentence.hint,
        sentence : sentence.sentence,
        value : '',
        checked : '',
      }
      const aObj = {
        value: sentence.answer,
        used: false,
      }
      answers.push(aObj);
      return rObj;
    });
    answers = this.shuffle(answers);

    this.setState({
      answers, 
      sentences,
      title
    })
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

updateWordBank(index) {

      const updatedAnswers = [...this.state.answers];
      const answerObject = updatedAnswers[index];
      answerObject.used = true;
      updatedAnswers[index] = answerObject;
      this.setState({
        answers: updatedAnswers
      });
}

inputChangedHandlerX(e, index){
  const updatedSentences = [...this.state.sentences];

  const updatedSentence = {
    ...updatedSentences[index]
  }

  updatedSentence.value = e.target.value;
  updatedSentence.checked = '';
  updatedSentences[index] = updatedSentence;

  this.setState({
    sentences: updatedSentences,
  })
}

handleCheckX(e, index) {
  e.preventDefault();
  const updatedSentences = [...this.state.sentences];


  const updatedSentence = {
    ...updatedSentences[index]
  }

  const value = updatedSentence.value.trim().toLowerCase();
  const answer = updatedSentence.answer;
  const alts = updatedSentence.alts;

  if ( value === answer ) {
    updatedSentence.checked =  'correct';
    this.updateWordBank(index);
  } else if (alts.length !== 0 && alts !== undefined) {
    updatedSentence.checked =  'incorrect';
      for (let i = 0; i < alts.length; i++) {
        if ( value === alts[i]) {
          updatedSentence.checked =  'correct';
          this.updateWordBank(index);
          break;
        }
      }
    } else {
      updatedSentence.checked =  'incorrect';
  }

  updatedSentences[index] = updatedSentence;

  this.setState({
    sentences: updatedSentences,
  });

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
  //     this.updateWordBank(index);
  //   } else if (alts.length !== 0 && alts !== undefined) {
  //       for (let i = 0; i < alts.length; i++) {
  //         if ( value === alts[i]) {
  //           const obj = {[key]: 'correct'};
  //           const newObj = Object.assign(checkedInputs, obj);
  //           this.setState({
  //             checkedInputs: newObj
  //           });
  //           this.updateWordBank(index);
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
  //     this.updateWordBank(index);
  //   } else if (alts.length !== 0 && alts !== undefined) {
  //       for (let i = 0; i < alts.length; i++) {
  //         if ( value === alts[i]) {
  //           const obj = {[key]: 'correct'};
  //           const newObj = Object.assign(checkedInputs, obj);
  //           this.setState({
  //             checkedInputs: newObj
  //           });
  //           this.updateWordBank(index);
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



  render() {

    const sentences = [];
    for (let key in this.state.sentences) {
      sentences.push({
          id: key,
          config: this.state.sentences[key]
      });
    }
   
    return (
       <Query 
      query={LESSON_SET}
      variables={{id: this.props.match.params.id}}
      onCompleted={(data) => this.completed(data.lessonSet.sentences)}>
      {({ loading, error, data}) => {
        if (loading)  return <div className="spinner spinner-1"></div>;
        if (error) return `Error!: ${error}`;
        let userCanDelete = false;

        if (this.props.user){
          userCanDelete = this.props.user.userID === data.lessonSet.authorID;
        }
        
        
        return (
           <div className="LessonSentencesWrapper">
            <button className="BackButtonLesson" onClick={() => this.back()}>{"<"} Back</button>
            { userCanDelete ? <XMarkSVG onclick={() => this._deleteLesson()} />
                 : null}
                  <div className="LessonTitle">
                    <h1>{data.lessonSet.title}</h1>
                  </div>
          <div className="WordBank">
            
            <h2>Word Bank</h2>
            {this.state.answers.map((answer, index) => (
              <div className="WordBankAnswer" key={index}>
                {answer.used ? (
                  <div className="UsedWord"><p>{answer.value}</p></div>
                  ) : (
                  <div className="UnusedWord"><p>{answer.value}</p></div>
                  )}
              </div>
              ))}
           </div>
          <div className="WordBankLessonTab">
                            
                  {sentences.map((sentence, index) => (
                    <div className="LessonSentence" key={sentence.id}>
                      <p>{index + 1}</p>
                      <Sentence 
                        handlechange={(event) => this.inputChangedHandlerX(event, index)}
                        handlesubmit={(e)=> this.handleCheckX(e, sentence.id)}
                        value={sentence.config.value}
                        sentence={sentence.config.sentence} 
                        correctanswer={sentence.config.answer}
                        message={sentence.config.checked}
                        onclick={(e)=> this.handleCheckX(e, sentence.id)}
                        exercise='true' 
                        placeholder='        ' />
                    </div>))}
           </div>
           

          </div>

        );
     }}
     </Query>

      )
  }
}


const mapStateToProps = state => {
  return {
    lesson: state.lessonSet,
    user: state.user
  }
}

const Container = withRouter(WordBank);
export default connect( mapStateToProps )( Container );
