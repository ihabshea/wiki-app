import './App.css';
import React, { useReducer, useContext, useState, useEffect } from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import { PropsRoute, PublicRoute, PrivateRoute } from 'react-router-with-props';
import AuthContext from './context/auth';
import Header from './pages/Header';
import Article from './pages/Article';
import MainPage from './pages/Mainpage'
import useEffectAsync from './helpers/useEffectAsync';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
 Button, Modal, ModalHeader, ModalBody, ModalFooter,
Col, Row, Form, Container, FormGroup, Label, Input, FormText, ListGroup, ListGroupItem, Jumbotron } from 'reactstrap';
const Context = React.createContext(null);


const currentPathReducer = (state,  action) =>{
  switch(action.type){
    case 'navigate':

  }
}
const appReducer = (state, action)  => {
    switch(action.type){
      case 'update':
      const updateRequest = {

      query : `
      mutation{
          updateCharacter(characterInput: {

          }){

          }
        }
      `
    };
      return fetch('http://localhost:9000/graphql',

      {
        method: 'POST',
        body: JSON.stringify(updateRequest),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then( res => {
        if(res.status !== 200 && res.status !== 201){
          throw new Error('failed');
        }
        return res.json();

    }).then(resData => {
      return resData.data.characters;
    }).catch(err => {
      throw(err);
    });
    case 'topArticles':
      const retrieveQuery = {
        query: `
          query {

          }
        `
      }
      default:
        return state;
    }
  }


const App = () => {
const [articles, dispatch] = useReducer(appReducer,  []);
const [loginState, updateToken] = useState({
  token: null,
  userId: null,
  tokenExpiration: null
});
useEffect(()=> {

      if(localStorage.getItem('login')){
          updateToken(JSON.parse(localStorage.getItem('login')));
      }


}, []);
// useEffect(()=> {
//   localStorage.setItem('login', JSON.stringify(loginState));
// },[loginState])
const loginFunction = async (token, userId, tokenExpiration) => {
  try{
    const t = {token: token, userId: userId, tokenExpiration:  tokenExpiration};
    await updateToken(t);
    console.log(t);
    localStorage.setItem('login', JSON.stringify(t));
    console.log(JSON.parse(localStorage.getItem('login')))
  }catch(error){

  }
}

const logoutFunction = () => {

}
  return(
    <Router>
      <Context.Provider value={dispatch}>
        <AuthContext.Provider value={{token: loginState.token, userId: loginState.userId, login: loginFunction, logout: logoutFunction}}>
        <Header />
        <PropsRoute exact path="/" component={MainPage} loginState={loginState} articles={articles} />
        <PropsRoute path="/article/:id" component={Article} />
        </AuthContext.Provider>

      </Context.Provider>
    </Router>

  )
}

export default App;
