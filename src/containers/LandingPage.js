import React, { Component } from 'react';
import { NavLink, Link, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import logo from "../assets/svg/kwinzo.svg";
import './LandingPage.css';
import * as actions from '../store/actions';

import Auth from './Auth/Auth';
import AuthModal from '../components/AuthModal/AuthModal';
import Backdrop from '../components/Backdrop/Backdrop';
import CreateLesson from './CreateLesson/CreateLesson';
import CreateLessonLanding from '../components/CreateLessonLanding/CreateLessonLanding';
import CreateReadingLesson from './CreateReadingLesson/CreateReadingLesson';
import Home from '../components/Home/Home';
import Lesson from './Lesson/Lesson';
import Lessons from './Lessons/Lessons';
import ReadingCompLesson from './ReadingCompLesson/ReadingCompLesson';
import ReadingOmissionLesson from './ReadingOmissionLesson/ReadingOmissionLesson';
import SoloGame from './SoloGame/SoloGame';
import UserDropdown from '../components/UserDropdown/UserDropdown';
import UserPage from './UserPage/UserPage';
import WaitingPage from './WaitingPage/WaitingPage';
import WordBank from './WordBank/WordBank';


class LandingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authModal: false,
      displayMenuStyle: 'NavClose',
    }
  }

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  toggleModal() {
    this.setState( prevState => {
      return { authModal: !prevState.authModal }
    });
  }

  toggleMenu(){
    
    if (this.state.displayMenuStyle === 'NavClose'){
      this.setState({ displayMenuStyle: 'NavOpen'});
    } else {
      this.setState({ displayMenuStyle: 'NavClose'});
    }

  }

  logout() {
    this.props.history.push('/');
    this.props.logout();
  }


  render() {
      const cssClasses = [
        "MobileNavLinks",
        this.state.displayMenuStyle
      ];
        return (
           <div className="Landing">
            <div className="Wrapper">
                <header className="Header">
                    <NavLink 
                        to={{
                        pathname: '/'
                    }}exact> <img 
                        className="LogoImage"
                        src={logo}
                        width="100px" 
                        height="120px"
                        alt="logo" 
                    /><h1>Kwinzo</h1></NavLink>
                    <p>Quiz to win</p>
                      {this.props.user ?
                        <UserDropdown
                          user={this.props.user}
                          picture={this.props.user.picture}
                          logout={() => this.logout()}
                        />
                        :
                         <svg
                          className="AuthSvg" 
                          id="last"
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 300 300" 
                          x="0" 
                          y="0" 
                          height="35" 
                          width="35"
                          onClick={()=> this.toggleModal()}>
                          <path d="M149.996 0C67.157 0 .001 67.158.001 149.997c0 82.837 67.156 150 
                          149.995 150s150-67.163 150-150C299.996 67.156 232.835 0 149.996 0zm.457 
                          220.763v-.002H85.465c0-46.856 41.152-46.845 50.284-59.097l1.045-5.587c-12.83-6.502-21.887-22.178-21.887-40.512 
                          0-24.154 15.712-43.738 35.089-43.738s35.089 19.584 35.089 43.738c0 18.178-8.896 33.756-21.555 40.361l1.19 
                          6.349c10.019 11.658 49.802 12.418 49.802 58.488h-64.069z"/></svg> 
                        }
                        
                          
                        
                        <nav>
                            <ul>
                             <li><NavLink 
                              to={{
                                pathname: '/create-lesson'
                             }}
                             activeStyle={{
                                color:'#323232'}} id='second'>Create</NavLink></li>

                             <li><NavLink
                              to={{
                                pathname: '/lessons'
                             }}
                             activeStyle={{
                                color:'#323232'}}>Lessons</NavLink></li>

                             </ul>
                        </nav>
                        <div className="MobileWrapper">
                          <div className={cssClasses.join(' ')}>
                             <div className="MobileLink"><Link 
                              to={{
                                pathname: '/create-lesson'
                             }}>Create</Link></div>

                             <div className="MobileLink"><Link
                              to={{
                                pathname: '/lessons'
                             }}>Lessons</Link></div>

                            {this.props.user ? <div className="MobileLink"><Link
                              to={{
                                pathname: `/user/${this.props.user.userID}`
                             }}>My Page</Link></div> : <div className="MobileLogin" onClick={()=> this.toggleModal()}>Login</div>}

                            {this.props.user ? <div className="MobileLogin" onClick={() => this.logout()}>Logout</div> : null}
                          </div>
                          <div className="HamburgerIcon" onClick={() => this.toggleMenu()}><i className="fa fa-bars"></i></div>
                        </div>

                </header>
            
               <Switch> 
                <Route exact path="/create-lesson" render={() => <CreateLessonLanding togglemodal={() => this.toggleModal()}/> } />
                <Route path="/create-lesson/reading" render={() => <CreateReadingLesson togglemodal={() => this.toggleModal()}/> } />
                <Route path="/create-lesson/exercise" render={() => <CreateLesson togglemodal={() => this.toggleModal()}/> } />
                <Route path="/login" component={Auth} />
                <Route path="/lessons/:id" component={Lesson}/>
                <Route path="/reading-comp-lesson/:id" component={ReadingCompLesson} />
                <Route path="/reading-omission-lesson/:id" component={ReadingOmissionLesson} />
                <Route path="/solo-play/:id" render={() => <SoloGame lesson= {this.props.lesson} /> } />
                <Route path="/host-game/:id" render={() => <WaitingPage lesson= {this.props.lesson} /> } />
                <Route path="/lessons" component={Lessons} />
                <Route path="/user/:user" component={() => <UserPage user={this.props.user} />} />
                <Route path="/word-bank/:id" render={() => <WordBank lesson = {this.props.lesson } /> } />
                <Route path="/" component={Lessons} />
               </Switch>
               {this.state.authModal ? <AuthModal togglemodal={() => this.toggleModal()} show={this.state.authModal} /> : null}
               {this.state.authModal ? <Backdrop show={this.state.authModal}/> : null }
              </div>
            <footer className="Footer">
                    <ul>
                        <li><NavLink to={{
                            pathname: ''
                        }}><h3>About</h3></NavLink></li>

                        <li><NavLink to={{
                            pathname: ''
                        }}><h3>Contact</h3></NavLink></li>

                        <li><NavLink to={{
                            pathname: ''       
                        }}><h3>Features</h3></NavLink></li>

                    </ul> 
                    <p>&copy; JVidmar 2018</p>
            </footer>
                  
        </div>
        );
    }
}
const matchDispatchToState = dispatch => {
  return {
    logout: () => dispatch(actions.logout()),
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

const mapStateToProps = state => {
  return {
    lesson: state.lessonSet,
    user: state.user
  }
}

export default withRouter(connect(mapStateToProps, matchDispatchToState )(LandingPage));