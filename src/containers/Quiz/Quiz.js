import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import CreateLesson from '../CreateLesson/CreateLesson';
import { withRouter} from 'react-router';
import './Quiz.css';
import Sentence from '../../components/Sentence/Sentence';
import XMarkSVG from '../../components/SVG/XMarkSVG';
import { Query, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import * as actionTypes from '../../store/actionTypes';

const QUIZ = gql`
  query($uniqid: String!){
    quiz(uniqid: $uniqid ) {
      id
      uniqid
      title
      username
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
      answers: [],
      title: '',
      sentences: [],
      values: {},
      checkedInputs: {},
      editMode: false,
      wordBank: false,
    }
  }

 componentDidMount() {
        window.scrollTo(0, 0);
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

  back() {
      this.props.history.push('/lessons');
  }

  editMode(){
    if (this.props.user && this.props.user.uuid === this.state.authorID ){
      this.setState( prevState => {
        return {editMode: !prevState.editMode }
      });
  } 
  }

  completed(data) {
    console.log('data', data);
    const title = data.quiz.title;
    let sentences = data.quiz.sentences;
    let answers = [];
    sentences = sentences.map((sentence, index) => {
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
        index
      }
      answers.push(aObj);
      return rObj;
    });
    answers = this.shuffle(answers);
    this.setState({
      authorID : data.quiz.authorID, 
      answers,
      sentences,
      title
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

  updateWordBank(index) {

    const updatedAnswers = [...this.state.answers];
  
    for (let i = 0; i < updatedAnswers.length; i++) {
      const answerObject = updatedAnswers[i];
      // eslint-disable-next-line
      if (index == answerObject.index) {
        answerObject.used = true;
        updatedAnswers[i] = answerObject;
      }
    }

    this.setState({
      answers: updatedAnswers
    });
  }

  toggleWordBank() {
    this.setState( prevState => {
      return { wordBank: !prevState.wordBank}
    })
  }


  render() {
    let userCanEdit = false;
        
    const sentences = [];
    for (let key in this.state.sentences) {
      sentences.push({
          id: key,
          config: this.state.sentences[key]
      });
    }
    console.log('quiz id', this.props.match.params.id)
    return (
      <div>
      {!this.state.editMode ? (
      
      <Query 
      query={QUIZ}
      variables={{uniqid: this.props.match.params.id}}
      fetchPolicy='network-only'
      onCompleted={data => this.completed(data)}>
      {({ loading, error, data}) => {
        if (loading)  return <div className="spinner spinner-1"></div>;
        if (error) return <span>Something went wrong. Please try again later</span>;
        if (this.props.user){
          userCanEdit = this.props.user.userID === data.quiz.authorID;
      } 
        return (
          
           <div className="LessonSentencesWrapper">
            <button className="BackButtonLesson" onClick={() => this.back()}>{"<"} Back</button>
            { userCanEdit ? <XMarkSVG onclick={() => this._deleteLesson()}/>: null }
                  <div className="LessonTitle">
                    <h1>{data.quiz.title}</h1>
                  </div>
          <div className="LessonTab">
            
           <div className="LessonOptions">
            
                <div className="HomeFlex">
                  
                  <Link to={`/solo-play/${this.props.match.params.id}`} onClick={() => this.props.sendLesson(data.quiz)} style={{color: 'black', textDecoration: 'none' }}>
                    <div className="Solo">
                     <h2>Solo Play</h2>
                    </div>
                  </Link>
                 
                  <Link to={`/host-game/${this.props.match.params.id}`} onClick={() => this.props.sendLesson(data.quiz)} style={{color: 'black', textDecoration: 'none' }}>
                     <div className="PhoneBox">
                     <h2>Host Game</h2>
                    </div>
                 </Link>
                 
                 <div onClick={() => this.toggleWordBank()} style={{color: 'black', textDecoration: 'none' }}>
                  <div className="WordBankGame">
                    <h2>Word Bank</h2>
                  </div>
                 </div>

                <div onClick={() => this.editMode()}>
                  <div className="Assign">
                    <h2>Edit Quiz</h2>

                  </div>
                </div>

                </div>
                {this.state.wordBank ? <div className="WordBank">
            
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
                </div> : null}
                
                  {sentences.map((sentence, index) => (
                    <div className="LessonSentence" key={sentence.id}>
                      <p>{index + 1}</p>
                      <Sentence 
                        handlechange={(event) => this.inputChangedHandlerX(event, index)}
                        handlesubmit={(e) => this.handleCheckX(e, sentence.id)}
                        value={sentence.config.value}
                        sentence={sentence.config.sentence} 
                        correctanswer={sentence.config.answer}
                        message={sentence.config.checked}
                        lessonmode={true}
                        placeholder={sentence.config.hint}
                        onclick={(e)=> this.handleCheckX(e, sentence.id)} />
                        
                    </div>))}
                  {userCanEdit ? <button onClick={() => this.editMode()} className="CreateButton">Edit</button> : null}

                </div>
           </div>
          </div>

        );
     }}
      </Query> ) : <CreateLesson 
                      editmode={this.state.editMode} 
                      back={() => this.editMode()} 
                      sentences={this.state.sentences} 
                      title={this.state.title} 
                      togglemodal={this.props.togglemodal} />}</div>

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
    deleteInputLesson(id: $id)
  }
`

const mapDispatchToProps = dispatch => {
  return {
    sendLesson: (lesson) => dispatch({type: actionTypes.LESSON_SET, lesson:lesson })
  }
}

const mapStateToProps = state => {
  return {
    lesson: state.quiz,
    user: state.user
  }
}

const Container = graphql(DELETE_LESSON, { name: 'deleteLesson' })( withRouter(Lesson));
export default connect( mapStateToProps, mapDispatchToProps )( Container );
