import React, { Component } from 'react';
import InputSentence from '../../components/InputSentence/InputSentence';
import InputAlt from '../../components/InputAlt/InputAlt';
import Sentence from '../../components/Sentence/Sentence';
import {Prompt, withRouter} from 'react-router';
import PlusSVG from '../../components/SVG/PlusSVG';
import XMarkSVG from '../../components/SVG/XMarkSVG';

import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import './CreateLesson.css';

class CreateLesson extends Component {
  constructor(props) {
    super(props);
  this.state = {
    title: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Lesson Title'
        },
        value: '',
        validation: {
          required: true,
          msg: ''
        },
        valid: false,
        touched: false
    },
    lessonForm: {
      sentence: {
        value: '',
        validation: {
          required: true,
          msg: ''
        },
        valid: false,
        touched: false
      },
      answer: {
        value: '',
        validation: {
          required: true,
           msg: ''
        },
        valid: false,
        touched: false
      },
      hint: {
        value: '',
        validation: {
          required: false,
          msg: ''
        },
        valid: false,
        touched: false
      },
      alts:{
        array:[],
        valid: true,
      },
      prompts: {
        showDivs: false,
        valid: true,
      },
    },
    altForm:{ 
      value: '',
      validation: {
        required: false,
        msg: ''
      },
      valid: false,
      touched: false
    }, 
    exampleValue: '',
    exampleAnswer:'jumps',
    exampleMsg:'',
    addSentenceDisabled: false,
    formIsValid: false,
    addAltDisabled: false,
    lessonFormNum: 1,
    lessonFormArray: [],
    formIsHalfFilledOut: false,
    showExample: false,
    showDivs: false,
    message: 'add alternate answer',
    lessonID: ''
  }
 this.checkFormValidity = this.checkFormValidity.bind(this);
 this.addAlt = this.addAlt.bind(this);
}

  

  componentDidMount() {
    const lessonID = this.props.match.params.id;
    let lessonFormArray = [];
    if (this.props.editmode) {
      const updatedTitle = this.state.title;
      updatedTitle.value = this.props.title;
      updatedTitle.valid = true;
      updatedTitle.touched = true;
      this.setState({
        title: updatedTitle,
        lessonID
      });
      lessonFormArray = this.props.sentences.map((sentence) => {
        let rObj = {
          sentence: {
            value: sentence.sentence,
            validation:{
              required: true,
              msg: ''
            },
            valid: true,
            touched: true
          },
          answer: {
            value: sentence.answer,
            validation: {
              required: true,
              msg: ''
            },
            valid: true,
            touched: true
          },
          hint: {
            value: sentence.hint,
            validation: {
              required: true,
              msg: ''
            },
            valid: true,
            touched: true
          },
          alts: {
            array: sentence.alts.map((alt) => {
              let aObj = {
                value: alt,
                validation: {
                  required: true,
                  msg: ''
                },
                valid: true,
                touched: true
              };
              return aObj;   
            }),
            valid: true,
          },
          prompts: {
            showDivs: false,
            valid: true
          }
        }
        return rObj;
      });
    } else {
    let lessonForm = {...this.state.lessonForm};
      for (let i=0; i< this.state.lessonFormNum; i++) {
        lessonFormArray.push(lessonForm);
      }
    }
    this.setState({lessonFormArray});
    
  }



  addSentence() {

    const updatedLessonForms = [...this.state.lessonFormArray]
    const lessonForm = {...this.state.lessonForm}

    if (updatedLessonForms.length >= 21) {
      this.setState({
        addSentenceDisabled: true
      });
    } 
    updatedLessonForms.push(lessonForm);

    this.setState({
      lessonFormArray: updatedLessonForms,
    }, () => {
      this.checkFormValidity();
    });
  }

  addAlt(index, event) {
    event.preventDefault();

    let altForm = {
      ...this.state.altForm
    };

    const updatedLessonForms = [
      ...this.state.lessonFormArray
    ];

    const updatedForm = {
      ...updatedLessonForms[index]
    };

    const updatedAlts = {
      ...updatedForm.alts
    };

    const updatedAltArray = [
      ...updatedAlts.array
    ]

    if (updatedAltArray.length >= 4 ) {
      this.setState({addAltDisabled: true});
    }

    updatedAltArray.push(altForm);

    updatedLessonForms[index] = updatedForm;
    updatedForm.alts = updatedAlts;
    updatedAlts.array = updatedAltArray;
    

    this.setState({
      lessonFormArray: updatedLessonForms,
    }, () => {
      this.checkFormValidity();
    });
  };

  altMouseOverEvent(index) {
    const updatedLessonForms = [
      ...this.state.lessonFormArray
    ];

    const updatedForm = {
      ...updatedLessonForms[index]
    };

    const updatedPrompts = {
      ...updatedForm.prompts
    }

   if (updatedPrompts.showDiv === 'Hide') {
    updatedPrompts.showDiv = 'Show';
   } else {
    updatedPrompts.showDiv = 'Hide'; 
   }
    updatedForm.prompts = updatedPrompts;
    updatedLessonForms[index] = updatedForm;
    
    this.setState({ lessonFormArray: updatedLessonForms});
    
  }

  removeAlt(formIndex, altIndex, e) {
    e.preventDefault();

    const updatedLessonForms = [
      ...this.state.lessonFormArray
    ]

    const updatedForm = {
      ...updatedLessonForms[formIndex]
    }

    const updatedAlts = {
      ...updatedForm.alts
    };

    const updatedAltArray = [
      ...updatedAlts.array
    ]
    // eslint-disable-next-line
    const removed = updatedAltArray.splice(altIndex, 1);

    updatedAlts.array = updatedAltArray;
    updatedForm.alts = updatedAlts;
    updatedLessonForms[formIndex] = updatedForm;

    this.setState({
      lessonFormArray: updatedLessonForms,
    }, () => {
      this.checkFormValidity();
    });
  }

  removeSentence(formIndex, e) {
    e.preventDefault();
    const updatedLessonForms = [
      ...this.state.lessonFormArray
    ];
    // eslint-disable-next-line
    const removed = updatedLessonForms.splice(formIndex, 1);
    
    this.setState({
      lessonFormArray: updatedLessonForms,
    }, () => {
      this.checkFormValidity();
    });
  }

  inputExampleChangedHandler = (event) => {
      this.setState({
        exampleValue: event.target.value
      });
  }

  inputChangedHandler = (event, inputIdentifier, index) => {
    
        const updatedLessonForms = [
            ...this.state.lessonFormArray
        ];
        const updatedForm = { 
            ...updatedLessonForms[index]
        };
        
        const updatedElement = {
          ...updatedForm[inputIdentifier]
        }
        const updatedValidation = {
          ...updatedElement.validation
        }

         if (inputIdentifier === 'answer') {
            const sentence = updatedForm['sentence'].value;
            const answer = event.target.value.trim();
            
            let pos = sentence.indexOf(answer);

            updatedValidation.msg = '';
            updatedElement.valid = false;

            if (answer === '') {
              updatedValidation.msg = 'add an answer';
              updatedElement.valid = false;
            } else if (pos === -1 ) {
              updatedElement.valid = false;
              updatedValidation.msg = 'answer not found in sentence';
            } else if ( pos !== -1 ) {
              let count = 0;
              let indx = sentence.indexOf(answer);
              while (indx !== -1) {
                count++
                indx = sentence.indexOf(answer, indx + 1)
              }
              if (count > 1) {
              updatedElement.valid = false;
              updatedValidation.msg = 'more than one answer found';
              } else {
                updatedElement.valid = true;
              }
            }else if (answer.length >= 200){
            updatedValidation.msg = 'answer is too long';
            updatedElement.valid = false;
            } else {
              updatedElement.valid = true;
            }
        }

        if (inputIdentifier === 'hint') {
          const hint = event.target.value.trim();
          updatedValidation.msg = '';
          if ( hint === '' ){
            updatedValidation.msg = 'add a hint';
            updatedElement.valid = false;
          } else if ( hint.length >= 50 ) {
            
            updatedValidation.msg = 'hint is too long';
            updatedElement.valid = false;
          } else {
            updatedElement.valid = true;
            updatedValidation.msg = '';
          }
        }

        if (inputIdentifier === 'sentence') {
          const sentence = event.target.value;
          updatedValidation.msg = '';
          if ( sentence.trim() === '' ){
            updatedValidation.msg = 'add a sentence';
            updatedElement.valid = false;
          } else if (sentence.length >= 140) {
            updatedValidation.msg = 'sentence is too long';
            updatedElement.valid = false;
          } else {
          updatedElement.valid = true;
          updatedValidation.msg = '';
        }
      }

        
        updatedElement.value = event.target.value;
        
        updatedElement.touched = true;

        updatedLessonForms[index] = updatedForm;
        updatedForm[inputIdentifier] = updatedElement;
        updatedElement.validation = updatedValidation;
          

        this.setState({
          lessonFormArray: updatedLessonForms,
        }, () => {
          this.checkFormValidity();
        });
}


  checkFormValidity = () => {
    const lessonFormArray = this.state.lessonFormArray;
    let formIsValid = true;
    for ( let i = 0; i < lessonFormArray.length; i++) {
      for ( let property in lessonFormArray[i] ) {
        formIsValid = lessonFormArray[i][property].valid && formIsValid && this.state.title.valid;
      }
    }
    if (formIsValid === true ){
      this.setState({ formIsValid, formIsHalfFilledOut: false });
    } else {
      this.setState({formIsValid, formIsHalfFilledOut: true });
    }
  }


  inputChangedAltHandler = (e, formIndex, altIndex) => {

    const updatedLessonForms = [
      ...this.state.lessonFormArray
    ];

    const updatedForm = {
      ...updatedLessonForms[formIndex]
    };

    const updatedAlts = {
      ...updatedForm.alts
    };

    const updatedAltArray = [
      ...updatedAlts.array
    ];
        
    const updatedAlt = {
      ...updatedAltArray[altIndex]
    };

    const updatedAltValidation = {
      ...updatedAlt.validation
    };

    updatedAlt.value = e.target.value;
    updatedAlt.touched = true;

    if (updatedAlt.value === '') {
      updatedAltValidation.msg = 'delete alt or add an answer';
      updatedAlt.valid = false;
    } else if (updatedAlt.value.length >= 30 ){
      updatedAltValidation.msg = 'alt is too long';
      updatedAlt.valid = false;
    } else {
      updatedAlt.valid = true;
      updatedAltValidation.msg = '';
    }

    updatedLessonForms[formIndex] = updatedForm;
    updatedForm.alts = updatedAlts;
    updatedAlts.array = updatedAltArray;
    updatedAltArray[altIndex] = updatedAlt;
    updatedAlt.validation = updatedAltValidation;

    this.setState({
      lessonFormArray: updatedLessonForms,
    }, () => {
      this.checkFormValidity();
    });
    
  }

  handleTitleChange = (e) => {
    
    const updatedTitle = {
      ...this.state.title
    }

    updatedTitle.value = e.target.value;
    updatedTitle.touched = true;

    const updatedTitleValidation = {
      ...updatedTitle.validation
    }
    updatedTitleValidation.msg = '';

    if (updatedTitle.value.trim() === '') {
      updatedTitleValidation.msg = 'add a title';
      updatedTitle.valid = false;
    } else if (updatedTitle.value.length >= 34) {
      updatedTitleValidation.msg = 'title is too long';
      updatedTitle.valid = false;
    } else {
      updatedTitle.valid = true;
    }

    updatedTitle.validation = updatedTitleValidation;

    this.setState({ title: updatedTitle }, () => {
      this.checkFormValidity();
    });
    
  }

  completed = (data) => {
    if (this.props.editmode) {
      this.props.back();
    } else {
      this.setState({
        formIsHalfFilledOut: false
      }, () => {
        this.props.history.push(`/quiz/${data.createQuiz.uniqid}`);
      });
    }
  }

  back() {
    if (this.props.editmode) {
      this.props.back();
    } else {
    this.props.history.push('/create-lesson');
    }
  }
  
  showHelp() {
    const updatedLessonFormArray = [
      ...this.state.lessonFormArray
    ];
    if (updatedLessonFormArray.length !== 0) {
    
    const updatedLessonForm = {
      ...updatedLessonFormArray[0]
    };
    const updatedPrompts = {
      ...updatedLessonForm.prompts
    };
    updatedPrompts.showDivs = !updatedPrompts.showDivs;
    updatedLessonForm.prompts = updatedPrompts;
    updatedLessonFormArray[0] = updatedLessonForm;

      this.setState(prevState => {
       return { 
        lessonFormArray: updatedLessonFormArray,
        showDivs: !prevState.showDivs
       }
      });
    
  
    }
  }
  handleCheckOnEnter(e){
    e.preventDefault();
    const exampleValue = this.state.exampleValue;
    const exampleAnswer = this.state.exampleAnswer;
    if (exampleValue === exampleAnswer || exampleValue === 'jumped') {
      this.setState({
        exampleMsg: 'correct'
      });
    } else {
      this.setState({
        exampleMsg: 'incorrect'
      });
    }
  }

  showExample() {
    this.setState( prevState => {
     return  { showExample: !prevState.showExample }
    });

  }

  render() {

      let formArray = [];
      for (let key in this.state.lessonFormArray) {
        formArray.push({
          id: key,
          config: this.state.lessonFormArray[key]
        });
      }
      

      let form = (
        <div>
          <Mutation
            mutation={this.props.editmode ? UPDATE_LESSON : ADD_LESSON}
            onCompleted={data => this.completed(data)}>
              {createQuiz => (
                <form 
                  onSubmit={e => {
                    e.preventDefault();
                    if (!this.props.user) {
                        this.props.togglemodal();
                      } else {
                        const title = this.state.title.value;
                        const stateSentences = [...this.state.lessonFormArray];
                        const sentences = stateSentences.map( sntnc => {
                          let rObj = {};
                          let alts =[];
                          rObj['answer'] = sntnc.answer.value;
                          rObj['sentence'] = sntnc.sentence.value;
                          rObj['hint'] = sntnc.hint.value;
                          rObj['alts'] = alts;
                          for (let i = 0; i < sntnc.alts.array.length; i++){
                            if (sntnc.alts.array[i].value !== ""){
                              alts.push(sntnc.alts.array[i].value);
                            }
                          }
                      return rObj;  
                      });
                      
                        createQuiz({
                          variables: {
                          lessonID: this.state.lessonID,
                          title,
                          authorID: this.props.user.userID,
                          sentences}
                      });
                      }
                  }}>
                {formArray.map((formElement) => {
                  return (
                    <div className="InputSentenceWrapper" key={formElement.id}>
                      <p>{Number(formElement.id) + 1}</p>
                      <XMarkSVG onclick={(e) => this.removeSentence(formElement.id, e)} />


                    <InputSentence 
                      showPrompts={this.state.showDivs}
                      sentenceValue={formElement.config.sentence.value}
                      sentenceInvalid={!formElement.config.sentence.valid}
                      sentenceShouldValidate={formElement.config.sentence.validation}
                      sentenceTouched={formElement.config.sentence.touched}
                      sentenceChanged={(event) => this.inputChangedHandler(event, 'sentence', formElement.id)}
  
                      answerValue={formElement.config.answer.value}
                      answerInvalid={!formElement.config.answer.valid}
                      answerShouldValidate={formElement.config.answer.validation}
                      answerTouched={formElement.config.answer.touched}
                      answerChanged={(event) => this.inputChangedHandler(event, 'answer', formElement.id)}
      
                      hintValue={formElement.config.hint.value}
                      hintInvalid={!formElement.config.hint.valid}
                      hintShouldValidate={formElement.config.hint.validation}
                      hintTouched={formElement.config.hint.touched}
                      hintChanged={(event) => this.inputChangedHandler(event, 'hint', formElement.id)}

                    />
                  <div className="ElementAddWrapper">
                   {formElement.config.alts.length !== 0 ?  (
                    <div className="AltWrapper">{ formElement.config.alts.array.map( (alt, index) => (
                      <div key={index}>
              
                        <InputAlt 
                          onclick={(e) => this.removeAlt(formElement.id, index, e)}
                          altValue={alt.value}
                          altInvalid={!alt.valid}
                          altPlaceholder='Alternate answer'
                          altShouldValidate={alt.validation}
                          altTouched={alt.touched}
                          altChanged={(event) => this.inputChangedAltHandler(event, formElement.id, index)}
                        />
                 
                      </div>
                    ))}
                    </div> ) : null }
                    <div className="ElementAddButtonWrapper">
                      <button  className="ElementAddButton" disabled={this.state.addAltDisabled} onClick={(e) => this.addAlt(formElement.id, e)}>
                        <PlusSVG />
                      </button>
                      {this.state.showDivs ? <div className="Show">{this.state.message}</div> : null}
                    </div> 
                  </div>
            </div>
            )
          }
          )}
            
              <div className="ExerciseButton" disabled={this.state.addSentenceDisabled} onClick={() => this.addSentence()}>Add</div>
              <button className="CreateButton" type="submit" disabled={!this.state.formIsValid}>{this.props.editmode ? 'Update' : 'Create'}</button>
             </form>


            )}
            
          </Mutation>
        </div>
      );

    return (
      <div>
        <div className="CreateLesson">
         <button className="BackButtonCreate" onClick={() => this.back()}>{"<"} Back</button>
         <span className="QuestionMark" onClick={()=> this.showHelp()}>&#63;</span>
          <Prompt
            when={this.state.formIsHalfFilledOut}
            message="Are you sure you want to leave?"
          />
          <input
            className="LessonTitleInput"
            value={this.state.title.value}
            onChange={(e) => this.handleTitleChange(e)}
            placeholder="Quiz Title"
          />
          {this.state.showDivs ? <div className="ShowTitle">1. Add a Lesson Title</div> : null}
          <span>{this.state.title.validation.msg}</span>
          {this.state.showExample ? (
            <div className="ExampleSentence">
            <XMarkSVG onclick={() => this.showExample()} />
              <div className="ExampleKey">
                <ul>
                  <li>Key</li>
                  <li>Quiz Sentence: The quick brown fox jumps over the lazy dog.</li>
                  <li>Answer: jumps</li>
                  <li>Hint: jump</li>
                  <li>Alternate Answer: jumped</li>
                </ul>
              </div>
            <div className="ExampleSentenceHeader">Result</div>
              <Sentence 
                handlechange={(event) => this.inputExampleChangedHandler(event)}
                handlesubmit={(e) => this.handleCheckOnEnter(e)}
                value={this.state.exampleValue}
                sentence='The quick brown fox jumps over the lazy dog.' 
                correctanswer={this.state.exampleAnswer}
                message={this.state.exampleMsg}
                exercise='true' 
                placeholder='jump'
                onclick={(e) => this.handleCheckOnEnter(e)} />
            </div>
          ): <button className="ExerciseButton" onClick={() => this.showExample()}>Example</button>}
          {form}     
        </div>
        
      </div>
    )
  }
}

const ADD_LESSON = gql`
  mutation ($title: String!, $authorID: Int, $sentences: [SentenceInput]) {
    createQuiz( title: $title, authorID: $authorID, sentences: $sentences) {
      id
      created_at
      title
      authorID
      sentences {
        sentence
        hint
        answer
        alts
      }
      uniqid
    }
  }
`
const UPDATE_LESSON = gql`
  mutation ($lessonID: String!, $title: String!, $authorID: Int, $sentences: [SentenceInput]) {
    updateQuiz(lessonID: $lessonID, title: $title, authorID: $authorID, sentences: $sentences) {
      id
      created_at
      title
      authorID
      uniqid
      sentences {
        sentence
        hint
        answer
        alts
      }
    }
  }
`

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const Container = withRouter(CreateLesson);
export default connect(mapStateToProps)(Container);