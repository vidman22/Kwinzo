import React, { Component } from 'react';
import InputSentence from '../../components/InputSentence/InputSentence';
import InputAlt from '../../components/InputAlt/InputAlt';
import {Prompt, withRouter} from 'react-router';
import './CreateLesson.css';

import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';

let showConst = null;

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
    addSentenceDisabled: false,
    formIsValid: false,
    addAltDisabled: false,
    lessonFormNum: 1,
    lessonFormArray: [],
    formIsHalfFilledOut: false,
    showExAnswer: false,
    showExample: false,
    showDivs: false,
    message: 'add alternate answer'
  }
 this.showExAnswer = this.showExAnswer.bind(this);
 this.checkFormValidity = this.checkFormValidity.bind(this);
 this.addAlt = this.addAlt.bind(this);
}

  

  componentDidMount() {
    
    const lessonFormArray = [];
      const lessonForm = {...this.state.lessonForm};

      for (let i=0; i< this.state.lessonFormNum; i++) {
        lessonFormArray.push(lessonForm);
      }
      this.setState({lessonFormArray});

      showConst = setInterval(this.showExAnswer, 6000);
      
  }

  componentWillUnmount() {
    clearInterval(showConst);
  }

  showExAnswer() {
    this.setState( prevState => {
      return { showExAnswer: !prevState.showExAnswer }
    })
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
            const sentence = updatedForm['sentence'].value.toLowerCase();
            const answer = event.target.value.toLowerCase().trim();
      
            const index = sentence.indexOf(answer);

            updatedValidation.msg = '';
            updatedElement.valid = false;

            if (answer === '') {
              updatedValidation.msg = 'add an answer';
              updatedElement.valid = false;
            } else if (index === -1 ) {
              updatedElement.valid = false;
              updatedValidation.msg = 'answer not found in sentence';
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
    } else if (updatedTitle.value.length >= 40) {
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
      this.setState({
        formIsHalfFilledOut: false
      }, () => {
        this.props.history.push(`/lessons/${data.createLessonSet.id}`);
      });
  }

  back() {
    this.props.history.push('/create-lesson');
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
    
    console.log('lessonFormArray', this.state.lessonFormArray);
    }
  }

  render() {
     
      const formArray = [];
      for (let key in this.state.lessonFormArray) {
        formArray.push({
          id: key,
          config: this.state.lessonFormArray[key]
        });
      }
      if (formArray !== 0 ){
      }
      
      console.log('lessonFormArray', this.state.lessonFormArray);
      let form = (
        <div>
          <Mutation
            mutation={ADD_LESSON}
            onCompleted={data => this.completed(data)}>
              {createLessonSet => (
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
                        createLessonSet({
                          variables: {
                          title,
                          author: this.props.user.name,
                          authorID: this.props.user.userID,
                          sentences}
                      });
                      }
                  }}>
                {formArray.map((formElement) => {
                  return (
                    <div className="InputSentenceWrapper" key={formElement.id}>
                      <p>{Number(formElement.id) + 1}</p>
                       <svg className="DeleteSentence" onClick={(e) => this.removeSentence(formElement.id, e)} 
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
                      </svg>

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
                        <svg className="ElementAdd" 
                          fill="#ccc" 
                          // onMouseOver={() => this.altMouseOverEvent(formElement.id)}
                          // onMouseOut={()=> this.altMouseOverEvent(formElement.id)}
                          xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 510 510" width="20px" height="20px">
                   
                        <path d="M256 0C114.844 0 0 114.844 0 256s114.844 256 256 256 256-114.844 256-256S397.156 
                         0 256 0zm149.333 266.667a10.66 10.66 0 0 1-10.667 10.667H277.333v117.333a10.66 10.66 0 0 1-10.667
                         0.667h-21.333a10.66 10.66 0 0 1-10.667-10.667V277.333H117.333a10.66 10.66 0 0 1-10.667-10.667v-21.333a10.66 10.66
                         0 0 1 10.667-10.667h117.333V117.333a10.66 10.66 0 0 1 10.667-10.667h21.333a10.66 10.66 0 0 1 10.667 10.667v117.333h117.333a10.66
                         10.66 0 0 1 10.667 10.667v21.334z"/>
                       </svg>
                      </button>
                      {this.state.showDivs ? <div className="Show">{this.state.message}</div> : null}
                    </div> 
                  </div>
            </div>
            )
          }
          )}
            
              <div className="ExerciseButton" disabled={this.state.addSentenceDisabled} onClick={() => this.addSentence()}>Add</div>
              <button className="CreateButton" type="submit" disabled={!this.state.formIsValid}>Create</button>
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
            type="text"
            placeholder="Title"
          />
          {this.state.showDivs ? <div className="ShowTitle">1. Add a Lesson Title</div> : null}
          <span>{this.state.title.validation.msg}</span>
          {this.state.showExample ? <div className="ExampleSentence">
            <div className="ExampleKey">
              <ul>
                <li>Example Input</li>
                <li>Sentence: The quick brown fox jumps over the lazy dog.</li>
                <li>Answer: jumps</li>
                <li>Hint: jump</li> 
              </ul>
            </div>
          <div className="ExampleSentenceHeader">Example Result</div>
          
          <div className="ExampleSentenceWrapper">
            <div className="FirstHalfExample">The quick brown fox</div>
            <div className="ExampleAnswerWrapper">
              {this.state.showExAnswer ?  <div className="TypedTextExample">jumps</div> : <div className="ExampleHint">jump</div> }
            <div className="SecondHalfExample">over the lazy dog.</div>
            </div>
          </div>
        </div> : null}
          {form}     
        </div>
        
      </div>
    )
  }
}

const ADD_LESSON = gql`
  mutation CreateLesson($title: String!, $author: String!, $authorID: String!, $sentences: [SentenceInput]) {
    createLessonSet( title: $title, author: $author, authorID: $authorID, sentences: $sentences) {
      id
      created
      title
      author
      authorID
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