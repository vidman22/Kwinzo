import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Mutation, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import './Auth.css';

import * as actions from '../../store/actions';

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
        token
        expiresIn
        user {
            email
            username
            userID
            picture
        }
    }
}
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        expiresIn
        user {
            email
            username
            userID
            picture
        }
    }
}
`;

class Auth extends Component {
    constructor(props){
        super(props);
    this.state = {
      form: {
        username: {
            value:'',
            valid: false,
            touched: false,
            msg: '',
            style: '',
        },
        password: {
            value:'',
            valid: false,
            touched: false,
            msg: '',
            style: '',
        },
        email: {
            value:'',
            valid: false,
            touched: false,
            msg: '',
            style: '',
        }
      },
        formIsValid: false,
        isLogin: true
    }
    this.checkValidity = this.checkValidity.bind(this);
  } 


    checkValidity () {
       const updatedForm = this.state.form;
       let formIsValid = true;

        for (let property in updatedForm ) {
            formIsValid = updatedForm[property].valid && formIsValid;
        }
        this.setState({formIsValid});
    }

    inputChangedHandler = ( event, controlName ) => {
        const updatedForm = {
            ...this.state.form
        }

        const updatedElement = {
            ...updatedForm[controlName]
        }


        updatedElement.value = event.target.value;

        if (controlName === 'username') {
            let value = updatedElement.value.trim();
            if (value === '') {
                updatedElement.msg = 'add a name';
                updatedElement.valid = false;
            } else if (value.length > 22 ) {
                updatedElement.msg = 'add a shorter name';
                updatedElement.valid = false;
            } else {
                updatedElement.valid = true;
                updatedElement.msg = '';
            } 
        }

        if (controlName === 'email') {
            let value = updatedElement.value.trim();
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            const isValid = pattern.test( value );
            if (isValid) {
                updatedElement.valid = true;
                updatedElement.msg = '';
            } else {
                updatedElement.msg = 'add a valid email';
                updatedElement.valid = false;
            }
        }

        if (controlName === 'password') {
            let value = updatedElement.value.trim();
            const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
            const isValid = pattern.test( value );
            if (isValid) {
                updatedElement.valid = true;
                updatedElement.msg = '';
            } else {
                updatedElement.msg = 'use 8 characters - at least one letter, number, and symbol';
                updatedElement.valid = false;
            }

        }

        updatedElement.touched = true;

        updatedForm[controlName] = updatedElement;

        this.setState({ 
            form : updatedForm 
        },() => {
            this.checkValidity(); 
        });
        
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin};
        });
    }

    _oAuthMutation = async (email, username, picture, userID, token, expiresIn) => {
        try{
        await this.props.oAuthMutation({
            variables: {
                email,
                username,
                picture,
                userID,
                token,
                expiresIn
            }
        })
        } catch (err) {
        console.log(err);
        }    
    }

    completed = (data) => {
        this.props.togglemodal();
        
        let email;
        let username;
        let picture;
        let userID;
        let token;
        let expiresIn;

        for (let property in data) {
           email = data[property].user.email;
           username = data[property].user.username;
           picture = data[property].user.picture;
           userID = data[property].user.userID;
           token = data[property].token;
           expiresIn = data[property].expiresIn;
        }
        this.props.onAuth(email, username, picture, userID, token, expiresIn);
    }

    render () {
        const login = this.state.isLogin;
        const username = this.state.form.username.value;
        const email = this.state.form.email.value;
        const password = this.state.form.password.value;
  

        const responseGoogle = (response) => {
        
            const email = response.profileObj.email;
            const username = response.profileObj.givenName;
            const picture = response.profileObj.imageUrl;
            const userID = response.profileObj.googleId;
            const token = response.tokenId;
            const expiresIn = response.tokenObj.expires_in;

            this.props.onAuth(email, username, picture, userID, token, expiresIn);  
            this.props.togglemodal();
            this._oAuthMutation(email, username, picture, userID, token, expiresIn);

        }
        const responseFacebook = (response) => {
            
            const token = response.accessToken;
            this.props.onAuth( response.email, response.name, response.picture.data.url, response.id, token, response.expiresIn);
            this.props.togglemodal();
            this._oAuthMutation(response.email, response.name, response.picture.data.url, response.id, token, response.expiresIn);
        }



        return (

            <div className="Auth">
             <Mutation
                mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
                onCompleted={data => this.completed(data)}
             >
                {(mutation, {loading, error}) => (
                <div>
                    {login ? <h2>Login</h2> : <h2>Sign Up</h2>}
                    <form onSubmit={e => {
                        e.preventDefault();
                        mutation({variables: { username, email, password} });
                        }}>
                    {!login && (
                      <div>
                        <input
                            className={this.state.form.username.style}  
                            value={this.state.form.username.value}
                            onChange={( e ) => this.inputChangedHandler(e , 'username')}
                            type="text"
                            placeholder="username"
                        />
                        <p>{this.state.form.username.msg}</p>
                      </div>
                    )}
                    <input
                        className={this.state.form.email.style} 
                        value={this.state.form.email.value}
                        onChange={( e ) => this.inputChangedHandler(e , 'email')}
                        type="email"
                        placeholder="email"
                    />
                    <p>{this.state.form.email.msg}</p>
                    <input
                        className={this.state.form.password.style}  
                        value={this.state.form.password.value}
                        onChange={( e ) => this.inputChangedHandler(e , 'password')}
                        type="password"
                        placeholder="password"
                    />
                    <p>{this.state.form.password.msg}</p>
                        <button type="submit" className="AuthButton" disabled={!this.state.formIsValid}>
                            {login ? 'LOGIN' : 'CREATE AN ACCOUNT'}
                        </button>
                </form>
                {loading && <div className="spinner spinner-1"></div>}
                {error && <p>Error</p>}
               </div>    
             )}
             </Mutation>
                
              <button className="AuthButton" onClick={this.switchAuthModeHandler}>SWITCH TO { login ? 'SIGNUP' : 'LOGIN'}</button>
                
                    <GoogleLogin
                        
                        clientId='99023560874-es09obh5s0o70hd5j3lstp9lagsq395d.apps.googleusercontent.com'
                        buttonText={`${login ? 'Login' : 'Sign up' } with Google`}
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        render={ renderProps => (
                          
                            <div className="GoogleLogin" onClick={renderProps.onClick}>
                                <svg
                                className="GoogleSVG" 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24"
                                viewBox="0 0 48 48" >
                                <path d="M43.61 20.082H42V20H24v8h11.305c-1.653 4.656-6.082 8-11.305 
                                 8-6.629 0-12-5.371-12-12s5.371-12 12-12c3.059 0 5.844 1.152 7.96 3.04l5.657-5.657C34.047 
                                    6.055 29.27 4 24 4 12.953 4 4 12.953 4 24s8.953 20 20 20 20-8.953 20-20c0-1.34-.137-2.648-.39-3.918z"
                                    fill="#ffc107"/><path d="M6.305 14.691l6.574 4.82C14.656 15.11 18.96 12 24 12c3.059 0 5.844 1.152 7.96 
                                    3.04l5.657-5.657C34.047 6.055 29.27 4 24 4 16.316 4 9.656 8.336 6.305 14.691z" fill="#ff3d00"/><path d="M24 
                                    44c5.164 0 9.86-1.977 13.41-5.191L31.22 33.57A11.918 11.918 0 0 1 24 36c-5.203 0-9.617-3.316-11.281-7.945l-6.524
                                    5.023C9.504 39.555 16.227 44 24 44z" fill="#4caf50"/><path d="M43.61 20.082H42V20H24v8h11.305a12.054 12.054 0 0 
                                    1-4.09 5.57h.004l6.191 5.239C36.973 39.203 44 34 44 24c0-1.34-.137-2.648-.39-3.918z" fill="#1976d2"/>
                                </svg>
                                <div className="GoogleText">{login ? 'Login' : 'Sign up'} with Google</div>
                            </div> 
                    )}/> 

                <FacebookLogin
                    
                    appId="652524795116405"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebook} 
                    render={renderProps => (
                    <div className="FacebookLogin" onClick={renderProps.onClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        className="FacebookSVG"
                        viewBox="0 0 24 24" 
                        width="24" 
                        height="24" 
                        fill="#4f60bd">
                        <path d="M17.525 9H14V7c0-1.032.084-1.682 1.563-1.682h1.868v-3.18A26.065 26.065 0 0 0 14.693 2C11.98 
                        2 10 3.657 10 6.699V9H7v4l3-.001V22h4v-9.003l3.066-.001L17.525 9z"/></svg>
                        <div className="FacebookText">{login ? 'Login' : 'Sign up'} with Facebook</div>
                    </div>
                )}/>
            </div>
        );
    }
};

const OAUTH_MUTATION = gql`
    mutation OauthMutation( $email: String!, $username: String!, $picture: String, $userID: String!, $token: String!, $expiresIn: String! ) {
        oAuthSignIn( email: $email, username: $username, picture: $picture, userID: $userID, token: $token, expiresIn: $expiresIn) {
            token
            expiresIn
            user {
                email
                username
                userID
                picture
            }
        }
    }
`;



const mapDispatchToProps = dispatch => {
    return {
        onAuth:( email, name, picture, userID, token, expiresIn ) => dispatch( actions.authSuccess(email, name, picture, userID, token, expiresIn))
    };
};
const Container = graphql(OAUTH_MUTATION, {name: 'oAuthMutation'})(Auth);
export default connect( null , mapDispatchToProps )( Container );