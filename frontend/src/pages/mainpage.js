import './App.css';
import React, { useReducer, useContext, useState, useEffect } from 'react';
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
Col, Row, Form, FormGroup, Label, Input, FormText, ListGroup, ListGroupItem, Jumbotron   } from 'reactstrap';
const TopArticles = ({topArticles}) => {

}
const MainPage = ({token, articles}) => {
  const createArticle = event => {

  }
  return(
    <>
    <div>
      <Jumbotron>
        <h1 className="display-3">Hello, world!</h1>
        <p className="lead">An encyclopedia management system built to help fullstack developers.</p>
        <hr className="my-2" />
        <p>Contribute to the development, try the software out or explore the API.</p>
        <p className="lead">

          <Button onClick={createArticle} color="primary">Create Article</Button>
        </p>
      </Jumbotron>

    </div>
    </>
  )
}
