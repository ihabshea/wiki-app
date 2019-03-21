import React, { useReducer, useContext, useState, useEffect } from 'react';
import AuthContext from '../context/auth';
import LangContext from '../language/languageContext';
import strings from '../language/localization';

import Button from '@material-ui/core/Button';
import {theme, useStyles} from '../theme/theme';
import { ThemeProvider } from "@material-ui/styles";
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
  Modal, ModalHeader, ModalBody, ModalFooter,
Col, Row, Form, FormGroup, Label, Input, FormText, ListGroup, ListGroupItem, Jumbotron   } from 'reactstrap';


const TopArticles = ({topArticles}) => {

}
const MainPage = ({token, articles}) => {
  const classes = useStyles(theme);
  const authD =  useContext(AuthContext);
  const lContext = useContext(LangContext);
  const createArticle = async(event) => {
    const loginRequest = {
      query: `
      mutation{
        createArticle{
          _id
          createdOn
          creator{
            _id
          }
        }
      }
      `
    }
    await fetch('http://localhost:9000/graphql',
    {
      method: 'POST',
      body: JSON.stringify(loginRequest),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ authD.token
      }
    }
    )
    .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
      return res.json();
    }).then(resData => {
        // console.log(resData);
        window.location.replace("http://localhost:3000/article/"+resData.data.createArticle._id);
        // if(resData.data.login.token){
        // }
    }).catch(err => {
      throw(err);
    });
  }
  return(
    <>
    
        <LangContext.Consumer>
        {lcontext => {
            return (
    <AuthContext.Consumer>
  
    
        {context => {

          return (
            <ThemeProvider theme={theme}>
        <div>
          <Jumbotron>
            <h1 className="display-3">{strings.hello}</h1>
            <p className="lead">{strings.enc_msg}</p>
            <hr className="my-2" />
            <p>Contribute to the development, try the software out or explore the API.</p>
            <p className="lead">
            {context.token &&
              <Button onClick={createArticle} className={classes.button}   color="primary">{strings.newArticle}</Button>
            }

            </p>
          </Jumbotron>

        </div>

      </ThemeProvider>
          )
          
           }}
           
      </AuthContext.Consumer>
           
      )
 
    }}
      </LangContext.Consumer>

    </>
  )
}
export default MainPage;
