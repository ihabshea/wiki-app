
import React, { useReducer, useContext, useState, useEffect } from 'react';
import AuthContext from '../context/auth';
import useEffectAsync from '../helpers/useEffectAsync';
import LangContext from '../language/languageContext';
import strings from '../language/localization';
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
const Header  = ({language}) => {
    const [modal, setModal] = useState(false);
    const context = useContext(AuthContext);
    const lContext = useContext(LangContext);
    const [loginForm, setLoginForm] = useState([{
      username: '',
      password : ''
    }]);
    const loginTo = async (username, password) => {
      console.log(username, password);

      const loginRequest = {
        query: `
        query{
          login(username: "${username}", password: "${password}"){
            userId
            token
            tokenExpiration
          }
        }
        `
      }
      await fetch('http://localhost:9000/graphql',
      {
        method: 'POST',
        body: JSON.stringify(loginRequest),
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
        if(resData.data.login.token){
          context.login(resData.data.login.token, resData.data.login.userId,resData.data.login.userId.tokenExpiration);
        }
          // if(resData.data.login.token){
          // }
      }).catch(err => {
        throw(err);
      });
    }
    useEffectAsync(async() => {
      await strings.setLanguage(localStorage.getItem("language"));
    });
    const toggle = () => { setModal(!modal); }
    const changeInput = (e) => {
      const name = e.target.name;
      const value = e.target.value;
      setLoginForm(loginForm => { return {...loginForm, [name]: value}})
    }
    return(
      <AuthContext.Consumer>
      {context => {
        return (
          <LangContext.Consumer>
          {lContext => {
  
            return (
          <div>
          <header>
            <div id="header-links">
              <a className="current" id="header-link"><img src="/img/home.png" /><span className="text">{strings.home}</span></a>
            </div>
            <div id="logo">
            WikiMVC
            </div>
            {!context.token &&
              <>
                 <button onClick={toggle} className="loginLink">Login</button>
                 <Modal isOpen={modal} toggle={toggle}>
                 <ModalHeader toggle={toggle}>Login</ModalHeader>
                 <ModalBody>
                  <Form >
                    <FormGroup>
                      <Label for="exampleEmail" hidden>Username</Label>
                      <Input type="text" name="username" value={loginForm.username} onChange={changeInput} id="exampleEmail" placeholder="Username" />
                      </FormGroup>
                      {' '}
                      <FormGroup>
                      <Label for="examplePassword" hidden>Password</Label>
                      <Input type="password" name="password" value={loginForm.password} onChange={changeInput} id="examplePassword" placeholder="Password" />
                    </FormGroup>
                  </Form>
                  </ModalBody>
                 <ModalFooter>
                   <button onClick={() => loginTo(loginForm.username, loginForm.password)} color="primary" >Login</button>{' '}
                   <Button color="secondary" onClick={toggle}>Cancel</Button>
                 </ModalFooter>
               </Modal>
              </>
            }
            <div style={{"clear":"right"}}></div>
          </header>
         </div>
            )
          }}
          </LangContext.Consumer>

        )
      }}

      </AuthContext.Consumer>
     );
  }

export default Header;
