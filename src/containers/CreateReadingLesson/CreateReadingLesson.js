import React, { Component } from 'react';
import { Prompt, withRouter } from 'react-router-dom';

import InputReadingOmission from '../../components/InputReadingVocab/InputReadingVocab';
import InputCompOption from '../../components/InputCompOption/InputCompOption';
import MinusSVG from '../../components/SVG/MinusSVG';
import PlusSVG from '../../components/SVG/PlusSVG';
import XMarkSVG from '../../components/SVG/XMarkSVG';

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
          checkedOption: -1,
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
					highlight:{
						show: false,
						value:'',
						validation: {
							required: false,
							msg: ''
						},
						indices: [],
						valid: true,
						touched: false
					},
    			showDiv: 'Hide',
    			addAnswerDisabled: false
    		},
    		lessonFormArray: [],    	
    		formIsValid: false,
    		formIsHalfFilledOut: false,
    		lessonFormNum: 1,
				readingModeOmission: false,
				showHighlightOption: false,
		}
	}

	componentDidMount() {

    	const lessonFormArray = [];
    	const lessonVocabForm = {...this.state.lessonVocabForm};
    	const lessonCompForm = {...this.state.lessonCompForm};
		if (this.state.readingModeOmission) {
			for (let i=0; i< this.state.lessonFormNum; i++) {
    	    	lessonFormArray.push(lessonVocabForm);
    		}
		} else {

		for (let i = 0; i < this.state.lessonFormNum; i++ ) {
			lessonFormArray.push(lessonCompForm);
			}
		}
    	this.setState({lessonFormArray});
  	}

  	addForm = () => {
  		if (!this.state.readingModeOmission) {
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

  	optionMouseOverEvent(index) {
    	const updatedLessonForms = [
    	  ...this.state.lessonFormArray
    	];
	
    	const updatedForm = {
    	  ...updatedLessonForms[index]
    	};
	
      if (updatedForm.showDiv === 'Hide') {
       updatedForm.showDiv = 'ShowDiv';
      } else {
       updatedForm.showDiv = 'Hide'; 
      }
    	
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
		if (!this.state.readingModeOmission) {
			for (let i=0; i< this.state.lessonFormNum; i++) {
    	    	lessonFormArray.push(lessonVocabForm);
    		}
		} else {
			for (let i=0; i < this.state.lessonFormNum; i++) {
				lessonFormArray.push(lessonCompForm);
			}
		}
    	this.setState( prevState => {
				return { 
					showHighlightOption: false,
					lessonFormArray, 
					readingModeOmission: !prevState.readingModeOmission }
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
	
    	this.setState({ title: updatedTitle} , () => {
        this.checkFormValidity()
      });
  	}

  	submit(e){
  		e.preventDefault(e);

  	}

  	handleChange = (e) => {
  		const updatedTextarea = {
  			...this.state.textarea
  		};

  		const updatedValidation = {
  			...updatedTextarea.validation
  		}

  		updatedTextarea.value = e.target.value;

  		if (updatedTextarea.value.trim() === '') {
    	  updatedValidation.msg = 'add your text';
    	  updatedTextarea.valid = false;
    	} else if (updatedTextarea.value.length >= 5440) {
    	  updatedValidation.msg = 'text is too long';
    	  updatedTextarea.valid = false;
    	} else {
    	  updatedTextarea.valid = true;
    	}

    	updatedTextarea.validation = updatedValidation;

  		this.setState({
  			textarea: updatedTextarea,
  			formIsHalfFilledOut: true,
  		}, () => {
    	  this.checkFormValidity();
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

	    updatedForm.options = updatedOptions;  
    	updatedLessonForms[index] = updatedForm;
	
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
    	// eslint-disable-next-line
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
              updatedValidation.msg = `${indices.length} block(s) of text will be omitted`;
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
				
				if (inputIdentifier === 'highlight') {
					const textarea = this.state.textarea.value.toLowerCase().trim();
					const highlight = event.target.value.toLowerCase().trim();

					let index = textarea.indexOf(highlight);

					updatedValidation.msg = '';
					updatedElement.valid = false;
					
				

					if (highlight === '') {
						updatedValidation.msg = '';
						updatedElement.valid = false;
					} else if (index === -1 ) {
						updatedElement.valid = false;
						updatedValidation.msg = 'text to be highlighted not found in passage';
					} else {
						let indices = [];
						while (index !== -1) {
							indices.push(index);
							index = textarea.indexOf(highlight, index + 1)
						}
						
						updatedElement.indices = indices;
						updatedElement.valid = true;
						updatedValidation.msg = `${indices.length} block(s) of text will be highlighted`;
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
    	  updatedValidation.msg = 'add an answer';
    	  updatedOptionForm.valid = false;
    	} else if (updatedOptionForm.value.length >= 140) {
    	  updatedValidation.msg = 'answer is too long';
    	  updatedOptionForm.valid = false;
    	} else {
    	  updatedOptionForm.valid = true;
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
		
		// highlightText = (index) => {
		// 	this.setState({
		// 		showHighlightOption: true,
		// 	});
		// };

		toggleHighlight = (index) => {
			const updatedLessonForms = [
				...this.state.lessonFormArray
			];

			const updatedForm = {
				...updatedLessonForms[index]
			};

			const updatedFormHighlight = {
				...updatedForm.highlight
			};
			updatedFormHighlight.show = !updatedFormHighlight.show;

			updatedForm.highlight = updatedFormHighlight;
			updatedLessonForms[index] = updatedForm;
			this.setState({
				lessonFormArray: updatedLessonForms
			});
		}

  	optionChecked = (formIndex, index) => {

  		const updatedLessonForms = [
    	  ...this.state.lessonFormArray
    	];
	
    	const updatedForm = {
    	  ...updatedLessonForms[formIndex]
    	};
	

    	updatedForm.checkedOption = index;

    	updatedLessonForms[formIndex] = updatedForm;   	
	
    	this.setState({
    	  lessonFormArray: updatedLessonForms,
    	}, () => {
    	  this.checkFormValidity();
    	});
  	}

  	checkFormValidity = () => {
    	const lessonFormArray = this.state.lessonFormArray;
    	let formIsValid = true;

    	if (this.state.readingModeOmission) {
    		for ( let i = 0; i < lessonFormArray.length; i++) {
    		  for ( let property in lessonFormArray[i] ) {
    		    formIsValid = lessonFormArray[i][property].valid && formIsValid && this.state.title.valid && this.state.textarea.valid;
    		  } 
    		}
    	} else {
    		for ( let i = 0; i < lessonFormArray.length; i++) {
    			for ( let j = 0; j < lessonFormArray[i]['options'].length; j++) {
    				formIsValid = lessonFormArray[i]['options'][j].valid && lessonFormArray[i]['question'].valid && formIsValid && this.state.title.valid && this.state.textarea.valid;
    			}
    		  } 
    		}
    	if (formIsValid === true ){
    	  this.setState({ formIsValid, formIsHalfFilledOut: false });
    	 
    	} else {
    	  this.setState({formIsValid, formIsHalfFilledOut: true });
    	}
  	}

  	formData() {
  		
  		const form = [...this.state.lessonFormArray];
  		if (this.state.readingModeOmission){
  			let omissions = []
  			for ( let i = 0; i < form.length; i++) {
  				let obj = {
  					omission: form[i].omission.value,
  					hint: form[i].hint.value
  				}
  				omissions.push(obj)
  			}
  			return omissions
  		} else {
  			const questions = form.map( element => {
  				let rObj = {};
  				let options = [];
  				rObj['question'] = element.question.value;
          rObj['checkedOption'] = -1;
  				rObj['options'] = options;
					rObj['correctOption'] = element.checkedOption;
					rObj['highlight'] =  element.highlight.value;
  				for ( let i = 0; i < element.options.length; i ++ ){
  					options.push(element.options[i].value);
  				}
  				return rObj
  			});
  			return questions
  		}
  			
  	}formElement

  	completed(data){

      let urlPath;
      let lessonType;
      if ( this.state.readingModeOmission === true) {
        urlPath = 'reading-omission-lesson';
        lessonType = 'createReadingOmissionLesson'
      } else {
        urlPath = 'reading-comp-lesson';
        lessonType = 'createReadingCompLesson';
      }
      this.props.history.push(`/${urlPath}/${data[lessonType].uniqid}`);
  	}
    
    back() {
      this.props.history.push('/create-lesson');
    }

	render(){

		const formArray = [];
      	for (let key in this.state.lessonFormArray) {
        	formArray.push({
          		id: key,
          		config: this.state.lessonFormArray[key]
        	});
      	}
      	const ADD_LESSON = this.state.readingModeOmission ? ADD_OMISSION_LESSON : ADD_COMP_LESSON;


      	let form = (
      		
      	<div>
          <Mutation
            mutation={ADD_LESSON}
            onCompleted={data => this.completed(data)}>
              {mutation => (
                <form 
                  onSubmit={e => {
                    e.preventDefault();
                    if (!this.props.user) {
                        this.props.togglemodal();
                      } else {
                        const title = this.state.title.value;
  						const text = this.state.textarea.value;
  						const authorID = this.props.user.id;
 						  const data = this.formData();
  						if (this.state.readingModeOmission) {
  							mutation({
  								variables: {
  									title,
  									authorID,
  									text,
  									omissions: data
  								}
  							});
  						} else {
  							mutation({
  								variables: {
  									title,
  									authorID,
  									text,
  									questions: data
  								}
  							});
  						}
                      }
                  }}>
                {formArray.map((formElement) => {
                  return (
                    <div className="InputReadingSentenceWrapper" key={formElement.id}>
                      <p>{Number(formElement.id) + 1}</p>
											<XMarkSVG onclick={() => this.removeVocabInput(formElement.id)} />
                    	{this.state.readingModeOmission ? (
                    	<InputReadingOmission
  	
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
	  						         
                          <div className="ElementAddWrapper">{formElement.config.options.map((option, index) => (
                              <div key={index}>
              	         
                                <InputCompOption
                                  checked={formElement.config.checkedOption}
                                  index={index}
                                  onclick={(e) => this.removeAnswer(formElement.id, index, e)}
                                  oncheck={() => this.optionChecked(formElement.id, index)}
                                  optionValue={option.value}
                                  optionPlaceholder='Option'
                                  optionInvalid={!option.valid}
                                  optionShouldValidate={option.validation}
                                  optionTouched={option.touched}
                                  optionChanged={(event) => this.inputChangedAnswerHandler(event, formElement.id, index)}
                                />
                              </div>
                          ))}
                              <div className="ElementAddReadingButtonWrapper" >
																<PlusSVG onclick={(e) => this.addAnswer(formElement.id, e)} />
                              </div>
                              	</div>
              	         		<div className={formElement.config.showDiv}>Add an Option</div>
														 {formElement.config.highlight.show ? (
															<div className="InputHighlightWrapper">
															 <input
																 className="InputHighlight"
																 type="text"
																 value={formElement.config.highlight.value}
																 onChange={(event)=> this.inputChangedHandler(event, 'highlight', formElement.id)}
																 placeholder="Highlighted text"
																/>
																<MinusSVG onclick={() => this.toggleHighlight(formElement.id)} />
																<p>{formElement.config.highlight.validation.msg}</p>
															 </div>
														 ): <button
														 			type="button" 
																	onClick={()=> this.toggleHighlight(formElement.id)} 
																	className="AddHighlight">Add Highlight for Question
																</button>}
              		    </div>
											
                    	)}
	
            		</div>
            		)
          		}
          	)}
            <div className="ExerciseButton" onClick={() => this.addForm()}>
                Add
            </div>
            <button className="CreateButton" type="submit" disabled={!this.state.formIsValid}>Create</button>
            </form>
            )}
          </Mutation>
        </div>
        );
      		

		return (
			<div className="CreateReadingLesson">
        <button className="BackButton" onClick={() => this.back()}>{"<"} Back</button>
          		<Prompt
            		when={this.state.formIsHalfFilledOut}
            		message="Are you sure you want to leave?"
          		/>
          		<button className="ToggleReadingMode" onClick={(e)=> this.toggleMode(e)}>{this.state.readingModeOmission ? 'Switch to Comprehension Mode' : 'Switch to Omission Mode' }</button>
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

const ADD_OMISSION_LESSON = gql`
  mutation CreateLessonMutation($title: String!, $authorID: String!, $text: String!, $omissions: [OmissionInput]) {
    createReadingOmissionLesson( title: $title, authorID: $authorID, text: $text, omissions: $omissions) {

      created_at
      title
      authorID
      text
      omissions {
        omission
        hint
      }
    }
  }
`
const ADD_COMP_LESSON = gql`
  mutation CreateLessonMutation($title: String!, $authorID: String!, $text: String!, $questions: [QuestionInput]) {
    createReadingCompLesson( title: $title, authorID: $authorID, text: $text, questions: $questions) {

      created_at
      title
      authorID
      text
      questions {
        question
        checkedOption
        correctOption
				options
				highlight
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