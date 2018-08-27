import React, { Component } from 'react';
import {Prompt} from 'react-router-dom';

import './CreateReadingLesson.css';

class CreateReadingLesson extends Component {
	constructor(props){
		super(props);
		this.state = {
			title: {
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
    		formIsValid: false,
    		formIsHalfFilledOut: false,
		}
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
		return (
			<div className="CreateLesson">
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
          		<form onSubmit={(e) => this.submit(e)}>
  					<textarea>Some text...</textarea>
  					<button type="submit" className="CreateButton">Create</button>
				</form>
			</div>
			)
	}
}

export default CreateReadingLesson;