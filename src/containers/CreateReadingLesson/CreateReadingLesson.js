import React, { Component } from 'react';
import { Prompt, withRouter } from 'react-router-dom';

import InputAlt from '../../components/InputAlt/InputAlt';
import InputReadingVocab from '../../components/InputReadingVocab/InputReadingVocab';
import InputReadingComp from '../../components/InputReadingComp/InputReadingComp';

import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';

import './CreateReadingLesson.css';

class CreateReadingLesson extends Component {
	constructor(props){
		super(props);
		this.state = {
			title: {
    			value: '',
    			validation: {
    			  required: true,
    			  msg: ''
    			},
    			valid: false,
    			touched: false	
    		},
    		textarea: {
    			value: '',
    			validation: {
    				required: true,
    				msg: ''
    			},
    			valid: false,
    			touched: false
    		},
    		lessonVocabForm: {
    			omission: {  
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
    			}
    		},
    		lessonCompForm: {
    			question: {  
    			  value: '',
    			  validation: {
    			    required: true,
    			     msg: ''
    			  },
    			  valid: false,
    			  touched: false
    			},
    			options:[{
    			  value: '',
    			  correct: false,
    			  validation: {
    			    required: false,
    			    msg: ''
    			  },
    			  valid: false,
    			  touched: false
    			},
    			{
    			  value: '',
    			  correct: false,
    			  validation: {
    			    required: false,
    			    msg: ''
    			  },
    			  valid: false,
    			  touched: false
    			},
    			{
    			  value: '',
    			  correct: false,
    			  validation: {
    			    required: false,
    			    msg: ''
    			  },
    			  valid: false,
    			  touched: false
    			},
    			{
    			  value: '',
    			  correct: false,
    			  validation: {
    			    required: false,
    			    msg: ''
    			  },
    			  valid: false,
    			  touched: false
    			}],
    			showDiv: false,
    			addAnswerDisabled: false
    		},
    		lessonFormArray: [],    	
    		formIsValid: false,
    		formIsHalfFilledOut: false,
    		lessonFormNum: 5,
    		readingModeVocab: false
		}
	}

	componentDidMount() {
		console.log('did mount triggered');
    	const lessonFormArray = [];
    	const lessonVocabForm = {...this.state.lessonVocabForm};
    	const lessonCompForm = {...this.state.lessonCompForm};
		if (this.state.readingModeVocab) {
			for (let i=0; i< this.state.lessonFormNum; i++) {
    	    	lessonFormArray.push(lessonVocabForm);
    		}
		} else {
		console.log('lesson comp form in did mount', lessonCompForm);
		for (let i = 0; i < this.state.lessonFormNum; i++ ) {
			lessonFormArray.push(lessonCompForm);
			}
		}
    	this.setState({lessonFormArray});
  	}

  	addForm = () => {
  		if (!this.state.readingModeVocab) {
  			const lessonCompForm = this.state.lessonCompForm;
  			const lessonFormArray = [...this.state.lessonFormArray];

  			lessonFormArray.push(lessonCompForm);

  			this.setState({
  				lessonFormArray
  			});
  		} else {
  			const lessonVocabForm = this.state.lessonVocabForm;
  			const lessonFormArray = [...this.state.lessonFormArray];

  			lessonFormArray.push(lessonVocabForm);

  			this.setState({
  				lessonFormArray
  			});
  		}
  		
  	}

  	altMouseOverEvent(index) {
    	const updatedLessonForms = [
    	  ...this.state.lessonFormArray
    	];
	
    	const updatedForm = {
    	  ...updatedLessonForms[index]
    	};
	
    	const updatedOptions = {
    	  ...updatedForm.options
    	}

    	updatedOptions.showDiv = !updatedOptions.showDiv;
    	
    	updatedForm.options = updatedOptions;
    	updatedLessonForms[index] = updatedForm;
    	
    	this.setState({ lessonFormArray: updatedLessonForms});
  }

  	removeVocabInput = (index) => {
  		const updatedLessonForms = [
      		...this.state.lessonFormArray
    	];
    	// eslint-disable-next-line
    	const removed = updatedLessonForms.splice(index, 1);
    	
    	
    	this.setState({
    	  lessonFormArray: updatedLessonForms,
    	}, () => {
    	  this.checkFormValidity();
    	});
  	}

  	toggleMode(e) {
  		e.preventDefault(e);
  		const lessonFormArray = [];
    	const lessonVocabForm = this.state.lessonVocabForm;
    	const lessonCompForm = this.state.lessonCompForm;
		if (!this.state.readingModeVocab) {
			for (let i=0; i< this.state.lessonFormNum; i++) {
    	    	lessonFormArray.push(lessonVocabForm);
    		}
		} else {
			for (let i=0; i < this.state.lessonFormNum; i++) {
				lessonFormArray.push(lessonCompForm);
			}
		}
    	this.setState( prevState => {
    		return { lessonFormArray, readingModeVocab: !prevState.readingModeVocab }
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
	
    	let formIsValid = this.checkFormValidity();
	
    	updatedTitle.validation = updatedTitleValidation;
	
    	this.setState({ title: updatedTitle, formIsHalfFilledOut: !formIsValid, formIsValid });
  	}

  	submit(e){
  		e.preventDefault(e);
  		console.log('submit triggered');
  	}

  	handleChange = (e) => {
  		const updatedTextarea = {
  			...this.state.textarea
  		};

  		updatedTextarea.value = e.target.value;

  		this.checkFormValidity();

  		this.setState({
  			textarea: updatedTextarea,
  			formIsHalfFilledOut: true,
  		});

  	}

  	addAnswer = (index) => {
    	  
    	let optionForm = {
    	  ...this.state.lessonCompForm.options[0]
    	};
	
    	const updatedLessonForms = [
    	  ...this.state.lessonFormArray
    	];
	
    	const updatedForm = {
    	  ...updatedLessonForms[index]
    	};
	
    	const updatedOptions = [
    	  ...updatedForm.options
    	];
	
    	// if (updatedOptions.length >= 4 ) {
    	//   this.setState({addAnswerDisabled: true});
    	// }
	
    	updatedOptions.push(optionForm);
	
    	updatedLessonForms[index] = updatedForm;
    	updatedForm.options = updatedOptions;   	
	
    	this.setState({
    	  lessonFormArray: updatedLessonForms,
    	}, () => {
    	  this.checkFormValidity();
    	});
  	}

  	removeAnswer = (index, answerIndex) => {
	
    	const updatedLessonForms = [
    	  ...this.state.lessonFormArray
    	];
	
    	const updatedForm = {
    	  ...updatedLessonForms[index]
    	};
	
    	const updatedOptions = [
    	  ...updatedForm.options
    	];

    	const removed = updatedOptions.splice(answerIndex, 1);
	
    	updatedLessonForms[index] = updatedForm;
    	updatedForm.options = updatedOptions;   	
	
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
        

         if (inputIdentifier === 'omission') {
            const textarea = this.state.textarea.value.toLowerCase().trim();
            const omission = event.target.value.toLowerCase().trim();
      		console.log('text area', textarea);
            let index = textarea.indexOf(omission);

            updatedValidation.msg = '';
            updatedElement.valid = false;
            
          

            if (omission === '') {
              updatedValidation.msg = 'add something';
              updatedElement.valid = false;
            } else if (index === -1 ) {
              updatedElement.valid = false;
              updatedValidation.msg = 'text to be omitted not found in passage';
            } else {
            	let indices = [];
            	while (index !== -1) {
            		indices.push(index);
            		index = textarea.indexOf(omission, index + 1)
            	}
              updatedElement.valid = true;
              updatedValidation.msg = `${indices.length} blocks of text will be omitted`;
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

        if (inputIdentifier === 'question') {
        	const answer = event.target.value.trim();
        	updatedValidation.msg = '';
        	if (answer === ''){
        		updatedValidation.msg = 'add a question';
        		updatedElement.valid = false;
        	} else if (answer.length >= 180 ) {
        		updatedValidation.msg = 'too long';
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

  	inputChangedAnswerHandler = (event, formIndex, index) => {
  		const updatedLessonForms = [
    	  ...this.state.lessonFormArray
    	];
	
    	const updatedForm = {
    	  ...updatedLessonForms[formIndex]
    	};
	
    	const updatedOptions = [
    	  ...updatedForm.options
    	];

    	const updatedOptionForm = {
    		...updatedOptions[index]
    	}

		const updatedValidation = {
			...updatedOptionForm.validation
		}

		updatedOptionForm.value = event.target.value;
		updatedValidation.msg = '';

		if (updatedOptionForm.value.trim() === '') {
    	  updatedValidation.msg = 'add a title';
    	  updatedValidation.valid = false;
    	} else if (updatedOptionForm.value.length >= 140) {
    	  updatedValidation.msg = 'answer is too long';
    	  updatedValidation.valid = false;
    	} else {
    	  updatedValidation.valid = true;
    	}

    	updatedOptionForm.validation = updatedValidation;
		updatedOptions[index] = updatedOptionForm;
    	updatedForm.options = updatedOptions;
    	updatedLessonForms[formIndex] = updatedForm;   	
	
    	this.setState({
    	  lessonFormArray: updatedLessonForms,
    	}, () => {
    	  this.checkFormValidity();
    	});
  	}

  	checkFormValidity = () => {
    	// const lessonFormArray = this.state.lessonFormArray;
    	// let formIsValid = true;
    	// for ( let i = 0; i < lessonFormArray.length; i++) {
    	//   for ( let property in lessonFormArray[i] ) {
    	    
    	//     formIsValid = lessonFormArray[i][property].valid && formIsValid && this.state.title.valid;
    	//   } 
    	// }
    	// if (formIsValid === true ){
    	//   this.setState({ formIsValid, formIsHalfFilledOut: false });
    	 
    	// } else {
    	//   this.setState({formIsValid, formIsHalfFilledOut: true });
    	 
    	// }

  	}


	render(){
		console.log('state', this.state);

		const formArray = [];
      	for (let key in this.state.lessonFormArray) {
        	formArray.push({
          		id: key,
          		config: this.state.lessonFormArray[key]
        	});
      	}
      	console.log('form array', formArray);

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
                        
                      }
                  }}>
                {formArray.map((formElement) => {
                  return (
                    <div className="InputSentenceWrapper" key={formElement.id}>
                      <p>{Number(formElement.id) + 1}</p>
                       <svg className="DeleteSentence" onClick={() => this.removeVocabInput(formElement.id)} 
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

                    	{this.state.readingModeVocab ? (
                    	<InputReadingVocab
  	
                    	  omissionValue={formElement.config.omission.value}
                    	  omissionInvalid={!formElement.config.omission.valid}
                    	  omissionShouldValidate={formElement.config.omission.validation}
                    	  omissionTouched={formElement.config.omission.touched}
                    	  omissionChanged={(event) => this.inputChangedHandler(event, 'omission', formElement.id)}
      	
                    	  hintValue={formElement.config.hint.value}
                    	  hintInvalid={!formElement.config.hint.valid}
                    	  hintShouldValidate={formElement.config.hint.validation}
                    	  hintTouched={formElement.config.hint.touched}
                    	  hintChanged={(event) => this.inputChangedHandler(event, 'hint', formElement.id)}
	
                    	/> ) : (
                    	<div className="InputWrapper">
	  						<input 
	  							className="InputQuestion"
	  							type="text"
	  							value={formElement.config.question.value}
	  							onChange={(event) => this.inputChangedHandler(event, 'question', formElement.id)}
	  							placeholder="Question"
	  						/>
	  						<p>{formElement.config.question.validation.msg}</p>
	  						
                      		<div className="AltAddWrapper">{formElement.config.options.map((option, index) => (
                      			<div key={index}>
              	
                        		<InputAlt 
                        		  onclick={(e) => this.removeAnswer(formElement.id, index, e)}
                        		  altValue={option.value}
                        		  altPlaceholder='Optional answer'
                        		  altInvalid={!option.valid}
                        		  altShouldValidate={option.validation}
                        		  altTouched={option.touched}
                        		  altChanged={(event) => this.inputChangedAnswerHandler(event, formElement.id, index)}
                        		/>
                 	
                      			</div>
                    		))}
                    		<div className="AddButtonWrapper" >
                    		  <svg className="AddSVG" 
                    		  	onClick={(e) => this.addAnswer(formElement.id, e)}
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
                    		</div>
                    	</div>
              			<div className={formElement.config.options.showDiv}>Add an Answer</div>
              		</div>
                    	)}
                    	
            		</div>
            		)
          		}
          	)}
            <div className="AddButtonWrapper" onClick={() => this.addForm()}>
                <svg className="AddForm" 
                  fill="#ccc" 
                  
                  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 510 510" width="30px" height="30px">
             
                <path d="M256 0C114.844 0 0 114.844 0 256s114.844 256 256 256 256-114.844 256-256S397.156 
                  0 256 0zm149.333 266.667a10.66 10.66 0 0 1-10.667 10.667H277.333v117.333a10.66 10.66 0 0 1-10.667
                  0.667h-21.333a10.66 10.66 0 0 1-10.667-10.667V277.333H117.333a10.66 10.66 0 0 1-10.667-10.667v-21.333a10.66 10.66
                  0 0 1 10.667-10.667h117.333V117.333a10.66 10.66 0 0 1 10.667-10.667h21.333a10.66 10.66 0 0 1 10.667 10.667v117.333h117.333a10.66
                  10.66 0 0 1 10.667 10.667v21.334z"/>
                </svg>
            </div>
            <button className="CreateButton" type="submit" disabled={!this.state.formIsValid}>Create</button>
            </form>
            )}
          </Mutation>
        </div>
        );
      		

		return (
			<div className="CreateLesson">
          		<Prompt
            		when={this.state.formIsHalfFilledOut}
            		message="Are you sure you want to leave?"
          		/>
          		<button className="ToggleReadingMode" onClick={(e)=> this.toggleMode(e)}>{this.state.readingModeVocab ? 'Switch to Comprehension Mode' : 'Switch to Vocabulary Mode' }</button>
          		<input
            		className="LessonTitleInput"
            		value={this.state.title.value}
            		onChange={(e) => this.handleTitleChange(e)}
            		type="text"
            		placeholder="Title"
          		/>
          		<p>{this.state.title.validation.msg}</p>
  				<textarea
  					value={this.state.textarea.value}
  					onChange={(e)=> this.handleChange(e)}
  					placeholder="Reading passage..."
  				/>
  				{form}
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

const Container = withRouter(CreateReadingLesson);
export default connect(mapStateToProps)(Container);